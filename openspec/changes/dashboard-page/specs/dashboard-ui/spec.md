## ADDED Requirements

### Requirement: Dashboard page layout with stats cards and split view
Dashboard 頁 SHALL 包含：page header（eyebrow + 大標 + 副標）、4 張統計卡 grid（`repeat(4, 1fr)`）、主區 split view（`340px 1fr`，gap 24px）；≤900px 時統計卡變 2 欄、split view 變單欄。

#### Scenario: Default desktop layout
- **WHEN** 視窗寬度 > 900px
- **THEN** 統計卡 4 欄；split view 左 340px 固定、右側自適應

#### Scenario: Single column on mobile
- **WHEN** 視窗寬度 ≤ 900px
- **THEN** 統計卡 2 欄；split view 左右欄堆疊（清單在上，預覽在下）

### Requirement: Stats cards show query metrics
4 張統計卡 SHALL 分別顯示：
1. **Total** — `state.history.length` 總查詢數
2. **Today** — 今日 midnight 後的查詢數
3. **Rate limit** — RateRing 元件 + `remaining/limit` 數字
4. **Last vibe** — 最新一筆歷史的 `mood.label`（無歷史則顯示 `—`）

#### Scenario: Today count resets at midnight
- **WHEN** 過了今日 00:00
- **THEN** Today 卡片計數歸零（重新整理後）

#### Scenario: Last vibe shown from history
- **WHEN** 有歷史紀錄
- **THEN** Last vibe 卡片顯示最新一筆的 mood.label
