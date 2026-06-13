from fastapi import APIRouter, Request
from database import otp_collection
from datetime import datetime

router = APIRouter()


@router.post("/api/sms")
async def receive_sms(request: Request):

    payload = await request.json()

    document = {
        "payload": payload,
        "message": payload.get("message"),
        "sender": payload.get("from"),
        "received_at": payload.get("receivedAt"),
        "created_at": datetime.utcnow()
    }

    otp_collection.insert_one(document)

    return {
        "status": "success"
    }