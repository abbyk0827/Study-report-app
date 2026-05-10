from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# 🔽 修正：ドット(..)を使わず、直接ファイル名を指定（絶対インポート）
from database import get_db
import models
import schemas

# URLの末尾のスラッシュ問題を回避するため、prefixは /tasks のまま、エンドポイントは "" にする
router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/user/{user_id}", response_model=List[schemas.TaskResponse])
def read_user_tasks(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Task).filter(models.Task.user_id == user_id).order_by(models.Task.sort_order, models.Task.id).all()

@router.post("", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    # 1. まず削除対象のタスクを探す
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if db_task:
        # 🔽 追加：このタスクに紐づいている「学習記録」を先にすべて削除する
        db.query(models.StudyLog).filter(models.StudyLog.task_id == task_id).delete()
        
        # 2. 子が消えたので、安全に親（タスク）を削除する
        db.delete(db_task)
        db.commit()
        return {"message": "Deleted"}
        
    return {"message": "Not found"}, 404

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return {"message": "Deleted"}
    return {"message": "Not found"}, 404

@router.post("/reorder")
def reorder_tasks(task_orders: List[schemas.TaskReorder], db: Session = Depends(get_db)):
    for order_data in task_orders:
        db.query(models.Task).filter(models.Task.id == order_data.id).update({"sort_order": order_data.sort_order})
    db.commit()
    return {"message": "Reordered"}

@router.put("/{task_id}")
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    # 1. データベースから対象のタスクを探す
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if not db_task:
        return {"message": "Not found"}, 404
    
    # 🔽 修正：ループによる暗黙的な代入を避け、明示的な代入に変更（確実なデータベースの更新）
    if task_update.title is not None:
        db_task.title = task_update.title
        
    if task_update.target_minutes is not None:
        db_task.target_minutes = task_update.target_minutes
        
    # 2. 変更を確定して保存
    db.commit()
    db.refresh(db_task) # 念のため最新のデータをリフレッシュ
    
    return db_task