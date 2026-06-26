## Why

Analyze 頁的 mock submit 需要替換成真實後端呼叫，並完整實作 rate limit 機制（`GET /ratelimit` 載入校正、`X-RateLimit-*` 標頭即時更新、429 toast 倒數、音檔試聽）。這是 VibeTrack 核心業務邏輯，需獨立 change 確保責任清晰。

## What Changes

- 建立 `src/lib/api.ts`：封裝所有 HTTP 呼叫（`analyzeVibe`、`getRateLimit`、`getHealth`）
- 替換 `src/store/reducer.ts` 中 `submit` action 的 mock 邏輯 → 真實 `POST /analyze`（`multipart/form-data`）
- 在 reducer 加入 `updateRateLimit` action，供 API response 更新 `usage`/`maxUsage`
- 在 AppContext / App.tsx 的 init effect：`GET /health` 先 ping（冷啟動提示）→ `GET /ratelimit` 校正 pill
- 每次 `/analyze` 成功後讀 `X-RateLimit-Remaining`/`X-RateLimit-Limit`/`X-RateLimit-Reset` 更新 pill
- 429 時讀 `retry_after`（或 `Retry-After` header）設 `state.error`，讓 RateLimitToast 跑倒數
- 建立 `src/components/analyze/AudioPlayer.tsx`：管理單一 `<audio>` 元素，同時只播一首 preview

## Capabilities

### New Capabilities

- `api-client`: 封裝 fetch 呼叫（multipart/form-data POST、GET /ratelimit、GET /health）
- `rate-limit-sync`: 從後端標頭/端點即時同步速率限制狀態至 AppContext
- `audio-preview`: 30 秒試聽播放控制（單一 audio 元素，互斥播放）
- `health-check`: 冷啟動 ping，後端無回應時顯示「服務啟動中」提示

### Modified Capabilities

（無，替換 mock 邏輯但 spec 行為不變）

## Impact

- 依賴 `scaffold-project`（env.ts、types）、`shared-components`（RateLimitToast）、`analyze-page`（UI 已就緒）
- 移除 `src/mock/mockAnalyze.ts` 的 mock 呼叫（可保留 mock 資料供離線開發）
- `VITE_API_BASE_URL` 需指向真實後端才能完整驗收
