"use client";

import { useEffect, useState } from "react";

export type ExperienceAction = {
    id: string;
    category: string;
    points: number;
    date: string;
};

type FoodRecord = {
    date: string;
    amount?: number;
    appetiteLevel?: string;
};

type GraphRecord = {
    date: string;
    weight?: number;
    food?: number;
};

type AlbumPhoto = {
    id: string;
    src: string;
    date: string;
};

type PetFeatureStudioProps = {
    petName: string;
    profilePhoto: string | null;
    albumPhotos: AlbumPhoto[];
    experienceLog: ExperienceAction[];
    foodHistory: FoodRecord[];
    graphData: GraphRecord[];
    memoMap: Record<string, string>;
    onAwardExperience: (category: string, points: number) => void;
};

const backgroundThemes = [
    { id: "sunny", label: "ひだまり", level: 1, colors: ["#fff4de", "#f9dfbf"], accent: "#cc8355", icon: "☀️" },
    { id: "sakura", label: "さくら", level: 2, colors: ["#fff1f5", "#f7dce7"], accent: "#ca718b", icon: "🌸" },
    { id: "ocean", label: "なつの海", level: 3, colors: ["#e8f7f5", "#cde9e5"], accent: "#428b8b", icon: "🌊" },
    { id: "autumn", label: "もみじ", level: 4, colors: ["#fff1df", "#f1d7bd"], accent: "#a66c43", icon: "🍁" },
    { id: "snow", label: "ゆきあかり", level: 5, colors: ["#eef5fb", "#d9e8f5"], accent: "#688baa", icon: "❄️" },
];

const photoFrames = [
    { id: "spring", label: "春・さくら", icon: "🌸", colors: ["#fff0f5", "#f8d9e7"], accent: "#cb718c", note: "桜の花びらと春色のリボン" },
    { id: "summer", label: "夏・ひまわり", icon: "🌻", colors: ["#fff7d8", "#f8e5a5"], accent: "#d49a38", note: "ひまわりと明るい夏空" },
    { id: "autumn", label: "秋・紅葉", icon: "🍁", colors: ["#fff0dd", "#edd0b1"], accent: "#ae7048", note: "紅葉とあたたかな木の実" },
    { id: "winter", label: "冬・雪", icon: "❄️", colors: ["#eef6fd", "#d7e8f5"], accent: "#6789ac", note: "雪の結晶と冬の星" },
];

function titleForPet(level: number, experienceLog: ExperienceAction[]) {
    const foodCount = experienceLog.filter((entry) => entry.category === "food").length;
    const brushingCount = experienceLog.filter((entry) => entry.category === "brushing").length;
    const photoCount = experienceLog.filter((entry) => entry.category === "photo").length;

    if (brushingCount >= 5) return "ブラッシング王";
    if (foodCount >= 5) return "ごはんマスター";
    if (photoCount >= 5) return "思い出コレクター";
    if (level >= 5) return "ベテランにゃん";
    if (level >= 2) return "お世話見習い";
    return "おねむにゃん";
}

