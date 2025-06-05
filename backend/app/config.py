import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    # LinkedIn API credentials
    LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID")
    LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET")
    LINKEDIN_ACCESS_TOKEN = os.getenv("LINKEDIN_ACCESS_TOKEN")
    
    # API settings
    API_V1_STR = "/api/v1"
    PROJECT_NAME = "Social Media Data API"
    
    # CORS settings
    BACKEND_CORS_ORIGINS = [
        "http://localhost:3000",  # React frontend
        "http://localhost:8000",  # Backend
    ]

settings = Settings() 