import uuid
from sqlalchemy import Column, String, DateTime, Integer, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class ICMemo(Base):
    __tablename__ = "ic_memos"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String, nullable=False, index=True)
    version = Column(Integer, nullable=False)
    content = Column(JSON, nullable=False)  # full snapshot
    created_by = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
