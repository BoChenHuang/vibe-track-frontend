## 1. IndexedDB 模組

- [x] 1.1 建立 `app/lib/imageStore.ts`：`openDB()` 開啟 `vibetrack-images` DB（version 1，store: `images`）
- [x] 1.2 實作 `saveImage(id: string, file: File): Promise<void>`，以 entry.id 為 key 存入 blob，try/catch 靜默 fail
- [x] 1.3 實作 `loadImage(id: string): Promise<File | null>`，讀取 blob 後重建 `File`；找不到或錯誤時回傳 null
- [x] 1.4 實作 `deleteImage(id: string): Promise<void>`（備用，供未來清理）

## 2. Reducer Action

- [x] 2.1 在 `app/types/api.ts` 的 `AppAction` union 加入 `{ type: 'restoreImageFile'; file: File }`
- [x] 2.2 在 `app/store/reducer.ts` 加入 `restoreImageFile` case：`{ ...state, imageFile: action.file }`

## 3. Submit 時存圖

- [x] 3.1 在 `app/pages/AnalyzePage.tsx` 的 `handleSubmit` 成功分支，於 `dispatch(submitResolved)` 後呼叫 `saveImage(entry.id, imageFile)`（僅 `inputMode === 'image'` 且 `imageFile !== null` 時）

## 4. Replay 時還原圖

- [x] 4.1 在 `app/components/dashboard/HistoryPreview.tsx` 的 `handleReplay` 改為 async
- [x] 4.2 若 `entry.type === 'image'`，await `loadImage(entry.id)`；有結果則 dispatch `restoreImageFile`
- [x] 4.3 接著 dispatch `replayHistory(entry)`，再 `navigate('/')`

## 5. 驗收

- [x] 5.1 圖片模式分析成功後，確認 IndexedDB `vibetrack-images` 的 `images` store 中有對應 entry.id 的記錄
- [x] 5.2 在 Dashboard 點擊該筆 image entry 的 Replay，確認 Analyze 頁的 ImageUpload 顯示還原的圖片預覽
- [x] 5.3 清除 IndexedDB（DevTools → Application → Storage）後再點 Replay，確認頁面正常跳轉、不報錯，inputMode 切到 image
- [x] 5.4 text 類型 entry 的 Replay 行為不受影響
