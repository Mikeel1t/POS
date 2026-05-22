from sqlalchemy import Column, Integer, String
from config.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    estado = Column(Integer, nullable=False)
    