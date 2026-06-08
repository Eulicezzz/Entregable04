from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Tramite(Base):
    __tablename__ = "tramites"

    id_tramite = Column(Integer, primary_key=True, index=True)
    id_ciudadano = Column(Integer)
    tipo_tramite = Column(String(255))
    descripcion = Column(String(255))
    documentacion_completa = Column(Integer)
    reclamos_previos = Column(Integer)
    estado_actual = Column(String(255))
    fecha_ingreso = Column(Date)
    fecha_resolucion = Column(Date)
