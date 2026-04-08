---
mode: "agent"
description: "Cria Test Plan completo no Azure DevOps com Test Cases mapeados aos testes pytest do projeto, User Stories para gaps, e Bugs para defeitos encontrados."
---

## Objetivo

Criar um Test Plan completo no Azure DevOps (org: `paulasilvatech`, project: `LibraryManagementSystem`) sincronizado com os testes automatizados do projeto.

## Pipeline

### Etapa 1 — Inventariar Testes Existentes

Leia todos os arquivos de teste e liste cada função de teste:

```bash
cd library && .venv/bin/python3 -m pytest tests --collect-only -q
```

Para cada teste, identifique:
- Nome da função
- Arquivo
- Serviço/componente testado
- Enum branch coberto (se aplicável)

---

### Etapa 2 — Executar Testes e Capturar Resultados

```bash
cd library && .venv/bin/python3 -m pytest tests -v --junitxml=test-results.xml
```

---

### Etapa 3 — Criar Test Plan no Azure DevOps

Use o agent `azdo-sync` para:

1. **Criar Test Plan:**
   - Nome: `Sprint Test Plan — Library Management Services`
   - Descrição: `Plano de testes automatizados cobrindo LoanService, PatronService e JsonLoanRepository`

2. **Criar Test Suites** (um por componente):
   - `LoanService Tests`
   - `PatronService Tests`
   - `JsonLoanRepository Tests`

3. **Criar Test Cases** para cada teste existente:
   - Título: nome da função de teste
   - Steps: baseados no que o teste faz (arrange/act/assert)
   - Automated Test Name: nome completo do teste
   - Automated Test Storage: caminho do arquivo

---

### Etapa 4 — Identificar Gaps e Criar User Stories

Use o agent `test-analyzer` para identificar branches não cobertos.

Para cada gap, use `azdo-sync` para criar:

1. **User Story:**
   - Título: `Cobrir branch {ENUM_VALUE} do método {method_name}`
   - Acceptance Criteria: `Teste pytest cobrindo o branch com assert correto`
   - Tags: `test-gap`, `automated-testing`

2. **Linkar** o User Story ao Test Case correspondente

---

### Etapa 5 — Criar Bugs (se houver QA findings)

Se o `qa-inspector` encontrou bugs, use `azdo-sync` para criar:

1. **Bug** com:
   - Severity e Priority
   - Repro steps
   - Link ao Test Case que deveria cobrir o cenário

---

### Etapa 6 — Relatório Final

```markdown
### Azure Test Plan Criado ✅

**Test Plan:** [Sprint Test Plan — Library Management Services]
**URL:** https://dev.azure.com/paulasilvatech/LibraryManagementSystem/_testPlans

| Métrica | Valor |
|---------|-------|
| Test Suites criados | 3 |
| Test Cases criados | N |
| User Stories (gaps) | N |
| Bugs criados | N |

#### Test Suites
| Suite | Test Cases | Automated |
|-------|-----------|-----------|
| LoanService Tests | N | N |
| PatronService Tests | N | N |
| JsonLoanRepository Tests | N | N |

#### Work Items Criados
| ID | Tipo | Título | Estado |
|----|------|--------|--------|
| #XX | Test Case | test_return_loan_success | Active |
| #XX | User Story | Cobrir branch ERROR em extend_loan | New |
| #XX | Bug | Edge case sem tratamento | New |

**Board:** https://dev.azure.com/paulasilvatech/LibraryManagementSystem/_boards
```
