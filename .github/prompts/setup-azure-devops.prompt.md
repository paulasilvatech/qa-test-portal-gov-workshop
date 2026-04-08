---
mode: "agent"
description: "Creates a complete Azure DevOps project with repository, epics, user stories, bugs, tasks, and sprint board configuration using Azure DevOps MCP."
---

## Objective

Create a complete project in Azure DevOps with repository, work items, and configured board for the Library Management System.

Execute each section **in order**. Wait for confirmation before proceeding to the next section.

---

## Section 1 — Create Project

Create a new project in Azure DevOps:

- **Organization:** `paulasilvatech`
- **Project name:** `LibraryManagementSystem`
- **Description:** "Sistema de gerenciamento de biblioteca com arquitetura limpa em Python — entidades, serviços, repositórios JSON e testes automatizados com pytest"
- **Process template:** Agile
- **Visibility:** Private

---

## Section 2 — Create Repository

Create a Git repository in the `LibraryManagementSystem` project:

- **Repository name:** `library-management-python`
- **Default branch:** `main`

After creating the repository, provide the remote URL so the user can push the workspace content:

```bash
cd "/Users/paulasilva/Documents/GH-REPOS/untitled folder/AZ2007LabAppM4Python/AccelerateDevGHCopilot"
git init
git remote add azure https://dev.azure.com/paulasilvatech/LibraryManagementSystem/_git/library-management-python
git add .
git commit -m "Initial commit: Library Management System with clean architecture, services, repositories, and pytest tests"
git push -u azure main
```

---

## Section 3 — Create Epics

Create 3 Epics in the `LibraryManagementSystem` project:

| ID | Title | Description |
|----|-------|-------------|
| Epic-1 | Pagamento de IPVA MG | Sistema completo de consulta, geração de boleto, parcelamento e comprovante de pagamento do IPVA para o estado de Minas Gerais |
| Epic-2 | Sistema de Notificações de Empréstimos | Notificações automáticas para vencimento, atraso e disponibilidade de livros reservados |
| Epic-3 | Portal de Autoatendimento do Patrono | Portal web para renovação de filiação, histórico de empréstimos e extensão de prazos |

---

## Section 4 — Create User Stories

### Epic 1: Pagamento de IPVA MG

**US-001** — Parent: Epic-1
- **Title:** "Como cidadão de MG, quero consultar o valor do IPVA pelo número da placa para saber quanto devo pagar"
- **Story Points:** 5
- **Acceptance Criteria:**
  1. Dado uma placa válida de MG, quando consulto o IPVA, então exibe valor total, parcelas e vencimentos
  2. Dado uma placa inválida, quando consulto, então exibe mensagem "Placa não encontrada"
  3. Dado uma placa de outro estado, quando consulto, então exibe "Serviço disponível apenas para MG"

**US-002** — Parent: Epic-1
- **Title:** "Como cidadão, quero gerar o boleto de pagamento do IPVA para pagar no banco ou via PIX"
- **Story Points:** 8
- **Acceptance Criteria:**
  1. Dado um IPVA pendente, quando gero o boleto, então recebo PDF com código de barras e QR Code PIX
  2. Dado um IPVA já pago, quando tento gerar boleto, então exibe "IPVA já quitado"

**US-003** — Parent: Epic-1
- **Title:** "Como cidadão, quero parcelar o IPVA em até 3x para facilitar o pagamento"
- **Story Points:** 5
- **Acceptance Criteria:**
  1. Dado valor > R$200, quando escolho parcelar, então exibe opções de 1x, 2x, 3x com datas
  2. Dado valor <= R$200, quando consulto, então exibe apenas pagamento à vista

**US-004** — Parent: Epic-1
- **Title:** "Como cidadão, quero receber comprovante de pagamento do IPVA por email para meus registros"
- **Story Points:** 3
- **Acceptance Criteria:**
  1. Dado pagamento confirmado, quando processo finaliza, então envia email com PDF do comprovante
  2. Dado email inválido, quando informo, então exibe erro de validação

### Epic 2: Sistema de Notificações de Empréstimos

**US-005** — Parent: Epic-2
- **Title:** "Como bibliotecário, quero que o sistema envie notificação automática 3 dias antes do vencimento do empréstimo para reduzir atrasos"
- **Story Points:** 5
- **Acceptance Criteria:**
  1. Dado empréstimo com due_date em 3 dias, quando job diário roda, então envia email/SMS ao patrono
  2. Dado empréstimo já devolvido, quando job roda, então não envia notificação

**US-006** — Parent: Epic-2
- **Title:** "Como patrono, quero receber alerta quando meu empréstimo está atrasado para evitar multas adicionais"
- **Story Points:** 3
- **Acceptance Criteria:**
  1. Dado empréstimo com due_date no passado e return_date None, quando job roda, então envia alerta diário
  2. Dado empréstimo devolvido mesmo com atraso, quando job roda, então não envia mais alertas

**US-007** — Parent: Epic-2
- **Title:** "Como patrono, quero receber notificação quando um livro reservado fica disponível para retirá-lo a tempo"
- **Story Points:** 5
- **Acceptance Criteria:**
  1. Dado livro reservado devolvido por outro patrono, quando return_loan processa, então notifica patrono da reserva
  2. Dado múltiplas reservas, quando livro disponível, então notifica apenas o próximo da fila

### Epic 3: Portal de Autoatendimento do Patrono

**US-008** — Parent: Epic-3
- **Title:** "Como patrono, quero renovar minha filiação online sem ir à biblioteca para economizar tempo"
- **Story Points:** 3
- **Acceptance Criteria:**
  1. Dado patrono com membership expirada, quando clica "Renovar", então renew_membership é chamado e status atualizado
  2. Dado patrono com empréstimos pendentes, quando tenta renovar, então exibe erro LOAN_NOT_RETURNED

