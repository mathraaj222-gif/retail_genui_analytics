from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base


class FactEvent(Base):
    """
    fact_events table
    Stores transactional promotion performance data.
    """

    __tablename__ = "fact_events"

    event_id = Column(String, primary_key=True, index=True)

    store_id = Column(String, ForeignKey("dim_stores.store_id"))
    campaign_id = Column(String, ForeignKey("dim_campaigns.campaign_id"))
    product_code = Column(String, ForeignKey("dim_products.product_code"))

    base_price = Column(Float)

    promo_type = Column(String)  # should match PROMO_TYPES list

    quantity_sold_bfr_promo = Column(Integer)
    quantity_sold_aft_promo = Column(Integer)

    # Relationships
    store = relationship("Store", back_populates="events")
    product = relationship("Product", back_populates="events")
    campaign = relationship("Campaign", back_populates="events")