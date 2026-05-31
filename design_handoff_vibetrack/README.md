# Handoff: VibeTrack — 情緒分析音樂推薦

## Overview
VibeTrack 是一個分析「文字或圖片情緒」並推薦 Spotify 歌曲的網頁應用。
使用者輸入一段文字（或上傳一張圖片）＋ 選擇 market，送出後由後端（LLM + Spotify API）
回傳一組推薦歌曲與一個情緒摘要（mood）。應用包含兩個頁面：**Analyze（分析頁）** 與
**Dashboard（本地歷史紀錄）**。

## About the Design Files
此資料夾中的檔案是用 **HTML / React (透過瀏覽器內 Babel) + 原生 CSS** 製作的**設計參考稿** —
展示預期的外觀與行為的原型，**不是要直接複製的生產程式碼**。

你的任務是在**目標 codebase 的既有環境**（React / Vue / Next.js 等）中，用該專案既有的
慣例、元件庫與狀態管理，**重新實作這些設計**。若專案尚無前端環境，請選擇最合適的框架
（建議 React + Vite 或 Next.js）來實作。

原型中所有資料都是 mock（寫死在 `mock-data.js`），網路請求是 `setTimeout` 模擬。
實作時請替換成真實 API 串接（見下方「API Contract」）。

## Fidelity
**High-fidelity（hifi）**。配色、字體、間距、互動皆為最終設計，請盡量像素級還原，
並用 codebase 既有的元件庫重建相同視覺。

---

## Design Language（設計語言）

整體風格：**暗色霓虹（dark neon）**，音樂感、夜間感。

- **背景**：深紫黑底（`#07060d`），固定三顆 blur 光暈軌道（atmosphere）＋ 顆粒紋理疊加
- **卡片**：半透明白 + 1px 邊框 + backdrop-blur，圓角 20px
- **重點色**：霓虹粉 `#ff3cac` × 紫 `#7a5cff` × 青 `#00e5ff` 的 135° 漸層，用於 CTA、強調文字、能量視覺
- **字體**：
  - Display（標題）：**Space Grotesk** 400/500/600/700
  - Body（內文）：**Inter** 400/500/600
  - Mono（資料/代號/標籤）：**JetBrains Mono** 400/500
- 廣泛使用 monospace 小字作為「資料感」標籤（eyebrow、tag、BPM 風格標記）

### 主題系統（Tweaks）
有 4 套可切換的調色盤主題，透過設定一組 CSS 變數於 `:root` 切換：
`neon`（預設）、`sunset`、`aurora`、`mono`。
切換只改 `--bg-0/1/2`、`--neon-a/b/c/d`、`--grad-primary` 這幾個變數，
整個介面（含情緒 hero、按鈕）即時換色。詳見 `app.jsx` 的 `THEMES` 物件。

---

## Design Tokens

### Colors
```
--bg-0:        #07060d   /* 最深背景 */
--bg-1:        #0d0a18   /* 輸入框 / 次層背景 */
--bg-2:        #14112a
--surface:     rgba(255,255,255,0.04)
--surface-2:   rgba(255,255,255,0.06)
--line:        rgba(255,255,255,0.08)   /* 一般邊框 */
--line-strong: rgba(255,255,255,0.16)   /* 強調邊框 */

--ink-0: #ffffff             /* 主文字 */
--ink-1: rgba(255,255,255,0.92)
--ink-2: rgba(255,255,255,0.62)  /* 次文字 */
--ink-3: rgba(255,255,255,0.40)  /* 弱文字 / 標籤 */
--ink-4: rgba(255,255,255,0.22)

--neon-a: #ff3cac   /* 粉 */
--neon-b: #7a5cff   /* 紫 */
--neon-c: #00e5ff   /* 青 */
--neon-d: #b8ff3c   /* 萊姆綠 */
--neon-warn:   #ffb547
--neon-danger: #ff5573
--neon-ok:     #6cffb4

--grad-primary: linear-gradient(135deg, #ff3cac 0%, #7a5cff 50%, #00e5ff 100%)
```

### Radius
```
xs 6px · s 10px · m 14px · l 20px · xl 28px
```

### Shadows
```
--shadow-soft:    0 8px 30px -12px rgba(0,0,0,0.6)
--shadow-glow-a:  0 0 0 1px rgba(255,60,172,0.30), 0 12px 40px -8px rgba(255,60,172,0.45)
```

