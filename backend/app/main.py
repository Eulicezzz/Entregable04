from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.tramites import router as tramites_router
from app.routes.auth import router as auth_router


# Crear la aplicación FastAPI
app = FastAPI(title='API de predicción de Trámites')

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],  # esto debera restringir al dominio
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

# Rutas
app.include_router(predict_router, prefix="/api")
app.include_router(tramites_router, prefix="/api")
app.include_router(auth_router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "El backend IA está funcionando correctamente."}