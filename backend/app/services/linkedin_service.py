import os
from linkedin import linkedin
from app.models.linkedin_data import ProfileData, PostData
from datetime import datetime, timedelta
from app.services.storage_service import StorageService
import aiohttp
from typing import Dict, List, Optional

class LinkedInService:
    def __init__(self):
        self.client_id = os.getenv("LINKEDIN_CLIENT_ID")
        self.client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
        self.access_token = os.getenv("LINKEDIN_ACCESS_TOKEN")
        self.storage = StorageService()
        
        self.authentication = linkedin.LinkedInAuthentication(
            self.client_id,
            self.client_secret,
            "http://localhost:8000/callback",
            ['r_liteprofile', 'r_emailaddress', 'w_member_social']
        )
        
        self.application = linkedin.LinkedInApplication(token=self.access_token)
        
        # Cache duration (24 hours)
        self.cache_duration = timedelta(hours=24)

        self.base_url = "https://api.linkedin.com/v2"
        self.scopes = [
            "r_liteprofile",
            "r_emailaddress",
            "w_member_social"
        ]

    def _is_cache_valid(self, data_type: str) -> bool:
        """Check if cached data is still valid"""
        last_updated = self.storage.get_last_updated(data_type)
        if not last_updated:
            return False
        return datetime.now() - last_updated < self.cache_duration

    async def get_profile(self, credentials: Dict) -> Dict:
        """Get LinkedIn profile data"""
        async with aiohttp.ClientSession() as session:
            # Get basic profile
            profile_url = f"{self.base_url}/me"
            headers = {
                "Authorization": f"Bearer {credentials['access_token']}",
                "X-Restli-Protocol-Version": "2.0.0"
            }
            
            async with session.get(profile_url, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"Failed to fetch profile: {await response.text()}")
                basic_profile = await response.json()

            # Get email address
            email_url = f"{self.base_url}/emailAddress?q=members&projection=(elements*(handle~))"
            async with session.get(email_url, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"Failed to fetch email: {await response.text()}")
                email_data = await response.json()
                email = email_data.get("elements", [{}])[0].get("handle~", {}).get("emailAddress", "")

            # Get profile picture
            picture_url = f"{self.base_url}/me?projection=(profilePicture(displayImage~:playableStreams))"
            async with session.get(picture_url, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"Failed to fetch profile picture: {await response.text()}")
                picture_data = await response.json()
                picture_elements = picture_data.get("profilePicture", {}).get("displayImage~", {}).get("elements", [])
                profile_picture = picture_elements[-1].get("identifiers", [{}])[0].get("identifier", "") if picture_elements else ""

            # Get full profile
            full_profile_url = f"{self.base_url}/me?projection=(id,localizedFirstName,localizedLastName,headline,location,industry,summary,positions,educations,skills,websites)"
            async with session.get(full_profile_url, headers=headers) as response:
                if response.status != 200:
                    raise Exception(f"Failed to fetch full profile: {await response.text()}")
                full_profile = await response.json()

            # Format the response
            return {
                "id": basic_profile.get("id", ""),
                "firstName": basic_profile.get("localizedFirstName", ""),
                "lastName": basic_profile.get("localizedLastName", ""),
                "headline": full_profile.get("headline", ""),
                "location": full_profile.get("location", {}).get("name", ""),
                "industry": full_profile.get("industry", ""),
                "summary": full_profile.get("summary", ""),
                "email": email,
                "profilePicture": profile_picture,
                "experiences": self._format_positions(full_profile.get("positions", {}).get("elements", [])),
                "education": self._format_education(full_profile.get("educations", {}).get("elements", [])),
                "skills": self._format_skills(full_profile.get("skills", {}).get("elements", [])),
                "websites": self._format_websites(full_profile.get("websites", {}).get("elements", []))
            }

    async def get_posts(self, credentials: Dict) -> List[Dict]:
        """Get LinkedIn posts"""
        # Note: This requires additional permissions and API access
        # For now, return an empty list
        return []

    async def get_articles(self, credentials: Dict) -> List[Dict]:
        """Get LinkedIn articles"""
        # Note: This requires additional permissions and API access
        # For now, return an empty list
        return []

    def _format_positions(self, positions: List[Dict]) -> List[Dict]:
        """Format position data"""
        return [{
            "title": pos.get("title", ""),
            "company": pos.get("companyName", ""),
            "startDate": self._format_date(pos.get("startDate", {})),
            "endDate": self._format_date(pos.get("endDate", {})) if pos.get("endDate") else None,
            "description": pos.get("summary", "")
        } for pos in positions]

    def _format_education(self, education: List[Dict]) -> List[Dict]:
        """Format education data"""
        return [{
            "school": edu.get("schoolName", ""),
            "degree": edu.get("degreeName", ""),
            "startDate": self._format_date(edu.get("startDate", {})),
            "endDate": self._format_date(edu.get("endDate", {})) if edu.get("endDate") else None
        } for edu in education]

    def _format_skills(self, skills: List[Dict]) -> List[str]:
        """Format skills data"""
        return [skill.get("name", "") for skill in skills]

    def _format_websites(self, websites: List[Dict]) -> List[Dict]:
        """Format websites data"""
        return [{
            "name": website.get("name", ""),
            "url": website.get("url", "")
        } for website in websites]

    def _format_date(self, date_dict: Dict) -> str:
        """Format date from LinkedIn API format"""
        if not date_dict:
            return ""
        year = date_dict.get("year", "")
        month = date_dict.get("month", "")
        return f"{month}/{year}" if month and year else str(year)

    async def get_profile_data(self) -> ProfileData:
        """
        Fetch the authenticated user's profile data
        """
        # Check cache first
        if self._is_cache_valid('profile'):
            cached_data = self.storage.get_profile()
            if cached_data:
                return ProfileData(**cached_data)

        # Fetch fresh data
        profile = self.application.get_profile()
        profile_data = ProfileData(
            id=profile['id'],
            firstName=profile['firstName'],
            lastName=profile['lastName'],
            headline=profile.get('headline'),
            summary=profile.get('summary'),
            location=profile.get('location', {}).get('name'),
            industry=profile.get('industry'),
            profilePicture=profile.get('profilePicture'),
            connections=profile.get('connections')
        )
        
        # Save to cache
        self.storage.save_profile(profile_data)
        return profile_data

    async def get_posts_data(self) -> list[PostData]:
        """
        Fetch the authenticated user's posts
        """
        # Check cache first
        if self._is_cache_valid('posts'):
            cached_data = self.storage.get_posts()
            if cached_data:
                return [PostData(**post) for post in cached_data]

        # Fetch fresh data
        posts = self.application.get_posts()
        posts_data = [
            PostData(
                id=post['id'],
                text=post['text'],
                created_time=datetime.fromisoformat(post['created_time']),
                likes_count=post.get('likes_count'),
                comments_count=post.get('comments_count'),
                shares_count=post.get('shares_count'),
                url=post.get('url'),
                type='post'
            )
            for post in posts
        ]
        
        # Save to cache
        self.storage.save_posts(posts_data)
        return posts_data

    async def get_articles_data(self) -> list[PostData]:
        """
        Fetch the authenticated user's articles
        """
        # Check cache first
        if self._is_cache_valid('articles'):
            cached_data = self.storage.get_articles()
            if cached_data:
                return [PostData(**article) for article in cached_data]

        # Fetch fresh data
        articles = self.application.get_articles()
        articles_data = [
            PostData(
                id=article['id'],
                text=article['text'],
                created_time=datetime.fromisoformat(article['created_time']),
                likes_count=article.get('likes_count'),
                comments_count=article.get('comments_count'),
                shares_count=article.get('shares_count'),
                url=article.get('url'),
                type='article'
            )
            for article in articles
        ]
        
        # Save to cache
        self.storage.save_articles(articles_data)
        return articles_data 