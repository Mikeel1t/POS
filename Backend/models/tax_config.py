from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime
from sqlalchemy.sql import func
from config.database import Base

class TaxConfig(Base):
    __tablename__ = "tax_configs"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    name = Column(String(50), nullable=False)   # ej: "IVA_GENERAL"
    rate = Column(Float, nullable=False)         # ej: 0.19
    description = Column(String(200))
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())