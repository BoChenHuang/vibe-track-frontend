## Why

Dashboard 是 VibeTrack 的歷史紀錄頁，使用者可以瀏覽本地 localStorage 中儲存的過去查詢，split view 左側清單 + 右側完整預覽，並可將任一筆重播至 Analyze 頁。

## What Changes

- 建立 `src/pages/DashboardPage.tsx`（取代 scaffold 的 placeholder）
- 建立 4 張統計卡元件（Total queries / Today / Rate limit ring / Last vibe）
- 建立 History List 元件（左側可捲動清單，每筆含 type 標籤、相對時間、mood chip）
- 建立 History Preview 元件（右側完整快照：meta、輸入區塊、mood panel、推薦歌曲 mini grid）
- 建立 RateRing 元件（SVG 環形進度，value≥0.99 紅 / ≥0.6 黃 / 其餘青，含 glow）
- 實作 Replay 按鈕（dispatch `replayHistory`，帶完整快照跳回 Analyze 並顯示結果）
- 實作 Dashboard 的 localStorage 讀寫（歷史清單持久化）

## Capabilities

### New Capabilities

- `dashboard-ui`: Dashboard 頁面佈局（統計卡、split view 列表 + 預覽）
- `history-list`: 歷史查詢清單元件（type 標籤、active 狀態、相對時間）
- `history-preview`: 完整快照預覽元件（mood panel + mini song grid + Replay）
- `rate-ring`: SVG 環形進度元件（三色閾值 + glow）

### Modified Capabilities

（無）

## Impact

- 依賴 `scaffold-project`（types/HistoryEntry）、`shared-components`（MoodPanel、utils）、`analyze-page`（SongCard 的精簡版）
- `api-integration` change 的 `submitResolved` 寫入歷史至 AppContext；Dashboard 直接讀取
- 響應式：≤900px Dashboard grid 變單欄
