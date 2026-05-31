# VibeTrack — Rate Limit 前端需求（給後端）

## 背景
前端要渲染兩個東西：
1. 頂部用量指示（pill）：`剩餘/上限`，例如 `3/5`
2. 達上限時的 toast 倒數：「請稍後再試 — retry in 19m 59s」

目前後端**會在 `/analyze` 判定並擋下超量請求（回 429）**，但**沒有回傳前端渲染所需的數值**。
以下是需要補的欄位。核心訴求一句話：**讓後端成為唯一真相，前端只負責顯示。**

---

## 需求 1（必須）：429 回應帶重試時間
超過限制時，除了 `429` 狀態碼，請附上「還要等多久」。

**HTTP 標頭（標準做法，優先）**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 1180          # 整數秒，距離下次可呼叫的等待秒數
```

**並在 JSON body 也放一份（前端讀 body 較穩，二擇一或都給）**
```json
{
  "error": "rate_limited",
  "message": "每小時上限 5 次，請稍後再試",
  "retry_after": 1180,        // 整數秒
  "limit": 5,
  "remaining": 0,
  "reset_at": 1717059600      // 重置時間，Unix epoch 秒（UTC）
}
```

> `retry_after` 是**最重要**的欄位——沒有它，前端的倒數只能用猜的。

---

## 需求 2（建議）：每次成功回應也帶用量
讓 pill 的 `剩餘/上限` 是真的，而非前端自己數。

**成功回應（200）標頭**
```
X-RateLimit-Limit: 5         # 視窗內總額度
X-RateLimit-Remaining: 3     # 本次之後還剩幾次
X-RateLimit-Reset: 1717059600  # 額度重置時間，Unix epoch 秒（UTC）
```

對應的 JSON 也可選擇性附 `meta`（前端優先讀標頭，這只是方便）：
```json
{
  "mood": { /* ... */ },
  "tracks": [ /* ... */ ],
  "meta": { "limit": 5, "remaining": 3, "reset_at": 1717059600 }
}
```

---

## 需求 2.5（重要）：只讀的用量查詢端點
**問題**：pill 若只靠 `/analyze` 回應餵，使用者「關閉網頁再回來」時會不正確——
還沒呼叫 analyze 就沒有資料，或本機存的舊值已過時（尤其滑動視窗、跨裝置時）。

**解法**：提供一支**只查詢、不消耗額度**的端點，前端在每次載入時呼叫，pill 立刻準確。
```
GET /ratelimit            (或 /me/quota)
→ 200
{
  "limit": 5,
  "remaining": 3,
  "reset_at": 1717059600    // Unix epoch 秒（UTC）
}
```
要點：
- **不可**佔用 analyze 的額度（純讀取）
- 限流綁定維度要和 `/analyze` **一致**（同樣依 IP / device id / user）
- 跨裝置、關了再開、滑動視窗都能回傳正確的當前剩餘
- 若也需要 CORS 暴露標頭，請一併比照需求 3

> 沒有這支端點，前端只能用「localStorage 上次值 + `reset_at` 校正」做近似 fallback，
> 在滑動視窗或多裝置情境下可能低估或過時。

---

## 需求 3（必須，否則前端讀不到標頭）：CORS 暴露標頭
瀏覽器 JS **預設讀不到自訂回應標頭**，必須在回應加：
```
Access-Control-Expose-Headers: Retry-After, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
```
（若改走 JSON body 提供這些值，可不需要這條；但若用標頭就一定要。）

---

## 規格細節（請後端確認，避免前後端對不上）

| 項目 | 需要明確的點 | 前端的假設（可改） |
|---|---|---|
| 視窗類型 | 滑動視窗 還是 固定視窗？ | 假設**滑動 60 分鐘** |
| 上限 | 每視窗幾次？ | 5 |
| 計數時機 | 哪些算一次？只算**成功**？還是連 429 也算？ | 假設只算成功的 `/analyze` |
| 限流維度 | 依什麼綁定？IP / device id / user？ | 需後端告知，前端可帶 `X-Device-Id` |
| reset 語意 | `reset_at` 是「整個視窗重置」還是「下一個名額釋出」？ | 假設下一個名額釋出時間 |
| 時間單位 | `retry_after`/`reset` 是秒還是毫秒？epoch 還是相對？ | 假設 `retry_after`=相對秒、`reset_at`=epoch 秒 |

---

## 前端會怎麼用（讓你知道為什麼這樣設計）
- **標頭優先，本地 fallback**：後端有給就用真的；沒給就退回本地預估（現況），不會壞。
- **載入時**先打 `GET /ratelimit` → pill 一進來就準（解決關閉再回來的問題）。
- **每次 analyze 回應**用標頭即時更新 pill（省掉重複查詢）。
- pill 顯示 `remaining/limit`；達 0 時禁用送出。
- 429 → 用 `retry_after` 跑倒數（格式化成 `19m 59s` / `1h 5m`），歸零後自動解除。
- 一旦後端加了這些欄位，前端**不需再改版**就會自動變準。

---

## 最小可行（如果只能改一個）
就加 **429 的 `Retry-After`（或 body 的 `retry_after`）** + 對應的 **CORS expose**。
其餘（成功回應用量標頭、`GET /ratelimit`）是體驗加分，可後續再補。
不過要「**關閉網頁再回來也正確**」，`GET /ratelimit` 是關鍵的那一支。
