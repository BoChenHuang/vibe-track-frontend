## 1. Theme Token 定義

- [x] 1.1 建立 `src/lib/themes.ts`，定義 `THEMES` 物件（neon/sunset/aurora/mono 各自的 7 個 token 值）
- [x] 1.2 在同檔實作 `applyTheme(theme: string)` 函式（`document.documentElement.style.setProperty` 批次設定所有 token）

## 2. Reducer setTheme Action

- [x] 2.1 在 `src/store/reducer.ts` 加入 `setTheme` action：更新 `state.theme`，呼叫 `applyTheme(theme)`，寫入 `vibetrack:prefs:v3`

## 3. Tweaks 面板

- [x] 3.1 建立 `src/components/ui/TweaksPanel.module.css`（右下角 fixed 浮動按鈕 + 展開面板樣式）
- [x] 3.2 建立 `src/components/ui/TweaksPanel.tsx`：⚙ 按鈕 + 展開後 4 個主題色塊（各顯示主色漸層）；點擊 dispatch `setTheme`；目前 theme 有選中邊框
- [x] 3.3 在 `src/App.tsx` 加入 `<TweaksPanel />`（Router 外層或同層）

## 4. localStorage 工具

- [x] 4.1 建立 `src/lib/storage.ts`，實作 `saveHistory(entries)` / `loadHistory()` / `savePrefs(prefs)` / `loadPrefs()` / `saveRateTimes(times)` / `loadRateTimes()`，所有操作 try/catch（失敗回傳 null/default）
- [x] 4.2 History FIFO：`saveHistory` 在寫入前執行 `entries.slice(0, 50)`

## 5. App 初始化復原

- [x] 5.1 在 `src/store/reducer.ts` 加入 `restoreHistory`、`restorePrefs`、`restoreRateTimes` actions
- [x] 5.2 在 `src/App.tsx`（或 AppContext init）的 init `useEffect` 中：`loadHistory()` → dispatch `restoreHistory`；`loadPrefs()` → dispatch `restorePrefs` 並呼叫 `applyTheme`；`loadRateTimes()` → dispatch `restoreRateTimes`

## 6. submitResolved 寫入歷史

- [x] 6.1 在 reducer `submitResolved` action 中：prepend 新 entry → `saveHistory(newHistory)`
- [x] 6.2 確認 `setTheme` action 只寫 prefs，不觸碰 history key

## 7. rateTimes tickRate 守衛

- [x] 7.1 在 reducer `tickRate` action 中：先過濾過期 timestamp（`Date.now() - 3600000`）；若過濾後長度不變，return 原 state（不產生新陣列）；否則更新 rateTimes 並 `saveRateTimes`

## 8. 驗收

- [x] 8.1 切換 aurora 主題，重新整理頁面，確認主題保持 aurora
- [x] 8.2 切換 mono 主題，確認整個介面顏色（按鈕、mood hero、標籤）即時換色
- [x] 8.3 送出分析，切換至 Dashboard，重新整理，確認歷史紀錄保留
- [x] 8.4 手動填入 51 筆假資料至 localStorage，送出一筆，確認只保留最新 50 筆
- [x] 8.5 開啟私人瀏覽模式，確認 App 正常啟動（無 crash），history 為空
