"use client";

// 入力状態の管理と、初回表示時のデータ読み込みに使うReact機能
import { useState, useEffect } from "react";
// ペット管理画面へ戻るリンク機能
import Link from "next/link";

// フィラリア予防の予定日、投与履歴、通知を管理する画面を表示する
export default function FilariaPage() {
    // 次回投与予定日の入力値
    const [nextDoseDate, setNextDoseDate] = useState("");
    // 端末内に保存されている投与日履歴
    const [dosageHistory, setDosageHistory] = useState<{ date: string }[]>([]);
    // 期限が来たときに注意メッセージを出すかどうか
    const [showReminder, setShowReminder] = useState(false);

    // 保存済みの予定・履歴を復元し、期限を確認する
    useEffect(() => {
        // 以前保存した投与履歴を読み込む
        const saved = localStorage.getItem("filariaDosageHistory");
        if (saved) {
            // JSON文字列を履歴配列へ戻して画面に反映する
            setDosageHistory(JSON.parse(saved));
        }

        // 前回設定された次回投与日を読み込む
        const saved_next = localStorage.getItem("filariaNexDoseDate");
        if (saved_next) {
            setNextDoseDate(saved_next);
        }

        // ページロード時にリマインダーをチェック
        checkReminder();
    }, []);

    // 予定日が今日または過去なら画面通知を表示する
    const checkReminder = () => {
        // 保存領域に次回予定がなければ期限判定を行わない
        const nextDate = localStorage.getItem("filariaNexDoseDate");
        if (nextDate) {
            // 保存文字列を日付へ変換し、今日と比較できるようにする
            const next = new Date(nextDate);
            const today = new Date();
            // 時刻の差を除き、日付だけで期限を比較する
            today.setHours(0, 0, 0, 0);
            next.setHours(0, 0, 0, 0);

            // 予定日当日は画面警告を出し、許可済みならブラウザー通知も送る
            if (next.getTime() === today.getTime()) {
                setShowReminder(true);
                // ブラウザ通知
                if ("Notification" in window && Notification.permission === "granted") {
                    new Notification("🐱 フィラリア予防の日です！", {
                        body: "今日はフィラリア予防薬を投与してください",
                        icon: "/file.svg",
                    });
                }
            // 予定日を過ぎている場合も未対応の通知として表示する
            } else if (next.getTime() < today.getTime()) {
                setShowReminder(true);
            }
        }
    };

    // 投与実績を履歴へ保存し、次回予定を1か月後へ更新する
    const handleAddDose = (e: React.FormEvent) => {
        // ボタン送信によるページ再読み込みを防ぐ
        e.preventDefault();
        // 次回日が未設定の場合は投与記録を作成しない
        if (!nextDoseDate) return;

        // 今日の日付で新しい投与実績を作る
        const today = new Date().toISOString().slice(0, 10);
        const newHistory = [...dosageHistory, { date: today }];
        // 更新後の履歴を画面状態と端末内保存の両方へ反映する
        setDosageHistory(newHistory);
        localStorage.setItem("filariaDosageHistory", JSON.stringify(newHistory));

        // 現在の予定日から1か月後の日付を次の予定として計算する
        const nextDate = new Date(nextDoseDate);
        nextDate.setMonth(nextDate.getMonth() + 1);
        const nextDateStr = nextDate.toISOString().slice(0, 10);
        // 次回予定日を画面と端末内保存へ反映し、通知を閉じる
        setNextDoseDate(nextDateStr);
        localStorage.setItem("filariaNexDoseDate", nextDateStr);

        setShowReminder(false);
        alert("フィラリア予防薬を投与しました！");
    };

    // 入力された次回投与日を保存する
    const handleSetNextDate = (e: React.FormEvent) => {
        // フォーム送信でページが再読み込みされないようにする
        e.preventDefault();
        // 日付が空なら何も保存しない
        if (!nextDoseDate) return;

        // 入力値を次回予定として端末内へ保存する
        localStorage.setItem("filariaNexDoseDate", nextDoseDate);
        alert("次回投与日を設定しました！");
    };

    // ブラウザー通知が未設定なら利用者へ許可を求める
    const handleNotificationPermission = () => {
        // ブラウザーが通知機能を持つ場合だけ許可状態を確認する
        if ("Notification" in window) {
            // すでに許可されていれば状態を利用者へ知らせる
            if (Notification.permission === "granted") {
                alert("通知はすでに有効です");
            // 拒否済みでなければ許可ダイアログを表示する
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }
    };

    // 今日と次回投与日の差を日数で計算する
    const calculateDaysUntilNext = () => {
        // 予定日がなければ残り日数を計算できない
        if (!nextDoseDate) return null;
        // 予定日と今日の日付を用意し、時刻を切り捨てる
        const next = new Date(nextDoseDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        next.setHours(0, 0, 0, 0);
        // ミリ秒差を1日の長さで割り、日数を返す
        const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    // 表示に使う残り日数を一度計算しておく
    const daysUntil = calculateDaysUntilNext();

    // 次回予定、投与操作、通知設定、履歴を画面に配置する
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペット管理画面へ戻るリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <div className="space-y-6">
                    {/* 予定日当日または期限超過時に注意メッセージを表示する */}
                    {showReminder && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
                            <p className="font-bold text-yellow-800">⚠️ リマインダー</p>
                            <p className="text-yellow-700">フィラリア予防薬を投与する時期です！</p>
                        </div>
                    )}

                    <section className="bg-white p-6 rounded-lg shadow">
                        <h1 className="text-3xl font-bold mb-6">💉 フィラリア予防管理</h1>

                        {/* 次回予定日と今日からの日数を、日付がある場合だけ表示する */}
                        {nextDoseDate && daysUntil !== null && (
                            <div className="bg-blue-50 p-4 rounded mb-6 border-2 border-blue-400">
                                <p className="text-sm text-blue-600">次回投与予定日</p>
                                <p className="text-2xl font-bold text-blue-800">{nextDoseDate}</p>
                                <p className="text-sm text-blue-600 mt-2">
                                    あと{daysUntil === 0 ? "今日です！" : `${daysUntil}日`}
                                </p>
                            </div>
                        )}

                        {/* 次回投与日を入力して保存するフォーム */}
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

                        {/* 予定日が設定済みの場合だけ投与済みボタンを表示する */}
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

                        {/* ブラウザー通知の許可状態を確認・設定する */}
                        <button
                            onClick={handleNotificationPermission}
                            className="w-full bg-purple-400 text-white p-3 rounded hover:bg-purple-500 font-semibold mb-6"
                        >
                            🔔 リマインダー通知を有効にする
                        </button>
                    </section>

                    {/* 投与履歴がある場合は新しい日付から一覧表示する */}
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
