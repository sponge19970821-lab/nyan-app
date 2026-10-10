# Node.js 18を基準にフロントエンド用コンテナを作成する
FROM node:18

# コンテナ内で以降のコマンドを実行する作業場所
WORKDIR /app

# 依存関係の定義ファイルを先にコピーしてインストールする
COPY package*.json ./
RUN npm install

# アプリのソースコードをコンテナへコピーする
COPY . .

# コンテナ起動時にNext.jsの開発サーバーを実行する
CMD ["npm", "run", "dev"]
