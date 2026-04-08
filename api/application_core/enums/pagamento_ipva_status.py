from enum import Enum


class PagamentoIPVAStatus(Enum):
    """Status do pagamento de IPVA — equivalente ao LoanReturnStatus do library."""
    SUCCESS = "Pagamento do IPVA realizado com sucesso."
    IPVA_NOT_FOUND = "IPVA não encontrado."
    ALREADY_PAID = "IPVA já foi pago anteriormente."
    EXPIRED = "IPVA vencido — necessário recalcular com multa e juros."
    ERROR = "Erro ao processar pagamento do IPVA."
