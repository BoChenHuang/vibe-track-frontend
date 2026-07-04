## Why

前端目前僅在本機開發環境執行，尚無公開部署。將其部署至 Vercel 可讓用戶透過公開 URL 訪問服務，並利用 Vercel CDN 提升載入速度。

## What Changes

- 新增 `vercel.json`，設定 SPA routing fallback（所有路徑回到 `index.html`），避免 `/dashboard` 等 client-side routes 在直接訪問時回傳 404
- 確認 build 指令（`tsc -b && vite build`）與輸出目錄（`dist/`）符合 Vercel 預期格式
- 環境變數 `VITE_API_BASE_URL` 從 `.env` 移至 Vercel Dashboard 管理，值指向 `https://vibe-track.onrender.com`

## Capabilities

### New Capabilities

- `vercel-deployment`: 在 Vercel 上靜態部署前端 SPA，含 SPA routing fallback 設定與環境變數管理

### Modified Capabilities

（無 spec 層級的行為變更，API 呼叫邏輯與現有 `api-client` spec 一致）

## Impact

- **新增檔案**: `vercel.json`（專案根目錄）
- **不修改**: `vite.config.ts`（dev proxy 不影響 production build）、`app/lib/env.ts`（已正確讀取 `import.meta.env.VITE_API_BASE_URL`）
- **Vercel Dashboard 手動設定**: `VITE_API_BASE_URL=https://vibe-track.onrender.com`
- **後端相依**: 後端繼續運行於 Render.com，前端直接呼叫 API，無 proxy
