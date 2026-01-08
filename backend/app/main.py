from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.deals import router as deals_router
from app.api.ic_memos import router as ic_memo_router

app = FastAPI(title="Deal Pipeline API")

app.include_router(auth_router)
app.include_router(deals_router)
app.include_router(ic_memo_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
