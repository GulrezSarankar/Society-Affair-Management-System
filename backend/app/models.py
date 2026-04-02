from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base



 
#  Flat Model
class Flat(Base):
    __tablename__ = "flats"

    id = Column(Integer, primary_key=True, index=True)
    flat_number = Column(String(50), unique=True, index=True)
    floor = Column(String(50))
    block = Column(String(50))

    #  Relationship with Users
    residents = relationship("User", back_populates="flat", cascade="all, delete")


#  User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))

    #  AUTH FIELDS (IMPORTANT)
    otp = Column(String(6), nullable=True)
    is_verified = Column(Boolean, default=False)   # ✅ email verified
    is_approved = Column(Boolean, default=False)   # ✅ admin approval

    role = Column(String(50), default="RESIDENT")

    #  Foreign Key  Flat
    flat_id = Column(Integer, ForeignKey("flats.id"), nullable=True)  # ✅ allow NULL
    #  Relationships
    flat = relationship("Flat", back_populates="residents")

    maintenances = relationship(
        "Maintenance",
        back_populates="user",
        cascade="all, delete"
    )



#  Maintenance Model
class Maintenance(Base):
    __tablename__ = "maintenance"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Integer)

    status = Column(String(50), default="PENDING")

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="maintenances")



class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(500))
    image = Column(String(255), nullable=True)

    status = Column(String(50), default="PENDING")

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")