import json
import os
from datetime import datetime
from typing import List, Dict, Any
from app.models.linkedin_data import ProfileData, PostData

class StorageService:
    def __init__(self):
        self.data_dir = "data"
        self.profile_file = os.path.join(self.data_dir, "profile.json")
        self.posts_file = os.path.join(self.data_dir, "posts.json")
        self.articles_file = os.path.join(self.data_dir, "articles.json")
        self._ensure_data_directory()

    def _ensure_data_directory(self):
        """Create data directory if it doesn't exist"""
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)

    def _save_to_json(self, data: Any, file_path: str):
        """Save data to JSON file"""
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, default=str)

    def _load_from_json(self, file_path: str) -> Any:
        """Load data from JSON file"""
        if not os.path.exists(file_path):
            return None
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def save_profile(self, profile: ProfileData):
        """Save profile data to JSON"""
        profile_dict = profile.dict()
        profile_dict['last_updated'] = datetime.now().isoformat()
        self._save_to_json(profile_dict, self.profile_file)

    def save_posts(self, posts: List[PostData]):
        """Save posts data to JSON"""
        posts_dict = {
            'posts': [post.dict() for post in posts],
            'last_updated': datetime.now().isoformat()
        }
        self._save_to_json(posts_dict, self.posts_file)

    def save_articles(self, articles: List[PostData]):
        """Save articles data to JSON"""
        articles_dict = {
            'articles': [article.dict() for article in articles],
            'last_updated': datetime.now().isoformat()
        }
        self._save_to_json(articles_dict, self.articles_file)

    def get_profile(self) -> Dict:
        """Get profile data from JSON"""
        return self._load_from_json(self.profile_file)

    def get_posts(self) -> List[Dict]:
        """Get posts data from JSON"""
        data = self._load_from_json(self.posts_file)
        return data.get('posts', []) if data else []

    def get_articles(self) -> List[Dict]:
        """Get articles data from JSON"""
        data = self._load_from_json(self.articles_file)
        return data.get('articles', []) if data else []

    def get_last_updated(self, data_type: str) -> datetime:
        """Get last update timestamp for specific data type"""
        file_path = getattr(self, f"{data_type}_file")
        data = self._load_from_json(file_path)
        if data and 'last_updated' in data:
            return datetime.fromisoformat(data['last_updated'])
        return None 