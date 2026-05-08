import re
from enum import Enum

from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date, time

class UserBase(BaseModel):
    first_name: str
    second_name: Optional[str] = None
    login: str
    phone: str
    email: Optional[EmailStr] = None
    birthday: Optional[date] = None
    id_tg: Optional[str] = None
    id_vk: Optional[str] = None

class UserCreate(UserBase):
    password: str

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
    guests_count: int

class BookingCreate(BookingBase):
    tariff_id: int
    vr_duration: Optional[int] = None
    lounge_duration: Optional[int] = None
    placement: Placement = Placement.concurrent

class Booking(BookingBase):
    booking_id: int
    user_id: int
    tariff_id: int
    total_price: int

    class Config:
        from_attributes = True

