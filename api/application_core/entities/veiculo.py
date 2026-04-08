from dataclasses import dataclass
from typing import Optional


@dataclass
class Veiculo:
    placa: str
    renavam: str
    marca: str
    modelo: str
    ano_fabricacao: int
    ano_modelo: int
    cor: str
    combustivel: str
    proprietario_cpf: str
