# Nyan App Backend (Java + Spring Boot)

Python版FastAPIから、Java版Spring Bootに書き換えられました。

## 構成

- **フレームワーク**: Spring Boot 3.1.5
- **Java**: Java 17
- **データベース**: H2（インメモリ）
- **ビルド**: Maven

## API エンドポイント

### POST /health
ペットの健康データを保存します。

リクエスト例：
```json
{
  "date": "2024-01-15",
  "weight": 4.5,
  "food": 100,
  "water": 200,
  "mood": "happy"
}
```

レスポンス例：
```json
{
  "message": "saved"
}
```

### GET /health
すべての健康データを取得します。

レスポンス例：
```json
[
  {
    "id": 1,
    "date": "2024-01-15",
    "weight": 4.5,
    "food": 100,
    "water": 200,
    "mood": "happy"
  }
]
```

## ローカル実行

```bash
mvn spring-boot:run
```

サーバーは http://localhost:8080 で起動します。

H2コンソール: http://localhost:8080/h2-console

## Docker でのビルド・実行

```bash
docker build -t nyan-app-backend .
docker run -p 8080:8080 nyan-app-backend
```

## ビルド

```bash
mvn clean package
```

JAR ファイルは `target/nyan-app-backend-1.0.0.jar` に生成されます。
