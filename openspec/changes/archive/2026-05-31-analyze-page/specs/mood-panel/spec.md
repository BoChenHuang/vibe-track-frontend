## ADDED Requirements

### Requirement: Detected mood panel shows gradient hero and emotion tags
送出後 SHALL 顯示 Detected mood 面板：頂部 mono 標記 `PRIMARY MOOD` + `N signals`，底部情緒大標（38px）+ sub 短語；下方 3–5 個情緒標籤，primary tag 有發光圓點 + 強調底色；一行 mono 說明文字。

#### Scenario: Mood hero renders gradient
- **WHEN** `result.mood` 存在
- **THEN** 面板頂部高 200px 的漸層 hero 顯示，背景由 mood 的 gradA/gradB 插值

#### Scenario: Primary tag highlighted
- **WHEN** mood.tags 中某 tag 的 `primary: true`
- **THEN** 該 tag 有發光圓點（`var(--neon-b)`）+ 較亮背景；其餘 tag 為一般態

### Requirement: PreviewEmpty state shows spectrum animation
未送出時（`result === null` 且 `loading === false`）SHALL 顯示等待態：動畫頻譜條（多條垂直線，隨機高度動畫）+ 軌道光球 + 「Awaiting signal」文字。

#### Scenario: Spectrum bars animate
- **WHEN** 頁面載入，尚未送出任何請求
- **THEN** 右欄顯示等待態，頻譜條有持續高度變化動畫

### Requirement: MoodSkeleton shown during loading
`loading === true` 時 SHALL 顯示骨架 shimmer（同設計稿 MoodSkeleton），取代等待態或上次結果。

#### Scenario: Skeleton replaces previous result during loading
- **WHEN** 使用者送出新請求，`loading` 變 true
- **THEN** 右欄立即切換為骨架 shimmer，不再顯示上次 mood
