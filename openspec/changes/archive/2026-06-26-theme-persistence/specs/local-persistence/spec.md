## ADDED Requirements

### Requirement: History persisted to localStorage with FIFO 50-entry limit
每次 `submitResolved` 時 SHALL 將新 HistoryEntry prepend 至 `vibetrack:history:v3`（JSON stringify），並保持最多 50 筆（超出時移除最舊）；App 初始化時從此 key 讀回 history 並 dispatch `restoreHistory`。

#### Scenario: New entry saved on submission
- **WHEN** submitResolved 被 dispatch
- **THEN** 新 entry 寫入 `vibetrack:history:v3`，可在下次頁面載入後讀回

#### Scenario: FIFO limit maintained at 50
- **WHEN** history 已有 50 筆，再送出新分析
- **THEN** 最舊一筆被移除，新筆加入，localStorage 仍保持 50 筆

#### Scenario: History restored on page load
- **WHEN** 使用者重新整理頁面，localStorage 有 `vibetrack:history:v3`
- **THEN** AppContext `state.history` 在 init 後等於 localStorage 的資料

### Requirement: Preferences persisted separately from history
`setTheme` dispatch 時 SHALL 只寫入 `vibetrack:prefs:v3`（`{ theme }`），不重寫 history；App 初始化時讀回 prefs 並套用主題。

#### Scenario: Theme change only writes prefs key
- **WHEN** 使用者切換主題
- **THEN** 只有 `vibetrack:prefs:v3` 被更新；`vibetrack:history:v3` 不被觸碰

### Requirement: localStorage failures silently degraded
所有 localStorage 操作 SHALL 被 try/catch 包裹；讀取失敗（如私人瀏覽模式）回傳 null/default；寫入失敗靜默忽略，不 crash app。

#### Scenario: Private browsing fallback
- **WHEN** localStorage.getItem throw SecurityError
- **THEN** App 正常啟動，history 為空陣列，使用預設主題

### Requirement: Corrupt data silently discarded
讀取 localStorage 時若 JSON.parse 失敗 SHALL 靜默回傳 default 值，不丟出 error。

#### Scenario: Corrupt JSON ignored
- **WHEN** `vibetrack:history:v3` 的值非合法 JSON
- **THEN** history 初始化為空陣列，App 正常啟動
