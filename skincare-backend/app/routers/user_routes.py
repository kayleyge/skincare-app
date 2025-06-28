from fastapi import APIRouter, Depends, HTTPException
from app.database.models import UserModel
from app.auth.auth_bearer import get_current_user
from app.database.mongodb import db
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserModel)
async def get_current_user_info(current_user: UserModel = Depends(get_current_user)):
    """Get current user's profile information"""
    return current_user

@router.put("/me", response_model=UserModel)
async def update_user_info(
    updated_info: dict,
    current_user: UserModel = Depends(get_current_user)
):
    """Update current user's profile information"""
    # Don't allow updating sensitive fields
    forbidden_fields = {"_id", "email", "hashed_password"}
    update_data = {k: v for k, v in updated_info.items() if k not in forbidden_fields}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No valid fields to update")
    
    # Add updated_at timestamp
    from datetime import datetime
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.database.users.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get and return updated user
    updated_user = await db.database.users.find_one({"_id": ObjectId(current_user.id)})
    return UserModel(**updated_user)
