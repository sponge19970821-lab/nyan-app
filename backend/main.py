from fastapi import FastAPI  # HTTP APIのエンドポイントを定義する
from pydantic import BaseModel  # 受信データの型と形式を検証する

# APIルートを登録するFastAPIアプリ本体
app = FastAPI()

# 健康記録APIで受け渡しするデータの形式と型
class Health(BaseModel):
    # 記録した日付を文字列で受け取る
    date: str
    # 体重は小数を扱える数値として受け取る
    weight: float
    # 食事量は整数で受け取る
    food: int
    # 飲水量は整数で受け取る
    water: int
    # 気分や様子を文字列で受け取る
    mood: str

# 起動中だけ記録を保持する簡易メモリー上の保存先
db = []

# 受け取った健康記録を保存するPOST API
@app.post("/health")
def add_health(data: Health):
    # 検証済みの健康データをメモリー上の一覧へ追加する
    db.append(data)
    # 保存処理が完了したことをJSONで返す
    return {"message": "saved"}

# 保存済みの健康記録をすべて返すGET API
@app.get("/health")
def get_health():
    # 現在メモリー上にある全健康記録を返す
    return db
