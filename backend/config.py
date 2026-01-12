import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

config = Config() 