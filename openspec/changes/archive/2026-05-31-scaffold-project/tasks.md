## 1. 初始化專案

- [x] 1.1 執行 `pnpm create vite . --template react-ts` 初始化 Vite + React + TypeScript 專案
- [x] 1.2 安裝相依：`pnpm add react-router-dom`
- [x] 1.3 清除 Vite 預設的 `src/App.css`、`src/index.css`、`src/assets/react.svg` 等樣板檔

## 2. Design Tokens 與樣式基礎

- [x] 2.1 建立 `src/styles/tokens.css`，定義完整 `:root` CSS 變數（所有顏色 `--bg-0`、`--neon-a` 等、圓角 `--radius-xs` 至 `--radius-xl`、陰影 `--shadow-soft`、`--shadow-glow-a`、漸層 `--grad-primary`）
- [x] 2.2 建立 `src/styles/typography.css`，含 Google Fonts `@import`（Space Grotesk / Inter / JetBrains Mono），以及 `.font-display`、`.font-body`、`.font-mono` class 定義
- [x] 2.3 建立 `src/styles/global.css`：CSS reset（box-sizing、margin 清零）、`body` 背景色（`var(--bg-0)`）、`font-family: Inter, sans-serif`、`color: var(--ink-0)`
- [x] 2.4 建立 `src/styles/index.css`，依序 import tokens → typography → global
- [x] 2.5 在 `src/main.tsx` import `./styles/index.css`

## 3. 環境變數設定

- [x] 3.1 建立 `.env.example`，內容：`VITE_API_BASE_URL=http://localhost:3000`
- [x] 3.2 建立 `.env`（本地開發用，加入 .gitignore），內容：`VITE_API_BASE_URL=http://localhost:3000`
- [x] 3.3 建立 `src/lib/env.ts`，匯出 `API_BASE_URL`（讀 `import.meta.env.VITE_API_BASE_URL`，fallback `http://localhost:3000`）

## 4. TypeScript 型別定義

- [x] 4.1 建立 `src/types/api.ts`，定義 `MoodTag`、`Mood`、`Track`、`AnalyzeResponse`、`RateLimitStatus`、`RateLimitError`（含所有 nullable 欄位）
- [x] 4.2 在同檔定義 `HistoryEntry`（含 `id`、`ts`、`type`、`input`、`market`、`mood`、`tracks`）
- [x] 4.3 在同檔定義 `AppState`（含全部 state slice）、`AppAction`（union type 含所有 action type）

## 5. App Shell 與路由

- [x] 5.1 建立 `src/pages/AnalyzePage.tsx`（暫為空白 placeholder，顯示 `<div>Analyze</div>`）
- [x] 5.2 建立 `src/pages/DashboardPage.tsx`（暫為空白 placeholder，顯示 `<div>Dashboard</div>`）
- [x] 5.3 建立 `src/store/reducer.ts`，實作 `appReducer`（初始 state + 空 action handlers，型別完整）
- [x] 5.4 建立 `src/store/AppContext.tsx`，提供 `AppContext`（包含 state 與 dispatch）
- [x] 5.5 改寫 `src/App.tsx`：用 `HashRouter`，包裹 `AppContext.Provider`，設定兩條路由（`/` → AnalyzePage、`/dashboard` → DashboardPage）
- [x] 5.6 確認 `pnpm dev` 啟動正常，`/#/` 與 `/#/dashboard` 各自渲染對應頁面

## 6. Vite Proxy 設定

- [x] 6.1 更新 `vite.config.ts`，在 `server.proxy` 中將 `/analyze`、`/ratelimit`、`/health` 代理至 `process.env.VITE_API_BASE_URL ?? 'http://localhost:3000'`

## 7. 驗收

- [x] 7.1 執行 `pnpm build`，確認 TypeScript 編譯無錯誤
- [x] 7.2 確認 `var(--neon-a)` 在瀏覽器 DevTools 解析為 `#ff3cac`
- [x] 7.3 確認 `src/types/api.ts` 的 `Track.preview_url` 型別為 `string | null`
