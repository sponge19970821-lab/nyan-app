"use client";

import { useState } from "react";
import Link from "next/link";

export default function BrushingPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [brushed, setBrushed] = useState(false);
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            brushed,
            notes,
        });
        alert("ブラッシングの記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">🪮 ブラッシング</h1>
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
                                checked={brushed}
                                onChange={(e) => setBrushed(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">ブラッシングしました</span>
                        </label>

                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="毛玉取りなど気づきがあれば入力してください"
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
        </main>
    );
}
