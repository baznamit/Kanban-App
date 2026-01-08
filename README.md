# Deal Pipeline – Full-Stack Assignment

A small full-stack web application used by an investment team to manage deals through a pipeline, collaborate on IC memos, and track deal progress.

---

## Tech Stack

### Backend
- FastAPI (Python)
- SQLAlchemy + Alembic
- SQLite (Postgres-ready)
- JWT authentication

### Frontend
- React (Vite)
- React Router
- @hello-pangea/dnd (drag & drop Kanban)
- Plain CSS

---

## Features

### Authentication & Roles
- Email/password login
- JWT-based authentication
- Roles:
  - Admin – full access
  - Analyst – create/edit deals and IC memos
  - Partner – read-only access (extensible)

---

### Deal Pipeline (Kanban)
- Stages: Sourced → Screen → Diligence → IC → Invested → Passed
- Drag and drop deals between stages
- Stage changes create activity log entries
- Backend validates allowed stages

---

### Activity Log
- Records every stage change
- Stores:
  - Deal
  - Actor
  - From stage → To stage
  - Timestamp

---

### IC Memo with Versioning
- Fixed sections:
  - Summary
  - Market
  - Product
  - Traction
  - Risks
  - Open Questions
- Every save creates a new immutable version
- Full version history available
- Older versions are read-only

## Running the Project

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
