# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tasks, study_logs
from routers import tasks, study_logs, users 

# 🔽 追加：データベースのエンジンとテーブル定義（models）を読み込む
from database import engine
import models

# 🔽 追加：アプリ起動時に、データベースにテーブルが存在しなければ自動で作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FocusFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(study_logs.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "FocusFlow API Structuring Complete!"}