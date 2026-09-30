"use client";

import { useState } from "react";
import Link from "next/link";

export default function ToiletPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [poopCount, setPoopCount] = useState("");
    const [peeCount, setPeeCount] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            poopCount,
            peeCount,
            notes,
        });
        alert("排泄の記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">🚽 排泄の記録</h1>
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

                        <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400 space-y-3">
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

                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="体調や気づきがあれば入力してください"
                            />
                        </label>

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
