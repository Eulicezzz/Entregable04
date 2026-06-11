from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tramite import Tramite
from pydantic import BaseModel
from typing import Optional
from datetime import date

class TramiteCreate(BaseModel):
    id_ciudadano: int
    tipo_tramite: str
    descripcion: str
    documentacion_completa: int
    reclamos_previos: int
    estado_actual: str
    fecha_ingreso: date
    fecha_solucion: Optional[date] = None
    edad_solicitante: int
    zona_geografica: str
    tipo_solicitante: str
    score_criticidad: float
    dias_estimados: int
    dias_en_espera: Optional[int] = 0
    es_vulnerable: Optional[int] = 0

    class Config:
        extra = "allow"

router = APIRouter()

# RUTA 1: Para el select de tipos de trámite
@router.get("/tipos-tramite")
def get_tipos():
    return ['Certificado', 'Consulta', 'Permiso', 'Licencia', 'Denuncia']

# RUTA 2: Para cargar la lista del usuario
@router.get("/tramites")
def read_tramites(id_ciudadano: int, db: Session = Depends(get_db)):
    return db.query(Tramite).filter(Tramite.id_ciudadano == id_ciudadano).all()

# RUTA 3: Para registrar trámite
@router.post("/tramites")
def create_tramite(tramite: TramiteCreate, db: Session = Depends(get_db)):
    datos = tramite.model_dump()
    datos["fecha_resolucion"] = datos.pop("fecha_solucion", None)
    for campo in ["dias_en_espera", "es_vulnerable"]:
        datos.pop(campo, None)
    nuevo = Tramite(**datos)
    db.add(nuevo)
    db.commit()
    return nuevo