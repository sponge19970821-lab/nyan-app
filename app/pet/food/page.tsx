"use client";

// React の状態管理を使うための import
import { useState } from "react";
// 前のページへ戻るためのリンク機能
import Link from "next/link";

export default function FoodPage() {
    // 記録する日付を保存する state。初期値は今日の日付
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // ご飯の量を保存する state
    const [foodAmount, setFoodAmount] = useState("");
    // 食欲の状態を保存する state。初期値は「食欲がある」
    const [appetiteLevel, setAppetiteLevel] = useState("good");
    // おやつの量を保存する state
    const [treatAmount, setTreatAmount] = useState("");
    // おやつの名前を保存する state
    const [treatName, setTreatName] = useState("");

    // ご飯のフォームを送信したときの処理
    const handleFoodSubmit = (e: React.FormEvent) => {
        // ページの再読み込みを止める
        e.preventDefault();
        
        // localStorage に保存済みのご飯の履歴を取り出す
        // まだ何もなければ [] を使う
        const foodHistory = JSON.parse(localStorage.getItem("foodHistory") || "[]");
        // 今の入力内容を配列に追加する
        foodHistory.push({
            date: logDate,
            amount: parseFloat(foodAmount),
            appetiteLevel,
        });
        // 追加した配列を localStorage に JSON 形式で保存する
        localStorage.setItem("foodHistory", JSON.stringify(foodHistory));
        
        // デバッグ用に入力内容をコンソールへ出す
        console.log({
            logDate,
            foodAmount,
            appetiteLevel,
        });
        // 保存完了のメッセージを表示する
        alert("ごはんの記録を送信しました！");
    };

    // おやつのフォームを送信したときの処理
    const handleTreatSubmit = (e: React.FormEvent) => {
        // フォームのデフォルト動作を止める
        e.preventDefault();
        // デバッグ用に入力内容をコンソールへ出す
        console.log({
            logDate,
            treatName,
            treatAmount,
        });
        // 保存完了のメッセージを表示する
        alert("おやつの記録を送信しました！");
    };

    return (
        // ページ全体を中央に置き、薄い背景を付けて見た目を整える
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペット管理ページへ戻るリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <div className="space-y-6">
                    {/* ご飯の記録フォームの枠 */}
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-3xl font-bold mb-6">🍽️ ごはんの記録</h1>
                        {/* ご飯の入力フォーム。送信時は handleFoodSubmit を実行する */}
                        <form onSubmit={handleFoodSubmit} className="flex flex-col gap-4">
                            <label className="flex flex-col">
                                日付
                                <input
                                    type="date"
                                    value={logDate}
                                    onChange={(e) => setLogDate(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    required
                                />
                            </label>

                            <label className="flex flex-col">
                                ご飯の量（g）
                                <input
                                    type="number"
                                    value={foodAmount}
                                    onChange={(e) => setFoodAmount(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 100"
                                    required
                                />
                            </label>

                            <div className="flex flex-col">
                                <span className="font-semibold mb-3">食欲</span>
                                <label className="flex items-center gap-3 mb-2">
                                    <input
                                        type="radio"
                                        name="appetite"
                                        value="good"
                                        checked={appetiteLevel === "good"}
                                        onChange={(e) => setAppetiteLevel(e.target.value)}
                                        className="h-5 w-5"
                                    />
                                    <span>食欲がある</span>
                                </label>
                                <label className="flex items-center gap-3 mb-2">
                                    <input
                                        type="radio"
                                        name="appetite"
                                        value="moderate"
                                        checked={appetiteLevel === "moderate"}
                                        onChange={(e) => setAppetiteLevel(e.target.value)}
                                        className="h-5 w-5"
                                    />
                                    <span>あまり食欲がない</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="appetite"
                                        value="none"
                                        checked={appetiteLevel === "none"}
                                        onChange={(e) => setAppetiteLevel(e.target.value)}
                                        className="h-5 w-5"
                                    />
                                    <span>まったく食べない</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="bg-orange-400 text-white p-3 rounded hover:bg-orange-500 font-semibold mt-4"
                            >
                                記録を保存する
                            </button>
                        </form>
                    </section>

                    {/* おやつの記録フォームの枠 */}
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-3xl font-bold mb-6">🍪 おやつの記録</h2>
                        {/* おやつの入力フォーム。送信時は handleTreatSubmit を実行する */}
                        <form onSubmit={handleTreatSubmit} className="flex flex-col gap-4">
                            <label className="flex flex-col">
                                おやつの名前
                                <input
                                    type="text"
                                    value={treatName}
                                    onChange={(e) => setTreatName(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 猫用ジャーキー"
                                    required
                                />
                            </label>

                            <label className="flex flex-col">
                                おやつの量（g）
                                <input
                                    type="number"
                                    value={treatAmount}
                                    onChange={(e) => setTreatAmount(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 10"
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                className="bg-green-400 text-white p-3 rounded hover:bg-green-500 font-semibold mt-4"
                            >
                                記録を保存する
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}
