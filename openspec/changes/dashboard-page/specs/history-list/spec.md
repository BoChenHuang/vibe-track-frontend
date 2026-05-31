## ADDED Requirements

### Requirement: History list displays entries with type, time, mood, and track count
每筆歷史項目 SHALL 顯示：type badge（TEXT 粉色 `var(--neon-a)` / IMAGE 青色 `var(--neon-c)`）、相對時間（`formatRelativeTime`）、market 代碼、輸入摘要（2 行省略）、情緒 chip（mood.label）、歌曲數（`N tracks`）。

#### Scenario: Text entry shows TEXT badge in pink
- **WHEN** entry.type === 'text'
- **THEN** badge 顯示 `TEXT`，顏色為 `var(--neon-a)`

#### Scenario: Image entry shows IMAGE badge in cyan
- **WHEN** entry.type === 'image'
- **THEN** badge 顯示 `IMAGE`，顏色為 `var(--neon-c)`

### Requirement: Active history item highlighted with gradient border
選中的清單項 SHALL 有左側 4px 紫青漸層 border（`var(--neon-b)` → `var(--neon-c)`）+ 半透明漸層背景（`var(--surface-2)`）。

#### Scenario: Active item has gradient left border
- **WHEN** 使用者點擊某個清單項
- **THEN** 該項目左側出現漸層 border，背景加深

### Requirement: Empty history shows placeholder message
無歷史紀錄時 SHALL 顯示「尚無分析紀錄」說明文字與前往 Analyze 的連結提示。

#### Scenario: Empty state renders
- **WHEN** state.history 為空陣列
- **THEN** 左欄顯示空狀態說明，不渲染清單
