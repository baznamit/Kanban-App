from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.models.deal import Deal
from app.models.activity import Activity

router = APIRouter(prefix="/deals", tags=["deals"])

@router.post("/")
def create_deal(
    name: str,
    owner_id: str,
    db: Session = Depends(get_db)
):
    deal = Deal(
        name=name,
        owner_id=owner_id,
        stage="sourced"
    )
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


@router.get("/")
def list_deals(db: Session = Depends(get_db)):
    return db.query(Deal).all()


@router.patch("/{deal_id}/stage")
def move_stage(
    deal_id: str,
    to_stage: str,
    actor_id: str,
    db: Session = Depends(get_db)
):
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    from_stage = deal.stage
    deal.stage = to_stage

    activity = Activity(
        deal_id=deal.id,
        actor_id=actor_id,
        from_stage=from_stage,
        to_stage=to_stage,
        action=f"User moved deal from {from_stage} to {to_stage}"
    )

    db.add(activity)
    db.commit()

    return {"status": "ok"}