### Spacing
8px 基準。頁面外距 40px、卡片內距 24px、卡片間距 16–28px。

### Type Scale（hifi 實測）
```
page-title    : 52px / 500 / -0.03em letter-spacing / Space Grotesk
results-title : 26px / 500 / -0.02em
mood hero h2  : 38px / 500
card-title    : 14px / 500
song-title    : 15px / 500 / Space Grotesk
body / reason : 12–13px / Inter
eyebrow / tag : 10–11px / 0.16em letter-spacing / UPPERCASE / JetBrains Mono
```
> 注意：本設計為桌面網頁，最小資料字 10–11px 僅用於 mono 標籤；正文不小於 12px。

---

## Screens / Views

### 1. Analyze（分析頁）

**Purpose**：使用者輸入文字/圖片 → 選 market 與歌曲數 → 送出 → 看情緒摘要 + 推薦歌單。

**Layout**：
- 頂部 sticky topbar（品牌 / 中央 nav 切頁 / 右側 RATE/HR 速率指示）
- Page header：eyebrow + 大標（含漸層強調字）+ 副標
- 主區 `analyze-grid`：兩欄 `1.05fr 0.95fr`，gap 28px
  - 左欄 `.card`：Input 區
  - 右欄：Detected mood 區（或未送出時的等待態）
- 下方 `results-section`：歌曲卡 grid，`repeat(4, 1fr)`，gap 16px
  - 響應式：≤1100px 變 3 欄，≤800px 變 2 欄且主區變單欄

**Components**：

- **Input tabs**：Text / Image 分頁切換（pill 樣式，active 為較亮底）
- **Text 模式**：
  - textarea，min-height 160px，focus 時邊框轉紫 + 3px glow
  - 底部 meta 列：左側 4 個建議 chip（點擊填入），右側字數 `n/500`
- **Image 模式**：
  - drag & drop 區（虛線邊框，min-height 220px），hover/dragging 時邊框轉青 + 淡漸層底
  - 上傳後顯示預覽縮圖 + 檔名/大小 + 移除鈕（右上 ✕）
- **Controls row**：
  - Market 下拉（`field` 樣式，含國旗 emoji）：TW（預設）/ JP / US / GB / HK / KR
  - Tracks 下拉：**5 / 8 / 10**
  - **Analyze vibe CTA**：漸層底、深色字、含 ✦ icon 與 `⌘↵` 鍵帽
    - loading 時：cursor wait、左側脈動 orb、文字循環跑
      `Reading mood → Mapping spectrum → Picking tracks → Tuning order`（每 700ms 換）
    - disabled 條件：text 模式空字串 / image 模式無檔案 / loading 中
    - 快捷鍵：`⌘/Ctrl + Enter` 送出

- **Detected mood panel**（送出後右欄）：
  - 漸層 hero（高 200px）：頂部 mono 標記 `PRIMARY MOOD` / `N signals`，底部情緒大標 + 副標
  - Mood signals：3–5 個情緒標籤，primary 那顆有發光圓點 + 強調底
  - 一行 mono 註解說明 signals 來源
  - **未送出的等待態**（`PreviewEmpty`）：動畫頻譜條 + 「Awaiting signal」軌道光球
  - **loading 態**（`MoodSkeleton`）：骨架 shimmer

- **Song card（歌曲卡）** — 8 張（或依 Tracks 選擇）：
  - 封面（1:1）：`album_image_url` 背景圖；無圖時退回漸層占位
  - cover-shade：頂/底各一層黑色漸層遮罩，確保疊加元素可讀
  - 左上 rank 徽章 `#01`（mono）
  - 右上 POP 徽章 `POP nn` — **僅當 `popularity` 為數字時顯示**
  - 迷你播放鈕（右下）+ 播放波形動畫（左下）— **僅當 `preview_url` 存在時顯示**
    - hover 浮現；播放中變萊姆綠 + 波形動畫
  - 內容：歌名（Space Grotesk，單行省略）/ 藝人 / reason 引言（上方分隔線，min-height 50px）
  - 底列：Spotify 連結按鈕（萊姆綠 pill，含 Spotify icon + 外開 icon）+ 右側 `30s preview`/`no preview` 狀態
  - 未送出時顯示 8 張 placeholder 卡（半透明）

