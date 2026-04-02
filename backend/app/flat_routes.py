from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, utils
from sqlalchemy import Column, Integer, String, ForeignKey

router = APIRouter(prefix="/flats", tags=["Flats"])


# 🏠 ADD FLAT (ADMIN ONLY)
@router.post("/")
def create_flat(
    flat: schemas.FlatCreate,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    existing = db.query(models.Flat).filter(models.Flat.flat_number == flat.flat_number).first()

    if existing:
        raise HTTPException(status_code=400, detail="Flat already exists")

    new_flat = models.Flat(
        flat_number=flat.flat_number,
        floor=flat.floor,
        block=flat.block
    )

    db.add(new_flat)
    db.commit()
    db.refresh(new_flat)

    return {"message": "Flat created successfully"}


# 📋 GET ALL FLATS
@router.get("/", response_model=list[schemas.FlatResponse])
def get_flats(
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    return db.query(models.Flat).all()


# ❌ DELETE FLAT
@router.delete("/{flat_id}")
def delete_flat(
    flat_id: int,
    db: Session = Depends(get_db),
    admin=Depends(utils.admin_required)
):
    flat = db.query(models.Flat).filter(models.Flat.id == flat_id).first()

    if not flat:
        raise HTTPException(status_code=404, detail="Flat not found")

    db.delete(flat)
    db.commit()

    return {"message": "Flat deleted"}