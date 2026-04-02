from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
import random
from fastapi import UploadFile, File, Form
import shutil
import os
import uuid


router = APIRouter(prefix="/resident", tags=["Resident"])


# =========================
# 📝 REGISTER RESIDENT + OTP
# =========================
@router.post("/register")
def register_resident(
    user: schemas.ResidentCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    otp = str(random.randint(100000, 999999))
    hashed_password = utils.hash_password(user.password)

    new_user = models.User(
    name=user.name,
    email=user.email,
    password=hashed_password,
    role="RESIDENT",
    otp=otp,
    is_verified=False,
    is_approved=False,
    flat_id=None   # ✅ IMPORTANT
)
    db.add(new_user)
    db.commit()

    # 📧 Send OTP
    utils.send_email(
        user.email,
        "Verify Your Email",
        "Use this OTP to verify your account",
        otp=otp
    )

    return {"message": "OTP sent to email"}


# =========================
# ✅ VERIFY OTP
# =========================
@router.post("/verify-otp")
def verify_otp(data: schemas.VerifyOTP, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == data.email).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if db_user.otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    db_user.is_verified = True
    db_user.otp = None
    db.commit()

    return {"message": "Email verified. Wait for admin approval"}


# =========================
# 🔐 LOGIN RESIDENT
# =========================
@router.post("/login")
def login_resident(
    user: schemas.LoginSchema,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if db_user.role != "RESIDENT":
        raise HTTPException(status_code=403, detail="Not a resident account")

    # 🔥 NEW CHECKS
    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    if not db_user.is_approved:
        raise HTTPException(status_code=403, detail="Waiting for admin approval")

    token = utils.create_access_token({
        "sub": db_user.email,
        "role": db_user.role,
        "id": db_user.id
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role,
            "flat_id": db_user.flat_id
        }
    }


# =========================
# 👤 GET PROFILE
# =========================
@router.get("/profile")
def get_profile(user=Depends(utils.get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == user.get("sub")
    ).first()

    return {
        "id": db_user.id,
        "name": db_user.name,
        "email": db_user.email,
        "flat": {
            "flat_number": db_user.flat.flat_number if db_user.flat else None,
            "block": db_user.flat.block if db_user.flat else None
        }
    }

# =========================
# 💰 VIEW OWN MAINTENANCE
# =========================
@router.get("/my-maintenance")
def my_maintenance(
    user=Depends(utils.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == user.get("sub")).first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    data = db.query(models.Maintenance).filter(
        models.Maintenance.user_id == db_user.id
    ).all()

    return data


# =========================
# 💳 PAY MAINTENANCE
# =========================
@router.post("/pay/{maintenance_id}")
def pay_maintenance(
    maintenance_id: int,
    user=Depends(utils.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == user.get("sub")).first()

    maintenance = db.query(models.Maintenance).filter(
        models.Maintenance.id == maintenance_id,
        models.Maintenance.user_id == db_user.id  # 🔥 security fix
    ).first()

    if not maintenance:
        raise HTTPException(status_code=404, detail="Maintenance not found")

    maintenance.status = "PAID"
    db.commit()

    return {"message": "Payment successful"}

@router.post("/complaint")
def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None),
    user=Depends(utils.get_current_user),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(
        models.User.email == user.get("sub")
    ).first()

    # 🔥 ABSOLUTE PATH FIX (IMPORTANT)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    UPLOAD_DIR = os.path.join(BASE_DIR, "..", "uploads")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    image_path = None

    if image:
        # 🔥 CLEAN NAME + UNIQUE
        clean_name = image.filename.replace(" ", "_")
        filename = f"{uuid.uuid4()}_{clean_name}"

        file_path = os.path.join(UPLOAD_DIR, filename)

        # 🔥 SAVE FILE
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # 🔥 STORE PUBLIC PATH
        image_path = f"/uploads/{filename}"

        print("Saved at:", file_path)  # debug

    complaint = models.Complaint(
        title=title,
        description=description,
        image=image_path,
        user_id=db_user.id
    )

    db.add(complaint)
    db.commit()

    return {"message": "Complaint submitted successfully"}

@router.get("/my-complaints")
def my_complaints(user=Depends(utils.get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(
        models.User.email == user.get("sub")
    ).first()

    complaints = db.query(models.Complaint).filter(
        models.Complaint.user_id == db_user.id
    ).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "image": c.image
        }
        for c in complaints
    ]

# @router.get("/my-complaints")
# def my_complaints(user=Depends(utils.get_current_user), db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.email == user.get("sub")).first()

#     return db.query(models.Complaint).filter(
#         models.Complaint.user_id == db_user.id
#     ).all()