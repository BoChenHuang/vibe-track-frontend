## Why

VibeTrack 有 4 套可切換的調色盤主題（neon/sunset/aurora/mono）且需要跨頁面重新整理持久化；歷史紀錄與本地速率預估資料也需要 localStorage 持久化。這些橫切關注點適合集中在最後一個 change 一起完成，避免每個功能 change 各自散落持久化邏輯。

## What Changes

- 實作 4 套主題的 CSS 變數集（`THEMES` 物件），切換時只替換 `:root` style 上的幾個 token
- 建立 Tweaks 面板（浮動按鈕 + 展開面板），內有 4 個主題選項
- 實作 AppContext 的 `setTheme` action，dispatch 後即時替換 `:root` token
- 實作 localStorage 三把 key 的完整讀寫：
  - `vibetrack:history:v3` → history（僅 submitResolved 時寫入，FIFO 上限 50 筆）
  - `vibetrack:prefs:v3` → `{ theme }`（切主題時寫入）
  - `vibetrack:rate:v3` → rateTimes（本地預估 fallback）
- App 初始化時從 localStorage 復原 history、prefs（主題）、rate

## Capabilities

### New Capabilities

- `theme-system`: 4 套主題 token 切換（neon/sunset/aurora/mono）+ Tweaks 面板
- `local-persistence`: localStorage 讀寫（history/prefs/rate 三把 key）+ 初始化復原

### Modified Capabilities

（無）

## Impact

- 依賴所有前置 change（tokens、reducer、history 資料結構）
- 切主題只改 `:root` CSS 變數，不需 re-render 整棵元件樹
- FIFO 50 筆上限防止 localStorage 無限成長
