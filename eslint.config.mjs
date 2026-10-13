import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.jsの推奨ルールとTypeScript用ルールを組み合わせる
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Next.js標準の除外設定をプロジェクト用に置き換える
  globalIgnores([
    // ビルド成果物や自動生成ファイルを検査対象から外す
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
