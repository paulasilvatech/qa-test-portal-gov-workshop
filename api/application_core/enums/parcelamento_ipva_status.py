from enum import Enum


class ParcelamentoIPVAStatus(Enum):
    """Status do parcelamento de IPVA — equivalente ao LoanExtensionStatus do library."""
    SUCCESS = "Parcelamento do IPVA realizado com sucesso."
    IPVA_NOT_FOUND = "IPVA não encontrado."
    ALREADY_PAID = "Não é possível parcelar — IPVA já está pago."
    ALREADY_PARCELED = "IPVA já está parcelado."
    VALOR_MINIMO = "Valor abaixo do mínimo para parcelamento."
    PARCELAS_INVALIDAS = "Número de parcelas inválido (máximo 3x)."
    ERROR = "Erro ao processar parcelamento do IPVA."
