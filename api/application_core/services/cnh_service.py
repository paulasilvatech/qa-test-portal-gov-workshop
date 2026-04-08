from ..interfaces.icnh_service import ICNHService
from ..interfaces.icnh_repository import ICNHRepository
from ..enums.renovacao_cnh_status import RenovacaoCNHStatus
from datetime import datetime, timedelta


class CNHService(ICNHService):
    PONTUACAO_MAXIMA = 20
    DIAS_ANTES_VENCIMENTO = 30
    RENOVACAO_ANOS = 5

    def __init__(self, cnh_repository: ICNHRepository):
        self._cnh_repository = cnh_repository

    def renovar_cnh(self, cnh_id: str) -> RenovacaoCNHStatus:
        """Renovação de CNH — equivalente a PatronService.renew_membership."""
        try:
            cnh = self._cnh_repository.get_cnh(cnh_id)
            if cnh is None:
                return RenovacaoCNHStatus.CNH_NOT_FOUND
            if cnh.situacao == "suspensa":
                return RenovacaoCNHStatus.CNH_SUSPENSA
            if cnh.situacao == "cassada":
                return RenovacaoCNHStatus.CNH_CASSADA
            if cnh.pontuacao > self.PONTUACAO_MAXIMA:
                return RenovacaoCNHStatus.PONTUACAO_EXCEDIDA
            dias_para_vencer = (cnh.data_validade - datetime.now()).days
            if dias_para_vencer > self.DIAS_ANTES_VENCIMENTO:
                return RenovacaoCNHStatus.AINDA_VALIDA
            # Renovar: nova validade = hoje + 5 anos
            cnh.data_validade = datetime.now() + timedelta(days=365 * self.RENOVACAO_ANOS)
            cnh.data_emissao = datetime.now()
            cnh.situacao = "regular"
            cnh.pontuacao = 0
            self._cnh_repository.update_cnh(cnh)
            return RenovacaoCNHStatus.SUCCESS
        except Exception:
            return RenovacaoCNHStatus.ERROR
