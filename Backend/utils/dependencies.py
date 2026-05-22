from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from config.database import get_db
from models.user import User
from utils.util import decrypt_secret, decode_token
from jose import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado"
    )
    try:
        # Extraemos el user_id sin verificar firma aún
        from jose import jwt as _jwt
        unverified = _jwt.get_unverified_claims(token)
        user_id = int(unverified["sub"])
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise credentials_exception

    # Ahora verificamos con el secret del usuario específico
    try:
        raw_secret = decrypt_secret(user.encrypted_jwt_secret)
        decode_token(token, raw_secret)
    except JWTError:
        raise credentials_exception

    return user