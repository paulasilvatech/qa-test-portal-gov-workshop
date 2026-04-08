from abc import ABC, abstractmethod
from typing import Optional
from ..entities.cnh import CNH


class ICNHRepository(ABC):
    @abstractmethod
    def get_cnh(self, cnh_id: str) -> Optional[CNH]:
        pass

    @abstractmethod
    def get_cnh_by_cpf(self, cpf: str) -> Optional[CNH]:
        pass

    @abstractmethod
    def update_cnh(self, cnh: CNH) -> None:
        pass
