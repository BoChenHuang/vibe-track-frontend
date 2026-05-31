## ADDED Requirements

### Requirement: Four themes switchable via CSS variable replacement
系統 SHALL 提供 neon（預設）、sunset、aurora、mono 四套主題，每套定義 `--bg-0/1/2`、`--neon-a/b/c/d`、`--grad-primary` 的值；切換時呼叫 `applyTheme` 直接在 `document.documentElement` 設定 CSS 自訂屬性，整個介面即時換色。

#### Scenario: Default theme is neon
- **WHEN** 頁面初始載入，localStorage 無 prefs 資料
- **THEN** 套用 neon 主題（`--neon-a: #ff3cac`、`--bg-0: #07060d`）

#### Scenario: Theme switch updates CSS variables instantly
- **WHEN** 使用者選擇 sunset 主題
- **THEN** `document.documentElement` 的 `--neon-a` 立即更新為 `#ff6b35`

#### Scenario: Theme persists across page reload
- **WHEN** 使用者選擇 aurora 主題後重新整理
- **THEN** 頁面載入後自動套用 aurora 主題

### Requirement: Tweaks panel provides theme selector
系統 SHALL 在右下角渲染浮動按鈕（`⚙`），點擊展開面板；面板中有 4 個主題色塊選項，點擊任一色塊 dispatch `setTheme` action；目前選中主題有勾選或邊框標記。

#### Scenario: Tweaks panel opens on button click
- **WHEN** 使用者點擊右下角 ⚙ 按鈕
- **THEN** 主題選擇面板展開顯示 4 個選項

#### Scenario: Active theme marked in panel
- **WHEN** 目前 theme 為 aurora
- **THEN** aurora 選項有選中樣式（邊框或勾選圖示）
