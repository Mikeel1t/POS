from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from utils.dependencies import get_current_user
from models.product import Product
from models.tax_config import TaxConfig
from models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/products", tags=["products"])

class ProductCreate(BaseModel):
    name: str
    short_name: str
    unit_price: float
    stock: int
    tax_config_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    short_name: Optional[str] = None
    unit_price: Optional[float] = None
    stock: Optional[int] = None
    tax_config_id: Optional[int] = None

@router.get("/")
def get_all(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Product).all()

@router.get("/{product_id}")
def get_one(product_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    return product

@router.post("/", status_code=201)
def create(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tax = db.query(TaxConfig).filter(TaxConfig.id == data.tax_config_id).first()
    if not tax:
        raise HTTPException(404, "Configuración de impuesto no encontrada")
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}")
def update(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    if data.tax_config_id:
        tax = db.query(TaxConfig).filter(TaxConfig.id == data.tax_config_id).first()
        if not tax:
            raise HTTPException(404, "Configuración de impuesto no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", status_code=204)
def delete(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    db.delete(product)
    db.commit()