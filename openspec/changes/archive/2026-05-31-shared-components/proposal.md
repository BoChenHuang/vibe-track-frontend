## Why

Analyze 與 Dashboard 兩頁共用多個視覺元件（背景大氣光暈、頂部導覽列、速率限制 pill、toast 通知、SVG icon 集合），需要在 scaffold 完成後優先建立這些元件，讓兩頁的實作 change 有基礎可引用。

## What Changes

- 建立 `src/components/layout/Atmosphere.tsx`：三顆 blur 光暈球 + 顆粒紋理疊加層（純 CSS，no image）
- 建立 `src/components/layout/Topbar.tsx`：品牌 logo、中央頁面切換 nav、右側 UsagePill
- 建立 `src/components/ui/UsagePill.tsx`：顯示 `remaining/limit RATE / HR`，含點狀指示燈
- 建立 `src/components/ui/RateLimitToast.tsx`：429 錯誤 toast，含倒數計時（`19m 59s` / `1h 5m` 格式）
- 建立 `src/lib/icons.tsx`：全部內聯 SVG icon（Spotify、ExternalLink、Play、Wave、Sparkle 等）
- 建立 `src/lib/utils.ts`：共用工具函式（`formatCountdown`、`formatRelativeTime`、`formatFileSize`）

## Capabilities

### New Capabilities

- `shared-ui`: Atmosphere 背景、Topbar、UsagePill、RateLimitToast 等共用 UI 元件
- `icon-system`: 內聯 SVG icon 集合（無外部圖示庫依賴）
- `utils`: 格式化工具函式（倒數、相對時間、檔案大小）

### Modified Capabilities

（無）

## Impact

- 依賴 `scaffold-project` change 的 design tokens 與型別定義
- `analyze-page` 與 `dashboard-page` change 均引用此 change 的元件
- 無外部新依賴（圖示用內聯 SVG）
