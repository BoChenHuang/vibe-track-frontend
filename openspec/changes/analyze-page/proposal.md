## Why

Analyze 是 VibeTrack 的核心功能頁，使用者在此輸入文字或圖片、選擇市場與歌曲數、送出後看到情緒摘要與推薦歌單。需要實作完整的 UI 元件與 AppContext 狀態串接，但先以 mock 資料驗收視覺，真實 API 串接由 api-integration change 負責。

## What Changes

- 建立 `src/pages/AnalyzePage.tsx`（取代 scaffold 的 placeholder）
- 建立 Input 卡片（Text / Image 切換 tabs、textarea、drag&drop 上傳、market 下拉、tracks 下拉、CTA 按鈕）
- 建立 Detected Mood 面板（漸層 hero、情緒標籤、等待態動畫、loading skeleton）
- 建立 Song Card 元件（封面、rank、歌名/藝人/reason、POP 徽章、播放鈕、Spotify 連結）
- 建立 Results section（歌曲 4 欄 grid、結果 header actions）
- 實作 AppContext dispatch（`setText`、`setImage`、`setMarket`、`setTrackCount`、`submit`、`submitResolved`）
- 使用 mock 資料（`src/mock/data.ts`）讓 UI 可在無後端時驗收

## Capabilities

### New Capabilities

- `analyze-input`: 文字/圖片輸入元件（tabs、textarea、drag&drop、market、tracks、CTA）
- `mood-panel`: Detected mood 顯示（漸層 hero、標籤、等待態、skeleton）
- `song-card`: 歌曲卡元件（封面、rank、reason、POP/播放 conditional）
- `analyze-results`: 結果 grid 與 header actions

### Modified Capabilities

（無）

## Impact

- 依賴 `scaffold-project`（tokens、types）與 `shared-components`（Topbar、icons、utils）
- `api-integration` change 將替換此 change 的 mock submit 邏輯
- 響應式斷點：≤1100px 3 欄、≤800px 2 欄且主區單欄
