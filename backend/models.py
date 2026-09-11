from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    devices = relationship("Device", back_populates="owner")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    device_type = Column(String(50), nullable=False)
    brand = Column(String(100), nullable=False)
    model = Column(String(100), nullable=False)
    purchase_date = Column(String(50), nullable=True)
    purchase_price = Column(Float, default=0.0)
    current_value = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="devices")
    diagnoses = relationship("Diagnosis", back_populates="device", cascade="all, delete-orphan")

class Diagnosis(Base):
    __tablename__ = "diagnoses"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    diagnosis_id = Column(String(50), unique=True, index=True, nullable=False)
    symptoms = Column(Text, nullable=False)  # JSON string
    history = Column(Text, nullable=True)    # JSON string
    description = Column(Text, nullable=True)
    health_score = Column(Integer, nullable=False)
    repairability_score = Column(Integer, nullable=False)
    recommendation = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    device = relationship("Device", back_populates="diagnoses")
    report = relationship("Report", back_populates="diagnosis", uselist=False, cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_id = Column(String(50), ForeignKey("diagnoses.diagnosis_id"), index=True, nullable=False)
    probable_causes = Column(Text, nullable=False)     # JSON string
    component_health = Column(Text, nullable=False)    # JSON string
    recovery_options = Column(Text, nullable=False)    # JSON string
    action_plan = Column(Text, nullable=False)         # JSON string
    technician_questions = Column(Text, nullable=False) # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

    diagnosis = relationship("Diagnosis", back_populates="report")
