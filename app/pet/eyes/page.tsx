"use client";

import { useState } from "react";
import Link from "next/link";

export default function EyesPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [eyeCleaned, setEyeCleaned] = useState(false);
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            eyeCleaned,
            notes,
        });
        alert("目やに掃除の記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">👁️ 目やに掃除</h1>
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
                                checked={eyeCleaned}
                                onChange={(e) => setEyeCleaned(e.target.checked)}
                                className="h-5 w-5"
                            />
                            <span className="font-semibold">目やにを掃除しました</span>
                        </label>

                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="目の状態など気づきがあれば入力してください"
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-indigo-400 text-white p-3 rounded hover:bg-indigo-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
