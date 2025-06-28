from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from app.config import settings

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

db = MongoDB()

async def connect_db():
    db.client = AsyncIOMotorClient(settings.DATABASE_URL)
    db.database = db.client[settings.MONGO_INITDB_DATABASE]
    print("Connected to MongoDB")

async def close_db():
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")