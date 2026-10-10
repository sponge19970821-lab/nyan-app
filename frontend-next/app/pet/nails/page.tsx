"use client";

// フォームの入力値をReactの状態として保持する
import { useState } from "react";
// ペット管理画面へ戻るリンクを作る
import Link from "next/link";

// 爪切りの実施状況を記録する画面を表示する
export default function NailsPage() {
    // 記録対象の日付。初期値には今日を設定する
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 爪切りを実施したかどうかをチェック状態で保持する
    const [nailsCut, setNailsCut] = useState(false);
    // 猫の反応や切った本数などを記録する自由入力メモ
    const [notes, setNotes] = useState("");

    // 入力内容を確認用ログへまとめ、送信完了を知らせる
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準のフォーム送信による再読み込みを止める
        e.preventDefault();
        // 日付、実施有無、メモをまとめて開発者ツールに出力する
        console.log({
            logDate,
            nailsCut,
            notes,
        });
        // 記録の送信操作が終わったことを利用者へ知らせる
        alert("爪切りの記録を送信しました！");
    };

    // 戻るリンク、記録フォーム、年齢別の爪切り目安を配置する
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
                    <h1 className="text-3xl font-bold mb-6">💅 爪切り</h1>
                    
                    {/* 入力内容を送信処理へ渡す爪切り記録フォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 爪を切った日付を指定する */}
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

                        {/* 爪切りを実施した場合にチェックを付ける */}
                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={nailsCut}
                                onChange={(e) => setNailsCut(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">爪を切りました</span>
                        </label>

                        {/* 猫の反応や気づいた点を補足する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="反応や気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した爪切り記録を送信するボタン */}
                        <button
                            type="submit"
                            className="bg-gray-400 text-white p-3 rounded hover:bg-gray-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>

                    {/* 猫の年齢に応じた爪切り間隔の目安を表示する */}
                    <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400 mt-6">
                        <h2 className="font-semibold text-gray-700 mb-3">爪切りの目安</h2>
                        {/* 子猫・成猫・シニア猫それぞれの推奨間隔を並べる */}
                        <div className="space-y-2 text-sm text-gray-600">
                            <div><span className="font-semibold">子猫（〜1歳）</span>：1〜2週間ごと</div>
                            <div><span className="font-semibold">成猫（1〜7歳）</span>：2〜4週間ごと（＝月1〜2回）</div>
                            <div><span className="font-semibold">シニア猫（7歳〜）</span>：2〜3週間ごと</div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
