## 1. Mock 資料

- [x] 1.1 建立 `src/mock/data.ts`，定義 1 組 mock AnalyzeResponse（含 mood 與 5–8 首 tracks，各有 reason、album_image_url、popularity、preview_url 等欄位）
- [x] 1.2 建立 `src/mock/mockAnalyze.ts`，匯出 `mockAnalyze()` async 函式（延遲 1.8s 回傳 mock AnalyzeResponse）

## 2. AppContext Reducer Actions

- [x] 2.1 在 `src/store/reducer.ts` 實作 `setText`、`setImage`、`setMarket`、`setTrackCount` actions
- [x] 2.2 實作 `submit` action（設 loading: true，呼叫 mockAnalyze，完成後 dispatch `submitResolved`）
- [x] 2.3 實作 `submitResolved` action（設 loading: false，存入 result）
- [x] 2.4 實作 `dismissError` action（清除 state.error）

## 3. Analyze 頁面佈局

- [x] 3.1 建立 `src/pages/AnalyzePage.module.css`（analyze-grid 兩欄 `1.05fr 0.95fr`，gap 28px；page-header 樣式；≤800px 單欄 media query）
- [x] 3.2 建立 `src/pages/AnalyzePage.tsx` 主結構（page-header 含 eyebrow + h1 漸層大標 + 副標、analyze-grid 左右欄佔位、results-section 佔位）

## 4. Input 卡片

- [x] 4.1 建立 `src/components/analyze/InputTabs.tsx`（Text / Image pill tab，active state）
- [x] 4.2 建立 `src/components/analyze/TextInput.tsx`（textarea、min-height 160px、focus glow CSS、4 個建議 chip、`n/500` 字數，dispatch `setText`）
- [x] 4.3 建立 `src/components/analyze/ImageUpload.tsx`（drag&drop 區、dragover 樣式、click 觸發 hidden file input、上傳後 preview，dispatch `setImage`）
- [x] 4.4 建立 `src/components/analyze/ControlsRow.tsx`（Market select 含國旗 emoji、Tracks select 5/8/10、CTA 按鈕，dispatch `setMarket`、`setTrackCount`、`submit`）
- [x] 4.5 在 CTA 按鈕加入 loading 態（脈動 orb + setInterval 循環文案，cleanup on unmount）
- [x] 4.6 在 AnalyzePage 加入 `⌘/Ctrl + Enter` keydown listener，觸發 submit（若非 disabled）
- [x] 4.7 組合上述子元件至 `src/components/analyze/InputCard.tsx`（`.card` 樣式，backdrop-blur，border `var(--line)`）

## 5. Detected Mood 面板

- [x] 5.1 建立 `src/components/analyze/PreviewEmpty.tsx`（頻譜條動畫、「Awaiting signal」文字，純 CSS keyframe）
- [x] 5.2 建立 `src/components/analyze/MoodSkeleton.tsx`（骨架 shimmer，CSS shimmer animation）
- [x] 5.3 建立 `src/components/analyze/MoodPanel.tsx`（漸層 hero 200px、PRIMARY MOOD mono 標記、mood.label h2、mood.sub、標籤 list，primary tag 有發光圓點）
- [x] 5.4 建立 `src/components/analyze/MoodSection.tsx`（條件渲染：loading → Skeleton；result → MoodPanel；else → PreviewEmpty）

## 6. Song Card

- [x] 6.1 建立 `src/components/analyze/SongCard.module.css`（1:1 封面、cover-shade 遮罩、rank 徽章、POP 徽章、播放鈕 hover 浮現動畫、hover card translate）
- [x] 6.2 建立 `src/components/analyze/SongCard.tsx`（根據 `album_image_url` / `popularity` / `preview_url` 條件渲染各元素；播放鈕 onClick 更新 playingId local state；Spotify 連結 target=_blank）
- [x] 6.3 在 SongCard 加入 `playingId` prop，播放中時播放鈕顯示 PauseIcon + 萊姆綠色

## 7. Results Section

- [x] 7.1 建立 `src/components/analyze/ResultsSection.tsx`（results header：標題 + Shuffle/Save ghost 按鈕；songs grid；≤1100px → 3 欄、≤800px → 2 欄 media query）
- [x] 7.2 `result === null` 時渲染 8 張半透明 placeholder SongCard（傳入空 mock track，`opacity: 0.35`）

## 8. 整合與驗收

- [x] 8.1 組合所有子元件至 AnalyzePage，確認左右欄及 results section 正確排版
- [x] 8.2 啟動 dev server，用 mock 資料驗收：送出後出現 Mood panel 與歌曲卡
- [x] 8.3 驗收響應式：縮小視窗至 1100px → 3 欄、800px → 2 欄 + 單欄主區
- [x] 8.4 驗收 POP 徽章只在 popularity 非 null 時顯示、播放鈕只在 preview_url 非 null 時顯示
