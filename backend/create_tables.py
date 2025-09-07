from db.database import Base, engine
from db.models import User

print("📦 Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created.")
