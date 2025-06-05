from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.config_service import ConfigService
from typing import Optional
from datetime import datetime

router = APIRouter()
config_service = ConfigService()

class LinkedInCredentials(BaseModel):
    client_id: str
    client_secret: str
    access_token: Optional[str] = None

@router.post("/credentials")
async def save_credentials(credentials: LinkedInCredentials):
    """Save LinkedIn credentials"""
    try:
        config_service.save_credentials(credentials.dict())
        return {"message": "Credentials saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/credentials")
async def get_credentials():
    """Get stored LinkedIn credentials"""
    credentials = config_service.get_credentials()
    if not credentials:
        raise HTTPException(status_code=404, detail="No credentials found")
    return credentials

@router.get("/status")
async def get_config_status():
    """Get configuration status"""
    credentials = config_service.get_credentials()
    last_updated = config_service.get_last_updated()
    
    return {
        "is_configured": credentials is not None,
        "last_updated": last_updated.isoformat() if last_updated else None
    }

@router.delete("/credentials")
async def clear_credentials():
    """Clear stored credentials"""
    try:
        config_service.clear_credentials()
        return {"message": "Credentials cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 