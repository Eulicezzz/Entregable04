from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ciudadano import Ciudadano
from app.schemas.auth import CiudadanoLogin, CiudadanoCreate

router = APIRouter()

# --- LOGIN CIUDADANO ---
@router.post("/login")
def login(credenciales: CiudadanoLogin, db: Session = Depends(get_db)):
    user = db.query(Ciudadano).filter(
        Ciudadano.numero_documento == credenciales.numero_documento
    ).first()
    
    if not user or user.password != credenciales.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Documento o contraseña incorrectos"
        )
    
    return {"message": "Login exitoso", "user_id": user.id_ciudadano}

# --- REGISTRO CIUDADANO ---
@router.post("/register")
def register(datos: CiudadanoCreate, db: Session = Depends(get_db)):
    # 1. Verificar si el usuario ya existe para evitar duplicados
    usuario_existente = db.query(Ciudadano).filter(
        Ciudadano.numero_documento == datos.numero_documento
    ).first()
    
    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un ciudadano con ese número de documento"
        )

    # 2. Crear instancia del nuevo ciudadano
    nuevo_ciudadano = Ciudadano(
        nombre=datos.nombre,
        numero_documento=datos.numero_documento,
        password=datos.password, 
        tipo_documento=datos.tipo_documento,
        edad=datos.edad,
        es_vulnerable=datos.es_vulnerable,
        zona_geografica=datos.zona_geografica,
        correo=datos.correo,
        telefono=datos.telefono
    )

    # 3. Guardar en la base de datos
    db.add(nuevo_ciudadano)
    db.commit()
    db.refresh(nuevo_ciudadano)

    return {"message": "Usuario registrado exitosamente", "id": nuevo_ciudadano.id_ciudadano}

# --- LOGIN FUNCIONARIO ---
@router.post("/login/funcionario")
def login_funcionario(credenciales: CiudadanoLogin, db: Session = Depends(get_db)):
    # Aquí aplicarías una lógica similar buscando en una tabla 'Funcionarios'
    return {"message": "Login funcionario funcionando"}