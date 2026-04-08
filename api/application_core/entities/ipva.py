from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
from .veiculo import Veiculo


@dataclass
class ParcelaIPVA:
    numero: int
    valor: float
    vencimento: datetime
    status: str = "pendente"  # pago, pendente, vencido
    codigo_barras: Optional[str] = None
    qr_code_pix: Optional[str] = None


@dataclass
class IPVA:
    id: str
    veiculo: Optional[Veiculo] = None
    ano_exercicio: int = 0
    valor_total: float = 0.0
    status: str = "pendente"  # pago, pendente, vencido, parcelado
    proprietario_cpf: str = ""
    parcelas: List[ParcelaIPVA] = field(default_factory=list)
    data_pagamento: Optional[datetime] = None
