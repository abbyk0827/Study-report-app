# backend/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
import models, schemas

router = APIRouter(prefix="/users", tags=["users"])

# 🔽 追加：ログインで受け取るデータの型定義
class LoginRequest(BaseModel):
    username: str
    password: str

# 🔽 追加：IDとパスワードでのログイン処理
@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    # ポートフォリオ用のアカウント（ID: kenta, Pass: password）
    if req.username == "kenta" and req.password == "password":
        user = db.query(models.User).filter(models.User.id == 1).first()
        if not user:
            user = models.User(id=1, name="Kenta.S", email="kenta@example.com", icon_emoji="👨‍💻", focus_message="Lifestyle & Productivity")
            db.add(user)
            db.commit()
        return {"user_id": 1, "message": "Login successful"}
    
    raise HTTPException(status_code=401, detail="IDまたはパスワードが違います")

# 🔽 追加：ゲスト利用のログイン処理（常にID: 2を割り当てる）
@router.post("/guest")
def guest_login(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 2).first()
    if not user:
        user = models.User(id=2, name="Guest User", email="guest@example.com", icon_emoji="🔰", focus_message="お試し利用中")
        db.add(user)
        db.commit()
    return {"user_id": 2, "message": "Guest login successful"}

# 🔽 修正：固定の「1」ではなく、リクエストされた user_id の情報を返す
@router.get("/me", response_model=schemas.UserResponse)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        user = models.User(id=user_id, name=f"User {user_id}", email=f"user{user_id}@example.com", icon_emoji="👤", focus_message="Welcome")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

# 🔽 修正：リクエストされた user_id の情報を更新する
@router.put("/me", response_model=schemas.UserResponse)
def update_current_user(user_update: schemas.UserUpdate, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.name is not None:
        user.name = user_update.name
    if user_update.icon_emoji is not None:
        user.icon_emoji = user_update.icon_emoji
    if user_update.focus_message is not None:
        user.focus_message = user_update.focus_message

    db.commit()
    db.refresh(user)
    return user