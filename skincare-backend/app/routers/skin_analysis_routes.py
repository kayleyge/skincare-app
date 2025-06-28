from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.database.models import UserModel, SkinAnalysisModel
from app.auth.auth_bearer import get_current_user
from app.services.skin_analysis import SkinAnalysisService
from app.database.mongodb import db
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/skin-analysis", tags=["Skin Analysis"])
skin_service = SkinAnalysisService()

class ImageAnalysisRequest(BaseModel):
    image_data: str  # Base64 encoded image

@router.post("/analyze")
async def analyze_skin(
    request: ImageAnalysisRequest,
    current_user: UserModel = Depends(get_current_user)
):
    # Perform skin analysis
    result = await skin_service.analyze_skin(request.image_data)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Save analysis to database
    analysis_data = {
        "user_id": str(current_user.id),
        "image_url": result["annotated_image"],
        "skin_score": result["skin_score"],
        "detected_issues": result["detected_issues"],
        "redness_areas": result["redness_areas"],
        "dark_spot_areas": result["dark_spot_areas"],
        "recommendations": result["recommendations"],
        "analysis_date": datetime.utcnow()
    }
    
    await db.database.skin_analyses.insert_one(analysis_data)
    
    return result

@router.get("/history", response_model=List[SkinAnalysisModel])
async def get_analysis_history(
    current_user: UserModel = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    analyses = await db.database.skin_analyses.find(
        {"user_id": str(current_user.id)}
    ).sort("analysis_date", -1).skip(skip).limit(limit).to_list(limit)
    
    return [SkinAnalysisModel(**analysis) for analysis in analyses]

@router.get("/progress")
async def get_skin_progress(
    current_user: UserModel = Depends(get_current_user),
    days: int = 30
):
    # Get analyses from the last N days
    from_date = datetime.utcnow() - timedelta(days=days)
    
    analyses = await db.database.skin_analyses.find({
        "user_id": str(current_user.id),
        "analysis_date": {"$gte": from_date}
    }).sort("analysis_date", 1).to_list(None)
    
    if not analyses:
        return {"message": "No analysis data available for the specified period"}
    
    # Extract progress data
    progress_data = {
        "dates": [analysis["analysis_date"].isoformat() for analysis in analyses],
        "skin_scores": [analysis["skin_score"] for analysis in analyses],
        "redness_counts": [len(analysis["redness_areas"]) for analysis in analyses],
        "dark_spot_counts": [len(analysis["dark_spot_areas"]) for analysis in analyses],
        "average_score": sum(analysis["skin_score"] for analysis in analyses) / len(analyses),
        "improvement": analyses[-1]["skin_score"] - analyses[0]["skin_score"] if len(analyses) > 1 else 0
    }
    
    return progress_data