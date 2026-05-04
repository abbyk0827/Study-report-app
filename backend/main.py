from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔽 ここからCORS（入場パスポート）の設定を追加 🔽
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # フロントエンド（ポート3000）からの通信を許可
    allow_credentials=True,
    allow_methods=["*"], # GETやPOSTなどすべてのメソッドを許可
    allow_headers=["*"], # すべてのヘッダーを許可
)

@app.get("/")
def read_root():
    return {"message": "Java Silver Portfolio API is running!"}