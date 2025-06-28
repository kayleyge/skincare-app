from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    # Pydantic v2: customize JSON schema generation
    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        """Tell Pydantic/JSON-schema that ObjectId should be rendered as a string."""
        json_schema = handler(core_schema)
        # We want OpenAPI to show this field as simple string (ObjectId hex)
        if isinstance(json_schema, dict):
            json_schema.update(type="string", examples=["64b64cfa12ab34cd56ef7890"])
        return json_schema

class UserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    username: str
    email: EmailStr
    full_name: str
    hashed_password: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SkinAnalysisModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    image_url: str
    analysis_date: datetime = Field(default_factory=datetime.utcnow)
    skin_score: float
    detected_issues: List[dict]  # List of detected issues with coordinates
    redness_areas: List[dict]
    dark_spot_areas: List[dict]
    recommendations: List[str]
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class SkincareRoutineModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    name: str
    products: List[dict]
    morning_routine: List[str]
    evening_routine: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Request/Response Models
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None