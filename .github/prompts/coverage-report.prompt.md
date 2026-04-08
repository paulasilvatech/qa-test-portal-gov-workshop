---
mode: "agent"
description: "Gera relatório rápido de cobertura de branches com análise de gaps e recomendações."
---

## Objetivo

Produzir um relatório rápido de cobertura de branches para o Library Management System.

## Passos

### 1. Analisar Serviços

Leia os seguintes arquivos de serviço e mapeie cada branch (if/elif/else/try/except) para o enum value correspondente:

- `api/application_core/services/ipva_service.py`
- `api/application_core/services/cnh_service.py`

### 2. Analisar Testes Existentes

Leia os testes existentes e identifique quais branches são cobertos:

- `api/tests/test_ipva_service.py`
- `api/tests/test_cnh_service.py`
- `api/tests/test_json_ipva_repository.py`

### 3. Produzir Relatório

```markdown
## Relatório de Cobertura 📊

### Resumo Executivo
| Serviço | Métodos | Branches | Cobertos | Gap |
|---------|---------|----------|----------|-----|
| LoanService | N | N | N | N |
| PatronService | N | N | N | N |
| JsonLoanRepository | N | N | N | N |

### Detalhamento por Enum

#### LoanReturnStatus
| Status | Testado? | Arquivo de teste |
|--------|----------|-----------------|
| SUCCESS | ✅/❌ | ... |
| LOAN_NOT_FOUND | ✅/❌ | ... |
| ALREADY_RETURNED | ✅/❌ | ... |
| ERROR | ✅/❌ | ... |

#### LoanExtensionStatus
| Status | Testado? | Arquivo de teste |
|--------|----------|-----------------|
| SUCCESS | ✅/❌ | ... |
| LOAN_NOT_FOUND | ✅/❌ | ... |
| LOAN_EXPIRED | ✅/❌ | ... |
| MEMBERSHIP_EXPIRED | ✅/❌ | ... |
| LOAN_RETURNED | ✅/❌ | ... |
| ERROR | ✅/❌ | ... |

#### MembershipRenewalStatus
| Status | Testado? | Arquivo de teste |
|--------|----------|-----------------|
| SUCCESS | ✅/❌ | ... |
| PATRON_NOT_FOUND | ✅/❌ | ... |
| TOO_EARLY_TO_RENEW | ✅/❌ | ... |
| LOAN_NOT_RETURNED | ✅/❌ | ... |
| ERROR | ✅/❌ | ... |

### 📋 Ações Recomendadas
1. (Listar branches sem cobertura e prioridade)
```

### 4. Sugestão de Próximos Passos

Se houver gaps, sugerir:
- Usar o prompt `run-full-qa` para pipeline completo
- Ou usar `test-planner` → `test-writer` → `test-runner` para ciclo rápido
