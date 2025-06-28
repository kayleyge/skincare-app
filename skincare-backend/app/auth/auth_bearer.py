from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.auth_handler import decode_token
from app.database.models import UserModel
from app.database.mongodb import db

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        isTokenValid: bool = False
        try:
            payload = decode_token(jwtoken)
            if payload:
                isTokenValid = True
        except:
            isTokenValid = False
        return isTokenValid

async def get_current_user(token: str = Depends(JWTBearer())) -> UserModel:
    token_data = decode_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.database.users.find_one({"username": token_data.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserModel(**user)