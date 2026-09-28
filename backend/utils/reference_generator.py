import uuid
from datetime import datetime


def generate_reference(prefix: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = uuid.uuid4().hex[:6].upper()

    return f"{prefix}-{timestamp}-{unique_id}"