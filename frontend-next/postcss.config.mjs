// Tailwind CSSをPostCSSから使えるようにする
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

// Next.jsのCSS処理で使うプラグイン設定を公開する
export default config;
