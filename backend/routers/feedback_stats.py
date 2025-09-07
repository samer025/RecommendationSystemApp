# backend/routers/feedback_stats.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.database import SessionLocal
from db.models import Feedback

router = APIRouter()
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/feedback/stats")
def get_feedback_stats(db: Session = Depends(get_db)):
    # total feedbacks
    total = db.query(func.count(Feedback.id)).scalar() or 0

    # global average rating
    global_avg = db.query(func.avg(Feedback.rating)).scalar() or 0.0

    # distribution by rating (1..5)
    dist_query = (
        db.query(Feedback.rating, func.count(Feedback.id))
        .group_by(Feedback.rating)
        .all()
    )
    # normalize into dict {1:count,...,5:count}
    rating_distribution = {i: 0 for i in range(1, 6)}
    for rating, cnt in dist_query:
        rating_distribution[int(rating)] = cnt

    # average rating per offer (top 50 offers to avoid huge payload)
    offer_query = (
        db.query(Feedback.offer, func.avg(Feedback.rating).label("avg_rating"), func.count(Feedback.id).label("n"))
        .group_by(Feedback.offer)
        .order_by(func.avg(Feedback.rating).desc())
        .limit(50)
        .all()
    )
    avg_per_offer = [
        {"offer": row.offer, "avg": float(round(row.avg_rating, 3)), "count": int(row.n)}
        for row in offer_query
    ]

    unique_offers = len(avg_per_offer)

    return {
        "totalFeedbacks": int(total),
        "globalAverage": float(round(global_avg or 0.0, 3)),
        "uniqueOffersReturned": unique_offers,
        "ratingDistribution": rating_distribution,
        "averagePerOffer": avg_per_offer,
    }
