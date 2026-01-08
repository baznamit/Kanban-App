from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.models.ic_memo import ICMemo
from app.models.deal import Deal

router = APIRouter(prefix="/memos", tags=["ic-memos"])

REQUIRED_SECTIONS = [
    "summary",
    "market",
    "product",
    "traction",
    "risks",
    "open_questions",
]

@router.post("/{deal_id}")
def create_memo_version(
    deal_id: str,
    content: dict,
    created_by: str,
    db: Session = Depends(get_db),
):
    # Ensure deal exists
    deal = db.query(Deal).filter(Deal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")

    # Validate sections
    for section in REQUIRED_SECTIONS:
        if section not in content:
            raise HTTPException(
                status_code=400,
                detail=f"Missing section: {section}"
            )

    # Get latest version
    latest = (
        db.query(ICMemo)
        .filter(ICMemo.deal_id == deal_id)
        .order_by(ICMemo.version.desc())
        .first()
    )

    next_version = 1 if not latest else latest.version + 1

    memo = ICMemo(
        deal_id=deal_id,
        version=next_version,
        content=content,
        created_by=created_by,
    )

    db.add(memo)
    db.commit()
    db.refresh(memo)

    return memo

@router.get("/{deal_id}")
def list_versions(deal_id: str, db: Session = Depends(get_db)):
    rows = (
        db.query(ICMemo)
        .filter(ICMemo.deal_id == deal_id)
        .order_by(ICMemo.version.desc())
        .all()
    )

    return [
        {
            "id": memo.id,
            "version": memo.version,
            "created_at": memo.created_at,
            "created_by": memo.created_by,
        }
        for memo in rows
    ]


@router.get("/version/{memo_id}")
def get_version(memo_id: str, db: Session = Depends(get_db)):
    memo = db.query(ICMemo).filter(ICMemo.id == memo_id).first()
    if not memo:
        raise HTTPException(status_code=404, detail="Memo not found")
    return memo
    