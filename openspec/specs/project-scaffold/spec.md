## ADDED Requirements

### Requirement: Vite React TypeScript project initialised
系統 SHALL 使用 Vite + React + TypeScript 作為開發環境，支援 HMR 與嚴格型別檢查。

#### Scenario: Dev server starts
- **WHEN** 開發者執行 `pnpm dev`
- **THEN** Vite dev server 在 port 5173 啟動，頁面在瀏覽器中顯示應用框架

#### Scenario: Production build succeeds
- **WHEN** 開發者執行 `pnpm build`
- **THEN** TypeScript 編譯通過，輸出 dist/ 目錄，無型別錯誤

### Requirement: Design tokens defined as CSS custom properties
系統 SHALL 在 `src/styles/tokens.css` 的 `:root` 中定義全部設計 token，包含顏色（`--bg-0` 至 `--neon-danger`）、圓角（`--radius-xs` 至 `--radius-xl`）、陰影、間距。

#### Scenario: Token variables accessible
- **WHEN** 任意元件 CSS 中使用 `var(--neon-a)`
- **THEN** 瀏覽器解析為 `#ff3cac`

#### Scenario: Neon theme is default
- **WHEN** 頁面初始載入，無任何主題 class 時
- **THEN** 所有 neon token 值對應 README 的預設值（`--neon-a: #ff3cac`、`--bg-0: #07060d` 等）

### Requirement: Google Fonts loaded
系統 SHALL 透過 Google Fonts CDN import Space Grotesk（400/500/600/700）、Inter（400/500/600）、JetBrains Mono（400/500），並套用 `font-display: swap`。

#### Scenario: Fonts applied to body
- **WHEN** 頁面載入完成
- **THEN** `body` 的字型 fallback 為 Inter，待 Google Fonts 載入後切換為 Inter

### Requirement: Backend URL configurable via environment variable
系統 SHALL 從 `VITE_API_BASE_URL` 環境變數讀取後端 base URL；若未設定，SHALL 預設 `http://localhost:3000`。

#### Scenario: Custom backend URL used in requests
- **WHEN** `.env` 設定 `VITE_API_BASE_URL=https://api.example.com`
- **THEN** `src/lib/env.ts` 匯出的 `API_BASE_URL` 值為 `https://api.example.com`

#### Scenario: Default fallback applied
- **WHEN** 未設定 `VITE_API_BASE_URL`
- **THEN** `API_BASE_URL` 值為 `http://localhost:3000`

### Requirement: Two-page router structure
系統 SHALL 提供兩條路由：`/`（Analyze 頁）與 `/dashboard`（Dashboard 頁），使用 React Router v6 HashRouter。

#### Scenario: Root path renders Analyze placeholder
- **WHEN** 使用者訪問 `/#/`
- **THEN** Analyze 頁面元件渲染（初期可為 placeholder）

#### Scenario: Dashboard path renders Dashboard placeholder
- **WHEN** 使用者訪問 `/#/dashboard`
- **THEN** Dashboard 頁面元件渲染（初期可為 placeholder）
