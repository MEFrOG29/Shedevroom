import os
from fastapi import HTTPException

from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

from fastapi.params import Depends
from jose import jwt
import bcrypt
from sqlalchemy.orm import Session

import models
from database import get_db
from fastapi.security import OAuth2PasswordBearer

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_password_hash(password: str):
    pass_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pass_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password:str, hash_password:str):
    pass_bytes = plain_password.encode('utf-8')
    hash_password_bytes = hash_password.encode('utf-8')
    return bcrypt.checkpw(pass_bytes,hash_password_bytes)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days = REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user_login(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Для этого действия нужен access-токен")
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Невалидный токен")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Срок действия токена истек")
    except Exception:
        raise HTTPException(status_code=401, detail="Ошибка авторизации", headers={"WWW-Authenticate": "Bearer"})

def get_current_admin_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    login = get_current_user_login(token)
    user = db.query(models.User).filter(models.User.login == login).first()

    if not user or not user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="У вас недостаточно прав для выполнения этого действия"
        )
    return user