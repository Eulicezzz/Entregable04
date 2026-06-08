from pydantic import BaseModel, Field
from typing import Optional

# Esquema para el Login (valida solo lo necesario)
class CiudadanoLogin(BaseModel):
    numero_documento: str = Field(..., example="12345678")
    password: str = Field(..., example="tu_contraseña")

    class Config:
        from_attributes = True

# Esquema para el Registro (si lo necesitas más adelante)
class CiudadanoCreate(BaseModel):
    nombre: str
    numero_documento: str
    password: str
    tipo_documento: str
    tipo_solicitante: str 
    edad: int
    es_vulnerable: bool
    zona_geografica: str
    correo: str
    telefono: str