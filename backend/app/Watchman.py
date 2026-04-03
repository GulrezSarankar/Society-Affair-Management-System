from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
from datetime import datetime
import random

router = APIRouter(
    prefix="/watchman",
    tags=["Watchman"]
)

#  WATCHMAN AUTH

@router.post("/register")
def register_watchman(user: schemas.ResidentCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()

    if existing:
        raise HTTPException(400, "Email already exists")

    otp = str(random.randint(100000, 999999))

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=utils.hash_password(user.password),
        role="WATCHMAN",
        otp=otp,
        is_verified=False,
        is_approved=False
    )

    db.add(new_user)
    db.commit()

    utils.send_email(user.email, "OTP Verification", "Your OTP", otp=otp)

    return {"message": "OTP sent"}


@router.post("/verify-otp")
def verify_watchman(data: schemas.VerifyOTP, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(404, "User not found")

    if user.otp != data.otp:
        raise HTTPException(400, "Invalid OTP")

    user.is_verified = True
    user.otp = None
    db.commit()

    return {"message": "Verified. Wait for admin approval"}


@router.post("/login")
def login_watchman(user: schemas.LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(404, "User not found")

    if db_user.role != "WATCHMAN":
        raise HTTPException(403, "Not a watchman account")

    if not utils.verify_password(user.password, db_user.password):
        raise HTTPException(400, "Wrong password")

    if not db_user.is_verified:
        raise HTTPException(403, "OTP not verified")

    if not db_user.is_approved:
        raise HTTPException(403, "Waiting for admin approval")

    token = utils.create_access_token({
        "sub": db_user.email,
        "role": db_user.role,
        "id": db_user.id
    })

    return {
        "access_token": token,
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "role": db_user.role
        }
    }

#  VISITOR MANAGEMENT

#  ADD VISITOR (PENDING)
@router.post("/add")
def add_visitor(data: schemas.VisitorCreate, db: Session = Depends(get_db)):
    resident = db.query(models.User).filter(
        models.User.id == data.resident_id,
        models.User.role == "RESIDENT",
        models.User.is_approved == True
    ).first()

    if not resident:
        raise HTTPException(404, "Resident not found")

    visitor = models.Visitor(
        name=data.name,
        phone=data.phone,
        purpose=data.purpose,
        resident_id=data.resident_id,
        status="PENDING"
    )

    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return {"message": "Request sent to resident"}

#  GET ALL VISITORS (WATCHMAN)
@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    visitors = db.query(models.Visitor).all()

    return [
        {
            "id": v.id,
            "name": v.name,
            "phone": v.phone,
            "purpose": v.purpose,
            "status": v.status,
            "resident_name": v.resident.name if v.resident else None,
            "check_in": v.check_in,
            "check_out": v.check_out
        }
        for v in visitors
    ]

#  CHECKOUT
@router.put("/checkout/{visitor_id}")
def checkout(visitor_id: int, db: Session = Depends(get_db)):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == visitor_id).first()

    if not visitor:
        raise HTTPException(404, "Visitor not found")

    visitor.check_out = datetime.utcnow()
    db.commit()

    return {"message": "Checked out"}

# ==============================
# 🏠 RESIDENT SIDE (IMPORTANT)
# ==============================

#  GET PENDING REQUESTS
@router.get("/my-requests/{resident_id}")
def get_requests(resident_id: int, db: Session = Depends(get_db)):
    return db.query(models.Visitor).filter(
        models.Visitor.resident_id == resident_id,
        models.Visitor.status == "PENDING"
    ).all()

#  APPROVE / REJECT (RESIDENT)
@router.put("/respond/{visitor_id}")
def respond(visitor_id: int, status: str, db: Session = Depends(get_db)):
    visitor = db.query(models.Visitor).filter(models.Visitor.id == visitor_id).first()

    if not visitor:
        raise HTTPException(404, "Visitor not found")

    if status not in ["APPROVED", "REJECTED"]:
        raise HTTPException(400, "Invalid status")

    visitor.status = status
    db.commit()

    return {"message": f"{status} successfully"}

#  RESIDENT LIST (FOR DROPDOWN)
@router.get("/residents")
def get_residents(db: Session = Depends(get_db)):
    residents = db.query(models.User).filter(
        models.User.role == "RESIDENT",
        models.User.is_approved == True
    ).all()

    return [
        {
            "id": r.id,
            "name": r.name,
            "flat": r.flat.flat_number if r.flat else None
        }
        for r in residents
    ]