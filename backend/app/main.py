from fastapi import FastAPI
from sqlalchemy import text

from core.database import engine
from core.config import settings
from routers import category, product


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

# @app.get("/debug/database")
# def debug_database():

#     with engine.connect() as connection:

#         result = connection.execute(
#             text("""
#                 SELECT
#                     current_database(),
#                     current_schema()
#             """)
#         )

#         row = result.fetchone()

#         return {
#             "database": row[0],
#             "schema": row[1]
#         }

app.include_router(prefix="/api/v1", router = category.router)
app.include_router(prefix="/api/v1", router = product.router)


@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy"
    }