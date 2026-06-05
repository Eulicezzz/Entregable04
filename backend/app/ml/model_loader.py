import joblib # (carga el modelo entrenado) momentanea
 
# Llamar al backend cuando inicie la aplicación
def cargar_modelos():
    modelo_a = joblib.load('modelos/modelo_a.pkl') # Carga el modelo A
    modelo_b = joblib.load('modelos/modelo_b.pkl') # Carga el modelo B
    return {'modelo_a': modelo_a, 'modelo_b': modelo_b}