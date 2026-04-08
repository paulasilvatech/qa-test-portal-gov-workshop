from ..interfaces.iipva_service import IIPVAService
from ..interfaces.iipva_repository import IIPVARepository
from ..enums.pagamento_ipva_status import PagamentoIPVAStatus
from ..enums.parcelamento_ipva_status import ParcelamentoIPVAStatus
from ..entities.ipva import ParcelaIPVA
from datetime import datetime, timedelta


class IPVAService(IIPVAService):
    MAX_PARCELAS = 3
    VALOR_MINIMO_PARCELA = 50.0

    def __init__(self, ipva_repository: IIPVARepository):
        self._ipva_repository = ipva_repository

    def pagar_ipva(self, ipva_id: str) -> PagamentoIPVAStatus:
        """Pagamento de IPVA — equivalente a LoanService.return_loan."""
        try:
            ipva = self._ipva_repository.get_ipva(ipva_id)
            if ipva is None:
                return PagamentoIPVAStatus.IPVA_NOT_FOUND
            if ipva.status == "pago":
                return PagamentoIPVAStatus.ALREADY_PAID
            if ipva.status == "vencido":
                return PagamentoIPVAStatus.EXPIRED
            ipva.status = "pago"
            ipva.data_pagamento = datetime.now()
            for parcela in ipva.parcelas:
                if parcela.status != "pago":
                    parcela.status = "pago"
            self._ipva_repository.update_ipva(ipva)
            return PagamentoIPVAStatus.SUCCESS
        except Exception:
            return PagamentoIPVAStatus.ERROR

    def parcelar_ipva(self, ipva_id: str, num_parcelas: int) -> ParcelamentoIPVAStatus:
        """Parcelamento de IPVA — equivalente a LoanService.extend_loan."""
        try:
            ipva = self._ipva_repository.get_ipva(ipva_id)
            if ipva is None:
                return ParcelamentoIPVAStatus.IPVA_NOT_FOUND
            if ipva.status == "pago":
                return ParcelamentoIPVAStatus.ALREADY_PAID
            if ipva.status == "parcelado":
                return ParcelamentoIPVAStatus.ALREADY_PARCELED
            if num_parcelas < 1 or num_parcelas > self.MAX_PARCELAS:
                return ParcelamentoIPVAStatus.PARCELAS_INVALIDAS
            valor_parcela = ipva.valor_total / num_parcelas
            if valor_parcela < self.VALOR_MINIMO_PARCELA:
                return ParcelamentoIPVAStatus.VALOR_MINIMO
            ipva.parcelas = []
            for i in range(num_parcelas):
                parcela = ParcelaIPVA(
                    numero=i + 1,
                    valor=round(valor_parcela, 2),
                    vencimento=datetime.now() + timedelta(days=30 * (i + 1)),
                    status="pendente",
                )
                ipva.parcelas.append(parcela)
            ipva.status = "parcelado"
            self._ipva_repository.update_ipva(ipva)
            return ParcelamentoIPVAStatus.SUCCESS
        except Exception:
            return ParcelamentoIPVAStatus.ERROR
