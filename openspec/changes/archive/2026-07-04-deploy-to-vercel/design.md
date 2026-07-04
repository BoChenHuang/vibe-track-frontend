## Context

vibe-track-frontend 是 Vite + React Router v7 (framework mode) 的 SPA，目前僅有本機開發環境。後端 API 部署於 Render.com (`https://vibe-track.onrender.com`)，前端透過 `VITE_API_BASE_URL` 環境變數直接呼叫。

Vercel 是靜態前端的標準部署平台，支援自動偵測 Vite 專案、全球 CDN、Git 整合 CI/CD，適合本專案需求。

## Goals / Non-Goals

**Goals:**
- 在 Vercel 上公開部署前端，提供穩定的 HTTPS URL
- 設定 SPA routing，使所有 client-side routes（如 `/dashboard`）直接訪問時不回傳 404
- 環境變數透過 Vercel 管理，與 `.env` 檔案解耦

**Non-Goals:**
- 不將後端遷移至 Vercel（後端繼續在 Render）
- 不啟用 SSR 或 Vercel Edge Functions
- 不修改 API 呼叫邏輯

## Decisions

### D1：使用 `vercel.json` rewrites 處理 SPA routing

React Router v7 使用 client-side routing，當用戶直接訪問 `/dashboard` 時，Vercel 靜態伺服器找不到該路徑會回傳 404。

**決策**：在 `vercel.json` 加入 catch-all rewrite：
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**替代方案考量**：
- `vercel.json` 的 `routes` 設定（較舊語法，rewrites 是新推薦方式）
- React Router v7 框架模式本身支援 SSR adapter，但本專案 build 產出純靜態 `dist/`，不需要 SSR

### D2：環境變數在 Vercel Dashboard 管理

`VITE_API_BASE_URL` 是 build-time 變數（被 Vite 內嵌進 bundle），不是 runtime 環境變數。

**決策**：在 Vercel Project Settings → Environment Variables 設定，`.env` 僅保留本機開發用。

**注意**：該變數值（`https://vibe-track.onrender.com`）會被內嵌進 JS bundle，對外部可見，這對公開 API URL 是可接受的。

### D3：輸出目錄為 `build/client/`（非 `dist/`）

React Router v7 framework mode 的 build 輸出為 `build/client/`（client bundle）與 `build/server/`（SSR bundle），而非標準 Vite 的 `dist/`。

**決策**：在 `vercel.json` 加入 `"outputDirectory": "build/client"` 讓 Vercel 自動讀取正確目錄，不需在 Dashboard 手動設定。

### D4：移除 `prerender: ['/']`

**問題**：原本 `react-router.config.ts` 設有 `prerender: ['/']`，會在 build 時將首頁內容 server-render 後寫入 `build/client/index.html`。Vercel 的 catch-all rewrite 讓所有路徑（包括 `/dashboard`）都服務這個含有首頁 HTML 的 `index.html`。React Router 在 `/dashboard` 嘗試 hydrate 時，發現 DOM 是首頁內容，產生 Hydration Error (#418)，觸發 root ErrorBoundary 顯示 "Something went wrong"。

**決策**：移除 `prerender: ['/']`，`index.html` 改為純 shell（僅含 `<script>` tag），所有路由純 client-side render，無 hydration mismatch。

**替代方案考量**：保留 prerender 但為每個路由各產一份 HTML（需列舉所有路由），複雜度高且未來維護成本大，不採用。

## Risks / Trade-offs

- **後端 CORS 設定**：若 Render.com 後端未允許 Vercel domain（`*.vercel.app`），API 呼叫會失敗。→ 部署後需驗證 CORS 回應，必要時需在後端加入 Vercel URL 的 CORS 設定
- **Render.com 冷啟動**：後端在閒置後會 sleep，首次 API 呼叫可能延遲 15-30 秒。→ 這是後端的已知限制，與本次部署無關
- **`.env` 不進 git**：確認 `.gitignore` 包含 `.env`，避免 API URL 有變更時被 commit 覆蓋 Vercel 設定

## Migration Plan

1. 建立 `vercel.json`（本 PR）
2. 將 GitHub repo 連接至 Vercel（手動操作，一次性）
3. 在 Vercel Dashboard 設定 `VITE_API_BASE_URL=https://vibe-track.onrender.com`
4. Vercel 自動觸發首次 build & deploy
5. 驗證 `/` 和 `/dashboard` 路由正常、API 呼叫成功

**Rollback**：刪除 Vercel 專案或關閉 auto-deploy 即可，不影響本地開發。

## Open Questions

- 後端 Render.com 是否已設定允許來自 `*.vercel.app` 的 CORS？（需部署後驗證）

## 實作備註

- **輸出目錄**：React Router v7 framework mode 輸出 `build/client/`，已在 `vercel.json` 的 `outputDirectory` 設定
- **Prerender 已移除**：`react-router.config.ts` 移除 `prerender: ['/']`，解決 SPA rewrite 與 server-rendered HTML 衝突導致的 Hydration Error #418
