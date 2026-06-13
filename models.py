from pydantic import BaseModel
from datetime import datetime

class OTPMessage(BaseModel):
    otp: str
    source: str = "web_otp"
    created_at: datetime