export default function PetFeatureStudio({
    petName,
    profilePhoto,
    albumPhotos,
    experienceLog,
    foodHistory,
    graphData,
    memoMap,
    onAwardExperience,
}: PetFeatureStudioProps) {
    const [selectedThemeId, setSelectedThemeId] = useState("sunny");
    const [selectedFrameId, setSelectedFrameId] = useState(() => {
        const month = new Date().getMonth();
        if ([2, 3, 4].includes(month)) return "spring";
        if ([5, 6, 7].includes(month)) return "summer";
        if ([8, 9, 10].includes(month)) return "autumn";
        return "winter";
    });
    const [selectedPhotoId, setSelectedPhotoId] = useState("");
    const [generatedCard, setGeneratedCard] = useState<string | null>(null);
    const [cardMessage, setCardMessage] = useState("");
    const [talkMessage, setTalkMessage] = useState("記録を見せてくれたら、いなりちゃんが感想をお話しするにゃ。");
    const [talkIndex, setTalkIndex] = useState(0);

    const experience = experienceLog.reduce((total, action) => total + action.points, 0);
    const level = Math.floor(experience / 100) + 1;
    const levelProgress = experience % 100;
    const nextLevelPoints = 100 - levelProgress;
    const petTitle = titleForPet(level, experienceLog);
    const unlockedThemes = backgroundThemes.filter((theme) => theme.level <= level);
    const activeTheme = unlockedThemes.find((theme) => theme.id === selectedThemeId) || unlockedThemes[0];
    const availablePhotos = [
        ...(profilePhoto ? [{ id: "profile", src: profilePhoto, date: "" }] : []),
        ...albumPhotos,
    ];
    const activePhoto = availablePhotos.find((photo) => photo.id === selectedPhotoId) || availablePhotos[0];

    useEffect(() => {
        const savedTheme = localStorage.getItem("petBackgroundTheme");
        if (savedTheme && backgroundThemes.some((theme) => theme.id === savedTheme && theme.level <= level)) {
            setSelectedThemeId(savedTheme);
        }
    }, [level]);

    const selectTheme = (themeId: string) => {
        setSelectedThemeId(themeId);
        localStorage.setItem("petBackgroundTheme", themeId);
    };

    const createPhotoCard = () => {
        if (!activePhoto) {
            setCardMessage("先にプロフィール写真かアルバム写真を登録してください。");
            return;
        }

        const frame = photoFrames.find((entry) => entry.id === selectedFrameId) || photoFrames[0];
        const source = new window.Image();
        source.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 1080;
            canvas.height = 1350;
            const context = canvas.getContext("2d");
            if (!context) {
                setCardMessage("カード画像を作れませんでした。もう一度お試しください。");
                return;
            }

            const background = context.createLinearGradient(0, 0, canvas.width, canvas.height);
            background.addColorStop(0, frame.colors[0]);
            background.addColorStop(1, frame.colors[1]);
            context.fillStyle = background;
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.strokeStyle = frame.accent;
            context.lineWidth = 12;
            context.beginPath();
            context.roundRect(34, 34, canvas.width - 68, canvas.height - 68, 44);
            context.stroke();

            context.textAlign = "center";
            context.fillStyle = "#56463f";
            context.font = "700 54px 'M PLUS Rounded 1c', sans-serif";
            context.fillText("うちの子カード", canvas.width / 2, 132);
            context.font = "42px sans-serif";
            context.fillText(`${frame.icon}   ${frame.icon}   ${frame.icon}`, canvas.width / 2, 198);

            const photoX = 130;
            const photoY = 250;
            const photoSize = 820;
            const scale = Math.max(photoSize / source.width, photoSize / source.height);
            const drawWidth = source.width * scale;
            const drawHeight = source.height * scale;
            context.save();
            context.beginPath();
            context.roundRect(photoX, photoY, photoSize, photoSize, 42);
            context.clip();
            context.drawImage(source, photoX + (photoSize - drawWidth) / 2, photoY + (photoSize - drawHeight) / 2, drawWidth, drawHeight);
            context.restore();

            context.strokeStyle = "rgba(255, 255, 255, 0.94)";
            context.lineWidth = 14;
            context.beginPath();
            context.roundRect(photoX, photoY, photoSize, photoSize, 42);
            context.stroke();

            context.fillStyle = "#493d39";
            context.font = "700 58px 'M PLUS Rounded 1c', sans-serif";
            context.fillText(petName || "うちの子", canvas.width / 2, 1168);
            context.fillStyle = frame.accent;
            context.font = "700 34px 'M PLUS Rounded 1c', sans-serif";
            context.fillText(`Lv.${level}  ${petTitle}`, canvas.width / 2, 1230);
            context.fillStyle = "#766760";
            context.font = "28px 'M PLUS Rounded 1c', sans-serif";
            context.fillText(frame.note, canvas.width / 2, 1282);

            setGeneratedCard(canvas.toDataURL("image/png"));
            setCardMessage("カードができました。画像を保存してSNSでシェアできます。");
            onAwardExperience("card", 15);
        };
        source.onerror = () => setCardMessage("写真を読み込めませんでした。別の写真を選んでください。");
        source.src = activePhoto.src;
    };

    const generateTalk = () => {
        const comments: string[] = [];
        const latestMeal = [...foodHistory]
            .filter((entry) => Number(entry.amount) > 0)
            .sort((first, second) => second.date.localeCompare(first.date))[0];
        const latestWeight = [...graphData]
            .filter((entry) => Number(entry.weight) > 0)
            .sort((first, second) => second.date.localeCompare(first.date))[0];
        const brushingMemo = memoMap.brushingHistory?.trim();
        const catName = petName || "きみ";

        if (latestMeal) {
            comments.push(`今日は${latestMeal.amount}gもごはんを食べたにゃ。おいしかったにゃ！`);
            comments.push(`ごはんを用意してくれてありがとうにゃ、${catName}はとってもうれしいにゃ。`);
        }
        if (latestWeight) {
            comments.push("体重を記録してくれてありがとうにゃ。見守ってくれて安心するにゃ。");
            comments.push(`今日も健康のことを気にかけてくれてうれしいにゃ。`);
        }
        if (brushingMemo) {
            comments.push("ブラッシング気持ちよかったにゃ。ふわふわになったにゃ！");
        }
        if (comments.length === 0) {
            comments.push("今日もそばにいてくれてうれしいにゃ。ゆっくり一緒に過ごそうにゃ。");
            comments.push("なでなでしてくれる？きみのそばがいちばん落ち着くにゃ。");
            comments.push("今日もお世話してくれてありがとうにゃ。大好きにゃ！");
        }

        setTalkMessage(comments[talkIndex % comments.length]);
        setTalkIndex((index) => index + 1);
    };

    return (
        <div className="space-y-6">
            <section className="rounded-xl border border-amber-100 p-5 shadow-sm transition-colors" style={{ background: `linear-gradient(135deg, ${activeTheme.colors[0]}, ${activeTheme.colors[1]})` }}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-500">Nyan Level</p>
                        <h2 className="mt-1 text-2xl font-bold text-slate-800">{activeTheme.icon} Lv.{level} · {petTitle}</h2>
                        <p className="mt-1 text-sm text-slate-600">{experience} XP · 次のレベルまであと {nextLevelPoints} XP</p>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-slate-600">{petName || "うちの子"}</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70" aria-label={`次のレベルまで${levelProgress}%`}>
                    <div className="h-full rounded-full bg-rose-400 transition-all" style={{ width: `${levelProgress}%` }} />
                </div>
                <div className="mt-5 border-t border-white/70 pt-4">
                    <p className="mb-2 text-sm font-bold text-slate-700">背景テーマ</p>
                    <div className="flex flex-wrap gap-2">
                        {backgroundThemes.map((theme) => {
                            const isUnlocked = theme.level <= level;
                            return (
                                <button
                                    key={theme.id}
                                    type="button"
                                    disabled={!isUnlocked}
                                    onClick={() => selectTheme(theme.id)}
                                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedThemeId === theme.id ? "border-slate-700 bg-white text-slate-800" : "border-white/80 bg-white/50 text-slate-700"} ${!isUnlocked ? "cursor-not-allowed opacity-50" : "hover:bg-white"}`}
                                    aria-pressed={selectedThemeId === theme.id}
                                >
                                    {isUnlocked ? `${theme.icon} ${theme.label}` : `🔒 Lv.${theme.level}`}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-sky-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-800">📸 うちの子カード</h2>
                    <p className="mt-1 text-xs text-slate-500">季節のフレーム付き・SNS向け縦長カード</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-600">
                        写真
                        <select
                            value={activePhoto?.id || ""}
                            onChange={(event) => setSelectedPhotoId(event.target.value)}
                            className="rounded-md border border-slate-200 bg-white px-3 py-2"
                            disabled={availablePhotos.length === 0}
                        >
                            {availablePhotos.length === 0 ? (
                                <option value="">写真を先に登録してください</option>
                            ) : (
                                availablePhotos.map((photo, index) => (
                                    <option key={photo.id} value={photo.id}>{photo.id === "profile" ? "プロフィール写真" : `アルバム写真 ${index + 1}`}</option>
                                ))
                            )}
                        </select>
                    </label>
                    <button
                        type="button"
                        onClick={createPhotoCard}
                        disabled={availablePhotos.length === 0}
                        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                        カードを作る
                    </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="季節フレーム">
                    {photoFrames.map((frame) => (
                        <button
                            key={frame.id}
                            type="button"
                            onClick={() => setSelectedFrameId(frame.id)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${selectedFrameId === frame.id ? "border-slate-700 bg-slate-800 text-white" : "border-slate-200 bg-white text-slate-600"}`}
                            aria-pressed={selectedFrameId === frame.id}
                        >
                            {frame.icon} {frame.label}
                        </button>
                    ))}
                </div>
                {cardMessage && <p className="mt-3 text-sm text-slate-600" role="status">{cardMessage}</p>}
                {generatedCard && (
                    <div className="mt-4 flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
                        <img src={generatedCard} alt={`${petName || "うちの子"}の季節カード`} className="max-h-[480px] w-auto rounded-lg border border-slate-200 shadow-md" />
                        <a href={generatedCard} download={`${petName || "うちの子"}-card.png`} className="rounded-md border border-sky-200 px-4 py-2 text-sm font-bold text-sky-800 hover:bg-sky-50">カード画像を保存</a>
                    </div>
                )}
            </section>

            <section className="rounded-lg border border-rose-100 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">💬 にゃんトーク</h2>
                        <p className="mt-1 text-xs text-slate-500">記録から作る、やさしいひとこと</p>
                    </div>
                    <button type="button" onClick={generateTalk} className="rounded-md bg-rose-400 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500">お話しする</button>
                </div>
                <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-900" aria-live="polite">「{talkMessage}」</p>
                <p className="mt-2 text-[11px] text-slate-400">このコメントは保存済みの記録をもとに端末内で作成します。</p>
            </section>
        </div>
    );
}
