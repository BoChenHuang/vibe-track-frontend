## Why

當使用者以圖片模式分析後，點選歷史紀錄的 Replay 無法還原原始圖片，輸入欄為空。由於圖片是 `File` 物件無法序列化至 localStorage，需要 IndexedDB 來持久化圖片 blob。

## What Changes

- 建立 `src/lib/imageStore.ts`：封裝 IndexedDB 的開啟、寫入、讀取、刪除操作（key 為 `entry.id`）
- 在 `submitResolved` 時將 `imageFile` blob 寫入 IndexedDB
- 在 `replayHistory` 時從 IndexedDB 讀出 blob，重建 `File`，dispatch `restoreImageFile` 設回 `state.imageFile`
- 新增 `restoreImageFile` action（`AppAction` + reducer）
- 舊 history entry 若無對應 blob，graceful fail（維持現有行為：切到 image tab 但不還原圖片）

## Capabilities

### New Capabilities

- `image-store`: 封裝 IndexedDB 的 CRUD，供 submit 寫入與 replay 讀取圖片 blob

### Modified Capabilities

- `history-preview`: Replay 按鈕對 image 類型 entry 需觸發非同步讀取並還原 `imageFile`

## Impact

- 依賴 `dashboard-page` change（`replayHistory` action 已存在）
- 依賴 `analyze-page` change（`imageFile` state 已存在）
- 新增瀏覽器 IndexedDB 使用（純前端，無後端影響）
- 清除瀏覽器資料會同時清除 IndexedDB，屬預期行為
