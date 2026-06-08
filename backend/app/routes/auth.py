from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login():
    return {"message": "Login ciudadano funcionando"}

@router.post("/register")
def register():
    return {"message": "Registro ciudadano funcionando"}

@router.post("/login/funcionario")
def login_funcionario():
    return {"message": "Login funcionario funcionando"}