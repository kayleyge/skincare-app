# skincare-backend/app/database/models.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic import GetJsonSchemaHandler, BaseModel
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import core_schema

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, _):
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")

    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema(
            [
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema(
                    [
                        core_schema.str_schema(),
                        core_schema.no_info_plain_validator_function(cls.validate),
                    ]
                ),
            ],
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls, _core_schema: core_schema.CoreSchema, handler: GetJsonSchemaHandler
    ) -> JsonSchemaValue:
        return handler(core_schema.str_schema())

# Create an annotated type for ObjectId fields
PydanticObjectId = Annotated[str, PyObjectId]

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    age: Optional[int] = Field(None, ge=13, le=120)
    skin_type: Optional[str] = None
    skin_concerns: Optional[List[str]] = []
    current_products: Optional[str] = None
    goals: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserModel(BaseModel):
    id: Optional[PydanticObjectId] = Field(default=None, alias="_id")
    email: str
    hashed_password: str

    username: str
    age: Optional[int] = None
    skin_type: Optional[str] = None
    skin_concerns: Optional[List[str]] = []
    
    current_products: Optional[str] = None
    goals: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class SkinAnalysisModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    image_url: str
    skin_score: float
    detected_issues: List[str]
    redness_areas: Optional[List[dict]] = []
    dark_spot_areas: Optional[List[dict]] = []
    recommendations: List[str]
    analysis_date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}