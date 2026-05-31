## Context

api-integration 完成後，`submitResolved` 會將完整 HistoryEntry 寫入 AppContext `state.history`（最新的在前）。Dashboard 頁直接讀取此陣列，無需另設 API 呼叫。localStorage 的讀寫由 theme-persistence change 統一處理（`vibetrack:history:v3` key）；此 change 只處理 UI。

## Goals / Non-Goals

**Goals:**
- Dashboard grid 佈局：`340px 1fr`，gap 24px，≤900px 變單欄
- 4 張統計卡：`repeat(4, 1fr)` grid，含 Total queries、Today（今日 midnight 後）、Rate limit（RateRing）、Last vibe（mood label）
- RateRing：SVG 圓環（半徑 32px），fill 比例 = `(limit - remaining) / limit`；value ≥ 0.99 → 紅（`var(--neon-danger)`）；≥ 0.6 → 黃（`var(--neon-warn)`）；其餘 → 青（`var(--neon-c)`）；含 glow filter
- History List 左欄：sticky，max-height 撐滿視窗（`calc(100vh - topbar - stats - padding)`），overflow-y auto；每筆有 type badge（TEXT 粉 / IMAGE 青）、相對時間、market、輸入摘要 2 行省略、情緒 chip、歌曲數；active 項目有左側紫青漸層 border + 背景
- History Preview 右欄：meta 列（時間戳、market、類型、歌曲數、Replay 按鈕）、輸入區塊（文字直接顯示 / 圖片顯示「[圖片] 檔名」）、完整 MoodPanel（複用 analyze-page 的元件）、推薦歌曲 mini grid（2 欄，小封面 + 歌名 + 藝人）
- 空 history 狀態：顯示「尚無紀錄，去 Analyze 頁試試看」提示

**Non-Goals:**
- 刪除歷史紀錄（設計稿未設計此功能）
- 歷史搜尋/篩選（設計稿未設計）
- localStorage 讀寫（由 theme-persistence change 負責）

## Decisions

**HistoryItem active 狀態**
- `selectedId: string | null` 存在 DashboardPage local state（非 AppContext）
- 點擊清單項 → 設 selectedId；預設選中最新一筆（`history[0]?.id`）

**MoodPanel 複用**
- 直接 import analyze-page 建立的 MoodPanel 元件
- 傳入 `mood: Mood` prop 即可（無需 loading/empty 態）

**Mini Song Grid**
- 不複用完整 SongCard，另建 `SongMini.tsx`（小封面 40px、歌名、藝人）
- `repeat(auto-fill, minmax(240px, 1fr))` 適應預覽欄寬度

**Replay 邏輯**
- dispatch `replayHistory(entry)`：將 entry 的 mood + tracks 設為 result、頁面切換至 Analyze
- reducer 的 `replayHistory` action：`{ ...state, page: 'analyze', result: { mood: entry.mood, tracks: entry.tracks } }`

**RateRing threshold**
- `fill = (limit - remaining) / limit`（已用比例）
- fill ≥ 0.99 → 紅（limit 幾乎耗盡）
- fill ≥ 0.6 → 黃（超過一半使用）
- fill < 0.6 → 青（充裕）

## Risks / Trade-offs

- [History list 高度計算] → 用 `calc(100vh - topbarH - statsH - pageHeaderH - padding)` 設定 max-height，配合 sticky 定位；避免 JS 動態計算
- [首次載入無 selectedId] → 預設選中 `history[0]`，若 history 為空顯示空狀態說明
