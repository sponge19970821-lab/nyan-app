import Link from "next/link";

// アプリのトップページを表示する
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900">
      {/* 画面の縦横中央にアプリの挨拶を配置する */}
      {/* Nyan Appのトップページであることを見出しで示す */}
      <h1 className="text-4xl font-bold">こんにちは Nyan App 🐾</h1>
      {/* Next.jsページが読み込まれたことを補足テキストで示す */}
      <Link
        href="/pet"
        className="mt-8 rounded-full bg-teal-600 px-10 py-3 text-lg font-bold tracking-widest text-white transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
      >
        START
      </Link>
    </main>
  );
}