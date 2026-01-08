from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.api.deals import router as deals_router
from app.api.ic_memos import router as ic_memo_router

app = FastAPI(title="Deal Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(deals_router)
app.include_router(ic_memo_router)

@app.get("/health")
def health():
    return {"status": "ok"}
