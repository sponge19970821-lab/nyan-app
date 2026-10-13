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
    albumPhotos: AlbumPhoto[];
    experienceLog: ExperienceAction[];
    foodHistory: FoodRecord[];
    graphData: GraphRecord[];
    memoMap: Record<string, string>;
    onAlbumPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenAlbum: () => void;
};

const backgroundThemes = [
    { id: "sunny", label: "ひだまり", level: 1, colors: ["#fff4de", "#f9dfbf"], accent: "#cc8355", icon: "☀️" },
    { id: "sakura", label: "さくら", level: 2, colors: ["#fff1f5", "#f7dce7"], accent: "#ca718b", icon: "🌸" },
    { id: "ocean", label: "なつの海", level: 3, colors: ["#e8f7f5", "#cde9e5"], accent: "#428b8b", icon: "🌊" },
    { id: "autumn", label: "もみじ", level: 4, colors: ["#fff1df", "#f1d7bd"], accent: "#a66c43", icon: "🍁" },
    { id: "snow", label: "ゆきあかり", level: 5, colors: ["#eef5fb", "#d9e8f5"], accent: "#688baa", icon: "❄️" },
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
    albumPhotos,
    experienceLog,
    foodHistory,
    graphData,
    memoMap,
    onAlbumPhotoChange,
    onOpenAlbum,
}: PetFeatureStudioProps) {
    const [selectedThemeId, setSelectedThemeId] = useState("sunny");
    const [talkMessage, setTalkMessage] = useState("記録を見せてくれたら、いなりちゃんが感想をお話しするにゃ。");
    const [talkIndex, setTalkIndex] = useState(0);

    const experience = experienceLog.reduce((total, action) => total + action.points, 0);
    const level = Math.floor(experience / 100) + 1;
    const levelProgress = experience % 100;
    const nextLevelPoints = 100 - levelProgress;
    const petTitle = titleForPet(level, experienceLog);
    const unlockedThemes = backgroundThemes.filter((theme) => theme.level <= level);
    const activeTheme = unlockedThemes.find((theme) => theme.id === selectedThemeId) || unlockedThemes[0];
    const recentPhotos = [...albumPhotos]
        .sort((first, second) => second.date.localeCompare(first.date) || second.id.localeCompare(first.id))
        .slice(0, 3);

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
                        <p className="mt-2 text-xs font-medium text-slate-600">お世話の記録や写真登録でXPをためて、100XPごとにレベルアップ！</p>
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

            <section className="overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-rose-400">LITTLE MOMENTS</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-800">📷 最近のアルバム</h2>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-600 shadow-sm">
                        {albumPhotos.length}枚の思い出
                    </span>
                </div>
                {recentPhotos.length > 0 ? (
                    <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
                        {recentPhotos.map((photo, index) => (
                            <button
                                key={photo.id}
                                type="button"
                                onClick={onOpenAlbum}
                                className={`group relative aspect-square overflow-hidden rounded-xl border-4 border-white bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg ${index === 1 ? "sm:mt-3" : ""}`}
                                aria-label={`アルバムを見る: ${photo.date}の写真`}
                            >
                                <img
                                    src={photo.src}
                                    alt={`${photo.date}に登録した写真`}
                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/70 to-transparent px-2 pb-2 pt-5 text-left text-[10px] font-medium text-white sm:text-xs">
                                    {photo.date}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="mb-4 rounded-xl border border-dashed border-rose-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                        写真を登録すると、最近の3枚がここに並びます 🐾
                    </p>
                )}
                <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700">
                        <span aria-hidden="true">＋</span>
                        アルバム用写真登録
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onAlbumPhotoChange}
                            className="hidden"
                        />
                    </label>
                    <button
                        type="button"
                        onClick={onOpenAlbum}
                        className="rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm font-bold text-teal-800 shadow-sm transition hover:bg-teal-50"
                    >
                        アルバムを見る{albumPhotos.length > 0 ? `（${albumPhotos.length}枚）` : ""}
                    </button>
                </div>
                <p className="mt-3 text-center text-xs text-rose-400" aria-hidden="true">✦　大切な思い出をいつでも見返そう　✦</p>
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
