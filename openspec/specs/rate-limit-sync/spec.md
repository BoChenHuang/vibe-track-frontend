## ADDED Requirements

### Requirement: Rate limit synced from backend headers after analyze
每次 `POST /analyze` 成功後，系統 SHALL 從 response headers 讀取 `X-RateLimit-Remaining`、`X-RateLimit-Limit`、`X-RateLimit-Reset`，並 dispatch `updateRateLimit` 更新 AppContext；若 header 不存在（CORS 未 expose），SHALL fallback 到本地 rateTimes 計算。

#### Scenario: Headers present and parsed
- **WHEN** analyze 回應帶有 `X-RateLimit-Remaining: 2`、`X-RateLimit-Limit: 5`
- **THEN** AppContext `rateRemaining = 2`、`rateLimit = 5`

#### Scenario: Headers absent, fallback to local
- **WHEN** analyze 回應無 rate limit headers
- **THEN** 保持本地 rateTimes 計算的 remaining 值，不覆蓋

### Requirement: Rate limit loaded from backend on app init
App 初始化時 SHALL 呼叫 `GET /ratelimit` 並 dispatch `updateRateLimit`，確保 pill 在頁面重新載入後顯示正確剩餘次數。

#### Scenario: Init syncs rate limit
- **WHEN** 使用者重新整理頁面
- **THEN** UsagePill 在 GET /ratelimit 回應後顯示後端的正確 remaining 值

### Requirement: 429 error dispatched with retry_after
`POST /analyze` 回應 429 時，系統 SHALL dispatch `setError({ type: '429', retryIn: N, at: Date.now() })`，`retryIn` 取 response body 的 `retry_after`（或 `Retry-After` header）。

#### Scenario: 429 triggers toast with correct countdown
- **WHEN** 後端回應 429，body.retry_after = 3600
- **THEN** RateLimitToast 顯示 `1h 0m` 倒數
