

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
import random
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import datetime
router = APIRouter(
    prefix="/watchman",
    tags=["Watchman"]
)

@router.post("/register")
def register_watchman(
    user: schemas.ResidentCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(models.User).filter(models.User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    otp = str(random.randint(100000, 999999))

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=utils.hash_password(user.password),
        role="WATCHMAN",   # ✅ IMPORTANT
        otp=otp,
        is_verified=False,
        is_approved=False
    )

    db.add(new_user)
    db.commit()

    utils.send_email(
        user.email,
        "Watchman Verification",
        "Your OTP",
        otp=otp
    )

    return {"message": "OTP sent"}

@router.post("/verify-otp")
def verify_watchman_otp(
    data: schemas.VerifyOTP,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    user.is_verified = True
    user.otp = None

    db.commit()

    return {"message": "Verified. Wait for admin approval"}

@router.post("/login")
def login_watchman(
    user: schemas.LoginSchema,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.role != "WATCHMAN":
        raise HTTPException(status_code=403, detail="Not a watchman account")

    if not utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Wrong password")

    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="OTP not verified")

    if not db_user.is_approved:
        raise HTTPException(status_code=403, detail="Waiting for admin approval")

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

# 🔥 ADD VISITOR (WATCHMAN)
@router.post("/add")
def add_visitor(data: dict, db: Session = Depends(get_db)):

    # check resident exists
    resident = db.query(models.User).filter(
        models.User.id == data["resident_id"],
        models.User.role == "RESIDENT"
    ).first()

    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")

    visitor = models.Visitor(
        name=data["name"],
        phone=data["phone"],
        purpose=data["purpose"],
        resident_id=data["resident_id"]
    )

    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return {"message": "Visitor added successfully"}


# 🔥 GET ALL VISITORS (WATCHMAN VIEW)
@router.get("/all")
def get_all_visitors(db: Session = Depends(get_db)):

    visitors = db.query(models.Visitor).all()

    result = []

    for v in visitors:
        result.append({
            "id": v.id,
            "name": v.name,
            "phone": v.phone,
            "purpose": v.purpose,
            "status": v.status,
            "resident_name": v.resident.name if v.resident else None,
            "check_in": v.check_in,
            "check_out": v.check_out
        })

    return result


# 🔥 APPROVE / REJECT VISITOR
@router.put("/update/{visitor_id}")
def update_status(
    visitor_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    visitor = db.query(models.Visitor).filter(
        models.Visitor.id == visitor_id
    ).first()

    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    visitor.status = status

    db.commit()

    return {"message": f"Visitor {status}"}


# 🔥 CHECKOUT VISITOR
@router.put("/checkout/{visitor_id}")
def checkout_visitor(visitor_id: int, db: Session = Depends(get_db)):

    visitor = db.query(models.Visitor).filter(
        models.Visitor.id == visitor_id
    ).first()

    if not visitor:
        raise HTTPException(status_code=404, detail="Visitor not found")

    visitor.check_out = datetime.utcnow()

    db.commit()

    return {"message": "Visitor checked out"}

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