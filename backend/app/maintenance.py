from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
from sqlalchemy import func


router = APIRouter(prefix="/maintenance", tags=["Maintenance"])


# 🔥 SEND MAINTENANCE (ADMIN)
@router.post("/send")
def send_maintenance(
    data: schemas.MaintenanceCreate,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    user = db.query(models.User).filter(models.User.id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    maintenance = models.Maintenance(
        user_id=data.user_id,
        amount=data.amount
    )

    db.add(maintenance)
    db.commit()
    db.refresh(maintenance)

    # ✅ CORRECT INDENTATION
    utils.send_email(
        user.email,
        "Maintenance Due",
        f"Dear {user.name}, your maintenance of ₹{data.amount} is due."
    )

    return {"message": "Maintenance sent successfully"}

@router.post("/pay/{maintenance_id}")
def pay_maintenance(
    maintenance_id: int,
    db: Session = Depends(get_db)
):
    maintenance = db.query(models.Maintenance).filter(
        models.Maintenance.id == maintenance_id
    ).first()

    if not maintenance:
        raise HTTPException(status_code=404, detail="Not found")

    maintenance.status = "PAID"
    db.commit()

    return {"message": "Payment successful"}

@router.get("/all")
def get_all_maintenance(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    return db.query(models.Maintenance).all()


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    total = db.query(func.sum(models.Maintenance.amount)).scalar() or 0

    paid = db.query(func.sum(models.Maintenance.amount)).filter(
        models.Maintenance.status == "PAID"
    ).scalar() or 0

    pending = db.query(func.sum(models.Maintenance.amount)).filter(
        models.Maintenance.status == "PENDING"
    ).scalar() or 0

    total_users = db.query(models.User).count()

    return {
        "total": total,
        "paid": paid,
        "pending": pending,
        "users": total_users
    }

# Payment History
@router.get("/user/{user_id}")
def get_user_payment_history(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(utils.get_current_user)
):
    # 🔒 security (optional but recommended)
    if current_user.get("role") != "ADMIN" and current_user.get("id") != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    payments = db.query(models.Maintenance).filter(
        models.Maintenance.user_id == user_id
    ).all()

    return payments