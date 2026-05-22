from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    short_name = Column(String(50), nullable=False)
    unit_price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    
    # FK a la config de impuesto que aplica a este producto
    tax_config_id = Column(Integer, ForeignKey("tax_configs.id"), nullable=False)
    tax_config = relationship("TaxConfig")