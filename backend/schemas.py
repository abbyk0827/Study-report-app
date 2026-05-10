from pydantic import BaseModel
from typing import List, Optional

class TaskBase(BaseModel):
    user_id: int
    title: str
    target_minutes: int
    sort_order: int = 0

class TaskCreate(TaskBase): pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    target_minutes: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    class Config:
        from_attributes = True

class TaskReorder(BaseModel):
    id: int
    sort_order: int

class StudyLogCreate(BaseModel):
    task_id: int
    actual_minutes: int
    log_type: str
    memo: Optional[str] = ""

class StudyLogUpdate(BaseModel):
    actual_minutes: Optional[int] = None
    memo: Optional[str] = None