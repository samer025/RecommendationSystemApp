# backend/routers/feedback.py

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import Feedback
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class FeedbackSchema(BaseModel):
    client_id: str
    offer: str
    rating: int
    comment: str

class FeedbackResponse(BaseModel):
    id: int
    client_id: str
    offer: str
    rating: int
    comment: str
    submitted_at: datetime

    class Config:
        from_attributes = True

@router.post("/feedback")
def submit_feedback(payload: FeedbackSchema, db: Session = Depends(get_db)):
    feedback = Feedback(
        client_id=payload.client_id,
        offer=payload.offer,
        rating=payload.rating,
        comment=payload.comment,
        submitted_at=datetime.utcnow()
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return {"message": "Feedback enregistré avec succès"}
@router.get("/feedbacks", response_model=List[FeedbackResponse])
def get_all_feedbacks(db: Session = Depends(get_db)):
    """Récupérer tous les feedbacks"""
    try:
        feedbacks = db.query(Feedback).order_by(Feedback.submitted_at.desc()).all()
        return feedbacks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des feedbacks: {str(e)}")