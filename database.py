from pymongo import MongoClient
from config import MONGO_URL, DB_NAME, COLLECTION_NAME

client = MongoClient(MONGO_URL)

db = client[DB_NAME]

otp_collection = db[COLLECTION_NAME]