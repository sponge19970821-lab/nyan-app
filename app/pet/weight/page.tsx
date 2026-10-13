"use client";

// 入力欄の値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るためのリンクを読み込む
import Link from "next/link";

// 体重を記録する入力画面を表示する
export default function WeightPage() {
    // 記録対象の日付を保持する。初期値には今日の日付を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 体重欄の入力値を文字列で保持する
    const [weight, setWeight] = useState("");
    // 体重変化について利用者が書く補足メモを保持する
    const [notes, setNotes] = useState("");

    // 送信内容を体重履歴へ追加し、処理完了を利用者へ知らせる
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準の送信によるページ再読み込みを防ぐ
        e.preventDefault();
        
        // 端末内にある体重履歴を読み込み、初回は空配列から始める
        const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        // 日付と数値に変換した体重を新しい履歴として追加する
        weightHistory.push({
            date: logDate,
            weight: parseFloat(weight),
        });
        // 更新した履歴全体をJSON文字列にして端末内へ保存する
        localStorage.setItem("weightHistory", JSON.stringify(weightHistory));
        
        // メモを含む入力内容を開発者ツールで確認できるよう出力する
        console.log({
            logDate,
            weight,
            notes,
        });
        // 利用者へ送信操作が完了したことを伝える
        alert("体重の記録を送信しました！");
    };

    // 戻るリンク、日付・体重・メモ欄、送信ボタンを組み立てる
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペットのプロフィールと記録一覧へ戻るリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-6">⚖️ 体重</h1>
                    {/* 送信時に体重履歴を保存するフォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 体重を測った日を指定する */}
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

                        {/* 小数第1位まで入力できる体重欄 */}
                        <label className="flex flex-col">
                            体重（kg）
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="border p-2 rounded mt-2"
                                placeholder="例: 4.5"
                                required
                            />
                        </label>

                        {/* 保存履歴とは別に、送信時の確認用メモを入力する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="気づきがあれば入力してください"
                            />
                        </label>

                        {/* 必須項目の入力後に履歴を保存する */}
                        <button
                            type="submit"
                            className="bg-purple-400 text-white p-3 rounded hover:bg-purple-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
