import jwt
from datetime import datetime, timedelta
from config.config import SECRET_KEY, ALGORITHM
from utils.util import Utils

class AuthService:

    @staticmethod
    def login(user, password):
        if not user:
            return None
        
        if user.estado != 1:
            return None
        if not Utils.verify(password, user.password_hash):
            return None
        return AuthService.createToken(user.id)
    @staticmethod
    def createToken(userid):
        payload = {
            "sub": userid,
            "exp": datetime.utcnow() + timedelta(hours=2)
        }

        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)