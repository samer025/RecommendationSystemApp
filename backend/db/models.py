from sqlalchemy import Column, Integer, String, DateTime,ForeignKey,JSON
from datetime import datetime
from .database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, nullable=False)  # ← ID utilisé pour la reco, pas l'admin
    model_used = Column(String, nullable=False)
    recommended_offers = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClientContact(Base):
    __tablename__ = "client_contacts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, nullable=False)
    offer = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)