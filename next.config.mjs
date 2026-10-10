// Next.jsの設定オブジェクトであることをJavaScriptへ伝える
/** @type {import('next').NextConfig} */
const nextConfig = {
    // 開発時に副作用を検出しやすくするReactの厳格モードを有効にする
    reactStrictMode: true,
};

// Next.jsが読み込む設定を公開する
export default nextConfig;
