"use client";

// 入力欄の変更を画面へ反映するReactの状態管理機能
import { useState } from "react";
// ペット管理画面へ戻るリンク機能
import Link from "next/link";

// 歯磨きの実施状況を記録する画面を表示する
export default function TeethPage() {
    // 歯磨きをした日付。最初は今日の日付を表示する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 歯磨きを実施したかどうかをチェック状態で保持する
    const [brushed, setBrushed] = useState(false);
    // 歯磨き中の反応などを記録する自由入力メモ
    const [notes, setNotes] = useState("");

    // 送信内容を確認用ログへ出力し、操作完了を通知する
    const handleSubmit = (e: React.FormEvent) => {
        // フォーム標準のページ再読み込みを防止する
        e.preventDefault();
        // 日付、実施有無、メモをまとめて開発者ツールへ出す
        console.log({
            logDate,
            brushed,
            notes,
        });
        // 利用者へ送信操作が終わったことを知らせる
        alert("歯磨きの記録を送信しました！");
    };

    // 戻るリンクと、日付・歯磨きチェック・メモのフォームを組み立てる
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペット管理画面へ戻るリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-6">🦷 歯磨き</h1>
                    {/* 入力内容を送信処理へ渡す歯磨き記録フォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 歯磨きをした日付を指定する */}
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

                        {/* 歯を磨いた場合にチェックを付ける */}
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={brushed}
                                onChange={(e) => setBrushed(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">歯を磨きました</span>
                        </label>

                        {/* 猫の反応や口の状態などを補足する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="反応や気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した歯磨き記録を送信する */}
                        <button
                            type="submit"
                            className="bg-teal-400 text-white p-3 rounded hover:bg-teal-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
