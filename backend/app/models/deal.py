import uuid
from sqlalchemy import Column, String, DateTime, Numeric
from sqlalchemy.sql import func
from app.core.database import Base

class Deal(Base):
    __tablename__ = "deals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    company_url = Column(String)
    owner_id = Column(String, nullable=False)
    stage = Column(String, nullable=False)  # sourced, screen, diligence, ic, invested, passed
    round = Column(String)
    check_size = Column(Numeric)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
