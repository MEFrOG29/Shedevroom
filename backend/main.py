from datetime import datetime, timedelta, date, time, timezone
from fastapi import FastAPI, Depends, APIRouter
from typing import List
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt
from sqlalchemy.orm import Session
from starlette.exceptions import HTTPException
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import HTMLResponse
import auth
import models
import schemas
from auth import SECRET_KEY, ALGORITHM, get_current_admin_user, oauth2_scheme
from database import engine, get_db
import secrets

from models import BookingStatus

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shedevroom Booking API")

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
        raise HTTPException(status_code=400, detail="Этот номер телефона уже зарегистрирован")

    if user.email is not None and user.email.strip() == "":
        user.email = None

    if user.email is not None:
        if db.query(models.User).filter(models.User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Пользователь с такой почтой уже существует")

    hash_pass = auth.get_password_hash(user.password)

    new_user = models.User(
        first_name=user.first_name,
        second_name=user.second_name,
        login=user.login,
        password_hash=hash_pass,
        phone=user.phone,
        email=user.email,
        birthday=user.birthday,
        id_tg=user.id_tg,
        id_vk=user.id_vk
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
    refresh_token = auth.create_refresh_token(data={"sub": user.login})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"}

@app.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Невалидный тип токена")

        username = payload.get("sub")
        new_access_token = auth.create_access_token(data={"sub": username})
        return {"access_token": new_access_token, "token_type": "bearer"}

    except Exception:
        raise HTTPException(status_code=401, detail="refresh токен не действителен или истек")


@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = auth.get_current_user_login(token)

    user = db.query(models.User).filter(models.User.login == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    return user

@app.post("/bookings/create", response_model=schemas.Booking)
def create_booking(
        booking_data: schemas.BookingCreate,
        db: Session = Depends(get_db),
        token: str = Depends(oauth2_scheme)
):
    try:
        parsed_time = datetime.strptime(booking_data.time_slot, "%H:%M").time()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Неверный формат времени. Ожидается HH:MM"
        )

    if parsed_time.minute not in [0, 30] or parsed_time.second != 0:
        raise HTTPException(
            status_code=400,
            detail="Время должно быть кратно 30 минутам (например, 14:00 или 14:30)"
        )

    user_login = auth.get_current_user_login(token)
    user = db.query(models.User).filter(models.User.login == user_login).first()
    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

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

    new_start = datetime.combine(booking_data.booking_date, parsed_time)
    new_end = new_start + timedelta(minutes=total_duration)

    now = datetime.now(timezone.utc)

    existing_bookings = db.query(models.Booking).filter(
        models.Booking.booking_date == booking_data.booking_date,
        models.Booking.status != "canceled"
    ).all()

    for b in existing_bookings:
        is_confirmed = (b.status == "confirmed")
        is_pending_active = (b.status == "pending" and (now - b.created_at).total_seconds() < 1800)

        if is_confirmed or is_pending_active:
            b_start = datetime.combine(b.booking_date, b.time_slot)
            b_end = b_start + timedelta(minutes=b.total_duration)

            if new_start < b_end and b_start < new_end:
                raise HTTPException(
                    status_code=400,
                    detail=f"Это время уже занято! Слот пересекается с бронью {b.time_slot}"
                )

    if tariff.tariff_id in [2, 3, 4]:
        if booking_data.guests_count <= 10:
            active_tariff_id = 2
        elif booking_data.guests_count <= 20:
            active_tariff_id = 3
        else:
            active_tariff_id = 4

        if active_tariff_id != tariff.tariff_id:
            tariff = db.query(models.Tariff).filter(models.Tariff.tariff_id == active_tariff_id).first()

    is_weekend = booking_data.booking_date.weekday() >= 5
    price_per_hour = tariff.weekend_price if is_weekend else tariff.base_price

    if tariff.tariff_id == 1:
        if booking_data.guests_count <= 8:
            final_price = int(price_per_hour * booking_data.guests_count * (total_duration/60))
        else:
            price_per_hour = tariff.fixed_price_weekend if is_weekend else tariff.fixed_price_weekday
            final_price = int(price_per_hour * (total_duration/60))

    elif tariff.tariff_id in [2,3,4]:
        final_price = int(price_per_hour * (total_duration/60))

    else:
        final_price = price_per_hour

    now_no_ms = datetime.now(timezone.utc).replace(microsecond=0)
    clean_time_slot = parsed_time.replace(second=0, microsecond=0)

    new_booking = models.Booking(
        user_id = user.user_id,
        tariff_id = booking_data.tariff_id,
        booking_date = booking_data.booking_date,
        time_slot = clean_time_slot,
        guests_count = booking_data.guests_count,
        vr_duration = vr_mins,
        lounge_duration = lounge_mins,
        total_duration = total_duration,
        total_price = final_price,
        status = "pending",
        created_at = now_no_ms
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@app.get("/bookings/available-slots")
def get_available_slots(booking_date: date, db: Session = Depends(get_db)):
    all_slots = []
    start_of_day = datetime.combine(booking_date, time(0,0))
    now = datetime.now()
    for i in range(48):
        slot_time = start_of_day + timedelta(minutes = i * 30)
        all_slots.append(slot_time)

    bookings = db.query(models.Booking).filter(
        models.Booking.booking_date == booking_date
    ).all()

    results = []
    for slot in all_slots:
        is_busy = False
        current_slot_time = slot.time()

        for b in bookings:
            b_created_naive = b.created_at.replace(tzinfo=None)
            is_pending_and_fresh = (b.status == "pending" and (now - b_created_naive).total_seconds() < 1800)
            is_confirmed = (b.status == "confirmed")

            if is_confirmed or is_pending_and_fresh:
                b_start = b.time_slot
                b_end = (datetime.combine(booking_date, b.time_slot)
                     + timedelta(minutes=b.total_duration)).time()

                if b_start <= current_slot_time < b_end:
                    is_busy = True
                    break

        is_in_past = datetime.combine(booking_date, current_slot_time) < now
        results.append({
            "time": current_slot_time.strftime("%H:%M"),
            "is_free": not is_busy and not is_in_past
        })

    return results

@app.get("/bookings/my", response_model=List[schemas.Booking])
def get_my_bookings(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_login = auth.get_current_user_login(token)
    user = db.query(models.User).filter(models.User.login == user_login).first()

    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    my_bookings = db.query(models.Booking).filter(
        models.Booking.user_id == user.user_id).order_by(
        models.Booking.booking_date.desc(), models.Booking.time_slot.desc()
    ).all()

    return my_bookings

@app.put("/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: int, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    user_login = auth.get_current_user_login(token)
    user = db.query(models.User).filter(models.User.login == user_login).first()

    if not user:
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    booking = db.query(models.Booking).filter(models.Booking.booking_id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    now = datetime.now()

    booking_time = datetime.combine(booking.booking_date, booking.time_slot)
    if booking_time - now < timedelta(hours=24):
        raise HTTPException(
            status_code=400,
            detail="Отмена невозможна. До начала осталось меньше 24 часов."
        )

    booking.status = "canceled"
    db.commit()
    return {"message": "Бронирование отменено, деньги будут возвращены в течении "}

@app.put("/bookings/{booking_id}/confirm")
def confirm_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.booking_id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    booking.status = "confirmed"
    booking.is_paid = True
    db.commit()
    return {"status": "confirmed", "message": "Оплата получена"}

@app.get("/admin/bookings/all", response_model=List[schemas.Booking])
def get_all_bookings(
        target_date: date = None,
        db: Session = Depends(get_db),
        admin: models.User = Depends(get_current_admin_user)
):
    query = db.query(models.Booking)

    if target_date:
        query = query.filter(models.Booking.booking_date == target_date)

    bookings = query.order_by(models.Booking.booking_date.desc(), models.Booking.time_slot.desc()).all()

    return bookings

@app.patch("/admin/bookings/{booking_id}/set_status")
def admin_set_booking_status(
    booking_id: int,
    new_status: BookingStatus,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin_user)
):
    booking = db.query(models.Booking).filter(models.Booking.booking_id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")

    booking.status = new_status
    if new_status == BookingStatus.confirmed:
        booking.is_paid = True

    db.commit()
    return {"message": f"Статус бронирования #{booking_id} изменен на {new_status}"}

@app.post("/auth/forgot-password")
def forgot_password(data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с такой почтой не найден")

    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(hours=1)

    reset_entry = models.PasswordReset(
        user_id = user.user_id,
        token = token,
        expires_at = expires_at
    )
    db.add(reset_entry)
    db.commit()

    print("\n" + "="*50)
    print(f"ПИСЬМО ДЛЯ: {user.email}")
    print(f"ССЫЛКА: http://localhost:5173/reset-password?token={token}")
    print("\n" + "="*50)

    return {"message": "Инструкции по восстанавлению отправлены на почту"}

@app.post("/auth/reset-password")
def reset_password(data: schemas.ResetPasswordConfirm, db: Session = Depends(get_db)):
    reset_entry = db.query(models.PasswordReset).filter(
        models.PasswordReset.token == data.token,
        models.PasswordReset.expires_at > datetime.now()
    ).first()

    if not reset_entry:
        raise HTTPException(status_code=400, detail="Токен не действителен или просрочен")

    user = db.query(models.User).filter(models.User.user_id == reset_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    user.password_hash = auth.get_password_hash(data.new_password)

    db.delete(reset_entry)
    db.commit()

    return {"message": "Пароль успешно изменен"}

@app.get("/tariffs/all", response_model=List[schemas.Tariff])
def get_all_tariffs(db: Session = Depends(get_db)):
    return db.query(models.Tariff).all()


@app.post("/bookings/calculate-price")
def calculate_booking_price(
    booking_data: schemas.BookingCreate,
    db: Session = Depends(get_db)
):
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
        return {"total_price": 0}

    if tariff.tariff_id in [2, 3, 4]:
        if booking_data.guests_count <= 10:
            active_tariff_id = 2
        elif booking_data.guests_count <= 20:
            active_tariff_id = 3
        else:
            active_tariff_id = 4

        if active_tariff_id != tariff.tariff_id:
            tariff = db.query(models.Tariff).filter(models.Tariff.tariff_id == active_tariff_id).first()

    is_weekend = booking_data.booking_date.weekday() >= 4
    price_per_hour = tariff.weekend_price if is_weekend else tariff.base_price

    if tariff.tariff_id == 1:
        if booking_data.guests_count <= 4:
            final_price = int(price_per_hour * 4 * (total_duration / 60))
        elif booking_data.guests_count < 8:
            final_price = int(price_per_hour * booking_data.guests_count * (total_duration / 60))
        else:
            price_per_hour = tariff.fixed_price_weekend if is_weekend else tariff.fixed_price_weekday
            final_price = int(price_per_hour * (total_duration / 60))

    elif tariff.tariff_id in [2, 3, 4]:
        final_price = int(price_per_hour * (total_duration / 60))

    else:
        final_price = price_per_hour

    return {"total_price": final_price}

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@app.get("/bookings/occupied-slots")
def get_occupied_slots(
        booking_date: date,
        tariff_id: int,
        db: Session = Depends(get_db)
):
    target_tariff = db.query(models.Tariff).filter(models.Tariff.tariff_id == tariff_id).first()
    if not target_tariff:
        raise HTTPException(status_code=404, detail="Тариф не найден")

    requires_vr = not target_tariff.is_flexible or target_tariff.vr_minutes > 0 or "игра" in target_tariff.title.lower()
    requires_lounge = not target_tariff.is_flexible or target_tariff.lounge_minutes > 0 or "лаунж" in target_tariff.title.lower()

    bookings = db.query(models.Booking).filter(
        models.Booking.booking_date == booking_date,
        models.Booking.status != "canceled"
    ).all()

    occupied_indices = set()

    now_utc = datetime.now(timezone.utc)

    def time_to_index(t: time) -> int:
        return (t.hour * 60 + t.minute) // 30

    for b in bookings:
        b_created = b.created_at.replace(tzinfo=timezone.utc) if b.created_at.tzinfo is None else b.created_at

        is_pending_and_fresh = (b.status == "pending" and (now_utc - b_created).total_seconds() < 1800)
        is_confirmed = (b.status == "confirmed")

        if not (is_confirmed or is_pending_and_fresh):
            continue

        exist_tariff = b.tariff
        if not exist_tariff:
            continue

        b_has_vr = not exist_tariff.is_flexible or b.vr_duration > 0 or "игра" in exist_tariff.title.lower()
        b_has_lounge = not exist_tariff.is_flexible or b.lounge_duration > 0 or "лаунж" in exist_tariff.title.lower()

        conflict_vr = requires_vr and b_has_vr
        conflict_lounge = requires_lounge and b_has_lounge

        if conflict_vr or conflict_lounge:
            start_idx = time_to_index(b.time_slot)

            booking_duration = b.total_duration or max(b.vr_duration or 0, b.lounge_duration or 0)
            slots_count = (booking_duration + 29) // 30

            for i in range(start_idx, start_idx + slots_count):
                if i < 48:
                    occupied_indices.add(i)

    now_local = datetime.now()
    if booking_date == date.today():
        current_slot_now = (now_local.hour * 60 + now_local.minute) // 30
        for i in range(0, current_slot_now):
            occupied_indices.add(i)

    return sorted(list(occupied_indices))