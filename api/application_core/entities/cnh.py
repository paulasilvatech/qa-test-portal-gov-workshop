from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class CNH:
    id: str
    titular_cpf: str
    numero_registro: str
    categoria: str  # A, B, AB, C, D, E
    data_emissao: datetime
    data_validade: datetime
    data_primeira_habilitacao: datetime
    situacao: str = "regular"  # regular, suspensa, cassada, vencida
    pontuacao: int = 0
    observacoes: Optional[str] = None
