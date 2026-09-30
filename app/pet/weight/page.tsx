"use client";

import { useState } from "react";
import Link from "next/link";

export default function WeightPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // localStorageに保存
        const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        weightHistory.push({
            date: logDate,
            weight: parseFloat(weight),
        });
        localStorage.setItem("weightHistory", JSON.stringify(weightHistory));
        
        console.log({
            logDate,
            weight,
            notes,
        });
        alert("体重の記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">⚖️ 体重</h1>
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

                        <label className="flex flex-col">
                            体重（kg）
                            <input
                                type="number"
                                step="0.1"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="border p-2 rounded mt-2"
                                placeholder="例: 4.5"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="気づきがあれば入力してください"
                            />
                        </label>

                        <button
                            type="submit"
                            className="bg-purple-400 text-white p-3 rounded hover:bg-purple-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
