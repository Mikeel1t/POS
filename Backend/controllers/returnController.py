from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from utils.dependencies import get_current_user
from models.return_movement import ReturnMovement
from models.invoice import Invoice, InvoiceItem
from models.product import Product
from models.user import User
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/returns", tags=["returns"])

class ReturnSchema(BaseModel):
    invoice_id: int
    product_id: int
    quantity_returned: int
    reason: Optional[str] = None

@router.post("/", status_code=201)
def register_return(
    data: ReturnSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    invoice = db.query(Invoice).filter(Invoice.id == data.invoice_id).first()
    if not invoice:
        raise HTTPException(404, "Factura no encontrada")

    item = db.query(InvoiceItem).filter(
        InvoiceItem.invoice_id == data.invoice_id,
        InvoiceItem.product_id == data.product_id
    ).first()
    if not item:
        raise HTTPException(404, "Producto no está en esa factura")
    if data.quantity_returned > item.quantity:
        raise HTTPException(400, "Cantidad a devolver supera la facturada")

    # Solo registramos el movimiento, sin revertir stock ni anular factura
    total_returned = round(data.quantity_returned * item.unit_price * (1 + item.tax_rate), 2)

    movement = ReturnMovement(
        invoice_id=data.invoice_id,
        product_id=data.product_id,
        quantity_returned=data.quantity_returned,
        reason=data.reason,
        total_returned=total_returned,
        registered_by=current_user.id
    )
    db.add(movement)
    db.commit()
    return {"message": "Devolución registrada", "total_returned": total_returned}