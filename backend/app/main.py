from fastapi import FastAPI
from sqlalchemy import text

from core.database import engine
from core.config import settings
from routers import category, product, inventory, dashboard, auth, users, audit_logs
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://inventory-frontend-iv0j.onrender.com"
        "http://localhost:5173",
        "http://127.0.0.1:5173",

    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(prefix="/api/v1", router = category.router)
app.include_router(prefix="/api/v1", router = product.router)
app.include_router(prefix="/api/v1", router = inventory.router)
app.include_router(prefix="/api/v1", router = dashboard.router)
app.include_router(prefix="/api/v1", router = auth.router)
app.include_router(prefix="/api/v1", router = users.router)
app.include_router(prefix="/api/v1", router = audit_logs.router)

@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy"
    }