- **Results header actions**：`Shuffle order`、`Save to history`（ghost 按鈕，目前為視覺，未接邏輯）

### 2. Dashboard（本地歷史，split view）

**Purpose**：瀏覽存在 localStorage 的歷史查詢，左側清單 + 右側預覽，可重播到 Analyze。

**Layout**：
- Page header（同 Analyze 風格）
- 頂部 4 張統計卡 `repeat(4, 1fr)`：
  - Total queries / Today / Rate limit（`usage/max` + SVG 環形進度）/ Last vibe
- 主區 `dashboard` grid：`340px 1fr`，gap 24px（≤900px 變單欄）
  - 左 `history-list`：sticky，可捲動，每筆 `history-item`
  - 右 `history-preview`：選中該筆的完整內容

**Components**：
- **History item**：type 標籤（TEXT 粉 / IMAGE 青）+ 相對時間 + market + 輸入摘要（2 行省略）
  + 情緒名 chip + 歌曲數；active 時左側紫青漸層底 + 邊框
- **History preview**：
  - meta 列：時間戳 / market / 輸入類型 / 歌曲數 + 「Replay on Analyze」按鈕
  - 輸入區塊（文字或圖片縮圖）
  - 完整 Mood panel（同 Analyze）
  - Recommended tracks：song-mini 列表（小封面 + 歌名 + 藝人 + 可選 POP），grid 2–3 欄
- **RateRing**：SVG 環形，`value≥0.99` 紅 / `≥0.6` 黃 / 其餘青，含 glow

---

## Interactions & Behavior

- **送出流程**：`submit` → 檢查速率限制 → loading（模擬 1.8s）→ `submitResolved` 寫入結果 + 歷史
- **情緒判定**（mock，需由後端取代）：`pickMoodKey()` 用關鍵字正則判斷
  `melancholic / energetic / calm`，圖片則依檔名長度。**真實版應由後端回傳 mood。**
- **Rate limit（每小時 5 次，後端為準）**：
  - **判定/執行在後端**：`/analyze` 超量回 `429`。前端的本地 `rateTimes` 只是**樂觀預估**。
  - **數值來源 = 後端**（見 API Contract）：
    - 載入時打 `GET /ratelimit` → pill 一進來就準（解決關閉再回來/跨裝置）
    - 每次 `/analyze` 回應的 `X-RateLimit-*` 標頭即時更新 pill
    - `429` 用 `Retry-After` 跑倒數
  - **標頭優先，本地 fallback**：後端有給就用真的；拿不到才退回本地預估（mock 現況）
  - topbar 的 **RATE / HR** 點點顯示 `remaining/limit`；達 0 禁用送出
  - 倒數格式化為 `19m 59s` / `1h 5m`（`components.jsx` 的 `formatCountdown`）
  - 底部「Simulate 429」按鈕僅 demo 用，**正式版移除**
- **播放預覽**：目前僅前端 UI 狀態切換（單一播放中卡片）。實作時接 `<audio>` 播 `preview_url`
- **Replay**：Dashboard 點「Replay on Analyze」→ 帶該筆**完整快照**（mood + tracks）跳回 Analyze 頁
- **主題切換**：Tweaks 面板選主題 → 改 `:root` CSS 變數

### Animations
- atmosphere 光暈：22–30s drift 循環
- CTA hover：translateY(-1px) + 加強 glow
- song card hover：translateY(-2px) + 邊框變亮；播放鈕浮現
- 能量條 / 環形：0.4–0.6s ease 過渡
- toast：從下方 20px 淡入（0.3s）

---

## State Management

集中在 `app.jsx` 的 `useReducer`。主要 state：
```
page          : "analyze" | "dashboard"
inputMode     : "text" | "image"
textValue     : string
imageFile     : { name, size, type } | null
market        : "TW" | "JP" | "US" | "GB" | "HK" | "KR"
trackCount    : 5 | 8 | 10
loading       : boolean
result        : { mood, songs, market, ts } | null
error         : { type: "429", retryIn, at } | null
history       : HistoryEntry[]          // 持久化（完整快照）
rateTimes     : number[]                // 本地樂觀預估用 timestamps，持久化
usage         : number                  // 視窗內次數（顯示用）
maxUsage      : 5                        // 真實版改由後端標頭/GET /ratelimit 決定
theme         : "neon" | "sunset" | "aurora" | "mono"   // 持久化
```
Actions：`setPage / setMode / setText / setImage / setMarket / setTrackCount /
setTheme / tickRate / submit / submitResolved / dismissError / replayHistory / force429`

