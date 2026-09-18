from fastapi import FastAPI

from core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Inventory API is running"
    }


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy"
    }