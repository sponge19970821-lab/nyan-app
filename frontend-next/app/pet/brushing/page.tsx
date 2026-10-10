"use client";

// フォームの入力値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るリンクを作る
import Link from "next/link";

// ブラッシングの実施状況を記録する画面を表示する
export default function BrushingPage() {
    // 記録対象の日付。初期値には今日を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // ブラッシングを実施したかどうかをチェック状態で保持する
    const [brushed, setBrushed] = useState(false);
    // 毛並みや毛玉などを記録する自由入力メモ
    const [notes, setNotes] = useState("");

    // 入力内容を確認用ログへまとめ、送信完了を知らせる
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準のフォーム送信による再読み込みを止める
        e.preventDefault();
        // 日付、実施有無、メモをまとめて開発者ツールに出力する
        console.log({
            logDate,
            brushed,
            notes,
        });
        // 記録の送信操作が終わったことを利用者へ知らせる
        alert("ブラッシングの記録を送信しました！");
    };

    // 戻るリンクと、日付・実施チェック・メモのフォームを表示する
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
                    <h1 className="text-3xl font-bold mb-6">🪮 ブラッシング</h1>
                    {/* 入力内容を送信処理へ渡すブラッシング記録フォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* ブラッシングをした日付を指定する */}
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

                        {/* 作業を実施した場合にチェックを付ける */}
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={brushed}
                                onChange={(e) => setBrushed(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">ブラッシングしました</span>
                        </label>

                        {/* 毛玉取りなど、実施内容の補足を書く */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="毛玉取りなど気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した記録を送信するボタン */}
                        <button
                            type="submit"
                            className="bg-green-400 text-white p-3 rounded hover:bg-green-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
