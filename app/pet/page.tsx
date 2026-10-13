"use client";

// React の状態管理と副作用を使うためのimport
import { useState, useEffect, useRef } from "react";
// 別ページへのリンクを作るためのimport
import Link from "next/link";
import Image from "next/image";
import PetFeatureStudio, { type ExperienceAction } from "./pet-feature-studio";
// 折れ線グラフを表示するためのライブラリ
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip, Legend, ResponsiveContainer } from "recharts";

// アルバムへ保存する写真と撮影日のデータ形式
type AlbumPhoto = {
    id: string;
    src: string;
    date: string;
};

// ペットのプロフィールページ全体を定義するコンポーネント
export default function PetForm() {
    // ペットの名前を管理するstate
    const [name, setName] = useState("");
    // ペットの生年月日を管理するstate
    const [birthday, setBirthday] = useState("");
    // ペットの種類を管理するstate
    const [species, setSpecies] = useState("");
    // 性別を管理するstate。初回は利用者が選ぶまで未選択にする
    const [gender, setGender] = useState("");
    // 去勢の有無を管理するstate（初期値は済み）
    const [neutered, setNeutered] = useState("yes");
    // 画像のURLを保存するstate
    const [image, setImage] = useState<string | null>(null);
    // 画像ファイル本体を保持するstate
    const [imageFile, setImageFile] = useState<File | null>(null);
    // 保存済みの成長写真と拡大表示中の写真を管理する
    const [albumPhotos, setAlbumPhotos] = useState<AlbumPhoto[]>([]);
    const [isAlbumOpen, setIsAlbumOpen] = useState(false);
    const [selectedAlbumPhoto, setSelectedAlbumPhoto] = useState<AlbumPhoto | null>(null);
    // 基本プロフィールが保存済みか、編集フォームを開いているかを管理する
    const [hasSavedProfile, setHasSavedProfile] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const shouldScrollToDashboard = useRef(false);
    // グラフで使う体重・ご飯のデータ配列を保存するstate
    const [graphData, setGraphData] = useState<any[]>([]);
    // ご飯の記録を保存しておくstate
    const [foodHistory, setFoodHistory] = useState<any[]>([]);
    // 日付ごとに入力中のご飯量を保持する
    const [foodAmountMap, setFoodAmountMap] = useState<Record<string, string>>({});
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
    // 行動に応じて獲得した経験値の履歴
    const [experienceLog, setExperienceLog] = useState<ExperienceAction[]>([]);
    // 項目ごとの日付入力値を管理するstate
    const [recordDateMap, setRecordDateMap] = useState<Record<string, string>>({});
    // 項目ごとのメモを保存するstate
    const [memoMap, setMemoMap] = useState<Record<string, string>>({});
    // チェック状態の変更時に再描画させるためのstate
    const [, setRefreshTick] = useState(0);

    



    // 画面が最初に表示されたときに、保存されたデータを読み込む処理
    useEffect(() => {
        // ブラウザー側の保存データを参照できる状態になったことを記録する
        setIsHydrated(true);

        // 保存済みの経験値履歴を読み、合計レベルを復元する
        try {
            const savedExperience = JSON.parse(localStorage.getItem("petExperienceLog") || "[]");
            if (Array.isArray(savedExperience)) {
                setExperienceLog(savedExperience);
            }
        } catch {
            localStorage.removeItem("petExperienceLog");
        }

        // 保存済みの基本プロフィールを読み込み、登録済み画面を復元する
        const savedProfile = localStorage.getItem("petProfile");
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                if (profile.name && profile.birthday && profile.species && profile.gender) {
                    setName(profile.name);
                    setBirthday(profile.birthday);
                    setSpecies(profile.species);
                    setGender(profile.gender === "メス" ? "女の子" : profile.gender === "オス" ? "男の子" : profile.gender);
                    setNeutered(profile.neutered || "yes");
                    if (profile.image) {
                        setImage(profile.image);
                    }
                    setHasSavedProfile(true);
                }
            } catch {
                localStorage.removeItem("petProfile");
            }
        }

        // 誕生日とアルバム写真をブラウザー保存領域から復元する
        const savedBirthday = localStorage.getItem("petBirthday");
        if (savedBirthday) {
            // 保存済みの誕生日を入力欄とカレンダーに反映する
            setBirthday(savedBirthday);
        }

        try {
            // JSON文字列のアルバムを写真配列へ戻す
            const savedAlbumPhotos = JSON.parse(localStorage.getItem("petGrowthAlbum") || "[]");
            if (Array.isArray(savedAlbumPhotos)) {
                // 配列として正しく読み込めたときだけ画面へ反映する
                setAlbumPhotos(savedAlbumPhotos);
            }
        } catch {
            // 壊れたJSONが残っている場合は削除し、次回の読み込み失敗を防ぐ
            localStorage.removeItem("petGrowthAlbum");
        }

        // グラフ用に体重とご飯の履歴をlocalStorageから読み込む
        const weightHistory = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        // ご飯の履歴もlocalStorageから読み込む
        const foodHistoryData = JSON.parse(localStorage.getItem("foodHistory") || "[]");
        // ご飯履歴をstateに入れて、カレンダーとグラフで使えるようにする
        setFoodHistory(foodHistoryData);
        // すでに量が記録されている日付は入力欄にも値を復元する
        setFoodAmountMap(Object.fromEntries(foodHistoryData.filter((entry: any) => entry.amount !== undefined).map((entry: any) => [entry.date, String(entry.amount)])));

        // 全記録項目の保存キーを集め、重複を除いてメモを一括で読み込む
        const memoKeys = [...new Set([...quickRecordItems, ...foodStatusItems, ...toiletStatusItems].map((item) => item.storageKey))];
        const loadedMemos: Record<string, string> = {};
        memoKeys.forEach((key) => {
            // 項目専用キーにメモが保存されていれば読み込み結果へ追加する
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
                // 同じ日付の食事データも後からまとめられるよう空の行を作る
                dateMap.set(entry.date, { date: entry.date });
            }
            // その日の体重をセットする
            dateMap.get(entry.date).weight = entry.weight;
        });
        
        // ご飯の記録も同じ日付ごとにまとめる
        foodHistoryData.forEach((entry: any) => {
            // その日付のデータがまだなければ、新しいオブジェクトを作る
            if (!dateMap.has(entry.date)) {
                // 体重記録がない日付でも食事量だけの行を作れるようにする
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

    useEffect(() => {
        if (!hasSavedProfile || !shouldScrollToDashboard.current) {
            return;
        }

        shouldScrollToDashboard.current = false;
        dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, [hasSavedProfile]);

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
        // 呼び出し元の日付を変更しないよう複製を作る
        const nextDate = new Date(date);
        // 複製した日付へ指定日数を加算する
        nextDate.setDate(nextDate.getDate() + days);
        // 計算後の日付を返す
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

    // 記録済み体重に合わせて、0.5刻みの軸端と目盛りを作る
    const recordedWeights = graphData
        .map((entry: any) => Number(entry.weight))
        .filter((value: number) => Number.isFinite(value));
    const weightAxisMin = recordedWeights.length > 0
        ? Math.floor(Math.min(...recordedWeights) * 2) / 2 - 0.5
        : 0;
    const weightAxisMax = recordedWeights.length > 0
        ? Math.ceil(Math.max(...recordedWeights) * 2) / 2 + 0.5
        : 5;
    const weightAxisTicks = Array.from(
        { length: Math.round((weightAxisMax - weightAxisMin) * 10) + 1 },
        (_, index) => Number((weightAxisMin + index * 0.1).toFixed(1)),
    );
    const weightMajorTicks = weightAxisTicks.filter((tick) => Math.round(tick * 10) % 5 === 0);
    const weightMinorTicks = weightAxisTicks.filter((tick) => Math.round(tick * 10) % 5 !== 0);

    // 月ごとにカレンダーの色と季節の飾りを切り替える設定
    const seasonalScenes = [
        { title: "こたつでぬくぬく", accent: "#e78b59", canvas: "#fff3e5", background: "linear-gradient(110deg, #fff1df, #f8d9b8)", prop: "🍊", decorations: ["❄️", "🍊", "✨"] },
        { title: "毛糸玉とひだまり", accent: "#d96f86", canvas: "#fff0f3", background: "linear-gradient(110deg, #fff0f2, #f6dce7)", prop: "🧶", decorations: ["🧶", "💌", "🌷"] },
        { title: "春の花を見つけたよ", accent: "#72a978", canvas: "#eff8ec", background: "linear-gradient(110deg, #eef8e9, #d7eed7)", prop: "🌷", decorations: ["🌱", "🌷", "🦋"] },
        { title: "桜の下でひとやすみ", accent: "#d97f9b", canvas: "#fff0f4", background: "linear-gradient(110deg, #fff0f4, #f7d9e4)", prop: "🌸", decorations: ["🌸", "🌸", "🍡"] },
        { title: "新緑とかくれんぼ", accent: "#618f5d", canvas: "#f0f7e8", background: "linear-gradient(110deg, #eff7df, #d9ebc6)", prop: "🍃", decorations: ["🍃", "☘️", "🐞"] },
        { title: "雨音とあじさい", accent: "#6b8fc0", canvas: "#edf4fb", background: "linear-gradient(110deg, #edf3fa, #d6e3f2)", prop: "☔", decorations: ["☔", "💧", "🪻"] },
        { title: "ひまわりと夏空", accent: "#dc9b32", canvas: "#fff7df", background: "linear-gradient(110deg, #fff6d9, #f8e6aa)", prop: "🌻", decorations: ["☀️", "🌻", "🍉"] },
        { title: "海辺で波とおいかけっこ", accent: "#438fa5", canvas: "#e8f7f4", background: "linear-gradient(110deg, #e5f7f5, #c7e9e7)", prop: "🐚", decorations: ["🐚", "🫧", "🌊"] },
        { title: "すすきとお月見", accent: "#9b8050", canvas: "#f7f1e2", background: "linear-gradient(110deg, #f7f0dc, #e9dfbf)", prop: "🌕", decorations: ["🌕", "🌾", "🍡"] },
        { title: "かぼちゃ探検隊", accent: "#d77b39", canvas: "#fff1e3", background: "linear-gradient(110deg, #fff0df, #f5d5b5)", prop: "🎃", decorations: ["🎃", "🍁", "🦇"] },
        { title: "落ち葉のじゅうたん", accent: "#a76c47", canvas: "#f8eee3", background: "linear-gradient(110deg, #f8ecdf, #ead5bf)", prop: "🍁", decorations: ["🍂", "🍁", "🌰"] },
        { title: "雪の夜の贈りもの", accent: "#6689ad", canvas: "#eff5fa", background: "linear-gradient(110deg, #eef5fb, #d5e4f1)", prop: "🎄", decorations: ["❄️", "🎄", "⭐"] },
    ];
    const seasonalScene = seasonalScenes[currentMonth.getMonth()];

    // 今日の日付を YYYY-MM-DD 形式で取得する
    const todayKey = formatDateKey(new Date());

    // 記録の種類に応じた経験値カテゴリを決める
    const getExperienceCategory = (storageKey: string) => {
        if (storageKey === "foodHistory" || storageKey.startsWith("appetite") || storageKey === "vomitHistory") {
            return "food";
        }
        if (storageKey === "brushingHistory") {
            return "brushing";
        }
        if (storageKey === "weightHistory") {
            return "weight";
        }
        if (storageKey === "medicineHistory") {
            return "medicine";
        }
        return "care";
    };

    // 1回の行動を経験値ログへ追記し、現在画面にも反映する
    const awardExperience = (category: string, points: number) => {
        if (typeof window === "undefined") {
            return;
        }

        const saved = JSON.parse(localStorage.getItem("petExperienceLog") || "[]");
        const nextLog: ExperienceAction[] = [
            ...saved,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                category,
                points,
                date: todayKey,
            },
        ];
        localStorage.setItem("petExperienceLog", JSON.stringify(nextLog));
        setExperienceLog(nextLog);
    };

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

    // 食欲や吐き戻しなど食事状態として記録する項目
    const foodStatusItems = [
        { label: "食欲旺盛", icon: "😺", color: "bg-amber-500", storageKey: "appetiteGoodHistory", type: "log" },
        { label: "食欲なさそう", icon: "😿", color: "bg-slate-500", storageKey: "appetiteLowHistory", type: "log" },
        { label: "吐き戻し", icon: "🤢", color: "bg-pink-400", storageKey: "vomitHistory", type: "log" },
    ];

    // 排便・排尿の状態を記録する項目
    const toiletStatusItems = [
        { label: "快便", icon: "✅", color: "bg-emerald-400", storageKey: "normalPoopHistory", type: "log" },
        { label: "ゆるめ", icon: "🫠", color: "bg-cyan-400", storageKey: "looseStoolHistory", type: "log" },
        { label: "排便なし", icon: "🚫", color: "bg-slate-400", storageKey: "noPoopHistory", type: "log" },
        { label: "排尿なし", icon: "💧", color: "bg-indigo-400", storageKey: "noUrineHistory", type: "log" },
    ];

    // カレンダー表示用と全記録検索用に項目一覧をまとめる
    const calendarItems = [...quickRecordItems, ...foodStatusItems, ...toiletStatusItems];
    const allTrackableItems = [...quickRecordItems, ...foodStatusItems, ...toiletStatusItems];

    // 保存キーから記録項目の設定を探す
    const getTrackableItem = (storageKey: string) => {
        return allTrackableItems.find((entry) => entry.storageKey === storageKey);
    };

    // カレンダー上で「完了済み」と「リマインダー」を区別するための状態を返す
    const getCalendarIconState = (dateKey: string, item: (typeof calendarItems)[number]) => {
        // サーバー側の初回描画ではブラウザー保存領域を読まず空扱いにする
        if (typeof window === "undefined") {
            return "none";
        }

        // 対象項目の記録・予定配列を端末内から読み込む
        const stored = JSON.parse(localStorage.getItem(item.storageKey) || "[]");

        if (item.type === "log") {
            // 通常記録は対象日に記録が存在すれば完了アイコンを返す
            return stored.some((entry: any) => entry.date === dateKey) ? "done" : "none";
        }

        // リマインダーは実施日と予定日を別々に調べる
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
        // ブラウザー外ではlocalStorageを参照できないため未記録として扱う
        if (typeof window === "undefined") {
            return false;
        }

        // 保存済み配列と項目定義を取得する
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const item = getTrackableItem(storageKey);

        if (!item) {
            return false;
        }

        if (item.type === "log") {
            // 通常記録は実施日が選択日と一致するか確認する
            return stored.some((entry: any) => entry.date === dateKey);
        }

        // リマインダー項目は予定日が選択日と一致するか確認する
        return stored.some((entry: any) => entry.dueDate === dateKey);
    };

    // アイコンボタンを押したときに、予定か記録のどちらかをセットする関数
    const toggleQuickRecord = (storageKey: string) => {
        // 保存キーに対応する項目設定がない場合は処理を終了する
        const item = getTrackableItem(storageKey);
        if (!item) {
            return;
        }

        // 現在の保存配列と画面で選択している日付を取得する
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const selectedDate = getSelectedDate(storageKey);

        if (item.type === "log") {
            // 通常記録は、既にあれば削除し、なければ新しい完了記録を追加する
            const exists = stored.some((entry: any) => entry.date === selectedDate);
            const updated = exists
                ? stored.filter((entry: any) => entry.date !== selectedDate)
                : [...stored, { date: selectedDate, checked: true }];

            // 変更した記録配列を保存領域へ書き戻す
            localStorage.setItem(storageKey, JSON.stringify(updated));
            // 新しく完了記録を追加したときだけ経験値を付与する
            if (!exists) {
                awardExperience(getExperienceCategory(storageKey), 10);
            }
            if (storageKey === "foodHistory") {
                setFoodHistory(updated);
            }
            // 保存領域の読み直しを伴わず画面を再描画する
            setRefreshTick((value) => value + 1);
            return;
        }

        // リマインダーは選択日に作成済みなら取り消しとして削除する
        const exists = stored.some((entry: any) => entry.date === selectedDate);
        if (exists) {
            const updated = stored.filter((entry: any) => entry.date !== selectedDate);
            localStorage.setItem(storageKey, JSON.stringify(updated));
            setRefreshTick((value) => value + 1);
            return;
        }

        // 爪・耳は画面で選ばれた間隔、それ以外は項目定義の間隔を使う
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
        // 選択日へ間隔を加えて次回予定日を計算する
        const reminderDate = formatDateKey(addDays(new Date(selectedDate), reminderDays));
        // 実施日と次回予定日を一組のリマインダーとして追加する
        const updated = [...stored, { date: selectedDate, dueDate: reminderDate, checked: true }];
        localStorage.setItem(storageKey, JSON.stringify(updated));
        // 新しいお世話予定を登録した行動にも経験値を付与する
        awardExperience(getExperienceCategory(storageKey), 10);

        if (storageKey === "foodHistory") {
            setFoodHistory(updated);
        }
        setRefreshTick((value) => value + 1);
    };

    // その項目が今日の対象かどうかを返す関数
    const hasTodayRecord = (storageKey: string) => {
        // 項目の存在とブラウザー側の初期化完了を確認する
        const item = getTrackableItem(storageKey);
        if (!item || !isHydrated || typeof window === "undefined") {
            return false;
        }

        // 保存済み配列を読み、現在選択中の日付の実施有無を返す
        const stored = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const selectedDate = getSelectedDate(storageKey);
        return stored.some((entry: any) => entry.date === selectedDate);
    };

    // 薬のリマインダー日を計算する関数
    const getMedicineReminderDate = (lastGivenDate: string, interval: string, customDate?: string) => {
        // 個別の日付が指定されていれば、周期計算より優先して返す
        if (customDate) {
            return customDate;
        }

        // 基準日が未入力の場合は今日を基準にする
        const baseDate = lastGivenDate ? new Date(lastGivenDate) : new Date();
        // 元の日付を保持するため計算用のDateを複製する
        const nextDate = new Date(baseDate);

        // 選択された周期に応じて次回日付を進める
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

        // 計算結果を画面・保存形式のYYYY-MM-DDに揃えて返す
        return formatDateKey(nextDate);
    };

    // 薬のリマインダーを保存する関数
    const saveMedicineReminder = () => {
        // サーバー描画中はブラウザー保存領域を使わない
        if (typeof window === "undefined") {
            return;
        }

        // 前後の空白を除き、未入力なら一般名「薬」を使う
        const name = medicineName.trim() || "薬";
        // 投与日が空欄なら今日を最後の投与日として扱う
        const lastGivenDate = medicineLastGivenDate || todayKey;
        // 周期または指定日から次回の投与予定日を求める
        const nextDate = getMedicineReminderDate(lastGivenDate, medicineInterval, medicineReminderDate || undefined);
        // 既存の薬リマインダーを読み、今回分を末尾へ追加する
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

        // 追加後の履歴を端末内に保存する
        localStorage.setItem("medicineHistory", JSON.stringify(updated));
        // 薬の予定を登録した行動を経験値として記録する
        awardExperience("medicine", 10);
        // 登録済みの入力欄を空にして次の入力に備える
        setMedicineName("");
        setMedicineLastGivenDate("");
        setMedicineReminderDate("");
    };

    // 体重測定の記録を保存する関数
    const saveWeightRecord = () => {
        // ブラウザー外では保存処理を行わない
        if (typeof window === "undefined") {
            return;
        }

        // 文字列入力を数値に変換し、日付や数値が不正なら中止する
        const value = Number(weightRecordValue);
        if (!weightRecordDate || weightRecordValue.trim() === "" || !Number.isFinite(value)) {
            return;
        }

        // 既存の体重履歴を読み、日付・体重を一件追加する
        const stored = JSON.parse(localStorage.getItem("weightHistory") || "[]");
        const updated = [
            ...stored,
            {
                date: weightRecordDate,
                weight: value,
                checked: true,
            },
        ];

        // 更新した体重履歴を端末内へ保存する
        localStorage.setItem("weightHistory", JSON.stringify(updated));
        // 保存した体重を同じ日付のグラフデータへ反映する
        setGraphData((currentData) => {
            const dataByDate = new Map(currentData.map((entry: any) => [entry.date, entry]));
            const currentEntry = dataByDate.get(weightRecordDate) || { date: weightRecordDate };
            dataByDate.set(weightRecordDate, { ...currentEntry, weight: value });
            return Array.from(dataByDate.values()).sort((first: any, second: any) => first.date.localeCompare(second.date));
        });
        // 体重を記録した行動に経験値を付与する
        awardExperience("weight", 10);
        // 日付と数値欄を空にし、プロフィール表示の体重も同期する
        setWeightRecordDate("");
        setWeightRecordValue("");
    };

    // 選択日の給餌量を保存し、同じ日付の既存量があれば上書きする
    const saveFoodAmount = (date: string) => {
        if (typeof window === "undefined") {
            return;
        }

        const amount = Number(foodAmountMap[date]);
        if (!date || foodAmountMap[date]?.trim() === "" || !Number.isFinite(amount) || amount < 0) {
            return;
        }

        const stored = JSON.parse(localStorage.getItem("foodHistory") || "[]");
        const existing = stored.find((entry: any) => entry.date === date);
        const updated = existing
            ? stored.map((entry: any) => entry.date === date ? { ...entry, amount } : entry)
            : [...stored, { date, amount }];

        localStorage.setItem("foodHistory", JSON.stringify(updated));
        setFoodHistory(updated);
        // 食事量を記録した行動に経験値を付与する
        awardExperience("food", 10);
        setGraphData((currentData) => {
            const dataByDate = new Map(currentData.map((entry: any) => [entry.date, entry]));
            const currentEntry = dataByDate.get(date) || { date };
            dataByDate.set(date, { ...currentEntry, food: amount });
            return Array.from(dataByDate.values()).sort((first: any, second: any) => first.date.localeCompare(second.date));
        });
        setRefreshTick((value) => value + 1);
    };

    // リマインダー一覧で表示する状態文字列を返す関数
    const getReminderValue = (item: (typeof quickRecordItems)[number]) => {
        // サーバー描画中は保存先がないため未設定を返す
        if (typeof window === "undefined") {
            return "未設定";
        }

        // 対象項目の履歴を読み、記録か予定かで最新値を探す
        const stored = JSON.parse(localStorage.getItem(item.storageKey) || "[]");
        if (item.type === "log") {
            // 通常記録は末尾から実施日を探し、なければ未記録を表示する
            const latest = [...stored].reverse().find((entry: any) => entry.date);
            return latest ? latest.date : "未記録";
        }

        // リマインダーは末尾から次回予定日を探す
        const latest = [...stored].reverse().find((entry: any) => entry.dueDate);
        return latest ? latest.dueDate : "未設定";
    };

    // 項目ごとのメモを保存する関数
    const saveMemo = (storageKey: string, value: string) => {
        // ブラウザー外から呼ばれた場合は何も変更しない
        if (typeof window === "undefined") {
            return;
        }

        // 画面のメモ一覧を更新し、入力中の文字をすぐ反映する
        const nextMap = { ...memoMap, [storageKey]: value };
        setMemoMap(nextMap);
        // 空白だけのメモは保存せず、以前の内容も削除する
        if (value.trim() === "") {
            localStorage.removeItem(`${storageKey}Memo`);
            return;
        }
        // 入力されたメモを項目別の保存キーへ記録する
        localStorage.setItem(`${storageKey}Memo`, value);
    };

    // プロフィール写真を読み込み、画面上のプレビューへ反映する
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

    // 選んだ成長写真を縮小・JPEG化し、アルバムへ保存する
    const handleAlbumImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // ファイル選択欄から先頭の画像を取り出す
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        try {
            // ブラウザーで画像を読み取り、縮小処理に使うビットマップを作る
            const bitmap = await createImageBitmap(file);
            // 縦横比を保ったまま長辺が1200pxを超えない縮尺を計算する
            const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
            // 縮小後の大きさに合わせた描画用キャンバスを用意する
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(bitmap.width * scale);
            canvas.height = Math.round(bitmap.height * scale);
            // 2D描画機能が取得できない環境では保存を中断する
            const context = canvas.getContext("2d");
            if (!context) {
                bitmap.close();
                throw new Error("画像を処理できませんでした");
            }

            // 透明部分を白で塗りつぶし、JPEG保存時の黒背景化を防ぐ
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            // 読み込んだ写真を計算済みサイズでキャンバスへ描く
            context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            // 使用後の画像データを解放する
            bitmap.close();

            // 一意なID、圧縮写真、登録日をひとつのアルバム項目にまとめる
            const photo: AlbumPhoto = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                src: canvas.toDataURL("image/jpeg", 0.82),
                date: formatDateKey(new Date()),
            };
            // 新しい写真を先頭に置き、最新の登録が先に見えるようにする
            const nextPhotos = [photo, ...albumPhotos];
            // 更新したアルバムを保存して画面一覧も同時に更新する
            localStorage.setItem("petGrowthAlbum", JSON.stringify(nextPhotos));
            setAlbumPhotos(nextPhotos);
            // 写真を追加した思い出づくりに経験値を付与する
            awardExperience("photo", 20);
        } catch {
            // 読み込みや保存に失敗した場合は再選択を促す
            alert("写真を保存できませんでした。画像を変えてもう一度お試しください。");
        } finally {
            // 同じファイルをもう一度選んでも変更イベントが発生するよう入力を戻す
            e.target.value = "";
        }
    };

    // 初回プロフィールまたは編集内容を保存する処理
    const handleSubmit = (e: React.FormEvent) => {
        // ブラウザー標準のフォーム送信によるページ再読み込みを防ぐ
        e.preventDefault();
        // 基本情報と任意項目をプロフィールデータとしてまとめる
        const profile = {
            name,
            birthday,
            species,
            gender,
            neutered,
            image,
        };
        // 次回アクセスでも入力値を復元できるよう端末内へ保存する
        localStorage.setItem("petProfile", JSON.stringify(profile));
        localStorage.setItem("petBirthday", birthday);
        // 初回登録だけにプロフィール作成分の経験値を付与する
        if (!hasSavedProfile) {
            awardExperience("profile", 15);
            shouldScrollToDashboard.current = true;
        }
        // 保存後は入力欄を閉じ、カレンダーなどの機能を表示する
        setHasSavedProfile(true);
        setIsEditingProfile(false);
        // 利用者へプロフィール登録が完了したことを知らせる
        alert("ペットのプロフィールを保存しました！");
    };

    if (!isHydrated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white p-6 text-slate-600" aria-busy="true">
                <p className="rounded-full bg-teal-50 px-5 py-3 text-sm font-semibold text-teal-800">
                    ペット情報を確認しています…
                </p>
            </main>
        );
    }

    // プロフィール、記録グラフ、カレンダー、お世話ノートをまとめて表示する
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-white text-slate-900">
            <div className="w-full max-w-3xl space-y-10">
                {/* 写真登録、プロフィール入力、成長写真アルバム */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-3xl font-bold mb-4">🐾 {hasSavedProfile ? "ペットプロフィール" : "マイペットを登録する"}</h1>

                    {hasSavedProfile ? (
                        /* 保存後に基本プロフィールを赤枠の概要として表示する */
                        <div className="mb-6 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-100 via-rose-50 to-orange-50 p-4 shadow-sm">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                                <div className="flex shrink-0 flex-col items-center gap-2">
                                    {/* クリックすると登録済みのプロフィール写真を変更できる */}
                                    <label className="cursor-pointer rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50">
                                        ペットの写真を登録
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {/* 登録写真がない場合は足あとを代わりに表示する */}
                                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white text-4xl shadow-sm">
                                        {image ? <img src={image} alt="ペット写真" className="h-full w-full rounded-full object-cover" /> : "🐾"}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Profile</p>
                                    <h2 className="text-2xl font-bold text-slate-800">{name}</h2>
                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                                        <span className="rounded-full bg-white px-2 py-1">生年月日: {birthday}</span>
                                        <span className="rounded-full bg-white px-2 py-1">種類: {species}</span>
                                        <span className="rounded-full bg-white px-2 py-1">性別: {gender}</span>
                                    </div>
                                    {!isEditingProfile && (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(true)}
                                            className="mt-3 rounded border border-pink-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-white"
                                        >
                                            プロフィールを編集
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* 初回登録中は未入力を示す赤枠を出さず、写真だけ表示する */
                        <div className="mb-6 flex flex-col items-center gap-2">
                            <label className="cursor-pointer rounded-full bg-pink-50 px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-pink-100">
                                ペットの写真を登録
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-pink-50 text-4xl shadow-sm">
                                {image ? <img src={image} alt="ペット写真" className="h-full w-full rounded-full object-cover" /> : "🐾"}
                            </div>
                        </div>
                    )}

                    {(!hasSavedProfile || isEditingProfile) && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* プロフィールに表示するペットの名前を入力する */}
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

                        {/* 入力した誕生日は即時保存し、カレンダー表示にも使う */}
                        <label className="flex flex-col">
                            生年月日
                            <input
                                type="date"
                                value={birthday}
                                onChange={(e) => {
                                    // 日付入力の現在値を取り出して画面状態を更新する
                                    const nextBirthday = e.target.value;
                                    setBirthday(nextBirthday);
                                    if (nextBirthday) {
                                        // 誕生日が入力されたら再訪後も使えるよう保存する
                                        localStorage.setItem("petBirthday", nextBirthday);
                                    } else {
                                        // 入力が消された場合は古い誕生日も削除する
                                        localStorage.removeItem("petBirthday");
                                    }
                                }}
                                className="border p-2 rounded mt-2"
                                required
                            />
                        </label>

                        {/* 性別はオス・メスのどちらか一方を選ぶ */}
                        <div className="flex flex-col">
                            <span className="font-semibold mb-2">性別</span>
                            <div className="flex gap-4">
                                {/* 女の子・男の子から選び、選択中の項目に印を付ける */}
                                {['女の子', '男の子'].map((option) => (
                                    <label key={option} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={option}
                                            checked={gender === option}
                                            required={option === "女の子"}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="h-4 w-4"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 猫種などペットの種類を入力する */}
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

                        {/* 去勢・避妊の処置状況をどちらか選ぶ */}
                        <div className="flex flex-col">
                            <span className="font-semibold mb-3">去勢・避妊</span>
                            {/* 処置が済んでいる場合の選択肢 */}
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
                            {/* まだ処置していない場合の選択肢 */}
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
                        
                        {/* 入力したプロフィール情報を送信する */}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                        >
                            {hasSavedProfile ? "変更を保存" : "プロフィールを保存してはじめる"}
                        </button>
                    </form>
                    )}
                </section>

                {hasSavedProfile && (
                <>
                <div ref={dashboardRef} id="pet-dashboard" className="scroll-mt-4">
                    <PetFeatureStudio
                        petName={name}
                        albumPhotos={albumPhotos}
                        experienceLog={experienceLog}
                        foodHistory={foodHistory}
                        graphData={graphData}
                        memoMap={memoMap}
                        onAlbumPhotoChange={handleAlbumImageChange}
                        onOpenAlbum={() => setIsAlbumOpen(true)}
                    />
                </div>


                
                {/* 保存済みの測定記録がある場合だけ成長グラフを表示する */}
                {graphData.length > 0 && (
                    <section className="rounded-lg border border-rose-100 bg-[#fffdfa] p-6 shadow-sm">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-2xl font-bold text-slate-800">🐾 成長グラフ</h2>
                            {/* 線の色と記録項目の対応を凡例で示す */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-600">
                                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" />体重（kg）</span>
                                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-teal-500" />ご飯（g）</span>
                            </div>
                        </div>
                        {/* 小さい画面でも幅に合わせて伸縮するグラフ領域 */}
                        <div className="h-[280px] w-full sm:h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData} margin={{ top: 24, right: 22, bottom: 42, left: 16 }}>
                                    {/* 横方向の補助線で数値の高さを読み取りやすくする */}
                                    <CartesianGrid yAxisId="left" horizontalValues={weightMajorTicks} stroke="#e7ddd7" strokeDasharray="3 6" vertical={false} />
                                    {/* 主目盛りの間に0.1kg刻みの薄い補助線を引く */}
                                    {weightMinorTicks.map((tick) => (
                                        <ReferenceLine key={`weight-minor-${tick}`} yAxisId="left" y={tick} stroke="#f3eeeb" strokeWidth={0.7} />
                                    ))}
                                    {/* 横軸は記録日。西暦を含めて表示する */}
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => String(value).replaceAll("-", "/")}
                                        tick={{ fontSize: 12, fill: "#655a54", fontWeight: 600 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        angle={-30}
                                        textAnchor="end"
                                        height={48}
                                        minTickGap={8}
                                    />
                                    {/* 左側の縦軸は体重データに対応する */}
                                    <YAxis
                                        yAxisId="left"
                                        domain={[weightAxisMin, weightAxisMax]}
                                        ticks={weightMajorTicks}
                                        tickFormatter={(value) => Number(value).toFixed(1)}
                                        tick={{ fontSize: 11, fill: "#655a54", fontWeight: 600 }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={46}
                                        label={{
                                            value: "体重（kg）",
                                            angle: 0,
                                            position: "insideLeft",
                                            style: { writingMode: "vertical-rl", textOrientation: "mixed", textAnchor: "middle", fill: "#a84c5d", fontSize: 11, fontWeight: 700 },
                                        }}
                                        allowDataOverflow
                                    />
                                    {/* 右側の縦軸は食事量データに対応する */}
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tick={{ fontSize: 10, fill: "#82766f" }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={58}
                                        label={{
                                            value: "ご飯の量（g）",
                                            angle: 0,
                                            position: "insideRight",
                                            style: { writingMode: "vertical-rl", textOrientation: "mixed", textAnchor: "middle", fill: "#397d72", fontSize: 11, fontWeight: 700 },
                                        }}
                                    />
                                    {/* 線や点に触れたとき、日付と数値を吹き出し表示する */}
                                    <Tooltip
                                        cursor={{ stroke: "#d8c9bf", strokeDasharray: "4 4" }}
                                        labelFormatter={(label) => `${label} の記録`}
                                        contentStyle={{ border: "1px solid #f0dfd8", borderRadius: "10px", backgroundColor: "rgba(255, 255, 255, 0.96)", boxShadow: "0 8px 20px rgba(90, 65, 50, 0.12)" }}
                                        labelStyle={{ color: "#594d47", fontWeight: 700, marginBottom: 4 }}
                                        itemStyle={{ color: "#655a54", fontSize: 12 }}
                                    />
                                    {/* コーラル色の線で体重の変化を結ぶ */}
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#e88798"
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                        name="体重"
                                        isAnimationActive={false}
                                        connectNulls
                                        dot={{ r: 4, fill: "#fffdfa", stroke: "#e88798", strokeWidth: 2 }}
                                        activeDot={{ r: 6, fill: "#e88798", stroke: "#fffdfa", strokeWidth: 2 }}
                                        label={{ position: "top", fill: "#a84c5d", fontSize: 10, fontWeight: 700, offset: 8 }}
                                    />
                                    {/* ミント色の線で食事量の変化を結ぶ */}
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="food"
                                        stroke="#62a99b"
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                        name="ご飯"
                                        isAnimationActive={false}
                                        connectNulls
                                        dot={{ r: 4, fill: "#fffdfa", stroke: "#62a99b", strokeWidth: 2 }}
                                        activeDot={{ r: 6, fill: "#62a99b", stroke: "#fffdfa", strokeWidth: 2 }}
                                        label={{ position: "top", fill: "#397d72", fontSize: 10, fontWeight: 700, offset: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                )}

                {/* 月色の下地に季節の猫と日々の記録カレンダーを表示する */}
                <section className="rounded-lg p-6 shadow transition-colors duration-300" style={{ backgroundColor: seasonalScene.canvas }}>
                        {/* 月表示と前後移動ボタンを並べるカレンダー見出し */}
                        <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">📅 カレンダー</h2>
                        <div className="flex gap-2">
                            {/* 表示月を1か月前へ移動する */}
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
                            {/* 表示月を1か月後へ移動する */}
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                                className="px-3 py-1 border rounded"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 rounded-2xl border border-amber-200 bg-white/85 px-4 py-3 shadow-md">
                        <p className="mb-2 text-xs font-bold tracking-wide text-amber-800">✨ カレンダーの見かた</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-700">
                            <span className="inline-flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-transparent bg-orange-400 text-[14px] text-white shadow-sm" aria-hidden="true">🍽️</span>
                                色つき：記録済み
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-[14px] text-slate-700 shadow-sm" aria-hidden="true">🍽️</span>
                                点線枠：リマインダー
                            </span>
                        </div>
                    </div>

                    <div
                        className="relative mb-4 flex min-h-28 items-center justify-between overflow-hidden rounded-md px-5 py-3 sm:min-h-32 sm:px-8"
                        style={{ background: seasonalScene.background }}
                        aria-label={`${currentMonth.getMonth() + 1}月の季節の猫イラスト: ${seasonalScene.title}`}
                    >
                        {/* 月に対応した季節の飾りを背景へ重ねる */}
                        <div className="absolute inset-0 flex items-center justify-end gap-3 pr-[28%] text-xl opacity-80 sm:pr-[24%] sm:text-2xl" aria-hidden="true">
                            {seasonalScene.decorations.map((decoration, index) => (
                                <span key={`${decoration}-${index}`} className={index === 1 ? "-translate-y-5" : "translate-y-4"}>{decoration}</span>
                            ))}
                        </div>
                        {/* 白背景を透明化したサイベリアン風猫の元画像 */}
                        <Image
                            className="relative z-10 h-24 w-auto max-w-[48%] shrink-0 object-contain sm:h-28"
                            src="/IMG_1782-transparent.png"
                            alt="クリームタビーのサイベリアン風猫のイラスト"
                            width={686}
                            height={392}
                        />
                    </div>

                    {/* 日曜日から土曜日までの曜日見出しを7列で並べる */}
                    <div className="grid grid-cols-7 gap-2 text-center">
                        {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
                            <div key={day} className="font-semibold text-sm py-2">
                                {day}
                            </div>
                        ))}

                        {/* 日付ごとの記録アイコンと誕生日の印を組み立てる */}
                        {calendarDays.map((date) => {
                            const key = formatDateKey(date);
                            // 年に関係なく、誕生日と同じ月日ならお祝い表示を付ける
                            const isBirthday = date.getMonth() === currentMonth.getMonth() && birthday.slice(5) === key.slice(5);
                            const dayIcons = calendarItems
                                .filter((item) => item.label !== "元気度" && item.storageKey !== "weightHistory")
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
                            const visibleIcons = dayIcons.slice(0, isBirthday ? 3 : 9);
                            const extraCount = Math.max(0, dayIcons.length - visibleIcons.length);

                            return (
                                <div
                                    key={key}
                                    className={`h-28 border rounded p-2 ${
                                        date.getMonth() !== currentMonth.getMonth()
                                            ? "bg-white/35 text-gray-500"
                                            : "bg-white/75"
                                    }`}
                                >


                                    {/* セルの日付番号 */}
                                    <div className="text-left text-[11px] font-medium leading-none">{date.getDate()}</div>
                                    {/* 誕生日当日はケーキと英語のお祝いを表示する */}
                                    {isBirthday && (
                                        <div className="mt-1 flex flex-col items-center leading-none text-pink-700" title="Happy Birthday!">
                                            <span className="text-sm">🎂</span>
                                            <span className="mt-0.5 text-center text-[6px] font-extrabold leading-[7px]">Happy<br />Birthday!</span>
                                        </div>
                                    )}
                                    <div className={`flex ${isBirthday ? "mt-1 min-h-[2rem]" : "mt-3 min-h-[3rem]"} flex-col items-center justify-start gap-1.5`}>

                                        {/* 完了記録・予定の印を最大数まで並べる */}
                                        <div className="grid grid-cols-3 gap-1.5 justify-items-center mt-[-4px] text-[12px]">
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
                                            ) : isBirthday ? null : (
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

                {/* 食事・排泄・薬・測定などを一覧で操作するノート */}
                <section className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-2xl font-bold mb-4">📝 お世話ノート</h2>
                    <p className="mb-4 inline-flex rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                        ✓ お世話ができたら、日付のとなりのチェックを入れて記録してね
                    </p>
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-3 py-2 font-semibold">項目</th>
                                    <th className="px-3 py-2 font-semibold">状態</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 各記録種類に合わせて入力欄と状態表示を切り替える */}
                                {quickRecordItems
                                    .filter((item) => item.label !== "元気度")
                                    .map((item) => {
                                        // ご飯の行には日付、食欲状態、個別メモを表示する
                                        if (item.storageKey === "foodHistory") {
                                            // この項目に保存されたメモと選択中の日付を取得する
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
                                                            {/* 食事記録を付ける日付を選ぶ */}
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={selectedDate}
                                                                    onChange={(e) => setRecordDateMap((prev) => ({ ...prev, [item.storageKey]: e.target.value }))}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            {/* 食欲や吐き戻しの状態をボタンで切り替える */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {foodStatusItems.map((status) => {
                                                                    // 選択日の記録有無でボタンの色を切り替える
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
                                                            {/* 選択した日に与えたご飯の量をグラム単位で記録する */}
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="1"
                                                                    value={foodAmountMap[selectedDate] || ""}
                                                                    onChange={(e) => setFoodAmountMap((previous) => ({ ...previous, [selectedDate]: e.target.value }))}
                                                                    placeholder="ご飯の量（g）"
                                                                    aria-label="ご飯の量（g）"
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                                <span className="text-xs font-semibold text-slate-600">g</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => saveFoodAmount(selectedDate)}
                                                                    className="rounded bg-teal-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-600"
                                                                >
                                                                    量を保存
                                                                </button>
                                                            </div>
                                                            {/* ご飯に関するメモを項目別に即時保存する */}
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

                                        // トイレの行には日付、排便・排尿状態、個別メモを表示する
                                        if (item.storageKey === "toiletHistory") {
                                            // この項目に保存されたメモと選択中の日付を取得する
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
                                                            {/* 排泄記録を付ける日付を選ぶ */}
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={selectedDate}
                                                                    onChange={(e) => setRecordDateMap((prev) => ({ ...prev, [item.storageKey]: e.target.value }))}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            {/* 排便・排尿の状態を個別のボタンで記録する */}
                                                            <div className="flex flex-wrap gap-2">
                                                                {toiletStatusItems.map((status) => {
                                                                    // 選択日に登録済みなら完了色で表示する
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
                                                            {/* 排泄に関する補足メモを保存する */}
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

                                        // 薬の行には投与日、薬名、周期、次回予定日を表示する
                                        if (item.storageKey === "medicineHistory") {
                                            // 最後に追加された履歴を読み、次回予定日を表示用に取り出す
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
                                                            {/* 最後に薬を与えた日を指定する */}
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="date"
                                                                    value={medicineLastGivenDate || todayKey}
                                                                    onChange={(e) => setMedicineLastGivenDate(e.target.value)}
                                                                    className="w-32 rounded border border-slate-200 px-2 py-1 text-xs"
                                                                />
                                                            </div>
                                                            {/* 薬の名前を入力する。空欄なら保存関数側で既定名を使う */}
                                                            <input
                                                                type="text"
                                                                value={medicineName}
                                                                onChange={(e) => setMedicineName(e.target.value)}
                                                                placeholder="薬の名前"
                                                                className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                                                            />
                                                            {/* 次回予定日の計算に使う投与間隔を選択する */}
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
                                                                {/* 指定日を選んだときだけ任意の日付欄を表示する */}
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
                                                            {/* 入力した薬名・投与日・周期をリマインダーとして保存する */}
                                                            <button
                                                                type="button"
                                                                onClick={saveMedicineReminder}
                                                                className="rounded bg-red-400 px-2 py-1 text-[11px] font-semibold text-white"
                                                            >
                                                                薬を登録
                                                            </button>
                                                            {/* 薬に関する補足メモを保存する */}
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

                                        // 体重の行には測定日・数値の入力欄と最新値を表示する
                                        if (item.storageKey === "weightHistory") {
                                            // 保存履歴の最後の測定値を取得し、未記録表示も用意する
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
                                                            {/* 同じ行で測定日と体重値を入力する */}
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
                                                            {/* 入力日と数値を体重履歴へ追加する */}
                                                            <button
                                                                type="button"
                                                                onClick={saveWeightRecord}
                                                                className="rounded bg-purple-400 px-2 py-1 text-[11px] font-semibold text-white"
                                                            >
                                                                体重を登録
                                                            </button>
                                                            {/* 体重測定時の気づきをメモとして保存する */}
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

                                        // その他のお世話項目は完了状態、日付、メモを共通表示する
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
                                                        {/* 対象日を選び、完了状態をチェックで切り替える */}
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
                                                        {/* 爪切り・耳掃除だけは次回リマインダー間隔を調整できる */}
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
                                                        {/* 選んだお世話項目に対応するメモを保存する */}
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

                </>
                )}
            </div>
            {/* アルバムを見る操作で開く、写真一覧のモーダル */}
            {isAlbumOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={() => setIsAlbumOpen(false)}
                        aria-label="アルバムを閉じる"
                    />
                    <section className="relative z-10 max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-4 shadow-2xl sm:p-6" role="dialog" aria-modal="true" aria-label="成長アルバム">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">成長アルバム</h2>
                                <p className="mt-1 text-xs text-slate-500">{albumPhotos.length}枚の写真</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAlbumOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600"
                                aria-label="アルバムを閉じる"
                            >
                                ×
                            </button>
                        </div>
                        {albumPhotos.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                                {albumPhotos.map((photo) => (
                                    <button
                                        key={photo.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAlbumPhoto(photo);
                                            setIsAlbumOpen(false);
                                        }}
                                        className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-teal-400"
                                        aria-label="成長写真を拡大"
                                    >
                                        <img src={photo.src} alt="成長記録の写真" className="aspect-square w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="rounded-lg bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">まだ写真がありません。プロフィールの「アルバム用写真登録」から追加できます。</p>
                        )}
                    </section>
                </div>
            )}
            {/* 選択した成長写真を拡大して見返すモーダル */}
            {selectedAlbumPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label="成長アルバムの写真">
                    {/* 暗い背景を押すと拡大表示を閉じる */}
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        onClick={() => setSelectedAlbumPhoto(null)}
                        aria-label="写真を閉じる"
                    />
                    <div className="relative z-10 flex max-h-full max-w-full flex-col items-center">
                        {/* ×ボタンで写真表示を閉じる */}
                        <button
                            type="button"
                            onClick={() => setSelectedAlbumPhoto(null)}
                            className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl text-slate-700 shadow"
                            aria-label="閉じる"
                        >
                            ×
                        </button>
                        {/* 選択した成長写真を画面内に収まる大きさで表示する */}
                        <img
                            src={selectedAlbumPhoto.src}
                            alt="成長記録の写真"
                            className="max-h-[78vh] max-w-[92vw] rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
