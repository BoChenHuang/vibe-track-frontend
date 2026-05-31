# CLAUDE.md — VibeTrack 開發規範

> 給 Claude Code 的專案指引。實作前請先讀 `README.md`（完整設計規格與 API contract）。

## 這是什麼
VibeTrack：分析文字/圖片情緒並推薦 Spotify 歌曲的網頁 App。兩頁：Analyze、Dashboard。

## 黃金守則
1. **bundle 內的 `.html` / `.jsx` 是設計參考稿，不是生產碼。** 它們用瀏覽器內 Babel +
   `window` 全域共享元件寫成，**不要照搬**。請在目標框架用正規模組化重建相同視覺與行為。
2. **像素級還原（hifi）。** 嚴格沿用 `README.md` 的 design tokens；不要自行發明顏色或間距。
3. **不要無中生有資料。** 情緒摘要（mood）與歌曲皆由後端回傳。前端不臆造 BPM、能量值、
   信心分數等指標（先前刻意移除過，勿復活）。
4. **欄位向下相容。** `popularity` 與 `preview_url` 為**可選**；缺少時隱藏對應 UI
   （POP 徽章、迷你播放鈕），不要顯示空值或 0。

## 技術建議
- 若無既有前端，用 **React + Vite + TypeScript**。
- 狀態：照 README 的 reducer 結構（`page / inputMode / market / trackCount / result /
  error / history / rateTimes / theme`）。小專案 useReducer 即可，不需引入 Redux。
- 樣式：CSS 變數（design tokens）放 `:root`；主題切換只換變數值。可用 CSS Modules
  或 styled-components，但 token 來源要單一。
- 字體：Space Grotesk（標題）/ Inter（內文）/ JetBrains Mono（標籤、資料）。
- 圖示：用內聯 SVG（參考 `components.jsx` 的 `Icon`），勿引入大型 icon library。

## 必接的真實邏輯（原型是 mock）
- **API 以 `api.md` 為準**（權威來源）；README 「API Contract」只是摘要，衝突以 `api.md` 主。
  - `POST /analyze`（**`multipart/form-data`**，非 JSON；`text`/`image`/`market`/`limit` 為 form 欄位，無 `type`）
  - `GET /ratelimit`（載入時查用量，不消耗額度）、`GET /health`（冷啟動先 ping）
  - 替換掉 `mock-data.js` 與 `app.jsx` 內的 `setTimeout` 模擬。
- **Rate limit（後端已實作，env 控制視窗；本專案設為每小時 5 次）**：判定在後端，前端**以後端為準**。
  - 載入時打 `GET /ratelimit` → pill 即準（關閉再回來/跨裝置）。
  - 讀 `/analyze` 回應的 `X-RateLimit-Limit/Remaining/Reset` 即時更新 pill。
  - 429 用 `Retry-After`（或 body `retry_after`）跑倒數。
  - **標頭優先，本地 `rateTimes` 預估僅作 fallback**；`maxUsage` 別寫死，用回應 `limit`。
  - 數字讀標頭自動跟視窗；只有 `RATE / HR` 文字標籤需配合部署視窗。「Simulate 429」僅 demo，正式版移除。
- **音檔試聽**：接 `<audio>` 播 `preview_url`，同一時間只播一首。
- **持久化**：歷史存**完整快照**（mood + 完整 tracks，含 `reason`——無法靠 id 從 Spotify 撈回），
  封面存 URL、FIFO 上限 50 筆。三把獨立 key：`vibetrack:history:v3 / prefs:v3 / rate:v3`
  （切主題只寫 prefs、不重寫歷史；歷史僅在送出時寫）。schema 變動時遞增版本號。

## 驗收清單
- [ ] Analyze：text/image 切換、drag&drop 上傳預覽、market（預設 TW）、Tracks 5/8/10
- [ ] 送出 loading 態（循環文案）、⌘↵ 快捷鍵
- [ ] Detected mood：漸層 hero + 3–5 情緒標籤（由 API 回傳）
- [ ] 歌曲卡：真實專輯封面、rank、reason、Spotify 連結；POP/播放鈕條件顯示
- [ ] 429 toast「請稍後再試」+ 倒數（格式 `19m 59s` / `1h 5m`，讀 `Retry-After`）
- [ ] pill 顯示 `remaining/limit`（RATE / HR），載入時 `GET /ratelimit` 校正
- [ ] Dashboard：統計卡、history split view（完整快照）、Replay、RateRing
- [ ] 4 套主題切換（neon/sunset/aurora/mono）
- [ ] 響應式：≤1100px 3 欄、≤800px 2 欄、≤900px Dashboard 單欄

## 別做
- 別把情緒判定寫在前端（原型的 `pickMoodKey` 關鍵字正則只是 placeholder；mood 由 `/analyze` 回傳）。
- 別用 JSON 送 `/analyze`——它吃 `multipart/form-data`（用 `FormData`）。
- 別寫死 market 只有 6 個；api.md 支援 13 個。
- 別新增 README/規格未提到的頁面、區塊或填充內容，先問再加。
