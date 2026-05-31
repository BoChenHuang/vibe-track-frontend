## Why

VibeTrack 前端目前是空白專案，需要從零建立 React + Vite + TypeScript 的基礎環境，並將設計稿的 design tokens 落地為 CSS 變數，讓後續各功能 change 有一致的基礎可以疊加。

## What Changes

- 初始化 Vite + React + TypeScript 專案（`pnpm create vite`）
- 安裝並設定核心相依：react-router-dom（頁面切換）
- 建立 `src/styles/tokens.css`：完整的 `:root` CSS 變數（顏色、圓角、陰影、間距、字型）
- 建立 `src/styles/typography.css`：Google Fonts（Space Grotesk / Inter / JetBrains Mono）import + 字型 class 定義
- 建立 `src/styles/global.css`：reset、body 背景、基礎版面
- 建立 `src/styles/index.css`：統一 import 點
- 建立 `.env.example` + `src/lib/env.ts`：後端 base URL（`VITE_API_BASE_URL`，預設 `http://localhost:3000`）
- 建立 App shell：`src/App.tsx`（router wrapper）、`src/main.tsx` 入口
- 建立型別定義 `src/types/api.ts`：`Mood`、`Track`、`HistoryEntry`、`RateLimitStatus` 等共用型別
- 設定 `vite.config.ts`：proxy `/api` → 後端（dev 環境避免 CORS）

## Capabilities

### New Capabilities

- `project-scaffold`: Vite + React + TS 基礎環境、CSS tokens、字型、環境變數設定
- `api-types`: 前後端共用的 TypeScript 型別定義（Track、Mood、HistoryEntry 等）

### Modified Capabilities

（無，這是全新專案）

## Impact

- 建立整個前端專案的根目錄結構
- 後續所有 change 均依賴此 change 的輸出
- 無 breaking change（新專案）
