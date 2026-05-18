from sqlalchemy import Column, String, Date
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base


class Campaign(Base):
    """
    dim_campaigns table
    Stores campaign metadata (Diwali, Sankranti, etc.)
    """

    __tablename__ = "dim_campaigns"

    campaign_id = Column(String, primary_key=True, index=True)
    campaign_name = Column(String, index=True)
    start_date = Column(Date)
    end_date = Column(Date)

    # Relationships
    events = relationship("FactEvent", back_populates="campaign")