import uuid
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID  # Only works for PostgreSQL
from sqlalchemy.sql import func
from app.core.db import Base
from sqlalchemy.types import UserDefinedType


# # Define pgvector type
class Vector(UserDefinedType):
    def get_col_spec(self):
        return "vector(1536)"  # change depending on vector dimension size


class Movie(Base):
    __tablename__ = "movies"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        index=True,
    )
    title = Column(String, nullable=False)
    embedding = Column(Vector)  # pgvector column


class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        index=True,
    )
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())

    messages = relationship(
        "ChatMessage", back_populates="session", cascade="all, delete-orphan"
    )
    tool_history = relationship(
        "ToolHistory", back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        index=True,
    )
    session_id = Column(uuid.UUID, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())

    session = relationship("ChatSession", back_populates="messages")


class ToolHistory(Base):
    __tablename__ = "tool_history"
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        index=True,
    )
    session_id = Column(uuid.UUID, ForeignKey("chat_sessions.id"), nullable=False)
    user_id = Column(String, nullable=False)
    tool_name = Column(String, nullable=False)
    tool_input = Column(Text, nullable=False)
    tool_output = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    session = relationship("ChatSession", back_populates="tool_history")
