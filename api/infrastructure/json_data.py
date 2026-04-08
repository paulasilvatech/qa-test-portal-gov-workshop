from typing import List, Optional
from application_core.entities.ipva import IPVA


class JsonData:
    """Data provider abstraction — mesma abordagem do library/infrastructure/json_data.py."""

    def __init__(self):
        self.ipvas: List[IPVA] = []
        self.cnhs = []
        self.cidadaos = []

    def save_ipvas(self, ipvas: List[IPVA]) -> None:
        self.ipvas = ipvas

    def save_cnhs(self, cnhs) -> None:
        self.cnhs = cnhs

    def load_data(self) -> None:
        pass
