from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Sarah Chen")
    email = Column(String(120), unique=True, index=True, default="sarah@hercare.ai")
    created_at = Column(DateTime, default=datetime.utcnow)

    cycles = relationship("Cycle", back_populates="user", cascade="all, delete-orphan")
    health_logs = relationship("HealthLog", back_populates="user", cascade="all, delete-orphan")
    pregnancy = relationship("PregnancyProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    insights = relationship("AIInsight", back_populates="user", cascade="all, delete-orphan")

class Cycle(Base):
    __tablename__ = "cycles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=True)
    cycle_length = Column(Integer, default=28)
    period_duration = Column(Integer, default=5)
    flow_intensity = Column(String(50), default="medium")  # light, medium, heavy
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cycles")

class HealthLog(Base):
    __tablename__ = "health_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    log_date = Column(Date, nullable=False, index=True)
    period_flow = Column(String(50), default="none")       # none, spotting, light, medium, heavy
    pain_level = Column(Integer, default=0)                # 0-10
    pain_types = Column(Text, default="[]")                # JSON string list
    mood = Column(String(50), default="calm")              # happy, calm, energetic, anxious, sad, irritable, mood_swings
    energy_level = Column(Integer, default=5)              # 1-10
    sleep_hours = Column(Float, default=7.5)               # 0.0 - 24.0
    sleep_quality = Column(String(50), default="good")     # poor, fair, good, excellent
    symptoms = Column(Text, default="[]")                  # JSON string list
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="health_logs")

class PregnancyProfile(Base):
    __tablename__ = "pregnancy_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    is_active = Column(Boolean, default=False)
    conception_date = Column(Date, nullable=True)
    last_period_date = Column(Date, nullable=True)
    due_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="pregnancy")

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), default=1)
    category = Column(String(50))                          # cycle, pattern, change, wellness
    title = Column(String(200))
    summary = Column(Text)
    details = Column(Text, default="{}")                   # JSON details
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="insights")
