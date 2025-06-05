from fastapi import APIRouter, HTTPException
from app.services.linkedin_service import LinkedInService
from app.services.config_service import ConfigService

router = APIRouter()
linkedin_service = LinkedInService()
config_service = ConfigService()

@router.get("/profile")
async def get_profile():
    """Get LinkedIn profile data"""
    try:
        credentials = config_service.get_credentials()
        if not credentials:
            raise HTTPException(status_code=401, detail="LinkedIn credentials not configured")
        
        profile = await linkedin_service.get_profile(credentials)
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts")
async def get_posts():
    """Get LinkedIn posts"""
    try:
        credentials = config_service.get_credentials()
        if not credentials:
            raise HTTPException(status_code=401, detail="LinkedIn credentials not configured")
        
        posts = await linkedin_service.get_posts(credentials)
        return posts
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/articles")
async def get_articles():
    """Get LinkedIn articles"""
    try:
        credentials = config_service.get_credentials()
        if not credentials:
            raise HTTPException(status_code=401, detail="LinkedIn credentials not configured")
        
        articles = await linkedin_service.get_articles(credentials)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 