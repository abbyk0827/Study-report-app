from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    title = Column(String, index=True)
    target_minutes = Column(Integer)
    sort_order = Column(Integer, default=0)

class StudyLog(Base):
    __tablename__ = "study_logs"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    actual_minutes = Column(Integer)
    log_type = Column(String)
    memo = Column(String, nullable=True)