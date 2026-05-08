from fastapi import FastAPI, Depends
from typing import List

from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import HTMLResponse

import auth
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shedevroom Booking API")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
def home():
    return "<h2>Бэкенд запущен</h2>"

@app.post("/users/register", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.login == user.login).first():
        raise HTTPException(status_code=400, detail="Этот логин уже занят")
    if db.query(models.User).filter(models.User.phone == user.phone).first():
        raise HTTPException(status_code=400, detail="Этот номер телефона уже зарегестрирован")
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Пользователь с такой почтой уже существует")

    hash_pass = auth.get_password_hash(user.password)

    new_user = models.User(
        first_name = user.first_name,
        second_name = user.second_name,
        login = user.login,
        password_hash=hash_pass,
        phone = user.phone,
        email = user.email,
        birthday = user.birthday,
        id_tg =  user.id_tg,
        id_vk = user.id_vk
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.login == form_data.username).first()

    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(data={"sub": user.login})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    username = auth.get_current_user_login(token)
    return {
        "message": f"Добро пожаловать {username}!",
        "status": "Вы авторизованы"
    }

@app.post("/bookings/create", response_model=schemas.Booking)
def create_booking(
        booking_data: schemas.BookingCreate,
        db: Session = Depends(get_db),
        token: str = Depends(oauth2_scheme)
):
    user_login = auth.get_current_user_login(token)
    user = db.query(models.User).filter(models.User.login == user_login).first()

    tariff = db.query(models.Tariff).filter(models.Tariff.tariff_id == booking_data.tariff_id).first()
    if not tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")
    if not tariff.is_flexible:
        vr_mins = tariff.vr_minutes
        lounge_mins = tariff.lounge_minutes
    else:
        vr_mins = booking_data.vr_duration or 0
        lounge_mins = booking_data.lounge_duration or 0

    if booking_data.placement == schemas.Placement.concurrent:
        total_duration = max(vr_mins, lounge_mins)
    else:
        total_duration = vr_mins + lounge_mins

    if total_duration < 30:
        raise HTTPException(status_code=400, detail="Минимальное время бронирования - 30 минут")

    is_weekend = booking_data.booking_date.weekday() >= 5
    price_per_hour = tariff.weekend_price if is_weekend else tariff.base_price

    if not tariff.is_flexible:
        final_price = price_per_hour
    else:
        final_price = int((price_per_hour/ 60) * total_duration)

    new_booking = models.Booking(
        user_id = user.user_id,
        tariff_id = booking_data.tariff_id,
        booking_date = booking_data.booking_date,
        time_slot = booking_data.time_slot.replace(microsecond=0),
        guests_count = booking_data.guests_count,
        vr_duration = vr_mins,
        lounge_duration = lounge_mins,
        total_duration = total_duration,
        total_price = final_price
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking