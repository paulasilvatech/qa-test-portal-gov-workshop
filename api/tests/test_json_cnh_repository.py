"""Testes do JsonCNHRepository — mesmos padrões do library/tests/test_json_ipva_repository.py.

Padrão: DummyJsonData stub para evitar acesso ao filesystem.
"""
import unittest
from datetime import datetime

import pytest

from application_core.entities.cnh import CNH
from infrastructure.json_cnh_repository import JsonCNHRepository


class DummyJsonData:
    """Stub para JsonData — mesma abordagem do library."""

    def __init__(self):
        self.cnhs = []
        self.save_cnhs_call_count = 0

    def save_cnhs(self, cnhs):
        self.cnhs = cnhs
        self.save_cnhs_call_count += 1

    def load_data(self):
        pass


_EMISSAO = datetime(2020, 1, 1)
_VALIDADE_1 = datetime(2030, 12, 1)
_VALIDADE_2 = datetime(2028, 5, 1)


def _cnh_001():
    return CNH(
        id="cnh-001",
        titular_cpf="111.111.111-11",
        numero_registro="REG-001",
        categoria="B",
        data_emissao=_EMISSAO,
        data_validade=_VALIDADE_1,
        data_primeira_habilitacao=_EMISSAO,
        situacao="regular",
        pontuacao=0,
    )


def _cnh_002():
    return CNH(
        id="cnh-002",
        titular_cpf="222.222.222-22",
        numero_registro="REG-002",
        categoria="AB",
        data_emissao=_EMISSAO,
        data_validade=_VALIDADE_2,
        data_primeira_habilitacao=_EMISSAO,
        situacao="suspensa",
        pontuacao=10,
    )


class JsonCNHRepositoryTest(unittest.TestCase):
    def setUp(self):
        self.data = DummyJsonData()
        self.repo = JsonCNHRepository(self.data)
        self.data.cnhs = [_cnh_001(), _cnh_002()]

    def test_get_cnh_found(self):
        result = self.repo.get_cnh("cnh-001")
        self.assertIsNotNone(result)
        self.assertEqual(result.id, "cnh-001")
        self.assertEqual(result.titular_cpf, "111.111.111-11")

    def test_get_cnh_not_found(self):
        result = self.repo.get_cnh("cnh-999")
        self.assertIsNone(result)

    def test_get_cnh_by_cpf_found(self):
        result = self.repo.get_cnh_by_cpf("222.222.222-22")
        self.assertIsNotNone(result)
        self.assertEqual(result.id, "cnh-002")
        self.assertEqual(result.titular_cpf, "222.222.222-22")

    def test_get_cnh_by_cpf_not_found(self):
        result = self.repo.get_cnh_by_cpf("000.000.000-00")
        self.assertIsNone(result)

    def test_update_cnh_found_mutates_and_saves(self):
        cnh = self.repo.get_cnh("cnh-001")
        cnh.pontuacao = 20
        self.repo.update_cnh(cnh)
        self.assertEqual(self.repo.get_cnh("cnh-001").pontuacao, 20)
        self.assertEqual(self.data.cnhs[0].pontuacao, 20)
        self.assertEqual(self.data.save_cnhs_call_count, 1)

    def test_update_cnh_not_found_is_noop(self):
        cnh_fantasma = CNH(
            id="cnh-999",
            titular_cpf="000.000.000-00",
            numero_registro="REG-999",
            categoria="B",
            data_emissao=_EMISSAO,
            data_validade=_VALIDADE_1,
            data_primeira_habilitacao=_EMISSAO,
        )
        self.repo.update_cnh(cnh_fantasma)
        self.assertEqual(len(self.data.cnhs), 2)
        self.assertEqual(self.data.cnhs[0].id, "cnh-001")
        self.assertEqual(self.data.cnhs[1].id, "cnh-002")
        self.assertEqual(self.data.save_cnhs_call_count, 0)


if __name__ == "__main__":
    unittest.main()


# --- Pytest-style tests ---


@pytest.fixture
def cnh_repo():
    data = DummyJsonData()
    repo = JsonCNHRepository(data)
    data.cnhs = [_cnh_001(), _cnh_002()]
    return repo, data


def test_get_cnh_returns_correct_entity(cnh_repo):
    repo, _ = cnh_repo
    cnh = repo.get_cnh("cnh-001")
    assert cnh is not None
    assert cnh.titular_cpf == "111.111.111-11"
    assert cnh.categoria == "B"


def test_update_cnh_persists_to_data(cnh_repo):
    repo, data = cnh_repo
    cnh = repo.get_cnh("cnh-001")
    cnh.pontuacao = 30
    repo.update_cnh(cnh)
    assert data.cnhs[0].pontuacao == 30
    assert data.save_cnhs_call_count == 1


def test_update_cnh_noop_when_not_found(cnh_repo):
    repo, data = cnh_repo
    cnh_fantasma = CNH(
        id="cnh-999",
        titular_cpf="000.000.000-00",
        numero_registro="REG-999",
        categoria="B",
        data_emissao=_EMISSAO,
        data_validade=_VALIDADE_1,
        data_primeira_habilitacao=_EMISSAO,
    )
    repo.update_cnh(cnh_fantasma)
    assert len(data.cnhs) == 2
    assert data.save_cnhs_call_count == 0


def test_get_cnh_by_cpf_returns_correct_entity(cnh_repo):
    repo, _ = cnh_repo
    cnh = repo.get_cnh_by_cpf("222.222.222-22")
    assert cnh is not None
    assert cnh.id == "cnh-002"
    assert cnh.categoria == "AB"


def test_get_cnh_by_cpf_returns_none_when_not_found(cnh_repo):
    repo, _ = cnh_repo
    assert repo.get_cnh_by_cpf("000.000.000-00") is None
