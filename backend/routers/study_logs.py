from fastapi import APIRouter, Depends
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

@router.put("/study_logs/{log_id}")
def update_study_log(log_id: int, log_update: schemas.StudyLogUpdate, db: Session = Depends(get_db)):
    db_log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()
    if not db_log: return {"message": "Not found"}, 404
    for key, value in log_update.model_dump(exclude_unset=True).items():
        setattr(db_log, key, value)
    db.commit()
    return {"message": "Updated"}

@router.delete("/study_logs/{log_id}")
def delete_study_log(log_id: int, db: Session = Depends(get_db)):
    db_log = db.query(models.StudyLog).filter(models.StudyLog.id == log_id).first()
    if db_log:
        db.delete(db_log)
        db.commit()
        return {"message": "Deleted"}
    return {"message": "Not found"}, 404