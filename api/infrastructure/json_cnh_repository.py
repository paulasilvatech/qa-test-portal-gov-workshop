from typing import Optional
from application_core.interfaces.icnh_repository import ICNHRepository
from application_core.entities.cnh import CNH
from .json_data import JsonData


class JsonCNHRepository(ICNHRepository):
    def __init__(self, json_data: JsonData):
        self._json_data = json_data

    def get_cnh(self, cnh_id: str) -> Optional[CNH]:
        for cnh in self._json_data.cnhs:
            if cnh.id == cnh_id:
                return cnh
        return None

    def get_cnh_by_cpf(self, cpf: str) -> Optional[CNH]:
        for cnh in self._json_data.cnhs:
            if cnh.titular_cpf == cpf:
                return cnh
        return None

    def update_cnh(self, cnh: CNH) -> None:
        for idx in range(len(self._json_data.cnhs)):
            if self._json_data.cnhs[idx].id == cnh.id:
                self._json_data.cnhs[idx] = cnh
                self._json_data.save_cnhs(self._json_data.cnhs)
                return