**HistoryEntry（完整快照）**：歷史紀錄存的是當下的完整結果，不只 id —
因為每首歌的 `reason` 是 LLM 針對該次輸入生成的，無法靠 track id 從 Spotify 撈回。
```
{
  id, ts,
  type   : "text" | "image",
  input  : string,                 // 文字內容，或圖片檔名
  market : "TW" | ...,
  mood   : { label, sub, tags[], gradA, gradB },
  tracks : Track[]                 // 完整歌曲物件（含 reason、封面 URL）
}
```
封面存 URL（非 base64），一筆 ≈5KB，FIFO 上限 50 筆 → 容量恆定、無前端負擔。

**持久化**：拆成三把獨立 localStorage key，避免改一個 slice 就重寫其他：
```
vibetrack:history:v3   → history（完整快照，僅在送出時寫入）
vibetrack:prefs:v3     → { theme }（切主題只寫這把）
vibetrack:rate:v3      → rateTimes（本地預估；真實版以後端為準）
```
`tickRate` 有守衛：無項目過期時不產生新陣列，避免每秒多餘 re-render / 寫入。

---

## API Contract — 以 `api.md` 為準

> **權威來源 = 同資料夾的 `api.md`（後端實際規格）。** 本節為摘要，與 `api.md`
> 衝突時一律以 `api.md` 為主。Swagger 互動文件：`GET /api/docs`。
> Base URL：後端 Render 服務（部署網址）。

**端點總覽**
| 端點 | 用途 |
|---|---|
| `POST /analyze` | 分析情緒 + 回推薦歌曲 |
| `GET /ratelimit` | 只讀查詢用量（不消耗額度） |
| `GET /health` | 存活檢查（冷啟動用） |

**Request — `POST /analyze`（注意：`multipart/form-data`，非 JSON）**
```
POST /analyze
Content-Type: multipart/form-data

text   : string   // 心情文字，≤300 字；text / image 至少一個
image  : file     // JPEG/PNG/WebP/GIF；text / image 至少一個
market : string   // 選填，Spotify 地區碼（見下）
limit  : number   // 選填，僅 5 | 8(預設) | 10
```
> **沒有 `type` 欄位** — 後端依你傳了 `text` 還是 `image` 自動判斷。前端用 `FormData` 送。

**支援的 market（13 個）**：`TW US JP KR HK SG GB AU CA FR DE BR`
（前端現只放 6 個，可擴充。）

**Response**
```jsonc
{
  "mood": {
    "label": "Heartbreak Reverie",
    "sub": "Bittersweet · Late-night · 失戀後的療傷",
    "tags": [
      { "name": "Heartbroken", "primary": true },
      { "name": "Reflective" },
      { "name": "Bittersweet" }
      // 3–5 個
    ]
  },
  "tracks": [
    {
      "id": "1iDQ0rKPkk09OzBhXOltmg",
      "title": "遺憾",
      "artist": "Mavis Hee",
      "spotify_url": "https://open.spotify.com/track/...",
      "album_image_url": "https://i.scdn.co/image/...",
      "reason": "許美靜的經典抒情歌曲…",
      "popularity": 55,           // 可選 — 有才顯示 POP 徽章
      "preview_url": null         // 可選 — 有才顯示迷你播放鈕
    }
    // … limit 首
  ]
}
```

**錯誤 — 429（速率上限）**
```
HTTP 429 Too Many Requests
Retry-After: 45                         // 整數秒，距下次可呼叫
{
  "error": "rate_limited",
  "message": "請求次數已達上限，請稍後再試。",
  "retry_after": 45,
  "limit": 5,
  "remaining": 0,
  "reset_at": 1717059600                // 視窗重置 Unix timestamp（秒）
}
```
前端用 `retry_after`（或 `Retry-After` 標頭）跑 toast 倒數。

