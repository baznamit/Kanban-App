from fastapi import FastAPI

app = FastAPI(title="Deal Pipeline API")

@app.get("/health")
def health_check():
    return {"status": "ok"}
