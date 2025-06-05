from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProfileData(BaseModel):
    id: str
    firstName: str
    lastName: str
    headline: Optional[str]
    summary: Optional[str]
    location: Optional[str]
    industry: Optional[str]
    profilePicture: Optional[str]
    connections: Optional[int]

class PostData(BaseModel):
    id: str
    text: str
    created_time: datetime
    likes_count: Optional[int]
    comments_count: Optional[int]
    shares_count: Optional[int]
    url: Optional[str]
    type: str  # 'post' or 'article' 