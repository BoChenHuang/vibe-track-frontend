## ADDED Requirements

### Requirement: analyzeVibe sends multipart/form-data POST
`analyzeVibe({ text?, image?, market?, limit? })` SHALL 建立 FormData，將非 null/undefined 欄位 append（`text` 為字串、`image` 為 File 物件、`market` 為字串、`limit` 為數字字串），以 `POST /analyze` 送出，**不手動設定 Content-Type header**（讓瀏覽器自動生成 boundary）。

#### Scenario: Text-only request
- **WHEN** `analyzeVibe({ text: '下雨天', market: 'TW', limit: 8 })` 被呼叫
- **THEN** FormData 包含 `text = '下雨天'`、`market = 'TW'`、`limit = '8'`；不包含 `image` 欄位；以 multipart/form-data 送出

#### Scenario: Image-only request
- **WHEN** `analyzeVibe({ image: File })` 被呼叫
- **THEN** FormData 包含 `image = File`；不包含 `text` 欄位

#### Scenario: 429 throws RateLimitError
- **WHEN** 後端回應 HTTP 429
- **THEN** `analyzeVibe` throw 包含 `retry_after`、`limit`、`remaining`、`reset_at` 的錯誤物件

#### Scenario: 500 throws generic error
- **WHEN** 後端回應 HTTP 500
- **THEN** `analyzeVibe` throw `{ statusCode: 500, message: '...' }`

### Requirement: getRateLimit fetches current rate status
`getRateLimit()` SHALL 呼叫 `GET /ratelimit`，回傳 `RateLimitStatus`（`limit`、`remaining`、`reset_at`）。

#### Scenario: Successful rate limit query
- **WHEN** `getRateLimit()` 被呼叫
- **THEN** 回傳 `{ limit: 5, remaining: 3, reset_at: 1717059600 }`（數字型別）

### Requirement: getHealth checks service liveness
`getHealth()` SHALL 呼叫 `GET /health`，成功回傳 `{ status: 'ok' }`；5 秒無回應 throw timeout error。

#### Scenario: Service alive
- **WHEN** `getHealth()` 被呼叫且後端正常
- **THEN** 回傳 `{ status: 'ok' }`

#### Scenario: Service timeout
- **WHEN** 後端 5 秒無回應
- **THEN** `getHealth()` throw timeout error
