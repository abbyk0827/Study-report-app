# backend/main.py
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import tasks, study_logs, users

# データベースのエンジンとテーブル定義（models）を読み込む
from database import engine
import models

# アプリ起動時に、データベースにテーブルが存在しなければ自動で作成する
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FocusFlow API")

# 🔽 修正：環境変数からCloudflareのURLを取得（未設定時はローカルの3000番を使う）
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    # 🔽 修正：ローカル環境と、環境変数に入れた本番環境の両方を許可する
    allow_origins=["http://localhost:3000", FRONTEND_URL],
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