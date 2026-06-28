## ADDED Requirements

### Requirement: History preview shows complete snapshot with Replay button
右欄 SHALL 顯示選中 entry 的完整快照：meta 列（timestamp、market、類型、歌曲數）+ Replay 按鈕；輸入區塊；完整 MoodPanel；推薦歌曲 mini grid（2 欄）。

#### Scenario: Meta row shows entry details
- **WHEN** 使用者選中一筆歷史
- **THEN** meta 列顯示格式化時間戳（如 `2024-01-15 14:30`）、market、類型（文字/圖片）、歌曲數

#### Scenario: Text input shown directly
- **WHEN** entry.type === 'text'
- **THEN** 輸入區塊顯示 entry.input 文字內容

#### Scenario: Image input shows filename
- **WHEN** entry.type === 'image'
- **THEN** 輸入區塊顯示「[圖片] entry.input」（entry.input 為圖片檔名）

### Requirement: Replay button navigates to Analyze with snapshot
點擊「Replay on Analyze」SHALL dispatch `replayHistory(entry)`，設定 result 為該快照並切換至 Analyze 頁；Analyze 頁 SHALL 立即顯示該 mood + 歌單（不重新呼叫 API）。

#### Scenario: Replay loads snapshot in Analyze
- **WHEN** 使用者點擊 Replay
- **THEN** 路由切換至 `/#/`，Analyze 頁顯示該筆的 mood panel 與歌曲卡

### Requirement: Mini song grid shows compact track items
推薦歌曲 SHALL 以 `SongMini` 小卡排列（2 欄 auto-fill）：40px 封面縮圖、歌名（單行省略）、藝人名；無封面時顯示漸層占位。

#### Scenario: Song mini displays album art
- **WHEN** track.album_image_url 非 null
- **THEN** 顯示 40×40 封面圖

#### Scenario: Song mini handles null image
- **WHEN** track.album_image_url 為 null
- **THEN** 顯示漸層色塊占位
