import os
from cryptography.fernet import Fernet
from pathlib import Path
import json
from typing import Dict, Optional
from datetime import datetime

class ConfigService:
    def __init__(self):
        self.config_dir = Path("config")
        self.encrypted_file = self.config_dir / "linkedin_config.enc"
        self.key_file = self.config_dir / ".key"
        self._ensure_config_directory()
        self._load_or_create_key()

    def _ensure_config_directory(self):
        """Create config directory if it doesn't exist"""
        self.config_dir.mkdir(exist_ok=True)

    def _load_or_create_key(self):
        """Load existing encryption key or create a new one"""
        if not self.key_file.exists():
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as f:
                f.write(key)
        else:
            with open(self.key_file, 'rb') as f:
                key = f.read()
        self.fernet = Fernet(key)

    def save_credentials(self, credentials: Dict):
        """Save encrypted LinkedIn credentials"""
        config_data = {
            'credentials': credentials,
            'last_updated': datetime.now().isoformat()
        }
        encrypted_data = self.fernet.encrypt(json.dumps(config_data).encode())
        with open(self.encrypted_file, 'wb') as f:
            f.write(encrypted_data)

    def get_credentials(self) -> Optional[Dict]:
        """Get decrypted LinkedIn credentials"""
        if not self.encrypted_file.exists():
            return None
        
        with open(self.encrypted_file, 'rb') as f:
            encrypted_data = f.read()
        
        try:
            decrypted_data = self.fernet.decrypt(encrypted_data)
            config_data = json.loads(decrypted_data)
            return config_data['credentials']
        except Exception as e:
            print(f"Error decrypting credentials: {e}")
            return None

    def get_last_updated(self) -> Optional[datetime]:
        """Get last update timestamp"""
        if not self.encrypted_file.exists():
            return None
        
        with open(self.encrypted_file, 'rb') as f:
            encrypted_data = f.read()
        
        try:
            decrypted_data = self.fernet.decrypt(encrypted_data)
            config_data = json.loads(decrypted_data)
            return datetime.fromisoformat(config_data['last_updated'])
        except Exception:
            return None

    def clear_credentials(self):
        """Clear stored credentials"""
        if self.encrypted_file.exists():
            self.encrypted_file.unlink() 