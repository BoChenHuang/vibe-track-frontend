## ADDED Requirements

### Requirement: Results section layout with responsive grid
歌曲卡 SHALL 排列在 `repeat(4, 1fr)` grid（gap 16px）；≤1100px 變 3 欄；≤800px 變 2 欄；同時主區 analyze-grid 在 ≤800px 改為單欄。

#### Scenario: Default 4-column layout
- **WHEN** 視窗寬度 > 1100px
- **THEN** 歌曲卡排列 4 欄

#### Scenario: 3-column at medium breakpoint
- **WHEN** 視窗寬度 ≤ 1100px
- **THEN** 歌曲卡排列 3 欄

#### Scenario: 2-column and single main at small breakpoint
- **WHEN** 視窗寬度 ≤ 800px
- **THEN** 歌曲卡排列 2 欄；analyze-grid 左右欄合併為單欄

### Requirement: Results header has Shuffle and Save actions
結果標題列 SHALL 顯示歌單標題（`N recommendations`）、`Shuffle order` 按鈕、`Save to history` 按鈕（ghost style）。此階段兩個按鈕為**視覺佔位**，無功能實作（onClick 為空或 console.log）。

#### Scenario: Shuffle and Save buttons rendered
- **WHEN** result 非 null
- **THEN** 結果標題列顯示兩個 ghost 按鈕
