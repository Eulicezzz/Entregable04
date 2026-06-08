from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Ciudadano(Base):
    __tablename__ = "ciudadanos"

    id_ciudadano = Column(Integer, primary_key=True, index=True)
    tipo_documento = Column(String(50))
    numero_documento = Column(String(20), unique=True, index=True)
    password = Column(String(255)) 
    nombre = Column(String(255))
    edad = Column(Integer)
    es_vulnerable = Column(Boolean)
    zona_geografica = Column(String(255))
    tipo_solicitante = Column(String(50), nullable=False, default="Persona Natural")
    correo = Column(String(255))
    telefono = Column(String(20))