---
mode: "agent"
description: "Executa o pipeline completo de QA: análise de cobertura → planejamento → escrita de testes → execução → inspeção QA."
---

## Objetivo

Executar o pipeline completo de Quality Assurance para o Library Management System, garantindo cobertura de 100% dos branches de todos os enums.

## Pipeline

Execute cada etapa **em sequência**. Use os agents especializados para cada passo.

---

### Etapa 1 — Análise de Cobertura

Use o agent `test-analyzer` para analisar os seguintes arquivos:

1. `api/application_core/services/ipva_service.py`
2. `api/application_core/services/cnh_service.py`

Produza a tabela de gaps com:
- Cada método e seus branches
- Qual enum value corresponde a cada branch
- Se existe teste cobrindo esse branch

---

### Etapa 2 — Planejamento de Testes

Use o agent `test-planner` para criar o plano de testes baseado nos gaps encontrados na Etapa 1.

Para cada branch não coberto, especifique:
- Nome da função de teste
- Padrão (parametrize, individual, pytest.raises)
- Fixture necessária
- Configuração do mock
- Assertivas esperadas

---

### Etapa 3 — Implementação

Use o agent `test-writer` para implementar os testes do plano da Etapa 2.

Regras:
- Adicionar testes APÓS o separador `# --- Pytest-style tests ---`
- Seguir convenções de `python-tests.instructions.md`
- NUNCA deletar testes existentes

---

### Etapa 4 — Execução e Validação

Use o agent `test-runner` para executar todos os testes:

```bash
cd library && .venv/bin/python3 -m pytest tests -v
```

Se houver falhas:
1. Passe os erros para `test-writer` corrigir
2. Execute novamente com `test-runner`
3. Máximo 2 ciclos de retry

---

### Etapa 5 — Inspeção QA

Use o agent `qa-inspector` para:

1. Verificar que todos os branches dos 3 enums têm testes
2. Buscar edge cases não cobertos (datas boundary, None inputs)
3. Validar qualidade dos testes (determinísticos, isolados, legíveis)
4. Produzir relatório final de QA

---

### Etapa 6 — Code Review

Use o agent `code-reviewer` para revisar os testes adicionados:

1. Verificar aderência às convenções do projeto
2. Identificar anti-patterns (tautological tests, vague assertions)
3. Confirmar que mocks estão configurados corretamente

---

## Relatório Final

Ao concluir, produza um resumo consolidado:

```markdown
### Pipeline QA Concluído ✅

| Etapa | Agent | Status |
|-------|-------|--------|
| Análise | test-analyzer | ✅/❌ |
| Planejamento | test-planner | ✅/❌ |
| Implementação | test-writer | ✅/❌ |
| Validação | test-runner | ✅/❌ |
| Inspeção QA | qa-inspector | ✅/❌ |
| Code Review | code-reviewer | ✅/❌ |

**Testes antes:** N
**Testes depois:** N
**Branches cobertos:** N/N (100%)
**Bugs encontrados:** N
**Edge cases adicionados:** N
```