**US-009** — Parent: Epic-3
- **Title:** "Como patrono, quero ver meu histórico completo de empréstimos para controlar minhas leituras"
- **Story Points:** 5
- **Acceptance Criteria:**
  1. Dado patrono autenticado, quando acessa histórico, então exibe lista com livro, data empréstimo, data devolução, status
  2. Dado patrono sem empréstimos, quando acessa histórico, então exibe "Nenhum empréstimo encontrado"

**US-010** — Parent: Epic-3
- **Title:** "Como patrono, quero estender o prazo do meu empréstimo pelo portal sem precisar ligar para a biblioteca"
- **Story Points:** 3
- **Acceptance Criteria:**
  1. Dado empréstimo ativo com membership válida, quando clica "Estender", então extend_loan é chamado e due_date atualizado
  2. Dado empréstimo expirado, quando tenta estender, então exibe erro LOAN_EXPIRED
  3. Dado membership expirada, quando tenta estender, então exibe erro MEMBERSHIP_EXPIRED

---

## Section 5 — Create Bugs

**BUG-001**
- **Title:** "extend_loan retorna SUCCESS para empréstimo com membership expirada quando due_date é no futuro mas membership_end é no passado"
- **Severity:** 2 - High
- **Priority:** 1
- **Repro Steps:**
  1. Criar empréstimo com due_date no futuro (datetime.now() + timedelta(days=10))
  2. Criar patrono com membership_end no passado (datetime.now() - timedelta(days=5))
  3. Chamar extend_loan(loan_id)
  4. Resultado: SUCCESS
  5. Esperado: MEMBERSHIP_EXPIRED
- **System Info:** Python 3.14.2, pytest 9.0.2, macOS
- **Area Path:** `application_core/services/loan_service.py`
- **Link to:** US-010

**BUG-002**
- **Title:** "renew_membership não valida empréstimos pendentes antes de renovar, ignorando status LOAN_NOT_RETURNED"
- **Severity:** 2 - High
- **Priority:** 1
- **Repro Steps:**
  1. Criar patrono com membership expirada
  2. Criar empréstimo ativo (return_date=None) para esse patrono
  3. Chamar renew_membership(patron_id)
  4. Resultado: SUCCESS
  5. Esperado: LOAN_NOT_RETURNED (enum existe mas nunca é usado)
- **System Info:** Python 3.14.2, pytest 9.0.2, macOS
- **Area Path:** `application_core/services/patron_service.py`
- **Link to:** US-008

---

## Section 6 — Create Tasks

**TASK-001** — Parent: US-002
- **Title:** "Implementar IPaymentService interface com métodos: generate_boleto(), check_payment_status(), process_pix_payment()"
- **Remaining Work:** 4h
- **Description:** Criar interface em `application_core/interfaces/ipayment_service.py` seguindo o padrão de ILoanService e IPatronService existentes

**TASK-002** — Parent: US-002
- **Title:** "Criar PaymentService com integração mock para testes unitários"
- **Remaining Work:** 6h
- **Description:** Implementar `application_core/services/payment_service.py` com lógica de geração de boleto e PIX. Usar padrão de injeção de dependência igual a LoanService

**TASK-003** — Parent: US-010
- **Title:** "Criar testes unitários para PaymentService cobrindo todos os branches de LoanExtensionStatus"
- **Remaining Work:** 3h
- **Description:** Seguir convenções de `tests/test_loan_service.py` — MagicMock + pytest fixtures/parametrize/raises. Cobrir todos 6 branches de LoanExtensionStatus

**TASK-004** — Parent: Epic-3
- **Title:** "Configurar pipeline CI/CD com pytest no Azure Pipelines"
- **Remaining Work:** 4h
- **Description:** Criar `azure-pipelines.yml` com: trigger on main, Python 3.14, install dependencies, run `pytest tests -v`, publish test results

---

## Section 7 — Configure Sprints and Board

### Create Iterations (Sprints)

| Sprint | Start Date | End Date | Duration |
|--------|-----------|----------|----------|
| Sprint 1 | 2026-02-24 | 2026-03-09 | 2 weeks |
| Sprint 2 | 2026-03-10 | 2026-03-23 | 2 weeks |
| Sprint 3 | 2026-03-24 | 2026-04-06 | 2 weeks |

### Assign Work Items to Sprints

**Sprint 1** (Foundation + Critical Fixes):
- US-001 (Consulta IPVA — 5pts)
- US-008 (Renovar filiação online — 3pts)
- BUG-001 (extend_loan membership bug)
- BUG-002 (renew_membership validation bug)
- Total: 8 story points + 2 bugs

**Sprint 2** (Core Features):
- US-002 (Gerar boleto — 8pts)
- US-003 (Parcelamento — 5pts)
- US-005 (Notificação pré-vencimento — 5pts)
- US-006 (Alerta atraso — 3pts)
- TASK-001, TASK-002
- Total: 21 story points

**Sprint 3** (Completion):
- US-004 (Comprovante email — 3pts)
- US-007 (Notificação reserva — 5pts)
- US-009 (Histórico empréstimos — 5pts)
- US-010 (Estender prazo portal — 3pts)
- TASK-003, TASK-004
- Total: 16 story points

---

## Section 8 — Final Verification

After creating all items, verify:

1. List all Epics → expect 3
2. List all User Stories → expect 10 (4 + 3 + 3)
3. List all Bugs → expect 2
4. List all Tasks → expect 4
5. Verify parent-child links (US → Epic, Task → US, Bug → US)
6. Verify sprint assignments
7. Show the board with columns: New | Active | Resolved | Closed

Report the final summary with work item IDs.
