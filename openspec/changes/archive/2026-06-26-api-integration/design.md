## Context

analyze-page change 完成後，UI 已可用 mock 資料正常運作。此 change 替換 mock 為真實 API 呼叫，並補齊 rate limit 與音檔試聽邏輯。後端 base URL 由 `API_BASE_URL`（`src/lib/env.ts`）讀取；dev 環境透過 Vite proxy 避免 CORS。

## Goals / Non-Goals

**Goals:**
- `src/lib/api.ts` 封裝三個端點，統一錯誤處理（throw on non-2xx）
- `analyzeVibe(params)` 用 FormData 送 `text`/`image`/`market`/`limit`，回傳 AnalyzeResponse + rate limit headers
- `getRateLimit()` 回傳 RateLimitStatus
- `getHealth()` 回傳 `{ status: 'ok' }` 或 throw
- App init effect：先 getHealth（timeout 5s）→ 失敗則 5s 後 retry 最多 3 次，顯示「服務啟動中」loading 態
- App init effect：getHealth 成功後 getRateLimit，更新 AppContext 速率狀態
- 每次 analyzeVibe 成功後從 response headers 讀 rate limit，dispatch `updateRateLimit`
- 429 回應解析 body + header，dispatch `setError({ type: '429', retryIn, at })`
- AudioPlayer：管理一個 `<audio ref>`，接受 `src` prop；`src` 改變時 load + play；`src = null` 時 pause
- 在 SongCard 播放鈕 onClick 更新 `playingId`，傳遞至 AudioPlayer

**Non-Goals:**
- Spotify OAuth 認證（此專案無需）
- 快取層（後端已有 24h 快取）
- Service Worker 離線支援

## Decisions

**api.ts 錯誤分層**
- HTTP 429 → throw 帶完整 body（`RateLimitError`）
- HTTP 4xx/5xx → throw 帶 `{ statusCode, message }`
- Network error → throw 原始 Error
- 呼叫端 try/catch dispatch 對應 action

**Rate limit 資料流**
1. App 初始化：`getRateLimit()` → dispatch `updateRateLimit({ limit, remaining, reset_at })`
2. 每次 `analyzeVibe` 200 回應：讀 `X-RateLimit-Remaining`/`Limit`/`Reset` headers → dispatch `updateRateLimit`
3. 429 回應：dispatch `setError({ type: '429', retryIn: body.retry_after, at: Date.now() })`
4. RateLimitToast 倒數歸零：dispatch `dismissError`

**AppContext 速率欄位替換**
- 現有 `usage`/`maxUsage` 改為 `rateRemaining`/`rateLimit`（或保持現名但語義調整）
- `rateTimes` 保留為本地 fallback，但若後端標頭有值則以後端為準

**AudioPlayer 設計**
- 一個 `<audio>` 元素放在 AnalyzePage 層級（非全局）
- `playingId: string | null` 存 AnalyzePage local state
- SongCard 的 PlayIcon onClick → `setPlayingId(track.id)` 或 `setPlayingId(null)`（toggle）
- AudioPlayer `useEffect([src])` → `audio.src = src; audio.play()`

**Health check retry**
- 最多重試 3 次，間隔 5s
- 重試期間顯示 `<BootingScreen>` overlay（「服務啟動中，請稍候」）
- 3 次失敗後顯示錯誤提示（但仍允許使用者嘗試送出）

## Risks / Trade-offs

- [CORS：自訂 header 需 expose] → 後端需設 `Access-Control-Expose-Headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset`，否則前端 JS 讀不到；若讀不到 header 則 fallback 本地 rateTimes
- [audio.play() autoplay policy] → 需由使用者手勢觸發（點擊播放鈕），符合規範；不在 init 時自動播放
- [Vite proxy 不轉送所有 headers] → dev 環境直接用 Vite proxy 即可；production 直設完整 URL
