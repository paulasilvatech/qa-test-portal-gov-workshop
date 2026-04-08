"""Testes do IPVAService — mesmos padrões do library/tests/test_loan_service.py.

Padrões aplicados:
- unittest.TestCase para testes base
- MagicMock para repositórios
- pytest functions após separador
- @pytest.mark.parametrize para branches de enum
- pytest.raises para error paths
"""
import unittest
from unittest.mock import MagicMock
from datetime import datetime, timedelta

import pytest

from application_core.services.ipva_service import IPVAService
from application_core.entities.ipva import IPVA, ParcelaIPVA
from application_core.enums.pagamento_ipva_status import PagamentoIPVAStatus
from application_core.enums.parcelamento_ipva_status import ParcelamentoIPVAStatus


class IPVAServiceTest(unittest.TestCase):
    """Testes unitários do IPVAService com unittest."""

    def setUp(self):
        self.mock_repo = MagicMock()
        self.service = IPVAService(self.mock_repo)

    # --- pagar_ipva ---

    def test_pagar_ipva_success(self):
        ipva = IPVA(id="1", status="pendente", valor_total=1500.0, proprietario_cpf="12345678900")
        self.mock_repo.get_ipva.return_value = ipva
        result = self.service.pagar_ipva("1")
        self.assertEqual(result, PagamentoIPVAStatus.SUCCESS)
        self.assertEqual(ipva.status, "pago")
        self.assertIsNotNone(ipva.data_pagamento)
        self.mock_repo.update_ipva.assert_called_once_with(ipva)

    def test_pagar_ipva_not_found(self):
        self.mock_repo.get_ipva.return_value = None
        result = self.service.pagar_ipva("999")
        self.assertEqual(result, PagamentoIPVAStatus.IPVA_NOT_FOUND)

    def test_pagar_ipva_already_paid(self):
        ipva = IPVA(id="1", status="pago", valor_total=1500.0)
        self.mock_repo.get_ipva.return_value = ipva
        result = self.service.pagar_ipva("1")
        self.assertEqual(result, PagamentoIPVAStatus.ALREADY_PAID)

    def test_pagar_ipva_expired(self):
        ipva = IPVA(id="1", status="vencido", valor_total=1500.0)
        self.mock_repo.get_ipva.return_value = ipva
        result = self.service.pagar_ipva("1")
        self.assertEqual(result, PagamentoIPVAStatus.EXPIRED)

    # --- parcelar_ipva ---

    def test_parcelar_ipva_success(self):
        ipva = IPVA(id="1", status="pendente", valor_total=600.0, proprietario_cpf="12345678900")
        self.mock_repo.get_ipva.return_value = ipva
        result = self.service.parcelar_ipva("1", 3)
        self.assertEqual(result, ParcelamentoIPVAStatus.SUCCESS)
        self.assertEqual(ipva.status, "parcelado")
        self.assertEqual(len(ipva.parcelas), 3)
        self.mock_repo.update_ipva.assert_called_once_with(ipva)

    def test_parcelar_ipva_not_found(self):
        self.mock_repo.get_ipva.return_value = None
        result = self.service.parcelar_ipva("999", 3)
        self.assertEqual(result, ParcelamentoIPVAStatus.IPVA_NOT_FOUND)


if __name__ == "__main__":
    unittest.main()


# --- Pytest-style tests ---


@pytest.fixture
def ipva_service():
    mock_repo = MagicMock()
    service = IPVAService(mock_repo)
    return service, mock_repo


@pytest.mark.parametrize(
    "status_ipva, expected_status",
    [
        ("pendente", PagamentoIPVAStatus.SUCCESS),
        ("pago", PagamentoIPVAStatus.ALREADY_PAID),
        ("vencido", PagamentoIPVAStatus.EXPIRED),
    ],
    ids=["success", "already_paid", "expired"],
)
def test_pagar_ipva_parametrized(ipva_service, status_ipva, expected_status):
    service, mock_repo = ipva_service
    ipva = IPVA(id="1", status=status_ipva, valor_total=1500.0)
    mock_repo.get_ipva.return_value = ipva
    result = service.pagar_ipva("1")
    assert result == expected_status


