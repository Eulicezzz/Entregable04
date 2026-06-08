from datetime import date
from typing import Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.tramite import Tramite

#Schema para validar la creación
class TramiteCreate(BaseModel):
    id_ciudadano: int
    tipo_tramite: str
    descripcion: str
    documentacion_completa: int
    reclamos_previos: int
    estado_actual: str
    fecha_ingreso: date
    fecha_solucion: Optional[date] = None

router = APIRouter()

@router.get("/tramites")
def read_tramites(db: Session = Depends(get_db)):
    tramites = db.query(Tramite).all()
    return tramites

@router.post("/tramites")
def create_tramite(tramite: TramiteCreate, db: Session = Depends(get_db)):
    nuevo_tramite = Tramite(**tramite.dict())
    db.add(nuevo_tramite)
    db.commit()
    db.refresh(nuevo_tramite)
    return nuevo_tramite

@router.get("/tipos-tramite")
def get_tipos_tramite():
    return ['Certificado', 'Consulta', 'Permiso', 'Licencia', 'Denuncia']