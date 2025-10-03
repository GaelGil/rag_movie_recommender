import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID  # Only works for PostgreSQL
from sqlalchemy.sql import func

# from sqlalchemy.orm import relationship
from app.core.db import Base


class User(Base):
    table_name = "users"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        index=True,
    )
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # chat_sessions = relationship("ChatSession", back_populates="user")
