"""Portal Gov API — FastAPI backend para serviços governamentais."""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from application_core.services.ipva_service import IPVAService
from application_core.services.cnh_service import CNHService
from infrastructure.json_data import JsonData
from infrastructure.json_ipva_repository import JsonIPVARepository
from infrastructure.json_cnh_repository import JsonCNHRepository

app = FastAPI(title="Portal Gov API", version="0.1.0")

# Bootstrap
json_data = JsonData()
json_data.load_data()

ipva_repo = JsonIPVARepository(json_data)
cnh_repo = JsonCNHRepository(json_data)

ipva_service = IPVAService(ipva_repo)
cnh_service = CNHService(cnh_repo)


# --- Request/Response models ---

class PagamentoRequest(BaseModel):
    ipva_id: str


class ParcelamentoRequest(BaseModel):
    ipva_id: str
    num_parcelas: int


class RenovacaoRequest(BaseModel):
    cnh_id: str


class StatusResponse(BaseModel):
    status: str
    message: str


# --- IPVA routes ---

@app.post("/api/ipva/pagar", response_model=StatusResponse)
def pagar_ipva(req: PagamentoRequest):
    result = ipva_service.pagar_ipva(req.ipva_id)
    return StatusResponse(status=result.name, message=result.value)


@app.post("/api/ipva/parcelar", response_model=StatusResponse)
def parcelar_ipva(req: ParcelamentoRequest):
    result = ipva_service.parcelar_ipva(req.ipva_id, req.num_parcelas)
    return StatusResponse(status=result.name, message=result.value)


# --- CNH routes ---

@app.post("/api/cnh/renovar", response_model=StatusResponse)
def renovar_cnh(req: RenovacaoRequest):
    result = cnh_service.renovar_cnh(req.cnh_id)
    return StatusResponse(status=result.name, message=result.value)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "portal-gov-api"}
