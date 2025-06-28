from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth_routes, user_routes, skin_analysis_routes
from app.database.mongodb import connect_db, close_db

app = FastAPI(title="GlowGuard Insight API")

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CLIENT_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(skin_analysis_routes.router)

# Database connection events
@app.on_event("startup")
async def startup_db_client():
    await connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()

@app.get("/")
async def root():
    return {"message": "Welcome to GlowGuard Insight API"}
