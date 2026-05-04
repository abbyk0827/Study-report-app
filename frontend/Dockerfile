FROM node:20-alpine

WORKDIR /app

# パッケージ情報のコピーとインストール
COPY package.json package-lock.json* ./
RUN npm install

# ソースコードのコピー
COPY . .

# 開発サーバーの起動コマンド
CMD ["npm", "run", "dev"]