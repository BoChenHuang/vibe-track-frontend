## 1. 建立 Vercel 設定檔

- [x] 1.1 在專案根目錄建立 `vercel.json`，加入 SPA routing rewrite（`"/(.*)" → "/index.html"`）與 `outputDirectory: "build/client"`
- [x] 1.2 確認 `.gitignore` 包含 `.env`（避免 `.env` 被 commit 進 git）

## 2. 修正 Build 設定

- [x] 2.1 執行 `pnpm build`，確認 TypeScript 編譯與 Vite build 均成功
- [x] 2.2 確認 `build/client/` 目錄含 `index.html` 與 `assets/` 資料夾（React Router v7 framework mode 輸出至 `build/client/`，非 `dist/`）
- [x] 2.3 移除 `react-router.config.ts` 的 `prerender: ['/']`，避免 SPA catch-all rewrite 將 server-rendered HTML 服務給非首頁路由，導致 Hydration Error #418

## 3. Vercel 專案連接（手動操作）

- [x] 3.1 前往 vercel.com，匯入 GitHub repo（`vibe-track-frontend`）
- [x] 3.2 Vercel 自動偵測 Framework Preset（Other，vercel.json 覆蓋設定）
- [x] 3.3 Build Command `npm run build`，Output Directory 由 `vercel.json` 自動提供
- [x] 3.4 在 Environment Variables 設定 `VITE_API_BASE_URL=https://vibe-track.onrender.com`

## 4. 部署與驗證

- [x] 4.1 觸發首次 deploy（連接 repo 後 Vercel 自動 build）
- [x] 4.2 訪問首頁，確認正常渲染
- [x] 4.3 直接訪問 `/dashboard`，確認路由正常載入（prerender 移除後的重新部署）
- [x] 4.4 執行 analyze 功能，確認 API 呼叫成功（後端 CORS 允許 Vercel domain）
- [x] 4.5 若 CORS 失敗，通知後端設定允許 `*.vercel.app` origin
