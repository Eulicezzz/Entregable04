from fastapi import APIRouter
from ..schemas.data_schema import DatosEntrada

router = APIRouter()

@router.post("/predecir/modelo1")
def predecir_modelo1(datos: DatosEntrada):
    #Llamamos al modelo cargado
    return {"predicción": "resultado del modelo 1"}

@router.post("/predecir/modelo2")
def predecir_modelo2(datos: DatosEntrada):
    #Llamamos al modelo cargado
    return {"prediccion": "resultado del modelo 2"}