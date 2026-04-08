---
applyTo: "api/application_core/**/*.py,api/infrastructure/**/*.py"
---

# Python Code Conventions for Portal Gov API

## Architecture

This project follows Clean Architecture:
- `application_core/entities/` — Domain entities (Loan, Patron, BookItem, Book)
- `application_core/enums/` — Status enums (LoanReturnStatus, LoanExtensionStatus, MembershipRenewalStatus)
- `application_core/interfaces/` — Abstract repository interfaces
- `application_core/services/` — Business logic services (LoanService, PatronService)
- `infrastructure/` — Concrete implementations (JsonLoanRepository, JsonPatronRepository, JsonData)

## Coding Standards

### Naming
- Classes: `PascalCase` (e.g., `LoanService`, `JsonLoanRepository`)
- Methods: `snake_case` (e.g., `return_loan`, `get_patron`)
- Private: prefix with underscore `_` (e.g., `_validate_input`)
- Constants: `UPPER_SNAKE_CASE`
- Enums: `PascalCase` class, `UPPER_SNAKE_CASE` values

### Service Methods Pattern
Every service method that can fail must:
1. Return a status enum (never raise exceptions to callers)
2. Wrap logic in try/except, returning ERROR status on exception
3. Check for None results from repository calls (return NOT_FOUND status)
4. Call `save_*()` only after successful state mutation
5. Handle all edge cases with specific enum values

```python
def operation(self, id: int) -> StatusEnum:
    try:
        entity = self.repository.get_entity(id)
        if entity is None:
            return StatusEnum.NOT_FOUND
        # ... business logic checks ...
        self.repository.save_entities()
        return StatusEnum.SUCCESS
    except Exception:
        return StatusEnum.ERROR
```

### Date Handling
- Use `datetime.now()` for current time comparisons
- Use `timedelta(days=N)` for date arithmetic
- Never hardcode dates — always compute relative to now

### Dependencies
- Services receive repositories via constructor injection
- Repositories receive data provider via constructor injection
- No service should directly access the file system

## Language

- Code (variables, functions, classes) in English
- Respond to user in pt-BR (Brazilian Portuguese)
