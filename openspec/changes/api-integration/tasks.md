## 1. API Client

- [ ] 1.1 建立 `src/lib/api.ts`，定義 `analyzeVibe(params: AnalyzeParams): Promise<{ data: AnalyzeResponse; headers: RateLimitHeaders }>` — 用 FormData 送 multipart/form-data，不手動設 Content-Type
- [ ] 1.2 在同檔實作 `getRateLimit(): Promise<RateLimitStatus>`（GET /ratelimit）
- [ ] 1.3 在同檔實作 `getHealth(): Promise<{ status: string }>`（GET /health，5s AbortController timeout）
- [ ] 1.4 統一錯誤處理：429 → throw `RateLimitError`（含 retry_after/limit/remaining/reset_at）；其他 4xx/5xx → throw `ApiError`（含 statusCode/message）

## 2. AppContext Reducer 擴充

- [ ] 2.1 在 `src/store/reducer.ts` 加入 `updateRateLimit` action（更新 `rateRemaining`、`rateLimit`、`rateResetAt`）
- [ ] 2.2 加入 `setError` action（設 state.error）與 `setBootingStatus` action（設 health check 狀態）
- [ ] 2.3 替換 `submit` action：移除 mockAnalyze 呼叫，改呼叫 `analyzeVibe`，成功後 dispatch `submitResolved` + `updateRateLimit`；429 dispatch `setError`；其他錯誤顯示一般錯誤訊息

## 3. App 初始化 Effect

- [ ] 3.1 在 `src/App.tsx`（或 `src/store/AppContext.tsx`）加入 init `useEffect`：先 `getHealth()`（最多重試 3 次，間隔 5s），成功後呼叫 `getRateLimit()` dispatch `updateRateLimit`
- [ ] 3.2 建立 `src/components/ui/BootingScreen.tsx`（全螢幕 overlay，顯示 spinner + 「服務啟動中，請稍候」），health check 通過後移除

## 4. Rate Limit 標頭解析

- [ ] 4.1 在 `analyzeVibe` 的 response 處理中讀取 `X-RateLimit-*` headers，回傳 `headers: { remaining, limit, resetAt }`（若 header 不存在則為 null）
- [ ] 4.2 在 submit action 的成功路徑中，若 headers 有值則 dispatch `updateRateLimit`；否則保持本地 rateTimes fallback

## 5. 音檔試聽

- [ ] 5.1 在 `src/pages/AnalyzePage.tsx` 加入 `playingId: string | null` local state
- [ ] 5.2 建立 `src/components/analyze/AudioPlayer.tsx`（接受 `src: string | null` prop，useRef `<audio>`，`useEffect([src])` → src 非 null 時 load+play，null 時 pause；`onended` 呼叫 `onEnded` callback prop）
- [ ] 5.3 將 AudioPlayer 加入 AnalyzePage，傳入當前 playing track 的 `preview_url`
- [ ] 5.4 SongCard 的播放鈕 onClick → `setPlayingId(id)` 或 toggle null；傳入 `isPlaying` prop 控制圖示顯示

## 6. 移除 Mock 依賴

- [ ] 6.1 確認 `src/mock/mockAnalyze.ts` 的呼叫已全部替換為 `analyzeVibe`
- [ ] 6.2 保留 `src/mock/data.ts`（供開發時視覺驗收，不需移除）

## 7. 驗收

- [ ] 7.1 啟動後端（localhost:3000），送出文字分析，確認回傳真實 mood + tracks
- [ ] 7.2 確認 UsagePill 在頁面載入後顯示後端回應的 remaining/limit
- [ ] 7.3 連續送出直至 429，確認 RateLimitToast 出現並正確倒數（讀 retry_after）
- [ ] 7.4 確認點擊播放鈕後 audio 播放，切換歌曲時上一首停止
- [ ] 7.5 關閉後端後重新整理，確認 BootingScreen 出現並在連線恢復後消失
