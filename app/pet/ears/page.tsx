"use client";

// フォームの入力値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るリンクを作る
import Link from "next/link";

// 耳掃除の実施状況を記録する画面を表示する
export default function EarsPage() {
    // 記録対象の日付。初期値には今日を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 耳掃除を実施したかどうかをチェック状態で保持する
    const [earscleaned, setEarscleaned] = useState(false);
    // 汚れや耳の状態を記録する自由入力メモ
    const [notes, setNotes] = useState("");

    // 入力内容を確認用ログへまとめ、送信完了を知らせる
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準のフォーム送信による再読み込みを止める
        e.preventDefault();
        // 日付、実施有無、メモをまとめて開発者ツールに出力する
        console.log({
            logDate,
            earscleaned,
            notes,
        });
        // 記録の送信操作が終わったことを利用者へ知らせる
        alert("耳掃除の記録を送信しました！");
    };

    // 戻るリンクと日付・実施状況・メモのフォームを配置する
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
                    <h1 className="text-3xl font-bold mb-6">👂 耳掃除</h1>
                    {/* 入力内容を送信処理へ渡す耳掃除記録フォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 耳掃除をした日付を指定する */}
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

                        {/* 耳掃除を実施した場合にチェックを付ける */}
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={earscleaned}
                                onChange={(e) => setEarscleaned(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">耳を掃除しました</span>
                        </label>

                        {/* 汚れの様子や気づいた点を補足する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="汚れの状態など気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した耳掃除記録を送信するボタン */}
                        <button
                            type="submit"
                            className="bg-amber-400 text-white p-3 rounded hover:bg-amber-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
