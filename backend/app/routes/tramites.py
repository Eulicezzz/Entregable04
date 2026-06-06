from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_bd
from app.models.tramite import Tramite

router = APIRouter()

@router.get("/tramites")
def read_tramites(db: Session = Depends(get_bd)):
    tramites = db.query(Tramite).all()
    return tramites