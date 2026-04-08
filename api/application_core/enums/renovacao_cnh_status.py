from enum import Enum


class RenovacaoCNHStatus(Enum):
    """Status da renovação de CNH — equivalente ao MembershipRenewalStatus do library."""
    SUCCESS = "Renovação da CNH realizada com sucesso."
    CNH_NOT_FOUND = "CNH não encontrada."
    CNH_SUSPENSA = "Não é possível renovar — CNH está suspensa."
    CNH_CASSADA = "Não é possível renovar — CNH está cassada."
    PONTUACAO_EXCEDIDA = "Não é possível renovar — pontuação excedida (>20 pontos)."
    AINDA_VALIDA = "CNH ainda válida — renovação só permitida nos últimos 30 dias."
    ERROR = "Erro ao processar renovação da CNH."
