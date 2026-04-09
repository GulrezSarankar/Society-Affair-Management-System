from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
import random
import uuid
import os
import shutil
from fastapi import Query

from typing import Optional
from fastapi import Query


router = APIRouter(prefix="/auth", tags=["Auth"])

# =========================
# 🧑‍💼 REGISTER ADMIN
# =========================
@router.post("/register")
def register(user: schemas.RegisterSchema, db: Session = Depends(get_db)):
    try:
        print("🔥 DATA:", user)

        existing_user = db.query(models.User).filter(models.User.email == user.email).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = utils.hash_password(user.password)

        new_user = models.User(
            name=user.name,
            email=user.email,
            password=hashed_password,
            role="ADMIN"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "Admin registered successfully"}

    except Exception as e:
        print("❌ REGISTER ERROR:", str(e))   # 🔥 IMPORTANT
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login")
def login(user: schemas.LoginSchema, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # 🔴 ADD THIS CHECK
    if db_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Only admin can login")

    token = utils.create_access_token({
        "sub": db_user.email,
        "role": db_user.role
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


#  SEND OTP
# @router.post("/send-otp")
# def send_otp(data: schemas.ForgotPassword, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == data.email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     otp = str(random.randint(100000, 999999))

#     user.otp = otp
#     db.commit()

#     utils.send_email(
#         user.email,
#         "Password Reset OTP",
#         "Use this OTP to reset your password",
#         otp=otp
#     )

#     return {"message": "OTP sent successfully"}


# #  VERIFY OTP (FIXED)
# @router.post("/verify-otp")
# def verify_otp(data: schemas.VerifyOTP, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == data.email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     if not user.otp:
#         raise HTTPException(status_code=400, detail="OTP not found")

#     if user.otp != data.otp:
#         raise HTTPException(status_code=400, detail="Invalid OTP")

#     return {"message": "OTP verified successfully"}


# #  RESET PASSWORD
# @router.post("/reset-password")
# def reset_password(data: schemas.ResetPassword, db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.email == data.email).first()

#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     hashed_password = utils.hash_password(data.new_password)

#     user.password = hashed_password
#     user.otp = None   # clear OTP
#     db.commit()

#     return {"message": "Password updated successfully"}

# Admin Can Approve Resident Account 
@router.put("/approve-user/{user_id}")
def approve_user(
    user_id: int,
    flat_id: Optional[int] = Query(None),   #  optional now
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    #  APPROVE USER
    user.is_approved = True

    #  ONLY ASSIGN FLAT FOR RESIDENT
    if user.role == "RESIDENT":
        if not flat_id:
            raise HTTPException(status_code=400, detail="Flat is required for resident")

        user.flat_id = flat_id

    db.commit()

    return {"message": f"{user.role} approved successfully"}
@router.get("/pending-users")
def get_pending_users(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    users = db.query(models.User).filter(
        models.User.role == "RESIDENT",
        models.User.is_verified == True,
        models.User.is_approved == False
    ).all()

    return users

# # Get All Residents
# @router.get("/residents")
# def get_all_residents(
#     db: Session = Depends(get_db),
#     admin=Depends(utils.admin_required)
# ):
#     residents = db.query(models.User).filter(
#         models.User.role == "RESIDENT"
#     ).all()

#     return residents

@router.delete("/user/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == "ADMIN":
        raise HTTPException(status_code=403, detail="Cannot delete admin")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}

@router.get("/residents")
def get_residents(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    results = db.query(
        models.User.id,
        models.User.name,
        models.User.email,
        models.User.is_approved,
        models.User.role,
        models.Flat.flat_number,
        models.Flat.block
    ).join(
        models.Flat,
        models.User.flat_id == models.Flat.id,
        isouter=True
    ).filter(
        models.User.role == "RESIDENT"
    ).all()

    # 🔥 CONVERT TO JSON
    data = []
    for r in results:
        data.append({
            "id": r.id,
            "name": r.name,
            "email": r.email,
            "role": r.role,
            "is_approved": r.is_approved,
            "flat_number": r.flat_number,
            "block": r.block
        })

    return data

@router.get("/complaints")
def all_complaints(db: Session = Depends(get_db), admin=Depends(utils.admin_required)):
    complaints = db.query(models.Complaint).all()

    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "status": c.status,
            "image": c.image,
            "user": {
                "name": c.user.name if c.user else None,
                "email": c.user.email if c.user else None
            }
        }
        for c in complaints
    ]



@router.put("/complaint/{id}")
def update_status(
    id: int,
    status: str,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == id
    ).first()

    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    #  VALIDATION (important)
    valid_status = ["PENDING", "IN_PROGRESS", "RESOLVED"]

    if status not in valid_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    complaint.status = status
    db.commit()

    return {
        "message": "Status updated successfully",
        "new_status": status
    }

@router.get("/watchmen")
def get_all_watchmen(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    return db.query(models.User).filter(
        models.User.role == "WATCHMAN"
    ).all()

@router.get("/pending-watchmen")
def get_pending_watchmen(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    return db.query(models.User).filter(
        models.User.role == "WATCHMAN",
        models.User.is_verified == True,
        models.User.is_approved == False
    ).all()

@router.delete("/watchman/{user_id}")
def delete_watchman(
    user_id: int,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role != "WATCHMAN":
        raise HTTPException(status_code=400, detail="Not a watchman")

    db.delete(user)
    db.commit()

    return {"message": "Watchman deleted successfully"}


@router.get("/all-users")
def get_all_users(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    users = db.query(models.User).all()

    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "is_approved": u.is_approved,
            "flat_id": u.flat_id,
            "flat_number": u.flat.flat_number if u.flat else None,  # ✅ FIX
            "block": u.flat.block if u.flat else None               # ✅ FIX
        })

    return result