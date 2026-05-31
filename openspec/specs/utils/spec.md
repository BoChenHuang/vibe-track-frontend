## ADDED Requirements

### Requirement: formatCountdown converts seconds to human-readable string
`formatCountdown(seconds: number): string` SHALL 回傳：`< 60` → `Xs`；`< 3600` → `Xm Ys`；`≥ 3600` → `Xh Ym`。

#### Scenario: Under one minute
- **WHEN** `formatCountdown(45)`
- **THEN** 回傳 `"45s"`

#### Scenario: One to fifty-nine minutes
- **WHEN** `formatCountdown(119)`
- **THEN** 回傳 `"1m 59s"`

#### Scenario: One hour or more
- **WHEN** `formatCountdown(3665)`
- **THEN** 回傳 `"1h 1m"`

### Requirement: formatRelativeTime converts timestamp to relative string
`formatRelativeTime(ts: number): string` SHALL 將 Unix ms timestamp 轉為「x 分鐘前」「x 小時前」「x 天前」中文相對時間字串。

#### Scenario: Recent timestamp
- **WHEN** `formatRelativeTime(Date.now() - 90000)`（1.5 分鐘前）
- **THEN** 回傳 `"1 分鐘前"`

### Requirement: formatFileSize converts bytes to readable string
`formatFileSize(bytes: number): string` SHALL 回傳人類可讀的檔案大小（KB / MB）。

#### Scenario: Kilobyte range
- **WHEN** `formatFileSize(2048)`
- **THEN** 回傳 `"2.0 KB"`
