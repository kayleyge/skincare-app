from fastapi import APIRouter, HTTPException, Response, Depends
from app.database.models import UserCreate, UserLogin, Token, UserModel
from app.database.mongodb import db
from app.auth.password import hash_password, verify_password
from app.auth.auth_handler import create_access_token, create_refresh_token, verify_token
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserModel)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.database.users.find_one(
        {"$or": [{"username": user_data.username}, {"email": user_data.email}]}
    )
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create new user
    user_dict = user_data.dict()
    user_dict["hashed_password"] = hash_password(user_dict.pop("password"))
    
    result = await db.database.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    return UserModel(**user_dict)

@router.post("/login", response_model=Token)
async def login(response: Response, user_credentials: UserLogin):
    # Find user
    user = await db.database.users.find_one({"username": user_credentials.username})
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create tokens
    access_token = create_access_token(data={"sub": user["username"]})
    refresh_token = create_refresh_token(data={"sub": user["username"]})
    
    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=1800  # 30 minutes
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=604800  # 7 days
    )
    
    return Token(access_token=access_token, refresh_token=refresh_token)

@router.post("/refresh")
async def refresh_token(response: Response, refresh_token: str):
    token_data = verify_token(refresh_token, "refresh")
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    # Create new access token
    access_token = create_access_token(data={"sub": token_data.username})
    
    # Set new access token cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=1800
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}