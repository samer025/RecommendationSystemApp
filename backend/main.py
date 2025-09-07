from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import pickle
import numpy as np
from surprise import Dataset, Reader
from routers import auth, feedback_stats  # <-- le fichier auth.py (auth routes)
from db.database import SessionLocal, engine
from db import models
from db.models import Recommendation,ClientContact
from fastapi import Depends
models.Base.metadata.create_all(bind=engine)
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
from routers import feedback
from urllib.parse import quote
# App FastAPI
app = FastAPI(title="Recommendation API")

# CORS pour Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes d'authentification
app.include_router(auth.router)
app.include_router(feedback.router)
app.include_router(feedback_stats.router)
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

# Chargement des modèles et données
def load_pickle(path):
    with open(path, 'rb') as f:
        return pickle.load(f)

als_model = load_pickle("als_model.pkl")
lightfm_model = load_pickle("lightfm_model.pkl")
lightfm_mappings = load_pickle("lightfm_mappings.pkl")
lightfm_train = load_pickle("lightfm_train_matrix.pkl")
knn_model = load_pickle("knn_cosine_model.pkl")
svd_model = load_pickle("svd_gridsearch_model.pkl")
svdpp_model = load_pickle("svdpp_model.pkl")
rating_df = load_pickle("nbrdefoix_rating_df.pkl")
user_product_matrix = load_pickle("user_item_matrix.pkl")
user_product_train_matrix = load_pickle("user_item_matrixx.pkl")
als_train_sparse = load_pickle("als_train_sparse.pkl")
user_id_to_index = load_pickle("user_id_to_index.pkl")

reader = Reader(rating_scale=(rating_df['scaled_rating'].min(), rating_df['scaled_rating'].max()))
data = Dataset.load_from_df(rating_df[['ID', 'OPTION_DESC', 'scaled_rating']], reader)
trainset = data.build_full_trainset()
svd_model.fit(trainset)

user_mapping = lightfm_mappings["user_mapping"]
item_mapping = lightfm_mappings["item_mapping"]
user_inv_map = lightfm_mappings["user_inv_map"]
item_inv_map = lightfm_mappings["item_inv_map"]
feedback_link = "http://localhost:3000/feedback"



def recommend_lightfm(user_id, top_n=3):
    if user_id not in user_mapping:
        return ["User not found"]
    user_idx = user_mapping[user_id]
    scores = lightfm_model.predict(user_idx, np.arange(len(item_mapping)))
    top_items = np.argsort(-scores)[:top_n]
    return [item_inv_map[i] for i in top_items]


def generate_email(client_id: str) -> str:
    cleaned_id = re.sub(r'\W+', '', client_id)
    return f"client_{cleaned_id.lower()}@example.com"

# Fonction d'envoi d'email
def send_email(to_email: str, subject: str, body: str):
    sender_email = "sameramor2000@gmail.com"
    sender_password = "	axzl zagt kdgh mskf"  # Mot de passe d’application (Gmail)

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            print(f" Email envoyé à {to_email}")
    except Exception as e:
        print(f" Erreur envoi email: {e}")

# Endpoint d'appel de reco
@app.get("/recommend/{model_name}/{user_id}")
def recommend(model_name: str, user_id: str, top_n: int = 3):
    model_name = model_name.lower()
    if model_name == "lightfm":
        result = recommend_lightfm(user_id, top_n)
    else:
        raise HTTPException(status_code=400, detail="Model non supported")
    # Sauvegarde en base
    db = SessionLocal()
    try:
        reco_entry = Recommendation(
            client_id=user_id,
            model_used=model_name,
            recommended_offers=result,
        )
        db.add(reco_entry)
        db.commit()
        db.refresh(reco_entry)
        client = db.query(ClientContact).filter(ClientContact.client_id == user_id).first()
        if not client:
            # Générer un email auto
            generated_email = generate_email(user_id)
            client = ClientContact(client_id=user_id, email=generated_email)
            db.add(client)
            db.commit()
            db.refresh(client)
            print(f"✅ Email auto créé pour {user_id} : {generated_email}")

        # ✉️ Envoi du mail
        if client.email:
            best_offer = result[0] if result else "Aucune offre recommandée"
            subject = "🎯 Votre offre personnalisée"

            best_offer_cleaned = best_offer.replace('/', '_')
            slug = quote(f"{user_id}--{best_offer_cleaned}")
            feedback_slug_link = f"http://localhost:3000/feedback/{slug}"
            body = f"Bonjour,\n\nNotre système vous recommande l’offre suivante :\n\n👉 {best_offer}\n \n .{feedback_slug_link} Merci d'utiliser notre service."
            send_email(client.email, subject, body)

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'enregistrement ou envoi : {str(e)}")
    finally:
        db.close()

    return {
        "user_id": user_id,
        "model": model_name,
        "recommendations": result
    }
