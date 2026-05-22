from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Text
from sqlalchemy.sql import func
from config.database import Base

class ReturnMovement(Base):
    """Solo registra el movimiento, no revierte stock ni anula factura."""
    __tablename__ = "return_movements"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_returned = Column(Integer, nullable=False)
    reason = Column(Text)
    total_returned = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    registered_by = Column(Integer, ForeignKey("users.id"))