from fastapi import FastAPI
from controllers import authController, invoiceController, returnController, productController, taxConfigController
from fastapi.middleware.cors import CORSMiddleware
from config.database import Base, engine

from models import TaxConfig, User, Product, Invoice, InvoiceItem, ReturnMovement  # noqa

Base.metadata.create_all(bind=engine)
app = FastAPI(title="POS API")

# CORS (para React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# rutas
app.include_router(authController.router)
app.include_router(invoiceController.router)
app.include_router(returnController.router)
app.include_router(productController.router)
app.include_router(taxConfigController.router)