import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    deal_id = Column(String, nullable=False)
    actor_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    from_stage = Column(String)
    to_stage = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
