from fastapi import APIRouter
from app.schemas.data_schema import InputModeloCriticidad, InputModeloDias
import tensorflow as tf
import numpy as np

router = APIRouter()

# Cargar el modelo .keras
modelo_criticidad = tf.keras.models.load_model('app/models/modelo_criticidad.keras')
modelo_dias = tf.keras.models.load_model('app/models/modelo_dias.keras')

MEDIAS = np.array([
    29.59975,   # dias_en_espera
    0.65075,    # documentacion_completa
    0.9645,     # reclamos_previos
    53.4065,    # edad_solicitante
    0.42125,    # es_vulnerable
    0.14575,    # tipo_tramite_Consulta
    0.2005,     # tipo_tramite_Denuncia
    0.258,      # tipo_tramite_Licencia
    0.203,      # tipo_tramite_Permiso
    0.6585,     # zona_geografica_Urbana
    0.76825     # tipo_solicitante_Persona natural
])   

DESVIACIONES = np.array([
    17.62892651120595,    # dias_en_espera
    0.47673308832091776,  # documentacion_completa
    1.2600554551288605,   # reclamos_previos
    21.04044338292328,    # edad_solicitante
    0.4937594935796171,   # es_vulnerable
    0.3528554059384665,   # tipo_tramite_Consulta
    0.40037451217578773,  # tipo_tramite_Denuncia
    0.4375339986789598,   # tipo_tramite_Licencia
    0.40223251981907177,  # tipo_tramite_Permiso
    0.47421276870198253,  # zona_geografica_Urbana
    0.4219501599715303    # tipo_solicitante_Persona natural
])

MEDIAS_M2 = np.array([
    29.59975, 0.65075, 0.9645, 53.4065, 0.42125,
    49.6938, 
    0.14575, 0.2005, 0.258, 0.203, 0.6585, 0.76825
])
DESVIACIONES_M2 = np.array([
    17.62892651120595, 0.47673308832091776, 1.2600554551288605, 21.04044338292328, 0.4937594935796171,
    18.297151460268346, 
    0.3528554059384665, 0.40037451217578773, 0.4375339986789598, 0.40223251981907177, 0.47421276870198253, 0.4219501599715303
])

@router.post("/predecir/modelo1")
def predecir_modelo1(datos: InputModeloCriticidad):
    
    tipo_tramite = datos.tipo_tramite           
    dias_espera = float(datos.dias_en_espera)           
    doc_completa = float(datos.documentacion_completa)   
    reclamos = float(datos.reclamos_previos)             
    edad = float(datos.edad_solicitante)                 
    vulnerable = float(datos.es_vulnerable)             
    zona = datos.zona_geografica                 
    tipo_solicitante = datos.tipo_solicitante     

    # Traduccion de columnas categoricas
    t_consulta = 1.0 if tipo_tramite == "Consulta" else 0.0
    t_denuncia = 1.0 if tipo_tramite == "Denuncia" else 0.0
    t_licencia = 1.0 if tipo_tramite == "Licencia" else 0.0
    t_permiso = 1.0 if tipo_tramite == "Permiso" else 0.0

    z_urbana = 1.0 if zona == "Urbana" else 0.0
    s_natural = 1.0 if tipo_solicitante == "Persona natural" else 0.0

    
    vector_raw = np.array([[
        dias_espera,       # 1
        doc_completa,      # 2
        reclamos,          # 3
        edad,              # 4
        vulnerable,        # 5
        t_consulta,        # 6
        t_denuncia,        # 7
        t_licencia,        # 8
        t_permiso,         # 9
        z_urbana,          # 10
        s_natural          # 11
    ]])

    
    vector_escalado = (vector_raw - MEDIAS) / DESVIACIONES

    # Prediccion
    prediccion = modelo_criticidad.predict(vector_escalado)
    resultado_score = float(prediccion[0][0])
    
    
    return {"score_criticidad_predicho": round(resultado_score, 2)}

@router.post("/predecir/modelo2")
def predecir_modelo2(datos: InputModeloDias):


    tipo_tramite = datos.tipo_tramite           
    dias_espera = float(datos.dias_en_espera)           
    doc_completa = float(datos.documentacion_completa)   
    reclamos = float(datos.reclamos_previos)             
    edad = float(datos.edad_solicitante)                 
    vulnerable = float(datos.es_vulnerable)             
    zona = datos.zona_geografica                 
    tipo_solicitante = datos.tipo_solicitante     

    t_consulta = 1.0 if tipo_tramite == "Consulta" else 0.0
    t_denuncia = 1.0 if tipo_tramite == "Denuncia" else 0.0
    t_licencia = 1.0 if tipo_tramite == "Licencia" else 0.0
    t_permiso = 1.0 if tipo_tramite == "Permiso" else 0.0
    z_urbana = 1.0 if zona == "Urbana" else 0.0
    s_natural = 1.0 if tipo_solicitante == "Persona natural" else 0.0


    vector_raw_m1 = np.array([[
        dias_espera, doc_completa, reclamos, edad, vulnerable,
        t_consulta, t_denuncia, t_licencia, t_permiso, z_urbana, s_natural
    ]])

    vector_escalado_m1 = (vector_raw_m1 - MEDIAS) / DESVIACIONES
    prediccion_m1 = modelo_criticidad.predict(vector_escalado_m1)
    score_criticidad = float(prediccion_m1[0][0])

 
    vector_raw_m2 = np.array([[
        dias_espera,        # 1
        doc_completa,       # 2
        reclamos,           # 3
        edad,               # 4
        vulnerable,         # 5
        score_criticidad,   # 6 
        t_consulta,         # 7
        t_denuncia,         # 8
        t_licencia,         # 9
        t_permiso,          # 10
        z_urbana,           # 11
        s_natural           # 12
    ]])

    
    vector_escalado_m2 = (vector_raw_m2 - MEDIAS_M2) / DESVIACIONES_M2

    
    prediccion_dias = modelo_dias.predict(vector_escalado_m2)
    resultado_dias = float(prediccion_dias[0][0])
    
    return {
        "score_criticidad_calculado": round(score_criticidad, 2),
        "dias_estimados_predichos": round(resultado_dias, 1)
    }
  
