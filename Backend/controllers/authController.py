from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from utils.util import (
    hash_password, verify_password,
    generate_jwt_secret, encrypt_secret, decrypt_secret,
    create_access_token
)
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    username: str
    password: str

@router.post("/register", status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(400, "Usuario ya existe")
    
    raw_secret = generate_jwt_secret(10)          
    encrypted = encrypt_secret(raw_secret)         

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        encrypted_jwt_secret=encrypted
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Usuario creado", "id": user.id}

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales inválidas")

    # Desencriptamos el secret del usuario específico para firmar su token
    raw_secret = decrypt_secret(user.encrypted_jwt_secret)
    token = create_access_token(user.id, raw_secret)
    return {"access_token": token, "token_type": "bearer"}