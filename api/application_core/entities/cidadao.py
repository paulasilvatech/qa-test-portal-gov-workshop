from dataclasses import dataclass, field
from typing import Optional, List
from datetime import datetime


@dataclass
class Endereco:
    logradouro: str
    numero: str
    bairro: str
    cidade: str
    uf: str
    cep: str
    complemento: Optional[str] = None


@dataclass
class Cidadao:
    cpf: str
    nome: str
    nis: str
    email: str
    telefone: str
    endereco: Optional[Endereco] = None
