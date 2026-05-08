import os
from http.client import HTTPException

from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
from jose import jwt
import bcrypt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_password_hash(password: str):
    pass_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pass_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password:str, hash_password:str):
    pass_byte_enc = plain_password.encode('utf-8')
    hash_password_byte_enc = hash_password.encode('utf-8')
    return bcrypt.checkpw(pass_byte_enc,hash_password_byte_enc)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user_login(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Невалидный токен")
        return username
    except Exception:
        raise HTTPException(status_code=401, detail="Ошибка авторизации")