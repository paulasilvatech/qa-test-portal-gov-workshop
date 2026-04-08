#!/usr/bin/env bash
# Test Guard Hook — Runs pytest before allowing commit
# Adapted from awesome-copilot best practices for Copilot coding agent sessions
set -euo pipefail

# Configuration
SKIP_TEST_GUARD="${SKIP_TEST_GUARD:-false}"
TEST_MODE="${TEST_MODE:-block}"  # "warn" or "block"
LOG_DIR="${TEST_LOG_DIR:-logs/copilot/tests}"

if [ "$SKIP_TEST_GUARD" = "true" ]; then
  echo "⏭️  Test guard skipped (SKIP_TEST_GUARD=true)"
  exit 0
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "🧪 Running test suite before commit..."

# Find the project root (where api/ lives)
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
LIBRARY_DIR="$PROJECT_ROOT/api"

if [ ! -d "$LIBRARY_DIR" ]; then
  echo "⚠️  api/ directory not found, skipping test guard"
  exit 0
fi

# Check for virtual environment
PYTHON="$LIBRARY_DIR/.venv/bin/python3"
if [ ! -f "$PYTHON" ]; then
  PYTHON="python3"
fi

# Run tests and capture output
TEST_OUTPUT=$("$PYTHON" -m pytest "$LIBRARY_DIR/tests" -v --tb=short 2>&1) || TEST_EXIT=$?
TEST_EXIT=${TEST_EXIT:-0}

# Count results
PASSED=$(echo "$TEST_OUTPUT" | grep -c " PASSED" || true)
FAILED=$(echo "$TEST_OUTPUT" | grep -c " FAILED" || true)
ERRORS=$(echo "$TEST_OUTPUT" | grep -c " ERROR" || true)
TOTAL=$((PASSED + FAILED + ERRORS))

# Log results
LOG_ENTRY="{\"timestamp\":\"$TIMESTAMP\",\"event\":\"test_guard\",\"mode\":\"$TEST_MODE\",\"total\":$TOTAL,\"passed\":$PASSED,\"failed\":$FAILED,\"errors\":$ERRORS,\"exit_code\":$TEST_EXIT}"
echo "$LOG_ENTRY" >> "$LOG_DIR/test-guard.log"

if [ "$TEST_EXIT" -eq 0 ]; then
  echo ""
  echo "✅ All $TOTAL tests passed"
  echo ""
  exit 0
else
  echo ""
  echo "❌ Test failures detected: $FAILED failed, $ERRORS errors out of $TOTAL tests"
  echo ""
  echo "$TEST_OUTPUT" | grep -E "(FAILED|ERROR)" | head -20
  echo ""

  if [ "$TEST_MODE" = "block" ]; then
    echo "🚫 Commit blocked: fix failing tests before committing."
    echo "   Set TEST_MODE=warn to log without blocking."
    exit 1
  else
    echo "⚠️  Tests failed but TEST_MODE=warn — commit will proceed."
    echo "   Set TEST_MODE=block to prevent commits with failing tests."
    exit 0
  fi
fi