def test_pagar_ipva_not_found(ipva_service):
    service, mock_repo = ipva_service
    mock_repo.get_ipva.return_value = None
    result = service.pagar_ipva("999")
    assert result == PagamentoIPVAStatus.IPVA_NOT_FOUND


def test_pagar_ipva_error(ipva_service):
    service, mock_repo = ipva_service
    mock_repo.get_ipva.side_effect = Exception("DB error")
    result = service.pagar_ipva("1")
    assert result == PagamentoIPVAStatus.ERROR


@pytest.mark.parametrize(
    "status_ipva, num_parcelas, valor_total, expected_status",
    [
        ("pendente", 3, 600.0, ParcelamentoIPVAStatus.SUCCESS),
        ("pago", 3, 600.0, ParcelamentoIPVAStatus.ALREADY_PAID),
        ("parcelado", 3, 600.0, ParcelamentoIPVAStatus.ALREADY_PARCELED),
        ("pendente", 5, 600.0, ParcelamentoIPVAStatus.PARCELAS_INVALIDAS),
        ("pendente", 0, 600.0, ParcelamentoIPVAStatus.PARCELAS_INVALIDAS),
        ("pendente", 3, 100.0, ParcelamentoIPVAStatus.VALOR_MINIMO),
    ],
    ids=["success", "already_paid", "already_parceled", "parcelas_over_max", "parcelas_zero", "valor_minimo"],
)
def test_parcelar_ipva_parametrized(ipva_service, status_ipva, num_parcelas, valor_total, expected_status):
    service, mock_repo = ipva_service
    ipva = IPVA(id="1", status=status_ipva, valor_total=valor_total)
    mock_repo.get_ipva.return_value = ipva
    result = service.parcelar_ipva("1", num_parcelas)
    assert result == expected_status


def test_parcelar_ipva_not_found(ipva_service):
    service, mock_repo = ipva_service
    mock_repo.get_ipva.return_value = None
    result = service.parcelar_ipva("999", 3)
    assert result == ParcelamentoIPVAStatus.IPVA_NOT_FOUND


def test_parcelar_ipva_error(ipva_service):
    service, mock_repo = ipva_service
    mock_repo.get_ipva.side_effect = Exception("DB error")
    result = service.parcelar_ipva("1", 3)
    assert result == ParcelamentoIPVAStatus.ERROR


def test_pagar_ipva_updates_parcelas(ipva_service):
    """Verifica que ao pagar, todas as parcelas pendentes são marcadas como pagas."""
    service, mock_repo = ipva_service
    parcelas = [
        ParcelaIPVA(numero=1, valor=200.0, vencimento=datetime.now(), status="pago"),
        ParcelaIPVA(numero=2, valor=200.0, vencimento=datetime.now() + timedelta(days=30), status="pendente"),
    ]
    ipva = IPVA(id="1", status="pendente", valor_total=400.0, parcelas=parcelas)
    mock_repo.get_ipva.return_value = ipva
    service.pagar_ipva("1")
    assert all(p.status == "pago" for p in ipva.parcelas)


def test_parcelar_ipva_cria_parcelas_corretas(ipva_service):
    """Verifica que as parcelas são criadas com valores e datas corretos."""
    service, mock_repo = ipva_service
    ipva = IPVA(id="1", status="pendente", valor_total=600.0)
    mock_repo.get_ipva.return_value = ipva
    service.parcelar_ipva("1", 3)
    assert len(ipva.parcelas) == 3
    assert ipva.parcelas[0].valor == 200.0
    assert ipva.parcelas[1].numero == 2
    assert ipva.parcelas[2].vencimento > ipva.parcelas[1].vencimento


def test_ipva_service_none_repo():
    """Verifica que passar None como repositório retorna ERROR."""
    service = IPVAService(None)
    result = service.pagar_ipva("1")
    assert result == PagamentoIPVAStatus.ERROR
