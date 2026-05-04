-- init.sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    target_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE study_logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    actual_minutes INTEGER NOT NULL,
    log_type VARCHAR(50) CHECK(log_type IN ('pomodoro', 'manual')) NOT NULL,
    memo TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title, target_minutes) VALUES 
('Javaの基本とデータ型', 600),
('制御構造（分岐・繰返し）', 600),
('オブジェクト指向とクラス設計', 1200),
('例外処理', 480),
('Java APIとモジュールシステム', 900);