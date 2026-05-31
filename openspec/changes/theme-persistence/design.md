## Context

所有頁面元件已完成。此 change 補齊兩個橫切功能：主題切換（4 套 CSS 變數）與 localStorage 持久化（三把 key）。主題切換的視覺效果依賴 design tokens 的 CSS 變數架構（scaffold-project 已建立）；持久化依賴 reducer 的完整 action 集合（各前置 change 已建立）。

## Goals / Non-Goals

**Goals:**
- 定義 `THEMES` 物件（4 套）：每套覆蓋 `--bg-0/1/2`、`--neon-a/b/c/d`、`--grad-primary`
- `applyTheme(theme)` 函式：用 `document.documentElement.style.setProperty` 批次設定 token
- `setTheme` reducer action：更新 `state.theme` 並呼叫 `applyTheme`
- App 初始化時從 `vibetrack:prefs:v3` 讀取主題，呼叫 `applyTheme`
- Tweaks 面板：右下角浮動按鈕（`⚙`），展開後顯示 4 個主題色塊選項
- localStorage 讀寫 hook/工具：`saveHistory`、`loadHistory`、`savePrefs`、`loadPrefs`、`saveRateTimes`、`loadRateTimes`
- `submitResolved` action 在 reducer 中呼叫 `saveHistory`（加入新 entry，FIFO 上限 50 筆）
- App init `useEffect`：`loadHistory` + `loadPrefs` + `loadRateTimes` → 各自 dispatch 復原 action
- schema 版本號管理：key 名稱含 `v3`，若讀到無法解析的資料則靜默丟棄

**Non-Goals:**
- 跨標籤頁同步（localStorage event）
- iCloud/遠端同步
- 設定匯出/匯入

## Decisions

**主題切換機制：CSS 變數直接設定**
- `applyTheme` 直接 `document.documentElement.style.setProperty('--neon-a', '#...')` 等
- 不用 class toggle，避免 specificity 問題
- 7 個 token 一次設完，瀏覽器只 paint 一次

**4 套主題 token 值（參照設計稿 THEMES 物件）**

| theme | --neon-a | --neon-b | --neon-c | --neon-d | --bg-0 |
|---|---|---|---|---|---|
| neon | #ff3cac | #7a5cff | #00e5ff | #b8ff3c | #07060d |
| sunset | #ff6b35 | #ff3cac | #ffb547 | #ff8c69 | #0d0508 |
| aurora | #00e5ff | #6cffb4 | #7a5cff | #b8ff3c | #04100d |
| mono | #ffffff | #cccccc | #999999 | #666666 | #0a0a0a |

**localStorage 讀寫分離**
- `src/lib/storage.ts` 集中管理三把 key 的 serialise/deserialise
- 每次讀取 try/catch：`JSON.parse` 失敗 → 回傳 null/default
- history 寫入前 slice(-50) 保持上限

**`rateTimes` 的 tickRate 守衛**
- reducer 的 `tickRate` action 先過濾過期 timestamp（`> Date.now() - windowMs`）
- 若過濾後陣列與現有相同（長度不變、無過期項），不產生新陣列 → 不觸發 re-render/寫入
- `windowMs` 預設 3600000（每小時），配合後端部署設定

## Risks / Trade-offs

- [localStorage 寫入頻率] → history 只在 submitResolved 時寫，prefs 只在 setTheme 時寫；rate 只在 tickRate 有變化時寫；避免每秒 setInterval 都寫入
- [schema migration] → 若未來 HistoryEntry 結構改變，只需遞增版本號（`v4`），舊資料自動丟棄（靜默）
- [私人瀏覽模式 localStorage] → 可能 throw `SecurityError`；try/catch 所有 localStorage 操作，失敗時靜默降級
