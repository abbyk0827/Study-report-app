-- init.sql

-- 1. ユーザーテーブル
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. タスクテーブル（🔽 sort_order を追加！）
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    target_minutes INTEGER NOT NULL,
    sort_order INTEGER DEFAULT 0, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 学習実績テーブル
CREATE TABLE study_logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    actual_minutes INTEGER NOT NULL,
    log_type VARCHAR(50) CHECK(log_type IN ('pomodoro', 'manual')) NOT NULL,
    memo TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 🔽 最低限必要なユーザーアカウント（ID: 1）だけを作成し、タスクは空にしておく
INSERT INTO users (username) VALUES ('Kenta_S');