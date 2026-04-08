from typing import List, Optional
from application_core.interfaces.iipva_repository import IIPVARepository
from application_core.entities.ipva import IPVA
from .json_data import JsonData


class JsonIPVARepository(IIPVARepository):
    def __init__(self, json_data: JsonData):
        self._json_data = json_data

    def get_ipva(self, ipva_id: str) -> Optional[IPVA]:
        for ipva in self._json_data.ipvas:
            if ipva.id == ipva_id:
                return ipva
        return None

    def update_ipva(self, ipva: IPVA) -> None:
        for idx in range(len(self._json_data.ipvas)):
            if self._json_data.ipvas[idx].id == ipva.id:
                self._json_data.ipvas[idx] = ipva
                self._json_data.save_ipvas(self._json_data.ipvas)
                return

    def get_ipvas_by_cpf(self, cpf: str) -> List[IPVA]:
        return [ipva for ipva in self._json_data.ipvas if ipva.proprietario_cpf == cpf]
