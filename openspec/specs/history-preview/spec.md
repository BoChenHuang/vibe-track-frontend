## MODIFIED Requirements

### Requirement: Replay button navigates to Analyze with snapshot
點擊「Replay on Analyze」SHALL：
1. 若 `entry.type === 'image'`，先 await `loadImage(entry.id)` 取得 `File | null`
2. 若取得 File，dispatch `restoreImageFile({ file })`
3. dispatch `replayHistory(entry)`（設定 result、inputMode、textValue、market）
4. `useNavigate` 跳至 `/`

Analyze 頁 SHALL 立即顯示該筆的 mood panel 與歌曲卡，且 image 類型的輸入欄顯示還原的圖片（若 loadImage 回傳 null 則輸入欄空白，不報錯）。

#### Scenario: Image replay restores file to input
- **WHEN** entry.type === 'image' 且 IndexedDB 中有對應 blob
- **THEN** Analyze 頁 imageFile state 為還原的 File，ImageUpload 元件顯示圖片預覽

#### Scenario: Image replay degrades gracefully when blob missing
- **WHEN** entry.type === 'image' 且 IndexedDB 中無對應 blob（如已清快取）
- **THEN** 仍跳至 Analyze 頁並顯示 mood + 歌曲，inputMode 切到 image，imageFile 為 null

#### Scenario: Text replay unchanged
- **WHEN** entry.type === 'text'
- **THEN** 行為與之前相同：textValue 還原、不呼叫 loadImage
