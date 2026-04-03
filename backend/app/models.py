from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


#  FLAT MODEL
class Flat(Base):
    __tablename__ = "flats"

    id = Column(Integer, primary_key=True, index=True)
    flat_number = Column(String(50), unique=True, index=True)
    floor = Column(String(50))
    block = Column(String(50))

    residents = relationship("User", back_populates="flat", cascade="all, delete")


#  USER MODEL
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))

    otp = Column(String(6), nullable=True)
    is_verified = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)

    role = Column(String(50), default="RESIDENT")

    flat_id = Column(Integer, ForeignKey("flats.id"), nullable=True)

    flat = relationship("Flat", back_populates="residents")

    #  RELATIONS WITH CASCADE
    maintenances = relationship(
        "Maintenance",
        back_populates="user",
        cascade="all, delete"
    )

    visitors = relationship(
        "Visitor",
        back_populates="resident",
        cascade="all, delete"
    )

    complaints = relationship(
        "Complaint",
        back_populates="user",
        cascade="all, delete"
    )


#  MAINTENANCE MODEL
class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer)

    status = Column(String(50), default="PENDING")

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="maintenances")
    created_at = Column(DateTime, default=datetime.utcnow)


#  COMPLAINT MODEL (FIXED)
class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(500))
    image = Column(String(255), nullable=True)

    status = Column(String(50), default="PENDING")

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="complaints")


#  VISITOR MODEL
class Visitor(Base):
    __tablename__ = "visitors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100))
    phone = Column(String(20))
    purpose = Column(String(255))

    resident_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    status = Column(String(50), default="PENDING")

    check_in = Column(DateTime, default=datetime.utcnow)
    check_out = Column(DateTime, nullable=True)

    resident = relationship("User", back_populates="visitors")