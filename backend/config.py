import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'bloodlink-demo-secret-key-2026')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///bloodlink.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_EXPIRATION_HOURS = 24
    STALE_INVENTORY_HOURS = int(os.environ.get('STALE_INVENTORY_HOURS', 6))
