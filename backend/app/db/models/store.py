from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base


class Store(Base):
    """
    dim_stores table
    Stores store location metadata.
    """

    __tablename__ = "dim_stores"

    store_id = Column(String, primary_key=True, index=True)
    city = Column(String, index=True)

    # Relationships
    events = relationship("FactEvent", back_populates="store")