"use client";

// 入力値の変更に合わせて画面を更新するReactの機能
import { useState } from "react";
// ペット管理画面へ移動するリンク機能
import Link from "next/link";

// 日々の元気度を記録する入力画面を表示する
export default function EnergyPage() {
    // 記録日、元気度の選択、補足メモの入力値を管理する
    // 記録日をYYYY-MM-DD形式で保持し、初期値には今日の日付を入れる
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // 元気度の選択値を保持し、初期状態は「普通」にする
    const [energyLevel, setEnergyLevel] = useState("normal");
    // 利用者が自由に書く体調の補足メモを保持する
    const [notes, setNotes] = useState("");

    // 送信時にページ再読み込みを防ぎ、入力値を確認して完了を知らせる
    const handleSubmit = (e: React.FormEvent) => {
        // フォーム標準の送信動作による画面遷移を止める
        e.preventDefault();
        // 現在の入力値を開発者ツールで確認できるよう出力する
        console.log({
            logDate,
            energyLevel,
            notes,
        });
        // 利用者へ送信操作が受け付けられたことを知らせる
        alert("元気度の記録を送信しました！");
    };

    // ページの共通枠、戻るリンク、元気度記録フォームを組み立てる
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペット管理画面へ戻るためのリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-6">⚡ 元気度</h1>
                    {/* 送信時に上の処理を呼び出す入力フォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 記録対象の日付を選ぶ入力欄 */}
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
                            {/* 選択中の元気度だけにチェックを表示する */}
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
                            {/* 既定値として選ばれる「普通」の選択肢 */}
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
                            {/* 体調が優れないときに選ぶ項目 */}
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

                        {/* 食欲や行動など、選択肢にない気づきを記録する欄 */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="気づきがあれば入力してください"
                            />
                        </label>

                        {/* 入力した日付・元気度・メモを送信するボタン */}
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
