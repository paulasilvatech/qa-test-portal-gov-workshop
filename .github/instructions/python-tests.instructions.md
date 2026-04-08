---
applyTo: "api/tests/**/*.py"
---

# Python Test Conventions for Portal Gov API

## Testing Patterns

### Infrastructure tests (repositories)
- Use `DummyJsonData` stub class to avoid file system access
- `DummyJsonData` must implement: `ipvas` (list), `cnhs` (list), `save_ipvas()`, `save_cnhs()`, `load_data()`
- Instantiate the repository with `DummyJsonData` and populate its data lists with entity objects
- Reference: `api/tests/test_json_ipva_repository.py`

### Service tests (IPVAService, CNHService)
- Use `unittest.mock.MagicMock` to mock repository interfaces
- Create mock via `MagicMock()` and pass to service constructor
- Configure return values: `mock_repo.get_ipva.return_value = ipva`
- Reference: `api/tests/test_ipva_service.py`, `api/tests/test_cnh_service.py`

### Coexistence rule
- Each test file contains BOTH unittest classes AND standalone pytest functions
- Unittest classes go first (with `setUp`, `self.assert*`)
- Pytest functions go after the `# --- Pytest-style tests ---` separator
- Keep `if __name__ == "__main__": unittest.main()` between the two sections

## Pytest Patterns (required for new tests)

### Fixtures
- Use `@pytest.fixture` for shared setup (service + mock pairs)
- Return tuple `(service, mock_repo)` from fixtures
- Example: `def loan_service(): ... return service, mock_repo`

### Parametrize
- Use `@pytest.mark.parametrize` to test multiple branches in one function
- Each tuple = one branch/enum value being tested
- Include descriptive parameter names

### Error testing
- Services catch all exceptions via try/except and return ERROR status
- Test None repo: `assert result == SomeStatus.ERROR`
- Use `with pytest.raises(ExceptionType):` only for code that truly raises

## Enum Reference (all branches must be tested)

### PagamentoIPVAStatus
- `SUCCESS` — IPVA found, status pendente, payment processed
- `IPVA_NOT_FOUND` — `get_ipva` returns None
- `ALREADY_PAID` — ipva.status == "pago"
- `EXPIRED` — ipva.status == "vencido"
- `ERROR` — exception during processing

### ParcelamentoIPVAStatus
- `SUCCESS` — IPVA found, pendente, valid parcelas, valor ok
- `IPVA_NOT_FOUND` — `get_ipva` returns None
- `ALREADY_PAID` — ipva.status == "pago"
- `ALREADY_PARCELED` — ipva.status == "parcelado"
- `PARCELAS_INVALIDAS` — num_parcelas < 1 or > 3
- `VALOR_MINIMO` — valor_parcela < 50.0
- `ERROR` — exception during processing

### RenovacaoCNHStatus
- `SUCCESS` — CNH found, regular, pontuacao ok, within 30 days of expiry
- `CNH_NOT_FOUND` — `get_cnh` returns None
- `CNH_SUSPENSA` — cnh.situacao == "suspensa"
- `CNH_CASSADA` — cnh.situacao == "cassada"
- `PONTUACAO_EXCEDIDA` — cnh.pontuacao > 20
- `AINDA_VALIDA` — more than 30 days until expiry
- `ERROR` — exception during processing

## Key Entities

### IPVA
Constructor: `IPVA(id, veiculo, ano_exercicio, valor_total, status, proprietario_cpf, parcelas, data_pagamento)`

### CNH
Constructor: `CNH(id, titular_cpf, numero_registro, categoria, data_emissao, data_validade, data_primeira_habilitacao, situacao, pontuacao, observacoes)`

### ParcelaIPVA
Constructor: `ParcelaIPVA(numero, valor, vencimento, status, codigo_barras, qr_code_pix)`

## Commands
```bash
# Run all tests with verbose output
cd api && .venv/bin/python3 -m pytest tests -v

# Run a specific test file
cd api && .venv/bin/python3 -m pytest tests/test_ipva_service.py -v

# Run a single test by name
cd api && .venv/bin/python3 -m pytest tests/test_ipva_service.py -k "test_pagar_ipva_success" -v
```

## Rules
1. NEVER access the file system in tests — use DummyJsonData or MagicMock
2. NEVER delete existing tests — only ADD new ones
3. ALWAYS place new pytest functions AFTER the separator comment
4. ALWAYS import entities and enums from `application_core.*`
5. ALWAYS use `datetime.now()` with `timedelta` for date manipulation
6. ALWAYS respond to the user in pt-BR (Brazilian Portuguese)
