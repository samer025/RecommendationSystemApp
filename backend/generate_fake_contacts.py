from db.database import SessionLocal
from db.models import ClientContact, Recommendation
import re

def generate_email(client_id: str) -> str:
    cleaned_id = re.sub(r'\W+', '', client_id)  # enlever caractères spéciaux
    return f"client_{cleaned_id.lower()}@example.com"

def main():
    db = SessionLocal()
    try:
        # Extraire tous les client_id uniques déjà présents dans recommendations
        client_ids = db.query(Recommendation.client_id).distinct().all()
        client_ids = [c[0] for c in client_ids]

        for cid in client_ids:
            email = generate_email(cid)

            # Vérifie s'il existe déjà
            existing = db.query(ClientContact).filter_by(client_id=cid).first()
            if not existing:
                contact = ClientContact(client_id=cid, email=email)
                db.add(contact)
        db.commit()
        print(f"{len(client_ids)} contacts générés avec succès.")
    except Exception as e:
        db.rollback()
        print(f"Erreur : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
