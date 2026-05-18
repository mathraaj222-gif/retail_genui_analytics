from backend.app.db.base_class import Base
from backend.app.db.session import engine

# Import ALL models so SQLAlchemy knows them
from backend.app.db.models.product import Product
from backend.app.db.models.campaign import Campaign
from backend.app.db.models.store import Store
from backend.app.db.models.event import FactEvent

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully!")