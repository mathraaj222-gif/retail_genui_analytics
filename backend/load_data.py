import pandas as pd
from app.db.session import SessionLocal
from app.db.models.product import Product
from app.db.models.campaign import Campaign
from app.db.models.store import Store
from app.db.models.event import FactEvent

db = SessionLocal()

print("Cleaning up existing data...")
db.query(FactEvent).delete()
db.query(Product).delete()
db.query(Campaign).delete()
db.query(Store).delete()
db.commit()

print("Loading data...")

# -------------------
# PRODUCTS
# -------------------
products_df = pd.read_csv("data/exports/dim_products.csv")
for _, row in products_df.iterrows():
    db.add(Product(
        product_code=row["product_code"],
        product_name=row["product_name"],
        category=row["category"]
    ))

db.commit()
print("Products loaded")

# -------------------
# CAMPAIGNS
# -------------------
campaigns_df = pd.read_csv("data/exports/dim_campaigns.csv")

campaigns_df["start_date"] = pd.to_datetime(
    campaigns_df["start_date"], 
    dayfirst=True
).dt.date

campaigns_df["end_date"] = pd.to_datetime(
    campaigns_df["end_date"], 
    dayfirst=True
).dt.date

for _, row in campaigns_df.iterrows():
    db.add(Campaign(
        campaign_id=row["campaign_id"],
        campaign_name=row["campaign_name"],
        start_date=row["start_date"],
        end_date=row["end_date"]
    ))

db.commit()
print("Campaigns loaded")

# -------------------
# STORES
# -------------------
stores_df = pd.read_csv("data/exports/dim_stores.csv")

for _, row in stores_df.iterrows():
    db.add(Store(
        store_id=row["store_id"],
        city=row["city"]
    ))

db.commit()
print("Stores loaded")

# -------------------
# FACT EVENTS
# -------------------
events_df = pd.read_csv("data/exports/fact_events.csv")

for _, row in events_df.iterrows():
    db.add(FactEvent(
        event_id=row["event_id"],
        store_id=row["store_id"],
        campaign_id=row["campaign_id"],
        product_code=row["product_code"],
        base_price=row["base_price"],
        promo_type=row["promo_type"],
        quantity_sold_bfr_promo=row["quantity_sold_bfr_promo"],
        quantity_sold_aft_promo=row["quantity_sold_aft_promo"]
    ))

db.commit()
print("Fact events loaded")

db.close()
print("✅ ALL DATA LOADED SUCCESSFULLY")