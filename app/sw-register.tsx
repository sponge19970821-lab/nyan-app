"use client";

import { useEffect } from "react";

// ブラウザーでオフライン対応用のサービスワーカーを登録する
export default function SwRegister() {
  // 初回表示後にブラウザー機能を確認し、サービスワーカーを登録する
  useEffect(() => {
    // ブラウザー上で動作しており、Service Worker APIが使える場合だけ続ける
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        // public/sw.jsをページのオフライン制御用として登録する
        .register("/sw.js")
        // 登録に成功した場合は開発者ツールへ結果を出す
        .then(() => console.log("Service worker registered"))
        // 失敗時は理由を警告として出し、画面表示は継続する
        .catch((err) => console.warn("SW registration failed", err));
    }
  }, []);

  // このコンポーネント自体には画面要素を表示しない
  return null;
}
