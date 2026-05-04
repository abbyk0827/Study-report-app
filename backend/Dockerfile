FROM python:3.11-slim

WORKDIR /app

# パッケージのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ソースコードのコピー
COPY . .

# サーバーの起動コマンド（reload付きで、コード変更を即時反映）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]