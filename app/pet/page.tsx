"use client";

// React の状態管理と副作用を使うためのimport
import { useState, useEffect } from "react";
// 別ページへのリンクを作るためのimport
import Link from "next/link";
// 折れ線グラフを表示するためのライブラリ
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// ペットのプロフィールページ全体を定義するコンポーネント
export default function PetForm() {
    // ペットの名前を管理するstate
    const [name, setName] = useState("");
    // ペットの生年月日を管理するstate
    const [birthday, setBirthday] = useState("");
    // ペットの種類を管理するstate
    const [species, setSpecies] = useState("");
    // 性別を管理するstate
    const [gender, setGender] = useState("オス");
    // 体重を管理するstate
    const [weight, setWeight] = useState("");
    // 去勢の有無を管理するstate（初期値は済み）
    const [neutered, setNeutered] = useState("yes");
    // 画像のURLを保存するstate
    const [image, setImage] = useState<string | null>(null);
    // 画像ファイル本体を保持するstate
    const [imageFile, setImageFile] = useState<File | null>(null);
    // フィラリア予防の次回投薬予定日を保存するstate
    const [nextFilariaDate, setNextFilariaDate] = useState("");
    // グラフで使う体重・ご飯のデータ配列を保存するstate
    const [graphData, setGraphData] = useState<any[]>([]);
    // ご飯の記録を保存しておくstate
    const [foodHistory, setFoodHistory] = useState<any[]>([]);
    // 現在表示中の月を保持するstate
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // 薬の名前を管理するstate
    const [medicineName, setMedicineName] = useState("");
    // 薬のリマインダー間隔を管理するstate
    const [medicineInterval, setMedicineInterval] = useState("monthly");
    // 薬を飲ませた日を管理するstate
    const [medicineLastGivenDate, setMedicineLastGivenDate] = useState("");
    // 薬の次回予定日を管理するstate
    const [medicineReminderDate, setMedicineReminderDate] = useState("");
    // 体重測定日を管理するstate
    const [weightRecordDate, setWeightRecordDate] = useState("");
    // 体重の数値を管理するstate
    const [weightRecordValue, setWeightRecordValue] = useState("");
    // 爪切りのリマインダー間隔を管理するstate
    const [nailsReminderDays, setNailsReminderDays] = useState("14");
    // 耳掃除のリマインダー間隔を管理するstate
    const [earsReminderDays, setEarsReminderDays] = useState("30");
    // 装飾の初期描画とマウント状態を揃えるためのstate
    const [isHydrated, setIsHydrated] = useState(false);
    // 項目ごとの日付入力値を管理するstate
    const [recordDateMap, setRecordDateMap] = useState<Record<string, string>>({});
    // 項目ごとのメモを保存するstate
    const [memoMap, setMemoMap] = useState<Record<string, string>>({});
    // チェック状態の変更時に再描画させるためのstate
    const [, setRefreshTick] = useState(0);

    // 画面が最初に表示されたときに、保存されたデータを読み込む処理
    useEffect(() => {
        setIsHydrated(true);

        // フィラリア予防の日付が保存されていれば、表示用にセットする
        const savedDate = localStorage.getItem("filariaNexDoseDate");
        // 保存された日付があれば、画面に表示する
        if (savedDate) {
            // 保存されていた日付をstateに入れて画面へ反映する
            setNextFilariaDate(savedDate);
        }

        // グラフ用に体重とご飯の履歴をlocalStorageから読み込む
        const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        // ご飯の履歴もlocalStorageから読み込む
        const foodHistoryData = JSON.parse(localStorage.getItem("foodHistory") || "[]");
        // ご飯履歴をstateに入れて、カレンダーとグラフで使えるようにする
        setFoodHistory(foodHistoryData);

        const memoKeys = [...new Set([...quickRecordItems, ...foodStatusItems, ...toiletStatusItems].map((item) => item.storageKey))];
        const loadedMemos: Record<string, string> = {};
        memoKeys.forEach((key) => {
            const savedMemo = localStorage.getItem(`${key}Memo`);
            if (savedMemo) {
                loadedMemos[key] = savedMemo;
            }
        });
        setMemoMap(loadedMemos);
        
        // 日付ごとに体重と食事量をまとめて、グラフ表示用のデータに整える
        const dateMap = new Map();
        
        // 体重の記録を日付ごとにまとめる
        weightHistory.forEach((entry: any) => {
            // その日付のデータがまだなければ、新しいオブジェクトを作る
            if (!dateMap.has(entry.date)) {
                dateMap.set(entry.date, { date: entry.date });
            }
            // その日の体重をセットする
            dateMap.get(entry.date).weight = entry.weight;
        });
        
        // ご飯の記録も同じ日付ごとにまとめる
        foodHistoryData.forEach((entry: any) => {
            // その日付のデータがまだなければ、新しいオブジェクトを作る
            if (!dateMap.has(entry.date)) {
                dateMap.set(entry.date, { date: entry.date });
            }
            // その日のご飯量をセットする
            dateMap.get(entry.date).food = entry.amount;
        });
        
        // 日付順に並び替えて、グラフに表示できる形にする
        const data = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));
        // グラフ用データをstateに入れる
        setGraphData(data);
    }, []);

    // 日付を YYYY-MM-DD の形式にそろえて、localStorage と比較しやすくする関数
    const formatDateKey = (date: Date) => {
        // 西暦を取得する
        const year = date.getFullYear();
        // 月を2桁に整える（例: 9 → 09）
        const month = String(date.getMonth() + 1).padStart(2, "0");
        // 日を2桁に整える（例: 3 → 03）
        const day = String(date.getDate()).padStart(2, "0");
        // 例: 2026-09-28 のような文字列を返す
        return `${year}-${month}-${day}`;
    };

    // 日付に何日か足した日を返す関数
    const addDays = (date: Date, days: number) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate;
    };

    // 項目ごとのリマインド間隔を管理するマップ
    const reminderDaysMap: Record<string, number> = {
        foodHistory: 1,
        toiletHistory: 1,
        medicineHistory: 7,
        energyHistory: 1,
        weightHistory: 7,
        vomitHistory: 1,
        nailsHistory: 14,
        earsHistory: 30,
        eyesHistory: 7,
        brushingHistory: 2,
        teethHistory: 2,
    };

    // その月のカレンダーに表示する日付を計算する関数
    const getCalendarDays = () => {
        // 今表示中の年と月を取得する
        const year = currentMonth.getFullYear();
        // 今月の0から始まる月番号を取得する
        const month = currentMonth.getMonth();
        // その月の1日を作る
        const firstDay = new Date(year, month, 1);
        // その月のカレンダーを日曜始まりにするため、前月の余白を計算する
        const startDay = new Date(firstDay);
        // 最初の日が何曜日かを使って、前月の日付を埋める
        startDay.setDate(firstDay.getDate() - firstDay.getDay());

        // 42マス分の日付を作って、週ごとの表を作りやすくする
        const days: Date[] = [];
        // 42日分を順番に足して、カレンダーの枠を作る
        for (let i = 0; i < 42; i++) {
            // 今の開始日から1日ずつ増やして日付を作る
            const day = new Date(startDay);
            // 日付を足して1日ごとに進める
            day.setDate(startDay.getDate() + i);
            // 作った日付を配列に入れる
            days.push(day);
        }
        // 42日分の配列を返す
        return days;
    };

    // 1か月分の日付を作成しておく
    const calendarDays = getCalendarDays();

    // 今日の日付を YYYY-MM-DD 形式で取得する
    const todayKey = formatDateKey(new Date());

    // 毎日の記録アイテムを一元管理する配列
    // reminder: 次にやる日時を設定する項目
    // log: その日の出来事を記録する項目
    const quickRecordItems = [
        { label: "ごはん", icon: "🍽️", color: "bg-orange-400", storageKey: "foodHistory", type: "reminder", reminderDays: 1 },
        { label: "トイレ", icon: "🚽", color: "bg-blue-400", storageKey: "toiletHistory", type: "log" },
        { label: "薬", icon: "💊", color: "bg-red-400", storageKey: "medicineHistory", type: "log" },
        { label: "元気度", icon: "⚡", color: "bg-yellow-400", storageKey: "energyHistory", type: "reminder", reminderDays: 1 },
        { label: "体重", icon: "⚖️", color: "bg-purple-400", storageKey: "weightHistory", type: "reminder", reminderDays: 7 },
        { label: "爪切り", icon: "💅", color: "bg-gray-400", storageKey: "nailsHistory", type: "reminder", reminderDays: 14 },
        { label: "耳掃除", icon: "👂", color: "bg-amber-400", storageKey: "earsHistory", type: "reminder", reminderDays: 30 },
        { label: "目やに掃除", icon: "👁️", color: "bg-indigo-400", storageKey: "eyesHistory", type: "reminder", reminderDays: 7 },
        { label: "ブラッシング", icon: "🪮", color: "bg-green-400", storageKey: "brushingHistory", type: "reminder", reminderDays: 2 },
        { label: "歯磨き", icon: "🦷", color: "bg-teal-400", storageKey: "teethHistory", type: "reminder", reminderDays: 2 },
        { label: "お風呂", icon: "🛁", color: "bg-sky-400", storageKey: "bathHistory", type: "reminder", reminderDays: 7 },
    ];

    const foodStatusItems = [
        { label: "食欲旺盛", icon: "😺", color: "bg-amber-500", storageKey: "appetiteGoodHistory", type: "log" },
        { label: "食欲なさそう", icon: "😿", color: "bg-slate-500", storageKey: "appetiteLowHistory", type: "log" },
        { label: "吐き戻し", icon: "🤢", color: "bg-pink-400", storageKey: "vomitHistory", type: "log" },
    ];

    const toiletStatusItems = [
        { label: "快便", icon: "✅", color: "bg-emerald-400", storageKey: "normalPoopHistory", type: "log" },
        { label: "ゆるめ", icon: "🫠", color: "bg-cyan-400", storageKey: "looseStoolHistory", type: "log" },
        { label: "排便なし", icon: "🚫", color: "bg-slate-400", storageKey: "noPoopHistory", type: "log" },
        { label: "排尿なし", icon: "💧", color: "bg-indigo-400", storageKey: "noUrineHistory", type: "log" },
    ];

    const calendarItems = [...quickRecordItems, ...foodStatusItems, ...toiletStatusItems];
    const allTrackableItems = [...quickRecordItems, ...foodStatusItems, ...toiletStatusItems];

    const getTrackableItem = (storageKey: string) => {
        return allTrackableItems.find((entry) => entry.storageKey === storageKey);
    };

    // カレンダー上で「完了済み」と「リマインダー」を区別するための状態を返す
    const getCalendarIconState = (dateKey: string, item: (typeof calendarItems)[number]) => {
        if (typeof window === "undefined") {
            return "none";
        }

        const stored = JSON.parse(localStorage.getItem(item.storageKey) || "[]");

        if (item.type === "log") {
            return stored.some((entry: any) => entry.date === dateKey) ? "done" : "none";
        }

        const isCompleted = stored.some((entry: any) => entry.date === dateKey);
        const isReminder = stored.some((entry: any) => entry.dueDate === dateKey && entry.date !== dateKey);

        if (isCompleted) {
            return "done";
        }
        if (isReminder) {
            return "reminder";
        }
        return "none";
    };

    // 項目ごとの選択日付を返す関数
    const getSelectedDate = (storageKey: string) => {
        return recordDateMap[storageKey] || todayKey;
    };

    // その日付に対して指定した記録や予定が存在するかを返す関数
    const hasRecordOnDate = (dateKey: string, storageKey: string) => {
        if (typeof window === "undefined") {
            return false;
        }

        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const item = getTrackableItem(storageKey);

        if (!item) {
            return false;
        }

        if (item.type === "log") {
            return stored.some((entry: any) => entry.date === dateKey);
        }

        return stored.some((entry: any) => entry.dueDate === dateKey);
    };

    // アイコンボタンを押したときに、予定か記録のどちらかをセットする関数
    const toggleQuickRecord = (storageKey: string) => {
        const item = getTrackableItem(storageKey);
        if (!item) {
            return;
        }

        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const selectedDate = getSelectedDate(storageKey);

        if (item.type === "log") {
            const exists = stored.some((entry: any) => entry.date === selectedDate);
            const updated = exists
                ? stored.filter((entry: any) => entry.date !== selectedDate)
                : [...stored, { date: selectedDate, checked: true }];

            localStorage.setItem(storageKey, JSON.stringify(updated));
            if (storageKey === "foodHistory") {
                setFoodHistory(updated);
            }
            setRefreshTick((value) => value + 1);
            return;
        }

        const exists = stored.some((entry: any) => entry.date === selectedDate);
        if (exists) {
            const updated = stored.filter((entry: any) => entry.date !== selectedDate);
            localStorage.setItem(storageKey, JSON.stringify(updated));
            setRefreshTick((value) => value + 1);
            return;
        }

        const reminderDays = (() => {
            if (storageKey === "nailsHistory") {
                return Number(nailsReminderDays);
            }
            if (storageKey === "earsHistory") {
                return Number(earsReminderDays);
            }
            if ("reminderDays" in item) {
                return Number(item.reminderDays ?? 1);
            }
            return 1;
        })();
        const reminderDate = formatDateKey(addDays(new Date(selectedDate), reminderDays));
        const updated = [...stored, { date: selectedDate, dueDate: reminderDate, checked: true }];
        localStorage.setItem(storageKey, JSON.stringify(updated));

        if (storageKey === "foodHistory") {
            setFoodHistory(updated);
        }
        setRefreshTick((value) => value + 1);
    };

    // その項目が今日の対象かどうかを返す関数
    const hasTodayRecord = (storageKey: string) => {
        const item = getTrackableItem(storageKey);
        if (!item || !isHydrated || typeof window === "undefined") {
            return false;
        }

        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const selectedDate = getSelectedDate(storageKey);
        return stored.some((entry: any) => entry.date === selectedDate);
    };

    // 薬のリマインダー日を計算する関数
    const getMedicineReminderDate = (lastGivenDate: string, interval: string, customDate?: string) => {
        if (customDate) {
            return customDate;
        }

        const baseDate = lastGivenDate ? new Date(lastGivenDate) : new Date();
        const nextDate = new Date(baseDate);

        switch (interval) {
            case "daily":
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case "weekly":
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case "monthly":
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            default:
                nextDate.setDate(nextDate.getDate() + 30);
        }

        return formatDateKey(nextDate);
    };

    // 薬のリマインダーを保存する関数
    const saveMedicineReminder = () => {
        if (typeof window === "undefined") {
            return;
        }

        const name = medicineName.trim() || "薬";
        const lastGivenDate = medicineLastGivenDate || todayKey;
        const nextDate = getMedicineReminderDate(lastGivenDate, medicineInterval, medicineReminderDate || undefined);
        const stored = JSON.parse(localStorage.getItem("medicineHistory") || "[]");
        const updated = [
            ...stored,
            {
                date: todayKey,
                dueDate: nextDate,
                givenDate: lastGivenDate,
                name,
                interval: medicineInterval,
                customDate: medicineReminderDate || "",
                checked: true,
            },
        ];

        localStorage.setItem("medicineHistory", JSON.stringify(updated));
        setMedicineName("");
        setMedicineLastGivenDate("");
        setMedicineReminderDate("");
    };

    // 体重測定の記録を保存する関数
    const saveWeightRecord = () => {
        if (typeof window === "undefined") {
            return;
        }

        const value = Number(weightRecordValue);
        if (!weightRecordDate || Number.isNaN(value)) {
            return;
        }

        const stored = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        const updated = [
            ...stored,
            {
                date: weightRecordDate,
                weight: value,
                checked: true,
            },
        ];

        localStorage.setItem("weightHistory", JSON.stringify(updated));
        setWeightRecordDate("");
        setWeightRecordValue("");
        setWeight(String(value));
    };

    // リマインダー一覧で表示する状態文字列を返す関数
    const getReminderValue = (item: (typeof quickRecordItems)[number]) => {
        if (typeof window === "undefined") {
            return "未設定";
        }

        const stored = JSON.parse(localStorage.getItem(item.storageKey) || "[]");
        if (item.type === "log") {
            const latest = [...stored].reverse().find((entry: any) => entry.date);
            return latest ? latest.date : "未記録";
        }

        const latest = [...stored].reverse().find((entry: any) => entry.dueDate);
        return latest ? latest.dueDate : "未設定";
    };

    // 項目ごとのメモを保存する関数
    const saveMemo = (storageKey: string, value: string) => {
        if (typeof window === "undefined") {
            return;
        }

        const nextMap = { ...memoMap, [storageKey]: value };
        setMemoMap(nextMap);
        if (value.trim() === "") {
            localStorage.removeItem(`${storageKey}Memo`);
            return;
        }
        localStorage.setItem(`${storageKey}Memo`, value);
    };

    // 写真選択時に、画像ファイルを読んでデータURLとして保存する関数
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 選択されたファイルを取り出す
        const file = e.target.files?.[0];
        // ファイルがある場合だけ処理を続ける
        if (file) {
            // 画像ファイル本体をstateに保存する
            setImageFile(file);
            // ファイルを読み込むためのReaderを作る
            const reader = new FileReader();
            // 読み込みが終わったあとに画像URLをstateに入れる
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            // 画像ファイルをデータURLとして読む
            reader.readAsDataURL(file);
        }
    };

    // フォームを送信したときの処理
    const handleSubmit = (e: React.FormEvent) => {
        // 画面の再読み込みを防ぐ
        e.preventDefault();
        // デバッグ用に入力値をコンソールに出す
        console.log({
            name,
            birthday,
            species,
            gender,
            weight,
            neutered,
            image,
        });
        // 保存完了のアラートを出す
        alert("ペットのプロフィールを保存しました！");
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
            <div className="w-full max-w-3xl space-y-10">
                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-4">🐾 ペットプロフィール</h1>

                    <div className="mb-6 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 p-4 border border-pink-200 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-sm">
                                {image ? <img src={image} alt="ペット写真" className="h-full w-full rounded-full object-cover" /> : "🐾"}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Profile</p>
                                <h2 className="text-2xl font-bold text-slate-800">{name || "名前未設定"}</h2>
                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                                    <span className="rounded-full bg-white px-2 py-1">{birthday ? `生年月日: ${birthday}` : "生年月日未入力"}</span>
                                    <span className="rounded-full bg-white px-2 py-1">{species ? `種類: ${species}` : "種類未入力"}</span>
                                    <span className="rounded-full bg-white px-2 py-1">{gender ? `性別: ${gender}` : "性別未入力"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                            <label className="flex flex-col items-center cursor-pointer">
                                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {image ? (
                                        <img src={image} alt="ペット写真" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">📸</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <span className="text-sm text-blue-500 hover:text-blue-700 mt-2 font-semibold">
                                    写真を登録
                                </span>
                            </label>
                        </div>

                        <label className="flex flex-col">
                            名前
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="border p-2 rounded mt-2"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            生年月日
                            <input
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                className="border p-2 rounded mt-2"
                                required
                            />
                        </label>

                        <div className="flex flex-col">
                            <span className="font-semibold mb-2">性別</span>
                            <div className="flex gap-4">
                                {['オス', 'メス'].map((option) => (
                                    <label key={option} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={option}
                                            checked={gender === option}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="h-4 w-4"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <label className="flex flex-col">
                            種類（猫種）
                            <input
                                type="text"
                                value={species}
                                onChange={(e) => setSpecies(e.target.value)}
                                className="border p-2 rounded mt-2"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            体重（kg）
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="border p-2 rounded mt-2"
                                required
                            />
                        </label>

                        <div className="flex flex-col">
                            <span className="font-semibold mb-3">去勢・避妊</span>
                            <label className="flex items-center gap-3 mb-2">
                                <input
                                    type="radio"
                                    name="neutered"
                                    value="yes"
                                    checked={neutered === "yes"}
                                    onChange={(e) => setNeutered(e.target.value)}
                                    className="h-5 w-5"
                                />
                                <span>済み</span>
                            </label>
                            <label className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="neutered"
                                    value="no"
                                    checked={neutered === "no"}
                                    onChange={(e) => setNeutered(e.target.value)}
                                    className="h-5 w-5"
                                />
                                <span>未処置</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                        >
                            保存する
                        </button>
                    </form>
                </section>

                {graphData.length > 0 && (
                    <section className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">📊 グラフ</h2>
                        <div className="w-full overflow-x-auto">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={graphData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date" 
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis yAxisId="left" label={{ value: "体重（kg）", angle: -90, position: "insideLeft" }} />
                                    <YAxis yAxisId="right" orientation="right" label={{ value: "ご飯（g）", angle: 90, position: "insideRight" }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line 
                                        yAxisId="left"
                                        type="monotone" 
                                        dataKey="weight" 
                                        stroke="#a855f7" 
                                        name="体重（kg）"
                                        connectNulls={true}
                                    />
                                    <Line 
                                        yAxisId="right"
                                        type="monotone" 
                                        dataKey="food" 
                                        stroke="#f97316" 
                                        name="ご飯（g）"
                                        connectNulls={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                )}

                <section className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">📅 カレンダー</h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                                className="px-3 py-1 border rounded"
                            >
                                ←
                            </button>
                            <span className="px-3 py-1 font-semibold">
                                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="px-3 py-1 border rounded"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                            <div key={day} className="font-semibold text-sm py-2">
                                {day}
                            </div>
                        ))}

                        {calendarDays.map((date) => {
                            const key = formatDateKey(date);
                            const dayIcons = calendarItems
                                .filter((item) => item.label !== "元気度")
                                .map((item) => {
                                    const state = getCalendarIconState(key, item);
                                    if (state === "none") {
                                        return null;
                                    }

                                    return {
                                        icon: item.icon,
                                        color: item.color,
                                        state,
                                    };
                                })
                                .filter(Boolean) as { icon: string; color: string; state: "done" | "reminder" }[];
                            const visibleIcons = dayIcons.slice(0, 3);
                            const extraCount = Math.max(0, dayIcons.length - visibleIcons.length);

                            return (
                                <div
                                    key={key}
                                    className={`h-28 border rounded p-2 ${
                                        date.getMonth() !== currentMonth.getMonth()
                                            ? "bg-gray-100 text-gray-400"
                                            : "bg-white"
                                    }`}
                                >
                                    <div className="text-left text-[11px] font-medium leading-none">{date.getDate()}</div>
                                    <div className="mt-3 flex min-h-[3rem] flex-col items-center justify-start gap-1.5">
                                        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[12px]">
                                            {visibleIcons.length > 0 ? (
                                                visibleIcons.map((item, index) => (
                                                    <span
                                                        key={`${key}-${item.icon}-${index}`}
                                                        title={item.state === "reminder" ? "リマインダー" : "完了済み"}
                                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[14px] leading-none shadow-sm border ${
                                                            item.state === "reminder"
                                                                ? "border-2 border-dashed border-slate-300 bg-white text-slate-700"
                                                                : `border-transparent text-white ${item.color}`
                                                        }`}
                                                    >
                                                        {item.icon}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[8px] text-slate-300">-</span>
                                            )}
                                        </div>
                                        {extraCount > 0 && (
                                            <span className="text-[8px] font-semibold text-slate-500">+{extraCount}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">📅 ペットのリマインダー</h2>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-3 py-2 font-semibold">項目</th>
                                    <th className="px-3 py-2 font-semibold">状態</th>
                                </tr>
                            </thead>
                            <tbody>
                                {quickRecordItems
                                    .filter((item) => item.label !== "元気度")
                                    .map((item) => {
                                        if (item.storageKey === "foodHistory") {
                                            const memoValue = memoMap[item.storageKey] || "";
                                            const selectedDate = getSelectedDate(item.storageKey);

                                            return (
                                                <tr key={item.label} className="border-t border-slate-200 bg-white">
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-white shadow-sm ${item.color}`}>
                                                                {item.icon}
                                                            </span>
                                                            <span className="font-medium text-slate-700">{item.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={selectedDate}
                                                                    onChange={(e) => setRecordDateMap((prev) => ({ ...prev, [item.storageKey]: e.target.value }))}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {foodStatusItems.map((status) => {
                                                                    const checked = hasTodayRecord(status.storageKey);
                                                                    return (
                                                                        <button
                                                                            key={status.storageKey}
                                                                            type="button"
                                                                            onClick={() => toggleQuickRecord(status.storageKey)}
                                                                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                                                                                checked
                                                                                    ? `${status.color} border-transparent text-white`
                                                                                    : "border-slate-200 bg-slate-50 text-slate-600"
                                                                            }`}
                                                                        >
                                                                            <span>{status.icon}</span>
                                                                            <span>{status.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={memoValue}
                                                                onChange={(e) => saveMemo(item.storageKey, e.target.value)}
                                                                placeholder="メモ"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs placeholder:text-slate-400"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        if (item.storageKey === "toiletHistory") {
                                            const memoValue = memoMap[item.storageKey] || "";
                                            const selectedDate = getSelectedDate(item.storageKey);

                                            return (
                                                <tr key={item.label} className="border-t border-slate-200 bg-white">
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-white shadow-sm ${item.color}`}>
                                                                {item.icon}
                                                            </span>
                                                            <span className="font-medium text-slate-700">{item.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={selectedDate}
                                                                    onChange={(e) => setRecordDateMap((prev) => ({ ...prev, [item.storageKey]: e.target.value }))}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {toiletStatusItems.map((status) => {
                                                                    const checked = hasTodayRecord(status.storageKey);
                                                                    return (
                                                                        <button
                                                                            key={status.storageKey}
                                                                            type="button"
                                                                            onClick={() => toggleQuickRecord(status.storageKey)}
                                                                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                                                                                checked
                                                                                    ? `${status.color} border-transparent text-white`
                                                                                    : "border-slate-200 bg-slate-50 text-slate-600"
                                                                            }`}
                                                                        >
                                                                            <span>{status.icon}</span>
                                                                            <span>{status.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={memoValue}
                                                                onChange={(e) => saveMemo(item.storageKey, e.target.value)}
                                                                placeholder="メモ"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs placeholder:text-slate-400"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        if (item.storageKey === "medicineHistory") {
                                            const latest = typeof window !== "undefined"
                                                ? JSON.parse(localStorage.getItem("medicineHistory") || "[]").slice(-1)[0]
                                                : null;
                                            const nextDate = latest?.dueDate || "未設定";
                                            const memoValue = memoMap[item.storageKey] || "";

                                            return (
                                                <tr key={item.label} className="border-t border-slate-200 bg-white">
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-white shadow-sm ${item.color}`}>
                                                                {item.icon}
                                                            </span>
                                                            <span className="font-medium text-slate-700">{item.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={medicineLastGivenDate}
                                                                    onChange={(e) => setMedicineLastGivenDate(e.target.value)}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={medicineName}
                                                                onChange={(e) => setMedicineName(e.target.value)}
                                                                placeholder="薬の名前"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                                                            />
                                                            <div className="flex flex-wrap gap-2">
                                                                <select
                                                                    value={medicineInterval}
                                                                    onChange={(e) => setMedicineInterval(e.target.value)}
                                                                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                                                                >
                                                                    <option value="daily">毎日</option>
                                                                    <option value="weekly">1週間ごと</option>
                                                                    <option value="monthly">1か月ごと</option>
                                                                    <option value="custom">指定日</option>
                                                                </select>
                                                                {medicineInterval === "custom" && (
                                                                    <input
                                                                        type="date"
                                                                        value={medicineReminderDate}
                                                                        onChange={(e) => setMedicineReminderDate(e.target.value)}
                                                                        className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                        placeholder="次回予定日"
                                                                    />
                                                                )}
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={saveMedicineReminder}
                                                                className="rounded bg-red-400 px-2 py-1 text-[11px] font-semibold text-white"
                                                            >
                                                                薬を登録
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={memoValue}
                                                                onChange={(e) => saveMemo(item.storageKey, e.target.value)}
                                                                placeholder="メモ"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs placeholder:text-slate-400"
                                                            />
                                                            <div className="text-[11px] text-slate-500">次回: {nextDate}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        if (item.storageKey === "weightHistory") {
                                            const latestWeight = typeof window !== "undefined"
                                                ? JSON.parse(localStorage.getItem("weightHistory") || "[]").slice(-1)[0]
                                                : null;
                                            const latestLabel = latestWeight ? `${latestWeight.date} / ${latestWeight.weight}kg` : "未記録";
                                            const memoValue = memoMap[item.storageKey] || "";

                                            return (
                                                <tr key={item.label} className="border-t border-slate-200 bg-white">
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-white shadow-sm ${item.color}`}>
                                                                {item.icon}
                                                            </span>
                                                            <span className="font-medium text-slate-700">{item.label}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-2 align-top">
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={weightRecordDate}
                                                                    onChange={(e) => setWeightRecordDate(e.target.value)}
                                                                    className="rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={weightRecordValue}
                                                                    onChange={(e) => setWeightRecordValue(e.target.value)}
                                                                    placeholder="体重kg"
                                                                    className="w-24 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={saveWeightRecord}
                                                                className="rounded bg-purple-400 px-2 py-1 text-[11px] font-semibold text-white"
                                                            >
                                                                体重を登録
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={memoValue}
                                                                onChange={(e) => saveMemo(item.storageKey, e.target.value)}
                                                                placeholder="メモ"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs placeholder:text-slate-400"
                                                            />
                                                            <div className="text-[11px] text-slate-500">最新: {latestLabel}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        const done = hasTodayRecord(item.storageKey);
                                        const memoValue = memoMap[item.storageKey] || "";
                                        const selectedDate = getSelectedDate(item.storageKey);

                                        return (
                                            <tr key={item.label} className="border-t border-slate-200 bg-white">
                                                <td className="px-3 py-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-white shadow-sm ${item.color}`}>
                                                            {item.icon}
                                                        </span>
                                                        <span className="font-medium text-slate-700">{item.label}</span>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="date"
                                                                value={selectedDate}
                                                                onChange={(e) => setRecordDateMap((prev) => ({ ...prev, [item.storageKey]: e.target.value }))}
                                                                className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleQuickRecord(item.storageKey)}
                                                                className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 text-xs font-bold transition ${
                                                                    done
                                                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                                                        : "border-slate-300 bg-white text-transparent"
                                                                }`}
                                                                title={done ? "完了済み" : "未完了"}
                                                            >
                                                                {done ? "✓" : ""}
                                                            </button>
                                                        </div>
                                                        {(item.storageKey === "nailsHistory" || item.storageKey === "earsHistory") && (
                                                            <div className="flex items-center gap-2">
                                                                <select
                                                                    value={item.storageKey === "nailsHistory" ? nailsReminderDays : earsReminderDays}
                                                                    onChange={(e) => {
                                                                        if (item.storageKey === "nailsHistory") {
                                                                            setNailsReminderDays(e.target.value);
                                                                            return;
                                                                        }
                                                                        setEarsReminderDays(e.target.value);
                                                                    }}
                                                                    className="rounded border border-slate-200 px-2 py-1 text-[10px]"
                                                                >
                                                                    <option value="7">1週間ごと</option>
                                                                    <option value="14">2週間ごと</option>
                                                                    <option value="21">3週間ごと</option>
                                                                    {item.storageKey === "earsHistory" && (
                                                                        <option value="30">1か月ごと</option>
                                                                    )}
                                                                </select>
                                                            </div>
                                                        )}
                                                        <input
                                                            type="text"
                                                            value={memoValue}
                                                            onChange={(e) => saveMemo(item.storageKey, e.target.value)}
                                                            placeholder="メモ"
                                                            className="w-full rounded border border-slate-200 px-2 py-1 text-xs placeholder:text-slate-400"
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">📋 定期管理</h2>
                    <div className="space-y-4">
                        <div className="bg-cyan-50 p-4 rounded border-l-4 border-cyan-400">
                            <h3 className="font-semibold mb-3">💉 フィラリア予防</h3>
                            {nextFilariaDate ? (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">次回投薬予定日</p>
                                    <p className="text-xl font-bold text-cyan-600">{nextFilariaDate}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">投薬予定日がまだ設定されていません</p>
                            )}
                            <Link href="/pet/filaria">
                                <button className="w-full bg-cyan-400 text-white p-3 rounded hover:bg-cyan-500 font-semibold">
                                    詳しく管理する
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
