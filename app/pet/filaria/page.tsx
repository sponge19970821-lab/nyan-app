"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FilariaPage() {
    const [nextDoseDate, setNextDoseDate] = useState("");
    const [dosageHistory, setDosageHistory] = useState<{ date: string }[]>([]);
    const [showReminder, setShowReminder] = useState(false);

    useEffect(() => {
        // ローカルストレージから履歴を読み込む
        const saved = localStorage.getItem("filariaDosageHistory");
        if (saved) {
            setDosageHistory(JSON.parse(saved));
        }

        const saved_next = localStorage.getItem("filariaNexDoseDate");
        if (saved_next) {
            setNextDoseDate(saved_next);
        }

        // ページロード時にリマインダーをチェック
        checkReminder();
    }, []);

    const checkReminder = () => {
        const nextDate = localStorage.getItem("filariaNexDoseDate");
        if (nextDate) {
            const next = new Date(nextDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            next.setHours(0, 0, 0, 0);

            if (next.getTime() === today.getTime()) {
                setShowReminder(true);
                // ブラウザ通知
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("🐱 フィラリア予防の日です！", {
                        body: "今日はフィラリア予防薬を投与してください",
                        icon: "/file.svg",
                    });
                }
            } else if (next.getTime() < today.getTime()) {
                setShowReminder(true);
            }
        }
    };

    const handleAddDose = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nextDoseDate) return;

        const today = new Date().toISOString().slice(0, 10);
        const newHistory = [...dosageHistory, { date: today }];
        setDosageHistory(newHistory);
        localStorage.setItem("filariaDosageHistory", JSON.stringify(newHistory));

        // 次回投与日を1ヶ月後に設定
        const nextDate = new Date(nextDoseDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        const nextDateStr = nextDate.toISOString().slice(0, 10);
        setNextDoseDate(nextDateStr);
        localStorage.setItem("filariaNexDoseDate", nextDateStr);

        setShowReminder(false);
        alert("フィラリア予防薬を投与しました！");
    };

    const handleSetNextDate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nextDoseDate) return;

        localStorage.setItem("filariaNexDoseDate", nextDoseDate);
        alert("次回投与日を設定しました！");
    };

    const handleNotificationPermission = () => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                alert("通知はすでに有効です");
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    };

    const calculateDaysUntilNext = () => {
        if (!nextDoseDate) return null;
        const next = new Date(nextDoseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        next.setHours(0, 0, 0, 0);
        const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const daysUntil = calculateDaysUntilNext();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <div className="space-y-6">
                    {showReminder && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="font-bold text-yellow-800">⚠️ リマインダー</p>
                            <p className="text-yellow-700">フィラリア予防薬を投与する時期です！</p>
                        </div>
                    )}

                    <section className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-3xl font-bold mb-6">💉 フィラリア予防管理</h1>

                        {nextDoseDate && daysUntil !== null && (
                            <div className="bg-blue-50 p-4 rounded mb-6 border-2 border-blue-400">
                                <p className="text-sm text-blue-600">次回投与予定日</p>
                                <p className="text-2xl font-bold text-blue-800">{nextDoseDate}</p>
                                <p className="text-sm text-blue-600 mt-2">
                                    あと{daysUntil === 0 ? "今日です！" : `${daysUntil}日`}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSetNextDate} className="flex flex-col gap-4 mb-6">
                            <label className="flex flex-col">
                                次回投与予定日を設定
                                <input
                                    type="date"
                                    value={nextDoseDate}
                                    onChange={(e) => setNextDoseDate(e.target.value)}
                                    className="border p-2 rounded mt-2"
                                />
                            </label>
                            <button
                                type="submit"
                                className="bg-blue-400 text-white p-3 rounded hover:bg-blue-500 font-semibold"
                            >
                                予定日を設定
                            </button>
                        </form>

                        {nextDoseDate && (
                            <form onSubmit={handleAddDose} className="mb-6">
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600 font-semibold"
                                >
                                    ✓ 投与しました
                                </button>
                            </form>
                        )}

                        <button
                            onClick={handleNotificationPermission}
                            className="w-full bg-purple-400 text-white p-3 rounded hover:bg-purple-500 font-semibold mb-6"
                        >
                            🔔 リマインダー通知を有効にする
                        </button>
                    </section>

                    {dosageHistory.length > 0 && (
                        <section className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-bold mb-4">投与履歴</h2>
                            <div className="space-y-2">
                                {dosageHistory.slice().reverse().map((record, idx) => (
                                    <div key={idx} className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                                        <p className="font-semibold text-green-800">{record.date}</p>
                                        <p className="text-sm text-green-600">✓ 投与済み</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}
