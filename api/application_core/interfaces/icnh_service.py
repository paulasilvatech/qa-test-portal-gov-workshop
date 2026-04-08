from abc import ABC, abstractmethod
from ..enums.renovacao_cnh_status import RenovacaoCNHStatus


class ICNHService(ABC):
    @abstractmethod
    def renovar_cnh(self, cnh_id: str) -> RenovacaoCNHStatus:
        pass
