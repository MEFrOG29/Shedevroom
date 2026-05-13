import re
from enum import Enum

from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, Annotated
from datetime import date, time



login_str = Annotated[str, Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_-]+$")]
name_str = Annotated[str, Field(min_length=2, max_length=30)]

class UserBase(BaseModel):
    first_name: name_str
    second_name: Optional[name_str] = None
    login: login_str
    phone: str
    email: Optional[EmailStr] = None
    birthday: Optional[date] = None
    id_tg: Optional[str] = Field(None, max_length=20)
    id_vk: Optional[str] = Field(None, max_length=40)

class UserCreate(UserBase):
    password: str = Field(min_length=8, description="Пароль должен быть не менее 8 символов")

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        digits = "".join(filter(str.isdigit, v))
        if len(digits) != 11:
            raise ValueError("Номер телефона должен содержать 11 цифр")
        if digits.startswith('8') or digits.startswith('7'):
            return f"+7{digits[1:]}"
        else:
            raise ValueError("Номер должен начинаться с 7 или 8")

    @field_validator('birthday')
    @classmethod
    def validate_age(cls, v: Optional[date]):
        if v and v > date.today():
            raise ValueError("Дата рождения не может быть в будущем")
        return v

class User(UserBase):
    user_id: int

    class Config:
        from_attributes = True

class TariffBase(BaseModel):
    title: str
    category: str
    base_price: int
    weekend_price: int
    lounge_hours: int = 0
    vr_hours: int = 0


class Tariff(TariffBase):
    tariff_id: int

    class Config:
        from_attributes = True

class Placement(str, Enum):
    vr_first = "vr_first"
    lounge_first = "lounge_first"
    concurrent = "concurrent"

class BookingBase(BaseModel):
    booking_date: date
    time_slot: time
    guests_count: int = Field(gt=0, le=99, description="От 1 до 99 гостей")

    @field_validator('booking_date')
    @classmethod
    def validate_date(cls, v:date):
        if v < date.today():
            raise ValueError("Нельзя бронировать на прошедшую дату")
        return v

class BookingCreate(BookingBase):
    tariff_id: int
    vr_duration: Optional[int] = Field(None, ge=0)
    lounge_duration: Optional[int] = Field(None, ge=0)
    placement: Placement = Placement.concurrent

class Booking(BookingBase):
    booking_id: int
    user_id: int
    tariff_id: int
    total_price: int

    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str