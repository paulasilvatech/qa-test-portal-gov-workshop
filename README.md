# Portal Gov — AI-Powered QA & Testing Workshop

A full-stack Brazilian government services portal built as an **AI-assisted QA & Testing workshop** for QA Engineers and Testers. It combines Clean Architecture, Domain-Driven Design, and a complete ecosystem of **GitHub Copilot custom agents, reusable prompts, coding instructions, session hooks, and CI/CD workflows** — demonstrating how modern AI tools transform the entire quality assurance lifecycle.

> **Purpose**: This is a **demo-scale, fully self-contained application** with realistic Brazilian government service data. It serves as a hands-on training ground where participants learn not just how to write tests, but how to **orchestrate an AI-powered QA pipeline** — from coverage analysis through test generation, execution, inspection, code review, E2E testing, and Azure DevOps synchronization.

---

## Table of Contents

- [The Workshop Story](#the-workshop-story)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Government Services](#government-services)
- [Getting Started](#getting-started)
- [AI-Powered QA Ecosystem](#ai-powered-qa-ecosystem)
  - [Custom Agents (10)](#custom-agents)
  - [Reusable Prompts (4)](#reusable-prompts)
  - [Coding Instructions (3)](#coding-instructions)
  - [Session Hooks (2)](#session-hooks)
  - [CI/CD Workflow](#cicd-workflow)
- [The QA Pipeline — End-to-End Flow](#the-qa-pipeline--end-to-end-flow)
- [Running Tests](#running-tests)
- [Testing Patterns & Strategies](#testing-patterns--strategies)
- [Workshop Exercises](#workshop-exercises)
- [Project Structure](#project-structure)

---

## The Workshop Story

Imagine you are a QA engineer joining a team that maintains a government services portal. The codebase uses Clean Architecture with well-defined business rules encoded as **status enums** — every possible outcome of paying a vehicle tax or renewing a driver's license is an enum branch. Your mission: **guarantee 100% branch coverage** across all services.

But you are not alone. The repository comes pre-configured with a complete **AI QA toolkit**:

1. **You ask Copilot to analyze coverage** → The `test-analyzer` agent reads every `if/elif/else/try/except` and maps it to enum values, producing a gap table showing exactly which branches lack tests.

2. **You ask Copilot to plan tests** → The `test-planner` agent designs specific test functions: names, patterns (parametrize vs individual), fixtures, mock configurations, and expected assertions.

3. **You ask Copilot to write the tests** → The `test-writer` agent implements the plan, following the project's dual unittest+pytest conventions enforced by `.instructions.md` files.

4. **You ask Copilot to run and validate** → The `test-runner` agent executes pytest, parses results, and if failures occur, automatically hands back to `test-writer` for fixes (up to 2 retry cycles).

5. **You ask Copilot to inspect quality** → The `qa-inspector` agent hunts for bugs, boundary edge cases, and verifies that no enum branch was skipped.

6. **You ask Copilot to review the code** → The `code-reviewer` agent checks for anti-patterns, tautological tests, mock misconfigurations, and convention violations.

7. **You ask Copilot to run E2E tests** → The `playwright-e2e` agent explores the portal, writes browser-based tests, and captures screenshots of failures.

8. **You ask Copilot to sync everything to Azure DevOps** → The `azdo-sync` agent creates Test Plans, Test Cases, User Stories for gaps, and Bug work items — all linked together.

**Or you just say "run full QA"** → The `qa-master` orchestrator executes all 8 phases in sequence, delegating to each specialist agent, handling retries, and producing a consolidated quality report.

And behind the scenes, **session hooks** automatically run a secrets scanner and test guard before every commit — so nothing gets pushed without passing tests and security checks.

This is not just a testing workshop. It is a **blueprint for AI-augmented quality engineering**.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.2 |
| | TypeScript | ~5.9 |
| | Vite | 7.3 |
| | React Router | 7.13 |
| | Vitest + Testing Library | 4.0 |
| **Backend** | Python | 3.11+ |
| | FastAPI | 0.115 |
| | Uvicorn | 0.34 |
| | Pytest + pytest-cov | 8.0+ |
| | Ruff (linter) | 0.8+ |
| **AI QA Ecosystem** | GitHub Copilot Custom Agents | 10 agents |
| | Reusable Prompts | 4 prompts |
| | Coding Instructions | 3 files |
| | Session Hooks | 2 hooks |
| | GitHub Actions CI/CD | 1 workflow |

---

## Architecture

### Backend — Clean Architecture

```
api/
├── application_core/            # Pure business logic (no framework dependencies)
│   ├── entities/                # Domain models: IPVA, CNH, Veiculo, Cidadao
│   ├── enums/                   # Status enums that drive every business branch
│   ├── interfaces/              # Abstract repository & service contracts (ABCs)
│   └── services/                # Business logic: IPVAService, CNHService
├── infrastructure/              # Concrete implementations
│   ├── json_data.py             # In-memory data store
│   ├── json_ipva_repository.py  # IPVA repository (JSON-backed)
│   └── json_cnh_repository.py   # CNH repository (JSON-backed)
├── tests/                       # Unit tests (unittest + pytest coexistence)
├── main.py                      # FastAPI app with dependency injection
└── conftest.py                  # Pytest shared configuration
```

**Key Design Principles:**

- **Dependency Inversion**: Services depend on interfaces, not implementations
- **Enum-driven Business Rules**: Every service method returns a status enum — no exceptions are raised to callers
- **Repository Pattern**: Data access is abstracted behind interfaces, making services testable with mocks

### Frontend — Component-Based Architecture

```
src/
├── pages/          # 8 service pages + Login + Home
├── components/     # Reusable UI: SearchBar, StatusBadge, BoletoViewer, etc.
├── services/       # Data layer: filters & maps mock JSON data
├── mock/           # JSON fixtures with realistic Brazilian data
├── utils/          # Pure formatters (CPF, currency, date) & validators
├── types/          # TypeScript interfaces for all domain models
└── __tests__/      # Vitest unit tests
```

---

## Government Services

| # | Service | Description | Key Features |
|---|---|---|---|
| 1 | **IPVA** | Vehicle Tax | View vehicles, parcelas, boleto/PIX, payment & parceling workflows |
| 2 | **IPTU** | Property Tax | Property details, tax calculation, parcelas with barcodes |
| 3 | **CNH Digital** | Driver's License | License card, pontuacao (points), infractions table, renewal |
| 4 | **DANFE** | Electronic Invoice (NF-e) | Invoice list, item details, chave de acesso lookup |
| 5 | **INSS** | Social Security | Benefits, extracts, receipts |
| 6 | **FGTS** | Severance Fund | Account balance, transactions, withdrawal options |
| 7 | **Emprestimo Consignado** | Payroll Loan | Contract details, payment schedule, interest rates |
| 8 | **Bolsa Familia** | Family Allowance | Benefit calendar, family composition, payment history |

### Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ipva/pagar` | Pay IPVA in full |
| `POST` | `/api/ipva/parcelar` | Split IPVA into installments |
| `POST` | `/api/cnh/renovar` | Renew driver's license |
| `GET` | `/api/health` | Health check |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **Python** >= 3.11
- **VS Code** with GitHub Copilot extension (for the AI QA ecosystem)

### Frontend

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

### Backend API

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

---

## AI-Powered QA Ecosystem

This is the heart of the workshop. The `.github/` directory contains a full AI QA toolkit designed for GitHub Copilot in VS Code.

```
.github/
├── agents/              # 10 custom Copilot agents
│   ├── qa-master.agent.md
│   ├── python-test-orchestrator.agent.md
│   ├── test-analyzer.agent.md
│   ├── test-planner.agent.md
│   ├── test-writer.agent.md
│   ├── test-runner.agent.md
│   ├── qa-inspector.agent.md
│   ├── code-reviewer.agent.md
│   ├── playwright-e2e.agent.md
│   └── azdo-sync.agent.md
├── prompts/             # 4 reusable prompt files
│   ├── run-full-qa.prompt.md
│   ├── coverage-report.prompt.md
│   ├── setup-azure-devops.prompt.md
│   └── setup-azure-test-plan.prompt.md
├── instructions/        # 3 coding instruction files
│   ├── python-code.instructions.md
│   ├── python-tests.instructions.md
│   └── portal-gov-tests.instructions.md
├── hooks/               # 2 session hooks
│   ├── hooks.json
│   ├── test-guard/run-tests.sh
│   └── secrets-scanner/scan-secrets.sh
└── workflows/           # CI/CD
    └── ci.yml
```

### Custom Agents

The repository defines **10 specialized agents** that work together as a multi-agent QA pipeline. Each agent has a focused role, specific tools, and handoff targets for the next phase.

#### Orchestrators (top-level entry points)

| Agent | Invoke with | Role |
|---|---|---|
| **qa-master** | `@qa-master` | Master orchestrator that runs the complete 8-phase QA pipeline. Delegates to all other agents. Supports scopes: FULL, UNIT, ANALYSIS, E2E, SYNC. |
| **python-test-orchestrator** | `@python-test-orchestrator` | Lightweight orchestrator focused on the unit test pipeline only (Analyze → Plan → Write → Run). |

#### Specialists (individual capabilities)

| Agent | Invoke with | Role | Tools | Hands off to |
|---|---|---|---|---|
| **test-analyzer** | `@test-analyzer` | Reads source code and existing tests, maps every branch to enum values, produces a coverage gap table. **Read-only — never edits files.** | read, search | test-planner |
| **test-planner** | `@test-planner` | Receives a gap analysis and designs specific test functions: names, patterns (parametrize/individual/pytest.raises), fixtures, mock configs, assertions. **Read-only — never edits files.** | read, search | test-writer |
| **test-writer** | `@test-writer` | Implements test code following the plan and project conventions. Adds tests after the `# --- Pytest-style tests ---` separator. **Never deletes existing tests.** | read, edit, search | test-runner |
| **test-runner** | `@test-runner` | Executes pytest, parses pass/fail/error results, and produces a structured report. If failures exist, diagnoses root cause and provides fix instructions. | read, execute | test-writer (for fixes) |
| **qa-inspector** | `@qa-inspector` | Senior QA perspective: hunts bugs, probes boundaries (date edge cases, None inputs, invalid states), verifies all enum branches are exercised, and produces a severity-rated inspection report. | read, search, execute | test-writer, test-runner |
| **code-reviewer** | `@code-reviewer` | Reviews test and service code for correctness, maintainability, convention compliance, anti-patterns (tautological tests, vague assertions, mock misconfigs). | read, search | test-writer, qa-inspector |
| **playwright-e2e** | `@playwright-e2e` | Explores the web portal, writes Playwright browser tests, executes them, and reports UI failures with screenshots. | read, edit, search, execute, playwright | azdo-sync |
| **azdo-sync** | `@azdo-sync` | Syncs results to Azure DevOps: creates Test Plans, Test Cases, User Stories (for gaps), and Bug work items. Links everything together. | read, search, execute | qa-inspector, test-planner |

#### Agent Interaction Diagram

```
                         ┌─────────────────────────┐
                         │       qa-master          │
                         │  (Master Orchestrator)   │
                         └──────────┬──────────────┘
                                    │ delegates to
       ┌────────────┬───────────┬──┴───┬──────────┬──────────┬──────────┐
       ▼            ▼           ▼      ▼          ▼          ▼          ▼
  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌──────┐
  │ analyzer│→│ planner  │→│writer │⇄│runner│→│inspector│→│reviewer│→│ azdo │
  │ (read)  │ │ (plan)   │ │(code) │ │(exec)│ │ (QA)   │ │(review)│ │(sync)│
  └─────────┘ └──────────┘ └───────┘ └──────┘ └────────┘ └────────┘ └──────┘
                                ▲         │
                                └─────────┘
                              retry loop (max 2)

                         ┌──────────────┐
                         │playwright-e2e│  (E2E browser tests)
                         └──────┬───────┘
                                │ hands off bugs to
                                ▼
                         ┌──────────────┐
                         │   azdo-sync  │  (Azure DevOps)
                         └──────────────┘
```

### Reusable Prompts

Prompts are pre-written workflows that can be executed as Copilot slash commands or referenced in chat.

| Prompt | File | Description |
|---|---|---|
| **Run Full QA** | `run-full-qa.prompt.md` | Executes the complete 6-phase QA pipeline: Coverage Analysis → Test Planning → Implementation → Execution & Validation → QA Inspection → Code Review. Produces a consolidated quality report. |
| **Coverage Report** | `coverage-report.prompt.md` | Quick branch coverage report — maps every service method's branches to enum values and checks if tests exist. Produces a gap table with actionable recommendations. |
| **Setup Azure DevOps** | `setup-azure-devops.prompt.md` | Creates a complete Azure DevOps project with repository, 3 Epics, 10+ User Stories with acceptance criteria, Bugs, Tasks, and sprint board configuration. |
| **Setup Azure Test Plan** | `setup-azure-test-plan.prompt.md` | Inventories all existing tests, creates a Test Plan in Azure DevOps with Test Suites and Test Cases, identifies gaps as User Stories, and creates Bug work items for QA findings. |

### Coding Instructions

Instruction files are automatically loaded by Copilot when editing matching files, ensuring all AI-generated code follows project conventions.

| Instruction | Applies To | What It Enforces |
|---|---|---|
| **python-code.instructions.md** | `api/application_core/**/*.py`, `api/infrastructure/**/*.py` | Clean Architecture layers, service method pattern (enum returns, try/except, no raised exceptions), naming conventions, date handling with `timedelta`, dependency injection via constructors. |
| **python-tests.instructions.md** | `api/tests/**/*.py` | Unittest + pytest coexistence rule, DummyJsonData stubs for repos, MagicMock for services, `@pytest.fixture` returning `(service, mock_repo)`, `@pytest.mark.parametrize` with `ids=`, separator convention, all 18 enum branches documented. |
| **portal-gov-tests.instructions.md** | `api/tests/**/*.py` | Complete enum reference with exact conditions for all branches (PagamentoIPVAStatus, ParcelamentoIPVAStatus, RenovacaoCNHStatus), entity constructor signatures, test command cheat sheet. |

### Session Hooks

Hooks run automatically at the end of each Copilot coding agent session — acting as quality gates before code is committed.

| Hook | File | Mode | What It Does |
|---|---|---|---|
| **Secrets Scanner** | `secrets-scanner/scan-secrets.sh` | `warn` | Scans modified files for leaked secrets (AWS keys, GitHub PATs, Azure credentials, private keys, connection strings, API keys, Slack/Stripe/NPM tokens). Supports `warn` (alert only) or `block` (prevent commit) modes. Uses allowlist for false positives. |
| **Test Guard** | `test-guard/run-tests.sh` | `block` | Runs the full pytest suite before allowing commit. If any test fails, the commit is blocked. Logs results (timestamp, pass/fail counts, exit code) to `logs/copilot/tests/test-guard.log` for auditability. |

**Hook execution order** (configured in `hooks.json`):
1. Secrets Scanner runs first (30s timeout)
2. Test Guard runs second (120s timeout)

Both hooks trigger on `sessionEnd` — meaning every time Copilot finishes a coding session, these checks run automatically.

### CI/CD Workflow

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main`:

**API Job** (`test-api`):
- Python 3.12 setup with pip caching
- Install dependencies from `pyproject.toml`
- Lint with Ruff (output in GitHub format)
- Run pytest with coverage, JUnit XML output, and coverage XML output
- Upload test results and coverage as artifacts
- Enforce 80% coverage threshold

**Frontend Job** (`test-frontend`):
- Node.js 22 setup with npm caching
- Install dependencies
- Lint with ESLint
- Run Vitest

---

## The QA Pipeline — End-to-End Flow

When the `qa-master` agent is invoked (or you run the `run-full-qa` prompt), this is the complete flow:

### Phase 0 — Reconnaissance
The orchestrator gathers baseline info: how many tests exist, which files to analyze.

### Phase 1 — Coverage Analysis (`test-analyzer`)
The analyzer reads every service method's source code, identifies all branches (`if`/`elif`/`else`/`try`/`except`), maps each to its enum return value, and cross-references with existing tests. Output: a **gap table** showing covered vs uncovered branches.

### Phase 2 — Test Planning (`test-planner`)
The planner receives the gap table and designs specific test functions. For each uncovered branch: function name, test pattern (parametrize for 3+ branches, individual for edge cases, `pytest.raises` for exceptions), fixture requirements, mock setup, and expected assertions.

### Phase 3 — Test Implementation (`test-writer`)
The writer implements the planned tests following project conventions: adds code after the `# --- Pytest-style tests ---` separator, uses existing fixtures, imports entities and enums from `application_core.*`, uses `datetime.now()` with `timedelta` for dates.

### Phase 4 — Execution & Retry (`test-runner`)
The runner executes `pytest -v`, parses results into a structured report. If failures occur, it diagnoses root causes and hands back to `test-writer` for fixes. This retry loop runs up to **2 cycles** before recording unresolved failures.

### Phase 5 — QA Inspection (`qa-inspector`)
The inspector takes a senior QA perspective: verifies all enum branches are exercised, probes boundary conditions (what if `membership_end == today`? what if `due_date == today`? what if patron is `None`?), checks test determinism and isolation, and produces a severity-rated bug report.

### Phase 6 — Code Review (`code-reviewer`)
The reviewer checks all added/modified code for: convention compliance, anti-patterns (tautological tests, vague assertions like `is not None`, mock misconfigurations), correct `save_*()` call verification, and date handling without hardcoded values.

### Phase 7 — E2E Testing (`playwright-e2e`)
If a web frontend exists, the E2E agent explores the portal via Playwright, identifies user flows (login, search, IPVA payment), writes browser-based tests, executes them, and captures screenshots of any failures.

### Phase 8 — Azure DevOps Sync (`azdo-sync`)
All results are synced to Azure DevOps:
- **Test Plan** created with Test Suites per component
- **Test Cases** mapped to each pytest function (with automated test name + storage)
- **User Stories** created for uncovered branches (tagged `test-gap`)
- **Bugs** created for QA findings with severity, repro steps, and linked Test Cases
- **Test results** uploaded from JUnit XML output

```
 Coverage    Test      Test       Test      QA        Code       E2E       Azure
 Analysis → Planning → Writing → Running → Inspect → Review → Playwright → DevOps
    │          │          │        ▲  │       │          │          │         │
    │          │          │        │  │       │          │          │         │
    │          │          └────────┘  │       │          │          │         │
    │          │          retry loop  │       │          │          │         │
    │          │                      │       │          │          │         │
    └──────────┴──────────────────────┴───────┴──────────┴──────────┴─────────┘
                            Orchestrated by qa-master
```

---

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
npx vitest run

# Run in watch mode
npx vitest

# Run specific test file
npx vitest run src/__tests__/formatters.test.ts
```

### Backend Tests

```bash
cd api

# Run all tests with verbose output
python3 -m pytest tests -v

# Run with coverage report
python3 -m pytest tests -v --cov=application_core --cov=infrastructure

# Run a specific test file
python3 -m pytest tests/test_ipva_service.py -v

# Run a single test by name
python3 -m pytest tests/test_ipva_service.py -k "test_pagar_ipva_success" -v

# Run with JUnit XML output (for Azure DevOps)
python3 -m pytest tests -v --junitxml=test-results.xml --cov=application_core --cov-report=xml:coverage.xml
```

### Linting

```bash
# Frontend
npm run lint

# Backend
cd api && ruff check .
```

---

## Testing Patterns & Strategies

This project demonstrates multiple testing approaches side by side, making it ideal for workshop learning.

### 1. Unittest Style (Backend)

Classic `unittest.TestCase` with `setUp()` and `MagicMock()`:

```python
class TestIPVAServicePagar(unittest.TestCase):
    def setUp(self):
        self.mock_repo = MagicMock()
        self.service = IPVAService(self.mock_repo)

    def test_pagar_ipva_success(self):
        ipva = IPVA(id="1", status="pendente", ...)
        self.mock_repo.get_ipva.return_value = ipva
        result = self.service.pagar_ipva("1")
        self.assertEqual(result, PagamentoIPVAStatus.SUCCESS)
```

### 2. Pytest Parametrized (Backend)

Branch-coverage through parametrization with readable IDs:

```python
@pytest.mark.parametrize(
    "status_ipva, expected_status",
    [
        ("pendente", PagamentoIPVAStatus.SUCCESS),
        ("pago", PagamentoIPVAStatus.ALREADY_PAID),
        ("vencido", PagamentoIPVAStatus.EXPIRED),
    ],
    ids=["success", "already_paid", "expired"],
)
def test_pagar_ipva_parametrized(ipva_service, status_ipva, expected_status):
    service, mock_repo = ipva_service
    ipva = IPVA(id="1", status=status_ipva, ...)
    mock_repo.get_ipva.return_value = ipva
    assert service.pagar_ipva("1") == expected_status
```

### 3. Repository Testing with Stubs (Backend)

Using `DummyJsonData` to avoid file I/O:

```python
class DummyJsonData:
    def __init__(self):
        self.ipvas = []
    def save_ipvas(self): pass
    def load_data(self): pass

def test_get_ipva_found():
    data = DummyJsonData()
    data.ipvas = [IPVA(id="1", ...)]
    repo = JsonIPVARepository(data)
    assert repo.get_ipva("1").id == "1"
```

### 4. Frontend Unit Tests (Vitest + Testing Library)

Pure function testing and service data filtering:

```typescript
describe("formatCPF", () => {
  it("formats a valid CPF string", () => {
    expect(formatCPF("12345678900")).toBe("123.456.789-00");
  });
});
```

### Mock Strategy Summary

| Layer | Mock Approach | Purpose |
|---|---|---|
| Frontend Services | JSON fixture files | No API dependency |
| Backend Repositories | `DummyJsonData` stub | No file I/O |
| Backend Services | `MagicMock()` for repos | Isolate business logic |
| API Endpoints | FastAPI `TestClient` | Integration testing |

### Status Enums (Business Rule Branches)

These enums drive all business logic and define the exact test branches:

**PagamentoIPVAStatus** — Pay IPVA (5 branches):

| Status | Condition |
|---|---|
| `SUCCESS` | IPVA found, status is "pendente" |
| `IPVA_NOT_FOUND` | ID does not exist |
| `ALREADY_PAID` | Status is already "pago" |
| `EXPIRED` | Status is "vencido" |
| `ERROR` | Unexpected exception |

**ParcelamentoIPVAStatus** — Split IPVA into installments (7 branches):

| Status | Condition |
|---|---|
| `SUCCESS` | Valid parceling (1-3 installments, each >= R$ 50) |
| `IPVA_NOT_FOUND` | ID does not exist |
| `ALREADY_PAID` | Already paid in full |
| `ALREADY_PARCELED` | Already parceled |
| `VALOR_MINIMO` | Installment value < R$ 50 |
| `PARCELAS_INVALIDAS` | num_parcelas < 1 or > 3 |
| `ERROR` | Unexpected exception |

**RenovacaoCNHStatus** — Renew driver's license (7 branches):

| Status | Condition |
|---|---|
| `SUCCESS` | CNH found, situacao "regular" or "vencida", pontuacao < 20 |
| `CNH_NOT_FOUND` | ID does not exist |
| `CNH_SUSPENSA` | License is suspended |
| `CNH_CASSADA` | License is revoked |
| `PONTUACAO_EXCEDIDA` | Points >= 20 |
| `AINDA_VALIDA` | License still valid (expires in > 30 days) |
| `ERROR` | Unexpected exception |

> **Total: 19 enum branches across 3 enums** — the workshop goal is to test every single one.

---

## Workshop Exercises

### Module 1 — Understanding the Codebase

1. **Run all tests** (`pytest -v` + `npx vitest run`) and read the output — identify which tests are unittest vs pytest style
2. **Read the status enums** — map each of the 19 enum values to its business rule condition
3. **Use `@test-analyzer`** — ask Copilot to produce a coverage gap table and compare with your manual analysis
4. **Use the `coverage-report` prompt** — generate a quick coverage report from the Copilot prompt

### Module 2 — Writing Tests Manually

5. **Add a missing test** — find an untested enum branch and write a test for it following project conventions
6. **Add parametrized tests** for all branches of `CNHService.renovar_cnh` using `@pytest.mark.parametrize`
7. **Write repository tests** for `JsonCNHRepository` using the `DummyJsonData` stub pattern
8. **Test edge cases** — boundary dates (`today`, `today + 30 days`), empty strings, negative numbers, `None` inputs

### Module 3 — AI-Assisted Test Generation

9. **Use `@test-planner`** — ask Copilot to design a test plan for uncovered branches
10. **Use `@test-writer`** — ask Copilot to implement the planned tests and verify they follow conventions
11. **Use `@test-runner`** — ask Copilot to execute all tests and handle any failures
12. **Use `@python-test-orchestrator`** — run the complete Analyze → Plan → Write → Run pipeline in one step

### Module 4 — Quality Assurance & Review

13. **Use `@qa-inspector`** — ask Copilot to perform a full QA inspection: find bugs, edge cases, and quality issues
14. **Use `@code-reviewer`** — ask Copilot to review all test code for anti-patterns and convention violations
15. **Break a test intentionally** — change business logic, observe which tests fail, and use `@test-runner` to diagnose

### Module 5 — End-to-End & Integration

16. **Write API integration tests** using FastAPI's `TestClient` for all 3 POST endpoints
17. **Use `@playwright-e2e`** — ask Copilot to explore the portal and generate browser-based E2E tests
18. **Add a new service** (e.g., `IPTUService` with `pagar_iptu()`) following Clean Architecture: entity, enum, interface, service, repository, and full test coverage

### Module 6 — Full Pipeline & DevOps Integration

19. **Use `@qa-master`** — run the complete 8-phase QA pipeline with a single command
20. **Use the `setup-azure-devops` prompt** — set up a full Azure DevOps project with Epics, User Stories, and sprint board
21. **Use the `setup-azure-test-plan` prompt** — create a Test Plan with Test Cases mapped to your pytest functions
22. **Observe the session hooks** — make a code change, end the session, and watch the secrets scanner and test guard run automatically

---

## Project Structure

### Domain Entities

| Entity | Key Fields |
|---|---|
| `IPVA` | id, veiculo, ano_exercicio, valor_total, status, proprietario_cpf, parcelas[], data_pagamento |
| `ParcelaIPVA` | numero, valor, vencimento, status, codigo_barras, qr_code_pix |
| `CNH` | id, titular_cpf, numero_registro, categoria, situacao, pontuacao, data_validade |
| `Veiculo` | placa, renavam, marca, modelo, ano, cor, combustivel |
| `Cidadao` | cpf, nome, nis, email, telefone, endereco |

### Conventions

- **Backend**: PascalCase classes, snake_case functions, enum-driven return values, try/except in all service methods
- **Frontend**: Functional components with hooks, pure utility functions, TypeScript strict mode
- **Tests**: Every enum branch must be tested. Both unittest and pytest styles coexist in the same file (separated by `# --- Pytest-style tests ---`). Parametrized tests use `ids=` for readable output.
- **AI Instructions**: Coding conventions are enforced automatically by `.instructions.md` files — Copilot follows them when generating or editing code in matching file paths.

---

## License

This project is intended for educational and workshop use.
