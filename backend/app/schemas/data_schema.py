from pydantic import BaseModel, Field
from typing import Literal

class InputModeloCriticidad(BaseModel):
    tipo_tramite: Literal[
    'Certificado', 'Consulta', 'Permiso', 'Licencia', 'Denuncia'
    ]
    dias_en_espera: int = Field(..., ge=0, 
                                description='Número de días en espera')
    documentacion_completa: int = Field(..., ge=0, le=1,
                                        description='1 si la documentación está completa, 0 si no')
    reclamos_previos: int = Field(..., ge=0,
                                  description='Número de reclamos previos')
    edad_solicitante: int = Field(..., ge=0,
                                   description='Edad del solicitante')
    es_vulnerable: int = Field(..., ge=0, le=1,
                                description='1 si el solicitante es vulnerable, 0 si no')
    zona_geografica: Literal[
        'Urbana', 'Rural'
    ]
    tipo_solicitante: Literal[
        'Persona Natural', 'Empresa'
    ]
    
    class Config:
        json_schema_extra = {
            'example': {
                'tipo_tramite': 'Licencia',
                'dias_en_espera': 15,
                'documentacion_completa': 1,
                'reclamos_previos': 0,
                'edad_solicitante': 30,
                'es_vulnerable': 0,
                'zona_geografica': 'Urbana',
                'tipo_solicitante': 'Persona Natural'
            }
        }

class InputModeloDias(InputModeloCriticidad):
    score_criticidad: float = Field(..., ge=0.0, le=100.0, 
                                    description='Puntaje de criticidad del trámite')

