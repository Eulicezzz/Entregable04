from sqlalchemy import Column, Integer, String, Date, Float
from app.database import Base

class Tramite(Base):
    __tablename__ = "tramites"

    # Claves e información básica
    id = Column(Integer, primary_key=True, index=True)
    id_ciudadano = Column(Integer)
    
    # Datos de entrada del formulario
    tipo_tramite = Column(String(255))
    descripcion = Column(String(255))
    documentacion_completa = Column(Integer)
    reclamos_previos = Column(Integer)
    estado_actual = Column(String(255))
    fecha_ingreso = Column(Date)
    fecha_resolucion = Column(Date, nullable=True) # Permitimos nulo si aún no se resuelve
    
    # Variables predictivas
    edad_solicitante = Column(Integer)
    es_vulnerable = Column(Integer) # Añadida para que coincida con tu form
    zona_geografica = Column(String(255))
    tipo_solicitante = Column(String(255))
    
    # Resultados de la IA
    score_criticidad = Column(Float)
    dias_estimados = Column(Integer)