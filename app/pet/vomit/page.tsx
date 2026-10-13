"use client";

// 入力欄の値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るためのリンクを読み込む
import Link from "next/link";

// 吐き戻しの有無と症状を記録する画面を表示する
export default function VomitPage() {
    // 記録日、吐き戻しの有無・回数、補足メモをそれぞれ保持する
    // 記録対象の日付。初期値には今日を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 吐き戻しがあった場合にチェックする
    const [hasVomited, setHasVomited] = useState(false);
    // 吐いた回数の入力値。チェック時だけ入力欄を表示する
    const [vomitCount, setVomitCount] = useState("");
    // 吐しゃ物の状態などを記録する補足メモ
    const [notes, setNotes] = useState("");

    // 入力内容を確認用ログへ出し、送信完了の通知を表示する
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準の送信によるページ再読み込みを防ぐ
        e.preventDefault();
        // 日付、発生有無、回数、メモをまとめて開発者ツールへ出力する
        console.log({
            logDate,
            hasVomited,
            vomitCount,
            notes,
        });
        // 現在の実装では通知を表示する。履歴への保存処理は行わない
        alert("吐き出しの記録を送信しました！");
    };

    // 発生チェックの状態に応じて回数欄を切り替える記録画面を組み立てる
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
                    <h1 className="text-3xl font-bold mb-6">🤢 吐き出し</h1>
                    {/* 入力内容を送信処理へ渡すフォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 吐き戻しが起きた日を指定する */}
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

                        {/* 吐き戻しの有無を切り替えるチェック欄 */}
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={hasVomited}
                                onChange={(e) => setHasVomited(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">吐きました</span>
                        </label>

                        {/* 発生した場合だけ回数入力欄を表示する */}
                        {hasVomited && (
                            <label className="flex flex-col">
                                吐いた回数
                                <input
                                    type="number"
                                    value={vomitCount}
                                    onChange={(e) => setVomitCount(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                    placeholder="例: 1"
                                    required
                                />
                            </label>
                        )}

                        {/* 吐いた内容や様子を補足するメモ欄 */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="症状など気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した症状記録を送信する */}
                        <button
                            type="submit"
                            className="bg-pink-400 text-white p-3 rounded hover:bg-pink-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
