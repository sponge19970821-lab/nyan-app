"use client";

// 薬の入力値を画面の状態として保持するReact機能
import { useState } from "react";
// ペット管理画面へ戻るリンク機能
import Link from "next/link";

// 薬ごとの使用有無・頻度と当日のメモを入力する画面を表示する
export default function MedicinePage() {
    // その日の薬の記録に使う日付。初期値は今日
    const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
    // フィラリア予防薬を飲ませたかどうかと、その間隔
    const [filaria, setFilaria] = useState(false);
    const [filariaFrequency, setFilariaFrequency] = useState("1month");
    // 腎臓病サプリを与えたかどうかと、その間隔
    const [kidneySupple, setKidneySupple] = useState(false);
    const [kidneySuppFrequency, setKidneySuppFrequency] = useState("daily");
    // 抗生物質を与えたかどうかと、その間隔
    const [antibiotics, setAntibiotics] = useState(false);
    const [antibioticsFrequency, setAntibioticsFrequency] = useState("daily");
    // その他の薬の名前、使用有無、投与間隔
    const [otherMedicine, setOtherMedicine] = useState("");
    const [hasOtherMedicine, setHasOtherMedicine] = useState(false);
    const [otherFrequency, setOtherFrequency] = useState("daily");
    // 薬全体に関する補足メモ
    const [notes, setNotes] = useState("");

    // 日付・薬の使用状況・頻度・メモをまとめて送信する
    const handleSubmit = (e: React.FormEvent) => {
        // ページ再読み込みを伴うブラウザー標準動作を止める
        e.preventDefault();
        // 入力値一式を開発者ツールで確認できるよう出力する
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
        // 利用者へ送信操作が完了したことを知らせる
        alert("薬の記録を送信しました！");
    };

    // 薬のチェック状態に応じて頻度選択欄を表示する記録画面
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-2xl">
                {/* ペット管理画面へ戻るリンク */}
                <Link href="/pet">
                    <button className="mb-6 text-blue-500 hover:text-blue-700 font-semibold">
                        ← 戻る
                    </button>
                </Link>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-6">💊 薬の記録</h1>
                    {/* 日付、薬、頻度、メモを入力して送信するフォーム */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* 薬を与えた日を指定する */}
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

                        {/* 各薬の使用有無と、選択時だけ表示する頻度欄 */}
                        <div className="bg-red-50 p-4 rounded border-l-4 border-red-400 space-y-4">
                            {/* チェックするとフィラリア薬の投与間隔を選べる */}
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
                                        {/* 1・2・3か月ごとの投与間隔 */}
                                        <option value="1month">月1回</option>
                                        <option value="2month">2ヶ月ごと</option>
                                        <option value="3month">3ヶ月ごと</option>
                                    </select>
                                )}
                            </div>

                            {/* チェックすると腎臓病サプリの頻度を選べる */}
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
                                        {/* 毎日、週1回、月1回から頻度を選ぶ */}
                                        <option value="daily">毎日</option>
                                        <option value="weekly">週1回</option>
                                        <option value="1month">月1回</option>
                                    </select>
                                )}
                            </div>

                            {/* チェックすると抗生物質の投与頻度を選べる */}
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
                                        {/* 毎日、2日ごと、週1回、月1回から選択する */}
                                        <option value="daily">毎日</option>
                                        <option value="2days">2日ごと</option>
                                        <option value="weekly">週1回</option>
                                        <option value="1month">月1回</option>
                                    </select>
                                )}
                            </div>

                            {/* 入力済みの薬名がある場合は名前と頻度を表示する */}
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

                            {/* チェックで自由入力欄を表示し、解除時は薬名を消す */}
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

                        {/* 薬への反応や気づきを自由に記録する */}
                        <label className="flex flex-col">
                            メモ
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border p-2 rounded mt-2 min-h-[100px]"
                                placeholder="反応や気づきがあれば入力してください"
                            />
                        </label>

                        {/* 現在の薬の入力内容を送信する */}
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
