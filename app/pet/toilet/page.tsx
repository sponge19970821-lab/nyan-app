"use client";

// 入力欄の値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るためのリンクを読み込む
import Link from "next/link";

// 排泄の回数と体調メモを入力する画面を表示する
export default function ToiletPage() {
    // 記録日・回数・メモを個別に保持し、入力のたびに画面へ反映する
    // 記録対象の日付。初期値には今日を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 便の回数欄に入力された値
    const [poopCount, setPoopCount] = useState("");
    // 尿の回数欄に入力された値
    const [peeCount, setPeeCount] = useState("");
    // 排泄や体調に関する補足メモ
    const [notes, setNotes] = useState("");

    // 入力内容を確認用ログへ出し、送信完了の通知を表示する
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準の送信でページが再読み込みされるのを防ぐ
        e.preventDefault();
        // 日付、回数、メモをまとめて開発者ツールへ出力する
        console.log({
            logDate,
            poopCount,
            peeCount,
            notes,
        });
        // 現在の実装では通知を表示する。履歴への保存処理は行わない
        alert("排泄の記録を送信しました！");
    };

    // 戻るリンクと、日付・排便・排尿・メモの入力欄を表示する
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
                    <h1 className="text-3xl font-bold mb-6">🚽 排泄の記録</h1>
                    {/* 入力内容を送信処理へ渡すフォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 記録を付ける日付を指定する */}
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

                        {/* 排便回数と排尿回数をまとめた入力エリア */}
                        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400 space-y-3">
                            {/* その日に確認した便の回数を入力する */}
                            <label className="flex flex-col">
                                💩 うんちの回数
                                <input
                                    type="number"
                                    value={poopCount}
                                    onChange={(e) => setPoopCount(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 1"
                                    required
                                />
                            </label>

                            {/* その日に確認した尿の回数を入力する */}
                            <label className="flex flex-col">
                                💧 おしっこの回数
                                <input
                                    type="number"
                                    value={peeCount}
                                    onChange={(e) => setPeeCount(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 3"
                                    required
                                />
                            </label>
                        </div>

                        {/* 回数だけでは伝わらない体調の変化を記録する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="体調や気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した排泄記録を送信する */}
                        <button
                            type="submit"
                            className="bg-blue-400 text-white p-3 rounded hover:bg-blue-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
