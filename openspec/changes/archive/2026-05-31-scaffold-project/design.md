## Context

空白的 vibe-track-frontend 專案目錄，需要建立 React + Vite + TypeScript 的完整基礎。設計稿使用暗色霓虹風格，有嚴格的 design tokens（顏色、字型、間距）。後端 base URL 需可透過環境變數設定，目前開發環境為 `http://localhost:3000`。

## Goals / Non-Goals

**Goals:**
- 建立可執行的 React + Vite + TypeScript 開發環境
- 落地全部 design tokens 為 CSS 自訂屬性（`--bg-0`、`--neon-a` 等）
- 設定三種 Google Fonts（Space Grotesk / Inter / JetBrains Mono）
- 建立後端 API base URL 環境變數機制（`VITE_API_BASE_URL`）
- 定義前後端共用的 TypeScript 型別（Track、Mood、HistoryEntry 等）
- 建立空白的兩頁 Router 結構（/、/dashboard）

**Non-Goals:**
- 實作任何頁面 UI 元件（由後續 change 負責）
- 串接任何 API（由 api-integration change 負責）
- 主題切換邏輯（由 theme-persistence change 負責）

## Decisions

**框架選擇：React + Vite + TypeScript**
- Vite 提供極快的 HMR，配合 TypeScript 嚴格模式確保型別安全
- 不選 Next.js：React Router v7 framework mode 提供同等 SSG/SSR 能力，遷移成本更低

**樣式方案：純 CSS 變數 + CSS Modules**
- Design tokens 放在 `app/styles/tokens.css` 的 `:root`，主題切換只替換變數值
- 元件樣式用 CSS Modules（`.module.css`）避免全域污染
- 不選 Tailwind：設計稿有精確的 token 系統，Tailwind 的 utility class 無法直接映射；也避免增加 bundle 體積

**路由：React Router v7 Framework Mode**
- 使用 `@react-router/dev` Vite plugin，啟用 framework mode
- 兩條路由：`/` → Analyze、`/dashboard` → Dashboard
- 首頁（`/`）在 build 時預先渲染為靜態 HTML（`prerender: ['/']`），支援 SEO
- Dashboard 維持 CSR，歷史紀錄存於 localStorage，server 端無資料可渲染
- 不選 HashRouter：hash URL（`/#/`）無法被搜尋引擎索引；framework mode 同時具備 SSG/SSR 能力，未來若需動態頁面 SSR 只需加 `loader`，不用換框架

**App 目錄結構：`app/`**
- Framework mode 標準慣例，使用 `app/` 作為應用根目錄
- 共用模組（`app/store/`、`app/types/`、`app/lib/`、`app/styles/`）與路由（`app/routes/`）並列

**環境變數：Vite `import.meta.env`**
- `VITE_API_BASE_URL` 預設 `http://localhost:3000`
- `app/lib/env.ts` 統一讀取，避免散落各處

**型別定義集中在 `app/types/api.ts`**
- 與後端 API response 一一對應（Track、Mood、MoodTag、AnalyzeResponse、RateLimitStatus 等）
- 所有欄位按 api.md 標記 nullable（`string | null`）

**Dev Proxy：`vite.config.ts`**
- `/analyze`、`/ratelimit`、`/health` 代理至 `VITE_API_BASE_URL`
- 解決開發時 CORS 問題，生產環境直接設定 `VITE_API_BASE_URL` 為完整後端 URL

## Risks / Trade-offs

- [Google Fonts 需要網路] → 在 `@import` 加 `display=swap`，先以系統字型 fallback 渲染，字型載入後切換，不影響 CLS
- [CSS 變數主題切換的動態效能] → token 數量約 25 個，切換時直接修改 `:root` style attribute，瀏覽器 paint 一次即可
- [Framework mode 需要 Node.js server 才能跑 SSR] → 目前僅用 SSG（prerender），不需要 server；若未來需要 SSR，部署需改為 Node.js server（如 `@react-router/serve`）或平台 adapter
- [Vite 8 + React Router v7 相容性] → 需啟用 `future.v8_viteEnvironmentApi: true`，使用 Vite Environment API 新版行為；升級至 React Router v8 後可移除此 flag
