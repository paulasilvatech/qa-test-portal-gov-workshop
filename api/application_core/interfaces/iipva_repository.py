from abc import ABC, abstractmethod
from typing import List, Optional
from ..entities.ipva import IPVA


class IIPVARepository(ABC):
    @abstractmethod
    def get_ipva(self, ipva_id: str) -> Optional[IPVA]:
        pass

    @abstractmethod
    def update_ipva(self, ipva: IPVA) -> None:
        pass

    @abstractmethod
    def get_ipvas_by_cpf(self, cpf: str) -> List[IPVA]:
        pass
