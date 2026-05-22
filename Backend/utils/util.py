import random
import string
from cryptography.fernet import Fernet
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import base64

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Clave maestra para encriptar los JWT secrets en BD (va en .env)
MASTER_KEY = os.getenv("MASTER_ENCRYPTION_KEY").encode()
fernet = Fernet(MASTER_KEY)

def generate_jwt_secret(length: int = 10) -> str:
    """Genera un secret de exactamente 10 caracteres aleatorios."""
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choices(chars, k=length))

def encrypt_secret(secret: str) -> str:
    """Encripta el JWT secret antes de guardarlo en BD."""
    return fernet.encrypt(secret.encode()).decode()

def decrypt_secret(encrypted: str) -> str:
    """Desencripta el JWT secret al momento de usarlo."""
    return fernet.decrypt(encrypted.encode()).decode()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(user_id: int, jwt_secret: str, expires_minutes: int = 60):
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, jwt_secret, algorithm="HS256")

def decode_token(token: str, jwt_secret: str):
    return jwt.decode(token, jwt_secret, algorithms=["HS256"])