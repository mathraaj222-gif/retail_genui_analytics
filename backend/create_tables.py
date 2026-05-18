from app.db.base_class import Base
from app.db.session import engine

# Import ALL models so SQLAlchemy knows them
from app.db.models.product import Product
from app.db.models.campaign import Campaign
from app.db.models.store import Store
from app.db.models.event import FactEvent

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ All tables created successfully!")