> **速率視窗由後端環境變數控制**：`api.md` 預設值是 60 秒；**本專案部署設為每小時（3600 秒）**，
> 故前端標 `RATE / HR`。視窗值之後若再調，前端的數字（剩餘/重置）讀標頭自動跟著對，
> 只有 `HR` 文字標籤需配合部署視窗手動對齊。

**Rate limit — 成功回應也帶用量**
```
HTTP 200
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1717059600
```
> 自訂標頭需在 `Access-Control-Expose-Headers` 列出，否則瀏覽器 JS 讀不到。

**Rate limit — 只讀查詢端點（pill 載入即準）**
```
GET /ratelimit                          // 不消耗額度；綁定維度與 /analyze 一致
→ 200  { "limit": 5, "remaining": 3, "reset_at": 1717059600 }
```
前端在**每次載入時**呼叫 → 關閉網頁再回來、跨裝置都正確。

**存活檢查 — `GET /health`**
```
GET /health  → 200 { "status": "ok" }
```
Render 免費方案閒置會休眠，冷啟動需數秒。前端初始化時先 ping，沒回應就顯示
「服務啟動中，請稍候」再進主介面。

**一般錯誤格式（非 429）**
```json
{ "statusCode": 422, "timestamp": "...", "path": "/analyze", "message": "..." }
```
| 狀態碼 | 情境 |
|---|---|
| 400 | `limit` 不在 5/8/10 |
| 422 | text 與 image 皆未提供（`At least one of text or image must be provided.`） |
| 429 | 超過速率上限 |
| 500 | 伺服器內部錯誤（Claude / Spotify 呼叫失敗） |

**快取**：相同 text+image 在 24h 內回傳快取結果（較快），但**仍消耗額度**。

> 完整 rate limit 契約見 `backend_ratelimit_requirements.md`；完整 API 見 `api.md`。
> 前端策略：**標頭/端點優先，本地 `rateTimes` 預估僅作 fallback**。
> `maxUsage`（現寫死 5）正式版改由回應的 `limit` 欄位決定，上限調整前端免改版。

> **UI 向下相容**：`popularity` / `preview_url` / `album_image_url` 皆可為 null；
> 缺少時 UI 自動隱藏對應元素（POP 徽章、播放鈕、封面退回漸層）。

---

## Assets
- **字體**：Google Fonts（Space Grotesk / Inter / JetBrains Mono）
- **圖示**：全為內聯 SVG（見 `components.jsx` 的 `Icon` 物件），無外部圖檔依賴
- **專輯封面**：來自 Spotify CDN（`i.scdn.co`），由 API response 提供
- **大氣光暈 / 顆粒 / 噪點**：純 CSS（radial-gradient + 內聯 SVG feTurbulence），無圖檔

---

## Files（本 bundle 內的設計參考檔）
```
VibeTrack.html    入口，載入順序：mock-data → components → analyze → dashboard → app
styles.css        全部樣式與設計 tokens（:root 變數）
mock-data.js      mock 歌曲 / 情緒 preset / 歷史 seed（替換成 API）
components.jsx    共用：Icon、Atmosphere、Topbar、UsagePill、RateLimitToast、格式化工具
analyze.jsx       Analyze 頁：輸入、market、CTA、mood panel、song cards
dashboard.jsx     Dashboard 頁：統計卡、history 清單、split 預覽、RateRing
app.jsx           根組件：useReducer state、THEMES、localStorage、async 模擬、Tweaks 面板
```

實作建議順序：先建 design tokens（CSS 變數 / theme provider）→ 共用元件（Icon、Topbar、
卡片）→ Analyze 頁串 API → rate limit 邏輯 → Dashboard 持久化 → 主題切換。

---

## 附檔
- `api.md` — **後端實際 API 規格（權威來源）**；串接一律以此為準
- `CLAUDE.md` — 給 Claude Code 的精簡開發規範與驗收清單（放專案根目錄會被自動讀取）
- `backend_ratelimit_requirements.md` — rate limit 後端契約背景（已實作；細節以 api.md 為準）
- `screenshots/` — 設計截圖：
  - `01-analyze.png` — Analyze 頁上半（輸入 + Detected mood）
  - `02-analyze-songs.png` — 歌曲卡 grid
  - `03-dashboard.png` — Dashboard split view + 統計卡
