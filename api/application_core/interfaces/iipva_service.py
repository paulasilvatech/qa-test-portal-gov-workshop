from abc import ABC, abstractmethod
from ..enums.pagamento_ipva_status import PagamentoIPVAStatus
from ..enums.parcelamento_ipva_status import ParcelamentoIPVAStatus


class IIPVAService(ABC):
    @abstractmethod
    def pagar_ipva(self, ipva_id: str) -> PagamentoIPVAStatus:
        pass

    @abstractmethod
    def parcelar_ipva(self, ipva_id: str, num_parcelas: int) -> ParcelamentoIPVAStatus:
        pass
