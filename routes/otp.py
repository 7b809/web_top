from fastapi import APIRouter
from database import otp_collection
from datetime import datetime

router = APIRouter()

@router.post("/api/otp")
async def save_otp(data: dict):

    document = {
        "otp": data.get("otp"),
        "source": data.get("source", "web_otp"),
        "created_at": datetime.utcnow()
    }

    otp_collection.insert_one(document)

    return {
        "status": "success"
    }


@router.get("/api/otp")
async def get_otps():

    data = []

    for doc in otp_collection.find().sort("_id", -1).limit(100):

        data.append({
            "id": str(doc["_id"]),
            "otp": doc["otp"],
            "source": doc["source"],
            "created_at": doc["created_at"]
        })

    return data