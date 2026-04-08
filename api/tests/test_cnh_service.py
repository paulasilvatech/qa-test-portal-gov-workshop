"""Testes do CNHService — mesmos padrões do library/tests/test_patron_service.py.

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

from application_core.services.cnh_service import CNHService
from application_core.entities.cnh import CNH
from application_core.enums.renovacao_cnh_status import RenovacaoCNHStatus


class CNHServiceTest(unittest.TestCase):
    """Testes unitários do CNHService com unittest."""

    def setUp(self):
        self.mock_repo = MagicMock()
        self.service = CNHService(self.mock_repo)

    def test_renovar_cnh_success(self):
        cnh = CNH(
            id="1", titular_cpf="12345678900", numero_registro="00123456789",
            categoria="B", data_emissao=datetime.now() - timedelta(days=1800),
            data_validade=datetime.now() + timedelta(days=10),
            data_primeira_habilitacao=datetime.now() - timedelta(days=3650),
            situacao="regular", pontuacao=5,
        )
        self.mock_repo.get_cnh.return_value = cnh
        result = self.service.renovar_cnh("1")
        self.assertEqual(result, RenovacaoCNHStatus.SUCCESS)
        self.assertEqual(cnh.pontuacao, 0)
        self.mock_repo.update_cnh.assert_called_once_with(cnh)

    def test_renovar_cnh_not_found(self):
        self.mock_repo.get_cnh.return_value = None
        result = self.service.renovar_cnh("999")
        self.assertEqual(result, RenovacaoCNHStatus.CNH_NOT_FOUND)

    def test_renovar_cnh_suspensa(self):
        cnh = CNH(
            id="1", titular_cpf="12345678900", numero_registro="00123456789",
            categoria="B", data_emissao=datetime.now(), data_validade=datetime.now(),
            data_primeira_habilitacao=datetime.now(), situacao="suspensa",
        )
        self.mock_repo.get_cnh.return_value = cnh
        result = self.service.renovar_cnh("1")
        self.assertEqual(result, RenovacaoCNHStatus.CNH_SUSPENSA)


if __name__ == "__main__":
    unittest.main()


# --- Pytest-style tests ---


@pytest.fixture
def cnh_service():
    mock_repo = MagicMock()
    service = CNHService(mock_repo)
    return service, mock_repo


def _make_cnh(situacao="regular", pontuacao=5, dias_para_vencer=10):
    return CNH(
        id="1", titular_cpf="12345678900", numero_registro="00123456789",
        categoria="B", data_emissao=datetime.now() - timedelta(days=1800),
        data_validade=datetime.now() + timedelta(days=dias_para_vencer),
        data_primeira_habilitacao=datetime.now() - timedelta(days=3650),
        situacao=situacao, pontuacao=pontuacao,
    )


@pytest.mark.parametrize(
    "situacao, pontuacao, dias_para_vencer, expected_status",
    [
        ("regular", 5, 10, RenovacaoCNHStatus.SUCCESS),
        ("suspensa", 0, 10, RenovacaoCNHStatus.CNH_SUSPENSA),
        ("cassada", 0, 10, RenovacaoCNHStatus.CNH_CASSADA),
        ("regular", 25, 10, RenovacaoCNHStatus.PONTUACAO_EXCEDIDA),
        ("regular", 5, 60, RenovacaoCNHStatus.AINDA_VALIDA),
    ],
    ids=["success", "suspensa", "cassada", "pontuacao_excedida", "ainda_valida"],
)
def test_renovar_cnh_parametrized(cnh_service, situacao, pontuacao, dias_para_vencer, expected_status):
    service, mock_repo = cnh_service
    cnh = _make_cnh(situacao=situacao, pontuacao=pontuacao, dias_para_vencer=dias_para_vencer)
    mock_repo.get_cnh.return_value = cnh
    result = service.renovar_cnh("1")
    assert result == expected_status


def test_renovar_cnh_not_found(cnh_service):
    service, mock_repo = cnh_service
    mock_repo.get_cnh.return_value = None
    result = service.renovar_cnh("999")
    assert result == RenovacaoCNHStatus.CNH_NOT_FOUND


def test_renovar_cnh_error(cnh_service):
    service, mock_repo = cnh_service
    mock_repo.get_cnh.side_effect = Exception("DB error")
    result = service.renovar_cnh("1")
    assert result == RenovacaoCNHStatus.ERROR


def test_renovar_cnh_reseta_pontuacao(cnh_service):
    """Verifica que a renovação zera a pontuação."""
    service, mock_repo = cnh_service
    cnh = _make_cnh(pontuacao=18, dias_para_vencer=5)
    mock_repo.get_cnh.return_value = cnh
    service.renovar_cnh("1")
    assert cnh.pontuacao == 0


def test_renovar_cnh_atualiza_validade(cnh_service):
    """Verifica que a nova validade é ~5 anos a partir de hoje."""
    service, mock_repo = cnh_service
    cnh = _make_cnh(dias_para_vencer=5)
    mock_repo.get_cnh.return_value = cnh
    service.renovar_cnh("1")
    dias_nova_validade = (cnh.data_validade - datetime.now()).days
    assert dias_nova_validade >= 1820  # ~5 anos


def test_cnh_service_none_repo():
    """Verifica que passar None como repositório retorna ERROR."""
    service = CNHService(None)
    result = service.renovar_cnh("1")
    assert result == RenovacaoCNHStatus.ERROR
