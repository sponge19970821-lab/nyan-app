// アプリのトップページを表示する
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {/* 画面の縦横中央にアプリの挨拶を配置する */}
      {/* Nyan Appのトップページであることを見出しで示す */}
      <h1 className="text-4xl font-bold">こんにちは  Nyan App 🐾</h1>
      {/* Next.jsページが読み込まれたことを補足テキストで示す */}
      <p className="text-lg text-gray-600 mt-4"></p>
    </main>
  );
}