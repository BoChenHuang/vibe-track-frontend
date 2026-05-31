## ADDED Requirements

### Requirement: Text and Image mode tabs switch input type
系統 SHALL 提供 Text / Image pill tab 切換，active 狀態有較亮底色；切換時保留各模式的輸入內容。

#### Scenario: Default is Text mode
- **WHEN** 頁面初始載入
- **THEN** Text tab 為 active，顯示 textarea

#### Scenario: Switch to Image mode
- **WHEN** 使用者點擊 Image tab
- **THEN** Image tab 變 active，顯示 drag&drop 上傳區，隱藏 textarea

### Requirement: Textarea has focus glow and character count
textarea SHALL 有 `min-height: 160px`；focus 時邊框轉 `var(--neon-b)` + 3px glow；底部右側顯示 `n/500` 字數（Unicode code point 計算）；底部左側有 4 個建議 chip，點擊填入 textarea。

#### Scenario: Focus applies purple glow
- **WHEN** 使用者點擊 textarea
- **THEN** 邊框色變 `var(--neon-b)`，`box-shadow` 出現 3px 紫色 glow

#### Scenario: Suggestion chip fills textarea
- **WHEN** 使用者點擊建議 chip（如「下雨天窩在家」）
- **THEN** textarea 內容設為該 chip 文字，字數計數更新

#### Scenario: Character count updates
- **WHEN** textarea 內容為 10 個字
- **THEN** 底部顯示 `10/500`

### Requirement: Image drag-and-drop upload with preview
Image 模式 SHALL 顯示虛線邊框上傳區（min-height 220px）；支援拖曳與點擊上傳；hover/dragging 時邊框轉 `var(--neon-c)` + 淡青漸層背景；上傳後顯示縮圖 + 檔名/大小 + 移除鈕（右上 ✕）。

#### Scenario: Drag hover changes style
- **WHEN** 使用者拖曳圖片至上傳區上方
- **THEN** 上傳區邊框轉青色，背景出現淡漸層

#### Scenario: File uploaded shows preview
- **WHEN** 使用者上傳圖片（JPEG/PNG/WebP/GIF）
- **THEN** 顯示縮圖（object-fit: contain）、檔名、`formatFileSize` 格式的大小、右上 ✕ 移除鈕

#### Scenario: Remove button clears image
- **WHEN** 使用者點擊 ✕ 移除鈕
- **THEN** imageFile 狀態清除，回到空白上傳區

### Requirement: Controls row with Market, Tracks, and CTA
系統 SHALL 在輸入區底部提供 Market 下拉（TW/JP/US/GB/HK/KR 含國旗 emoji，預設 TW）、Tracks 下拉（5/8/10，預設 8）、CTA 按鈕（「Analyze vibe」含 ✦ icon 與 ⌘↵ 鍵帽）。

#### Scenario: CTA disabled when no input
- **WHEN** text 模式且 textarea 空白
- **THEN** CTA 按鈕 disabled，`cursor: not-allowed`

#### Scenario: CTA loading state with cycling text
- **WHEN** `loading === true`
- **THEN** CTA 左側脈動 orb；文案每 700ms 循環切換：`Reading mood` → `Mapping spectrum` → `Picking tracks` → `Tuning order`

#### Scenario: Keyboard shortcut submits
- **WHEN** 使用者按 `⌘ + Enter`（macOS）或 `Ctrl + Enter`（Windows/Linux），且 CTA 非 disabled
- **THEN** 觸發送出，等同點擊 CTA
