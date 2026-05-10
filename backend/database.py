# backend/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Dockerの環境変数からDBのURLを取得（設定されていない場合のデフォルト値も用意）
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://user:password@db:5432/app_db"
)

# DBエンジンの作成
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# DBセッション（通信の窓口）の作成
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# モデル（設計図）のベース
Base = declarative_base()

# DB接続を管理する関数（APIが呼ばれるたびに接続し、終わったら閉じる）
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()