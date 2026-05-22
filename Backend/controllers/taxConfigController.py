from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from utils.dependencies import get_current_user
from models.tax_config import TaxConfig
from models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/tax-configs", tags=["tax-configs"])

class TaxConfigCreate(BaseModel):
    year: int
    name: str
    rate: float
    description: Optional[str] = None
    is_active: bool = True

class TaxConfigUpdate(BaseModel):
    rate: Optional[float] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

@router.get("/")
def get_all(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(TaxConfig).all()

@router.get("/{tax_id}")
def get_one(tax_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tax = db.query(TaxConfig).filter(TaxConfig.id == tax_id).first()
    if not tax:
        raise HTTPException(404, "Configuración no encontrada")
    return tax

@router.post("/", status_code=201)
def create(
    data: TaxConfigCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tax = TaxConfig(**data.model_dump())
    db.add(tax)
    db.commit()
    db.refresh(tax)
    return tax

@router.put("/{tax_id}")
def update(
    tax_id: int,
    data: TaxConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tax = db.query(TaxConfig).filter(TaxConfig.id == tax_id).first()
    if not tax:
        raise HTTPException(404, "Configuración no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(tax, key, value)
    db.commit()
    db.refresh(tax)
    return tax

@router.delete("/{tax_id}", status_code=204)
def delete(
    tax_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tax = db.query(TaxConfig).filter(TaxConfig.id == tax_id).first()
    if not tax:
        raise HTTPException(404, "Configuración no encontrada")
    db.delete(tax)
    db.commit()