from sqlalchemy.orm import DeclarativeBase, declared_attr

class Base(DeclarativeBase):
    id: int
    __name__: str
    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()
