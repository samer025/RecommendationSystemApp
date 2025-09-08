from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Use environment variable with fallback
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:1234@db:5432/recommendation_db"  # Changed from localhost to db
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()