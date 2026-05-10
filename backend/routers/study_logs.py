# backend/routers/study_logs.py
from fastapi import APIRouter, Depends, HTTPException # 👈 修正1: HTTPException を追加
from sqlalchemy.orm import Session

# 🔽 修正：ドット(..)を使わず、直接ファイル名を指定
from database import get_db
import models
import schemas

router = APIRouter(tags=["study_logs"])

@router.get("/users/{user_id}/study_logs")
def get_study_logs(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.StudyLog).join(models.Task, models.StudyLog.task_id == models.Task.id)\
             .filter(models.Task.user_id == user_id).order_by(models.StudyLog.id.desc()).all()

@router.post("/study_logs")
def create_study_log(log: schemas.StudyLogCreate, db: Session = Depends(get_db)):
    db_log = models.StudyLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    return {"message": "Saved", "data": db_log}

@router.get("/users/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.user_id == user_id).all()
    logs = db.query(models.StudyLog).all()
    return [{"title": t.title, "total_minutes": sum(l.actual_minutes for l in logs if l.task_id == t.id)} for t in tasks]

# 🔽 修正2：受け皿のURLをフロントエンドに合わせて "/study_logs/{log_id}" に変更
@router.put("/study_logs/{log_id}")
def update_study_log(log_id: int, log_update: schemas.StudyLogUpdate, db: Session = Depends(get_db)):
    log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    # 🔽 送られてきた項目があれば、それぞれ個別に更新する
    if log_update.actual_minutes is not None:
        log.actual_minutes = log_update.actual_minutes
    
    if log_update.task_id is not None:
        log.task_id = log_update.task_id # 👈 タスクIDの更新処理
    
    db.commit() # 👈 変更を確定
    db.refresh(log) # 👈 最新の情報を読み込む
    return log

@router.delete("/study_logs/{log_id}")
def delete_study_log(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
        return {"message": "Deleted"}
    return {"message": "Not found"}, 404