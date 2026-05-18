from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base


class Product(Base):
    """
    dim_products table
    Stores product master data.
    """

    __tablename__ = "dim_products"

    product_code = Column(String, primary_key=True, index=True)
    product_name = Column(String, index=True)
    category = Column(String)

    # Relationships
    events = relationship("FactEvent", back_populates="product")