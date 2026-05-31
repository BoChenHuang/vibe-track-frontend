## Context

shared-components 完成後，可以開始實作 Analyze 頁。此頁是 VibeTrack 主要互動界面，包含輸入、送出、結果展示三個階段。設計稿（analyze.jsx）以 mock setTimeout 模擬 API；此 change 先以靜態 mock 資料完成視覺，留 submit action 的 async 邏輯給 api-integration。

## Goals / Non-Goals

**Goals:**
- 完整實作 Analyze 頁面佈局（兩欄 grid 1.05fr 0.95fr）
- Input 卡：text/image tabs、textarea（min-height 160px，focus glow）、建議 chip（4 個）、字數 n/500
- Image 模式：drag&drop 區（虛線邊框，220px min-height）、拖曳 hover 樣式、上傳預覽（縮圖 + 檔名/大小 + 移除鈕）
- Controls row：Market 下拉（6 選項含國旗 emoji）、Tracks 下拉（5/8/10）、CTA 按鈕
- CTA loading 態：脈動 orb + 循環文案（4 段，700ms interval）
- Detected mood 面板：漸層 hero（200px）、PRIMARY MOOD 標記、情緒標籤 list
- PreviewEmpty 等待態：頻譜條動畫 + 「Awaiting signal」
- MoodSkeleton：骨架 shimmer
- Song card：封面（含 cover-shade 遮罩）、rank 徽章、POP 徽章（conditional）、迷你播放鈕（conditional，hover 浮現）、歌名/藝人/reason、Spotify 連結
- 未送出時 8 張 placeholder 卡
- ⌘/Ctrl + Enter 送出快捷鍵

**Non-Goals:**
- 真實 API 呼叫（api-integration change）
- 音檔試聽的 `<audio>` 播放（api-integration change）
- Rate limit 更新邏輯（api-integration change）

## Decisions

**Submit 暫以 mock 實作**
- `submit` action 呼叫 `src/mock/mockAnalyze()`，延遲 1.8s 回傳 mock AnalyzeResponse
- api-integration change 替換此函式為真實 fetch

**Song Card 封面降級**
- `album_image_url` 有值 → `<img>` 顯示（object-fit: cover）
- null → 顯示漸層占位背景（`var(--grad-primary)`，低 opacity）

**Mood panel 漸層顏色**
- 設計稿的 mood hero 漸層從 `gradA`/`gradB` 兩色組合
- mock 資料提供幾組預設 gradA/gradB；真實 mood 回傳後動態套用（inline style）

**Audio preview state**
- `playingId: string | null` 存在 AnalyzePage local state（非 AppContext）
- 只影響 UI 圖示切換；實際播放由 api-integration 接 `<audio>` element

**CTA disabled 條件**
- text 模式：`textValue.trim() === ''`
- image 模式：`imageFile === null`
- 或 `loading === true`

## Risks / Trade-offs

- [Drag&drop + click 兩種上傳] → 需處理 `dragover` 預設行為阻止；click 用隱藏 `<input type="file">` 觸發
- [Textarea 字數計算] → 以 Unicode code point 計算（`[...text].length`），避免 emoji 計數錯誤
- [CTA 文案循環] → `setInterval` 在 loading 期間執行，unmount 或 loading 結束要 clearInterval
