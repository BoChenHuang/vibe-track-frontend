## ADDED Requirements

### Requirement: Shared TypeScript types match API contract
系統 SHALL 在 `src/types/api.ts` 定義與 api.md 一一對應的 TypeScript interface，所有 nullable 欄位標記為 `field: T | null`。

#### Scenario: Track type reflects API spec
- **WHEN** 開發者使用 `Track` type
- **THEN** `preview_url: string | null`、`popularity: number | null`、`album_image_url: string | null` 均為 nullable；`id`、`title`、`artist`、`spotify_url`、`reason` 均為非 nullable string

#### Scenario: AnalyzeResponse wraps mood and tracks
- **WHEN** 開發者使用 `AnalyzeResponse` type
- **THEN** 包含 `mood: Mood` 與 `tracks: Track[]`

#### Scenario: RateLimitStatus matches GET /ratelimit response
- **WHEN** 開發者使用 `RateLimitStatus` type
- **THEN** 包含 `limit: number`、`remaining: number`、`reset_at: number`

### Requirement: App state types defined
系統 SHALL 定義 `AppState`、`HistoryEntry`、`AppAction` 等 reducer 相關型別，對應 README 的 state 結構。

#### Scenario: HistoryEntry stores complete snapshot
- **WHEN** 開發者使用 `HistoryEntry` type
- **THEN** 包含 `id: string`、`ts: number`、`type: 'text' | 'image'`、`input: string`、`market: string`、`mood: Mood`、`tracks: Track[]`

#### Scenario: AppState includes all state slices
- **WHEN** 開發者使用 `AppState` type
- **THEN** 包含 `page`、`inputMode`、`textValue`、`imageFile`、`market`、`trackCount`、`loading`、`result`、`error`、`history`、`rateTimes`、`usage`、`maxUsage`、`theme` 欄位
