"use client";

import { useState } from "react";
import Link from "next/link";

export default function MedicinePage() {
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    const [filaria, setFilaria] = useState(false);
    const [filariaFrequency, setFilariaFrequency] = useState("1month");
    const [kidneySupple, setKidneySupple] = useState(false);
    const [kidneySuppFrequency, setKidneySuppFrequency] = useState("daily");
    const [antibiotics, setAntibiotics] = useState(false);
    const [antibioticsFrequency, setAntibioticsFrequency] = useState("daily");
    const [otherMedicine, setOtherMedicine] = useState("");
    const [hasOtherMedicine, setHasOtherMedicine] = useState(false);
    const [otherFrequency, setOtherFrequency] = useState("daily");
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            logDate,
            filaria,
            filariaFrequency,
            kidneySupple,
            kidneySuppFrequency,
            antibiotics,
            antibioticsFrequency,
            otherMedicine,
            hasOtherMedicine,
            otherFrequency,
            notes,
        });
        alert("薬の記録を送信しました！");
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
                    <h1 className="text-3xl font-bold mb-6">💊 薬の記録</h1>
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

                        <div className="bg-red-50 p-4 rounded border-l-4 border-red-400 space-y-4">
                            <div className="flex items-center gap-3 pb-3 border-b">
                                <input
                                    type="checkbox"
                                    checked={filaria}
                                    onChange={(e) => setFilaria(e.target.checked)}
                                    className="h-5 w-5"
                                />
                                <span className="font-semibold">フィラリア予防</span>
                                {filaria && (
                                    <select
                                        value={filariaFrequency}
                                        onChange={(e) => setFilariaFrequency(e.target.value)}
                                        className="border rounded p-1 ml-auto text-sm"
                                    >
                                        <option value="1month">月1回</option>
                                        <option value="2month">2ヶ月ごと</option>
                                        <option value="3month">3ヶ月ごと</option>
                                    </select>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pb-3 border-b">
                                <input
                                    type="checkbox"
                                    checked={kidneySupple}
                                    onChange={(e) => setKidneySupple(e.target.checked)}
                                    className="h-5 w-5"
                                />
                                <span className="font-semibold">腎臓病サプリ</span>
                                {kidneySupple && (
                                    <select
                                        value={kidneySuppFrequency}
                                        onChange={(e) => setKidneySuppFrequency(e.target.value)}
                                        className="border rounded p-1 ml-auto text-sm"
                                    >
                                        <option value="daily">毎日</option>
                                        <option value="weekly">週1回</option>
                                        <option value="1month">月1回</option>
                                    </select>
                                )}
                            </div>

                            <div className="flex items-center gap-3 pb-3 border-b">
                                <input
                                    type="checkbox"
                                    checked={antibiotics}
                                    onChange={(e) => setAntibiotics(e.target.checked)}
                                    className="h-5 w-5"
                                />
                                <span className="font-semibold">抗生物質</span>
                                {antibiotics && (
                                    <select
                                        value={antibioticsFrequency}
                                        onChange={(e) => setAntibioticsFrequency(e.target.value)}
                                        className="border rounded p-1 ml-auto text-sm"
                                    >
                                        <option value="daily">毎日</option>
                                        <option value="2days">2日ごと</option>
                                        <option value="weekly">週1回</option>
                                        <option value="1month">月1回</option>
                                    </select>
                                )}
                            </div>

                            {otherMedicine && (
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold">その他</span>
                                    <span className="text-sm bg-white px-2 py-1 rounded">{otherMedicine}</span>
                                    <select
                                        value={otherFrequency}
                                        onChange={(e) => setOtherFrequency(e.target.value)}
                                        className="border rounded p-1 ml-auto text-sm"
                                    >
                                        <option value="daily">毎日</option>
                                        <option value="weekly">週1回</option>
                                        <option value="1month">月1回</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    checked={hasOtherMedicine}
                                    onChange={(e) => {
                                        setHasOtherMedicine(e.target.checked);
                                        if (!e.target.checked) {
                                            setOtherMedicine("");
                                        }
                                    }}
                                    className="h-5 w-5"
                                />
                                <span className="font-semibold">その他の薬</span>
                                {hasOtherMedicine && (
                                    <>
                                        <input
                                            type="text"
                                            value={otherMedicine}
                                            onChange={(e) => setOtherMedicine(e.target.value)}
                                            className="border p-1 rounded flex-1"
                                            placeholder="例: 便秘薬、他のサプリなど"
                                        />
                                        <select
                                            value={otherFrequency}
                                            onChange={(e) => setOtherFrequency(e.target.value)}
                                            className="border rounded p-1 text-sm"
                                        >
                                            <option value="daily">毎日</option>
                                            <option value="weekly">週1回</option>
                                            <option value="1month">月1回</option>
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>

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
                            className="bg-red-400 text-white p-3 rounded hover:bg-red-500 font-semibold mt-4"
                        >
                            記録を保存する
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}
