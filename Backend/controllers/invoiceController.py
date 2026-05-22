from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from utils.dependencies import get_current_user
from models.invoice import Invoice, InvoiceItem
from models.product import Product
from models.user import User
from pydantic import BaseModel
from typing import List
import datetime

router = APIRouter(prefix="/invoices", tags=["invoices"])

class ItemSchema(BaseModel):
    product_id: int
    quantity: int

class InvoiceCreate(BaseModel):
    items: List[ItemSchema]

@router.post("/", status_code=201)
def create_invoice(
    data: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subtotal = tax_total = 0.0
    invoice_items = []

    for item in data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(404, f"Producto {item.product_id} no encontrado")
        if product.stock < item.quantity:
            raise HTTPException(400, f"Stock insuficiente para {product.name}")

        item_subtotal = product.unit_price * item.quantity
        item_tax = item_subtotal * product.tax_config.rate
        item_total = item_subtotal + item_tax

        subtotal += item_subtotal
        tax_total += item_tax

        invoice_items.append(InvoiceItem(
            product_id=product.id,
            quantity=item.quantity,
            unit_price=product.unit_price,
            tax_rate=product.tax_config.rate,
            subtotal=item_subtotal,
            tax_amount=item_tax,
            total=item_total
        ))

        # Descontar stock
        product.stock -= item.quantity

    invoice_number = f"INV-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{current_user.id}"

    invoice = Invoice(
        invoice_number=invoice_number,
        user_id=current_user.id,
        subtotal=round(subtotal, 2),
        tax_amount=round(tax_total, 2),
        total=round(subtotal + tax_total, 2),
        items=invoice_items
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return {"invoice_id": invoice.id, "invoice_number": invoice.invoice_number, "total": invoice.total}

@router.get("/{invoice_id}")
def get_invoice(invoice_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(404, "Factura no encontrada")
    return invoice

@router.get("/")
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoices = db.query(Invoice).filter(
        Invoice.user_id == current_user.id
    ).all()

    return invoices
