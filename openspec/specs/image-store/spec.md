## ADDED Requirements

### Requirement: imageStore saves and loads image blobs via IndexedDB
`imageStore` 模組 SHALL 提供三個 async 函式操作 IndexedDB（DB: `vibetrack-images`，store: `images`，version: 1）：
- `saveImage(id: string, file: File): Promise<void>` — 以 entry.id 為 key 寫入 blob
- `loadImage(id: string): Promise<File | null>` — 以 entry.id 讀取；找不到或 DB 錯誤時回傳 null
- `deleteImage(id: string): Promise<void>` — 刪除對應 blob（可選，供未來清理用）

所有操作 SHALL 以 try/catch 包裹，遇到 IndexedDB 不可用（Private Browsing 限制等）時靜默 fail，不拋出例外。

#### Scenario: Save then load returns same file
- **WHEN** `saveImage('e1', file)` 後 `loadImage('e1')`
- **THEN** 回傳的 File 的 `name` 與 `size` 與原始 file 相同

#### Scenario: Load non-existent id returns null
- **WHEN** `loadImage('no-such-id')`
- **THEN** 回傳 `null`，不拋出例外

#### Scenario: IndexedDB unavailable returns null gracefully
- **WHEN** IndexedDB 拋出錯誤（如 Private Browsing）
- **THEN** `loadImage` 回傳 `null`，`saveImage` 靜默忽略

### Requirement: saveImage is called on submitResolved
每次成功分析且 `inputMode === 'image'` 且 `imageFile !== null` 時，SHALL 在 `submitResolved` dispatch 後呼叫 `saveImage(entry.id, imageFile)`。

#### Scenario: Image file saved on successful image submit
- **WHEN** 使用者以圖片模式送出分析並成功取得結果
- **THEN** `saveImage` 以該次 entry.id 和 imageFile 被呼叫
