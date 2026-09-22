from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import Column, Integer, String, Date, Boolean, Time, DECIMAL, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(30), nullable=False)
    second_name = Column(String(30))
    login = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(12), nullable=False, unique=True)
    email = Column(String(50), unique=True, nullable=True, default=None)
    birthday = Column(Date)
    id_tg = Column(String(20))
    id_vk = Column(String(40))
    is_admin = Column(Boolean, default=False, nullable=False)

class Tariff(Base):
    __tablename__ = "tariffs"

    tariff_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False, unique=True)
    category = Column(String(50), nullable=False)
    is_per_person = Column(Boolean, nullable=False)
    base_price = Column(Integer, nullable=False)
    weekend_price = Column(Integer, nullable=False)
    capacity_treshold = Column(Integer)
    fixed_price_weekday = Column(Integer)
    fixed_price_weekend = Column(Integer)
    lounge_minutes = Column(Integer, default=0)
    vr_minutes = Column(Integer, default=0)
    is_flexible = Column(Boolean, default=False)
    default_duration = Column(Integer, default=60)

class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    tariff_id = Column(Integer, ForeignKey("tariffs.tariff_id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    time_slot = Column(Time, nullable=False)
    guests_count = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)
    vr_duration = Column(Integer, default=0)
    lounge_duration = Column(Integer, default=0)
    total_duration = Column(Integer, nullable=False)
    status = Column(String, default="pending", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)

    user = relationship("User")
    tariff = relationship("Tariff")

class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete = "CASCADE"))
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)

    user = relationship("User")

class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    canceled = "canceled"
    completed = "completed"