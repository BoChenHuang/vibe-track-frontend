## Context

`replayHistory` action 已存在（dashboard-page change），但對 image 類型 entry 只能切換 `inputMode`，無法還原 `imageFile`（`File` 物件無法 JSON 序列化至 localStorage）。IndexedDB 支援直接儲存 binary blob，是瀏覽器標準的大型資料本地儲存方案。

## Goals / Non-Goals

**Goals:**
- 使用者以圖片分析後，點 Replay 能在 Analyze 頁還原原始圖片至輸入欄
- IndexedDB 操作封裝於獨立模組，不污染既有 storage.ts
- 舊 entry 或 IndexedDB 清除後，graceful degrade（不報錯，只是圖片不還原）

**Non-Goals:**
- 跨裝置或跨瀏覽器同步圖片
- 儲存 API 回傳的分析結果圖（只存使用者上傳的原始圖片）
- 自動清理過期圖片（使用者自行管理瀏覽器儲存空間）

## Decisions

**IndexedDB over localStorage base64**
- localStorage 5MB 上限，base64 再膨脹 33%，數張圖就爆
- IndexedDB 可存原始 blob，上限為磁碟空間的 20–50%，不影響 localStorage 的 history/prefs
- 實作：`openDB()` → object store `images`，key 為 `entry.id`（string）

**restoreImageFile action（同步注入 File）**
- `replayHistory` 本身是同步 reducer，無法 await IndexedDB
- 設計：`HistoryPreview` 的 Replay handler 先 await `loadImage(entry.id)`，有結果就 dispatch `restoreImageFile`，再 dispatch `replayHistory`，最後 navigate
- 順序保證 navigate 時 state 已有 imageFile

**imageStore.ts 獨立模組**
- 暴露三個 async 函式：`saveImage(id, file)`、`loadImage(id)` → `File | null`、`deleteImage(id)`
- DB name `vibetrack-images`，store name `images`，version `1`

## Risks / Trade-offs

- [IndexedDB 在 Private Browsing 部分瀏覽器可能受限] → try/catch 包裹，失敗時 graceful degrade
- [DB schema 升版] → 目前 version 1，未來需 migration 時以 `onupgradeneeded` 處理
- [使用者清快取] → 圖片消失屬預期，history entry 本身仍在 localStorage，只是 replay 無法還原圖
