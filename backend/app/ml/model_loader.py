from tensorflow.keras.models import load_model
import os

def cargar_modelos():
    # 1. Obtenemos la ruta absoluta de este archivo (model_loader.py)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 2. Construimos la ruta hacia la carpeta 'modelos'
    # Si model_loader.py está en 'backend/app/ml/', subimos dos niveles a 'backend/app/'
    # y ahí debería estar tu carpeta 'modelos'
    base_path = os.path.join(current_dir, '..', 'modelos')
    
    try:
        # Cargamos los archivos usando la ruta absoluta calculada
        path_crit = os.path.join(base_path, 'modelo_criticidad.keras')
        path_dias = os.path.join(base_path, 'modelo_dias.keras')
        
        modelo_criticidad = load_model(path_crit)
        modelo_dias = load_model(path_dias)
        
        print("🚀 ¡Modelos Keras cargados correctamente!")
        return {
            'modelo_criticidad': modelo_criticidad, 
            'modelo_dias': modelo_dias
        }
    except Exception as e:
        print(f"⚠️ Error al cargar los modelos: {e}")
        return {'modelo_criticidad': None, 'modelo_dias': None}