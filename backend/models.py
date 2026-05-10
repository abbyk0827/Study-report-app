# backend/models.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    icon_emoji = Column(String, default="👨‍💻") # アイコンを絵文字で簡易的に表現
    focus_message = Column(String, default="Lifestyle & Productivity") # 肩書き・目標

    # 一対多のリレーションシップ（Userは複数のTaskを持つ）
    tasks = relationship("Task", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # user_idを外部キーとして明示
    title = Column(String, index=True)
    target_minutes = Column(Integer)
    sort_order = Column(Integer, default=0)

    # リレーションシップ
    owner = relationship("User", back_populates="tasks")

class StudyLog(Base):
    __tablename__ = "study_logs"
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    actual_minutes = Column(Integer)
    log_type = Column(String)
    memo = Column(String, nullable=True)
    