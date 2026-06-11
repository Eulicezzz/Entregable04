import numpy as np
from fastapi import APIRouter, HTTPException
from app.schemas.data_schema import InputModeloDias
from app.ml.model_loader import cargar_modelos

router = APIRouter()
modelos = cargar_modelos()
m_criticidad = modelos['modelo_criticidad']
m_dias = modelos['modelo_dias']

# Valores de entrenamiento extraídos de tu Colab
MEAN = np.array([29.59975, 0.65075, 0.9645, 53.4065, 0.42125, 0.14575, 0.2005, 0.258, 0.203, 0.6585, 0.76825], dtype=np.float32)
STD = np.array([17.62892651, 0.47673309, 1.26005546, 21.04044338, 0.49375949, 0.35285541, 0.40037451, 0.437534, 0.40223252, 0.47421277, 0.42195016], dtype=np.float32)

@router.post("/predecir/modelo2")
def predecir_modelo2(datos: InputModeloDias):
    # 1. Construir vector de 11 elementos crudos (Mismo orden que en tu Colab)
    # [dias, doc, reclamos, edad, vuln, Consulta, Denuncia, Licencia, Permiso, Urbana, Persona natural]
    raw_vector = np.array([
        datos.dias_en_espera,
        datos.documentacion_completa,
        datos.reclamos_previos,
        datos.edad_solicitante,
        datos.es_vulnerable,
        1.0 if datos.tipo_tramite == "Consulta" else 0.0,
        1.0 if datos.tipo_tramite == "Denuncia" else 0.0,
        1.0 if datos.tipo_tramite == "Licencia" else 0.0,
        1.0 if datos.tipo_tramite == "Permiso" else 0.0,
        1.0 if datos.zona_geografica == "Urbana" else 0.0,
        1.0 if datos.tipo_solicitante == "Persona natural" else 0.0
    ], dtype=np.float32)

    # 2. Aplicar la misma estandarización del entrenamiento
    norm_vector = (raw_vector - MEAN) / STD
    vector_modelo1 = norm_vector.reshape(1, -1)

    # 3. Modelo 1: Predicción de criticidad
    pred_crit = m_criticidad.predict(vector_modelo1)[0][0]

    # 4. Modelo 2: Predicción de días (requiere los 11 datos originales + la predicción anterior)
    vector_modelo2 = np.append(vector_modelo1, [[pred_crit]], axis=1)
    pred_dias = m_dias.predict(vector_modelo2)[0][0]

    return {
        "prediccion": int(round(pred_dias)),
        "score_criticidad": float(round(pred_crit, 2))
    }