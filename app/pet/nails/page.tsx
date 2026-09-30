"use client";

import { useState } from "react";
import Link from "next/link";

export default function NailsPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [nailsCut, setNailsCut] = useState(false);
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            nailsCut,
            notes,
        });
        alert("爪切りの記録を送信しました！");
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-6">💅 爪切り</h1>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={nailsCut}
                                onChange={(e) => setNailsCut(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">爪を切りました</span>
                        </label>

                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="反応や気づきがあれば入力してください"
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-gray-400 text-white p-3 rounded hover:bg-gray-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>

                    <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400 mt-6">
                        <h2 className="font-semibold text-gray-700 mb-3">爪切りの目安</h2>
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
