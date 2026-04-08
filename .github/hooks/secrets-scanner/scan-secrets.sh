#!/usr/bin/env bash
# Secrets Scanner Hook — Scans modified files for leaked secrets
# Adapted from github/awesome-copilot hooks/secrets-scanner
set -euo pipefail

# Configuration
SCAN_MODE="${SCAN_MODE:-warn}"        # "warn" or "block"
SCAN_SCOPE="${SCAN_SCOPE:-diff}"      # "diff" or "staged"
SKIP_SECRETS_SCAN="${SKIP_SECRETS_SCAN:-false}"
LOG_DIR="${SECRETS_LOG_DIR:-logs/copilot/secrets}"
ALLOWLIST="${SECRETS_ALLOWLIST:-}"

if [ "$SKIP_SECRETS_SCAN" = "true" ]; then
  echo "⏭️  Secrets scanner skipped (SKIP_SECRETS_SCAN=true)"
  exit 0
fi

mkdir -p "$LOG_DIR"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Get modified files
if [ "$SCAN_SCOPE" = "staged" ]; then
  FILES=$(git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true)
else
  FILES=$(git diff --name-only HEAD 2>/dev/null || true)
fi

if [ -z "$FILES" ]; then
  echo "✅ No modified files to scan"
  echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"scan_complete\",\"status\":\"no_files\",\"mode\":\"$SCAN_MODE\"}" >> "$LOG_DIR/scan.log"
  exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "🔍 Scanning $FILE_COUNT modified file(s) for secrets..."

# Secret patterns (pattern_name:regex)
PATTERNS=(
  "AWS_ACCESS_KEY:AKIA[0-9A-Z]{16}"
  "AWS_SECRET_KEY:aws_secret_access_key\s*=\s*['\"][A-Za-z0-9/+=]{40}"
  "GITHUB_PAT:ghp_[A-Za-z0-9]{36}"
  "GITHUB_FINE_GRAINED_PAT:github_pat_[A-Za-z0-9_]{82}"
  "PRIVATE_KEY:-----BEGIN\s+(RSA|EC|OPENSSH|PGP|DSA)\s+PRIVATE\s+KEY-----"
  "GENERIC_API_KEY:(api[_-]?key|apikey)\s*[=:]\s*['\"][A-Za-z0-9]{20,}"
  "GENERIC_SECRET:(secret|password|passwd|pwd)\s*[=:]\s*['\"][^\s'\"]{8,}"
  "CONNECTION_STRING:(postgresql|mongodb|mysql|redis|mssql)://[^\s\"']{10,}"
  "SLACK_TOKEN:xox[bpors]-[A-Za-z0-9-]{10,}"
  "STRIPE_SECRET:sk_live_[A-Za-z0-9]{20,}"
  "NPM_TOKEN:npm_[A-Za-z0-9]{36}"
  "AZURE_CLIENT_SECRET:azure[_-]?client[_-]?secret\s*[=:]\s*['\"][^\s'\"]{8,}"
  "JWT_TOKEN:eyJ[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\."
  "INTERNAL_IP_PORT:(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)[0-9.]+:[0-9]{2,5}"
)

# Placeholder patterns to skip (false positives)
PLACEHOLDERS="(example|changeme|your_|xxx|placeholder|TODO|FIXME|dummy|test_key|sample)"

FINDINGS=()
FINDING_COUNT=0

while IFS= read -r file; do
  # Skip binary files, lock files, and this script
  case "$file" in
    *.lock|*.pyc|*.pyo|*.so|*.dylib|*.exe|*.bin|*.jpg|*.png|*.gif|*.pdf)
      continue ;;
  esac

  [ -f "$file" ] || continue
  file -b --mime "$file" 2>/dev/null | grep -q "text/" || continue

  LINE_NUM=0
  while IFS= read -r line; do
    LINE_NUM=$((LINE_NUM + 1))
    for pattern_entry in "${PATTERNS[@]}"; do
      PATTERN_NAME="${pattern_entry%%:*}"
      PATTERN_REGEX="${pattern_entry#*:}"

      if echo "$line" | grep -qE "$PATTERN_REGEX" 2>/dev/null; then
        # Check if it's a placeholder
        if echo "$line" | grep -qiE "$PLACEHOLDERS" 2>/dev/null; then
          continue
        fi
        # Check allowlist
        if [ -n "$ALLOWLIST" ]; then
          SKIP=false
          IFS=',' read -ra ALLOWED <<< "$ALLOWLIST"
          for allowed in "${ALLOWED[@]}"; do
            if echo "$line" | grep -q "$allowed" 2>/dev/null; then
              SKIP=true
              break
            fi
          done
          [ "$SKIP" = "true" ] && continue
        fi

        FINDINGS+=("$file:$LINE_NUM:$PATTERN_NAME")
        FINDING_COUNT=$((FINDING_COUNT + 1))
      fi
    done
  done < "$file"
done <<< "$FILES"

# Report results
if [ "$FINDING_COUNT" -eq 0 ]; then
  echo "✅ No secrets detected in $FILE_COUNT scanned file(s)"
  echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"scan_complete\",\"status\":\"clean\",\"mode\":\"$SCAN_MODE\",\"files_scanned\":$FILE_COUNT}" >> "$LOG_DIR/scan.log"
  exit 0
fi

echo ""
echo "⚠️  Found $FINDING_COUNT potential secret(s) in modified files:"
echo ""
printf "  %-45s %-6s %-30s\n" "FILE" "LINE" "PATTERN"
printf "  %-45s %-6s %-30s\n" "----" "----" "-------"
for finding in "${FINDINGS[@]}"; do
  IFS=':' read -r f_file f_line f_pattern <<< "$finding"
  printf "  %-45s %-6s %-30s\n" "$f_file" "$f_line" "$f_pattern"
done
echo ""

# Log findings (redacted)
echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"secrets_found\",\"mode\":\"$SCAN_MODE\",\"files_scanned\":$FILE_COUNT,\"finding_count\":$FINDING_COUNT}" >> "$LOG_DIR/scan.log"

if [ "$SCAN_MODE" = "block" ]; then
  echo "🚫 Session blocked: resolve the findings above before committing."
  echo "   Set SCAN_MODE=warn to log without blocking, or add patterns to SECRETS_ALLOWLIST."
  exit 1
else
  echo "💡 Review the findings above. Set SCAN_MODE=block to prevent commits with secrets."
  exit 0
fi
