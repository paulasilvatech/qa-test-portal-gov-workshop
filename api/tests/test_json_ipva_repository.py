"""Testes do JsonIPVARepository — mesmos padrões do library/tests/test_json_loan_repository.py.

Padrão: DummyJsonData stub para evitar acesso ao filesystem.
"""
import unittest

import pytest

from application_core.entities.ipva import IPVA
from infrastructure.json_ipva_repository import JsonIPVARepository


class DummyJsonData:
    """Stub para JsonData — mesma abordagem do library."""

    def __init__(self):
        self.ipvas = []
        self.save_ipvas_call_count = 0

    def save_ipvas(self, ipvas):
        self.ipvas = ipvas
        self.save_ipvas_call_count += 1

    def load_data(self):
        pass


class JsonIPVARepositoryTest(unittest.TestCase):
    def setUp(self):
        self.data = DummyJsonData()
        self.repo = JsonIPVARepository(self.data)
        self.data.ipvas = [
            IPVA(id="1", status="pendente", valor_total=1500.0, proprietario_cpf="111"),
            IPVA(id="2", status="pago", valor_total=800.0, proprietario_cpf="111"),
            IPVA(id="3", status="vencido", valor_total=2000.0, proprietario_cpf="222"),
        ]

    def test_get_ipva_found(self):
        result = self.repo.get_ipva("1")
        self.assertIsNotNone(result)
        self.assertEqual(result.id, "1")

    def test_get_ipva_not_found(self):
        result = self.repo.get_ipva("999")
        self.assertIsNone(result)

    def test_update_ipva_found_mutates_and_saves(self):
        ipva = self.repo.get_ipva("1")
        ipva.status = "pago"
        self.repo.update_ipva(ipva)
        updated = self.repo.get_ipva("1")
        self.assertEqual(updated.status, "pago")
        self.assertEqual(self.data.save_ipvas_call_count, 1)

    def test_get_ipvas_by_cpf(self):
        results = self.repo.get_ipvas_by_cpf("111")
        self.assertEqual(len(results), 2)
        for r in results:
            self.assertEqual(r.proprietario_cpf, "111")

    def test_get_ipvas_by_cpf_not_found(self):
        results = self.repo.get_ipvas_by_cpf("999")
        self.assertEqual(len(results), 0)


if __name__ == "__main__":
    unittest.main()


# --- Pytest-style tests ---


@pytest.fixture
def ipva_repo():
    data = DummyJsonData()
    repo = JsonIPVARepository(data)
    data.ipvas = [
        IPVA(id="1", status="pendente", valor_total=1500.0, proprietario_cpf="111"),
        IPVA(id="2", status="pago", valor_total=800.0, proprietario_cpf="111"),
    ]
    return repo, data


def test_get_ipva_returns_correct_entity(ipva_repo):
    repo, _ = ipva_repo
    ipva = repo.get_ipva("1")
    assert ipva is not None
    assert ipva.valor_total == 1500.0


def test_update_ipva_persists(ipva_repo):
    repo, data = ipva_repo
    ipva = repo.get_ipva("1")
    ipva.status = "pago"
    repo.update_ipva(ipva)
    assert data.ipvas[0].status == "pago"
    assert data.save_ipvas_call_count == 1


def test_get_ipvas_by_cpf_filters(ipva_repo):
    repo, _ = ipva_repo
    results = repo.get_ipvas_by_cpf("111")
    assert len(results) == 2
    assert all(ipva.proprietario_cpf == "111" for ipva in results)


def test_update_ipva_noop_when_not_found(ipva_repo):
    repo, data = ipva_repo
    ipva_fantasma = IPVA(id="999")
    repo.update_ipva(ipva_fantasma)
    assert len(data.ipvas) == 2
    assert data.ipvas[0].id == "1"
    assert data.ipvas[1].id == "2"
    assert data.save_ipvas_call_count == 0
