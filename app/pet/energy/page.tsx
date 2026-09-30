"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnergyPage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [energyLevel, setEnergyLevel] = useState("normal");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            energyLevel,
            notes,
        });
        alert("元気度の記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">⚡ 元気度</h1>
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

                        <div className="flex flex-col">
                            <span className="font-semibold mb-3">元気度</span>
                            <label className="flex items-center gap-3 mb-2">
                                <input
                                    type="radio"
                                    name="energy"
                                    value="very"
                                    checked={energyLevel === "very"}
                                    onChange={(e) => setEnergyLevel(e.target.value)}
                                    className="h-5 w-5"
                                />
                                <span>非常に元気</span>
                            </label>
                            <label className="flex items-center gap-3 mb-2">
                                <input
                                    type="radio"
                                    name="energy"
                                    value="normal"
                                    checked={energyLevel === "normal"}
                                    onChange={(e) => setEnergyLevel(e.target.value)}
                                    className="h-5 w-5"
                                />
                                <span>普通</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="energy"
                                    value="low"
                                    checked={energyLevel === "low"}
                                    onChange={(e) => setEnergyLevel(e.target.value)}
                                    className="h-5 w-5"
                                />
                                <span>元気がない</span>
                            </label>
                        </div>

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
                            className="bg-yellow-400 text-white p-3 rounded hover:bg-yellow-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
