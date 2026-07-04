# Spec: vercel-deployment

### Requirement: SPA routing fallback
前端 SHALL 在所有非靜態資源路徑回傳 `index.html`，使 React Router client-side routes 可正確處理。前端 build SHALL 使用 `ssr: false` 模式（`react-router.config.ts`），確保 `build/client/index.html` 為純 shell，不含 server-rendered 內容，避免 SPA catch-all rewrite 將 prerendered HTML 服務給非對應路由造成 Hydration Error。

#### Scenario: 直接訪問 dashboard 路由
- **WHEN** 用戶直接在瀏覽器訪問 `/dashboard`
- **THEN** 系統回傳 `index.html`，React Router 正確渲染 Dashboard 頁面，HTTP 狀態碼為 200

#### Scenario: 靜態資源不受影響
- **WHEN** 瀏覽器請求 `/assets/index-abc123.js`
- **THEN** 系統回傳實際靜態檔案（不走 fallback）

### Requirement: Build-time 環境變數注入
系統 SHALL 在 build 時將 `VITE_API_BASE_URL` 內嵌進 JS bundle，使前端可直接呼叫後端 API。

#### Scenario: API URL 正確注入
- **WHEN** Vercel 執行 build（`tsc -b && vite build`）且 `VITE_API_BASE_URL` 已在 Vercel Dashboard 設定
- **THEN** 生成的 JS bundle 中 `import.meta.env.VITE_API_BASE_URL` 解析為 `https://vibe-track.onrender.com`

#### Scenario: 環境變數未設定時的 fallback
- **WHEN** `VITE_API_BASE_URL` 未設定
- **THEN** `import.meta.env.VITE_API_BASE_URL` 解析為空字串，API 呼叫使用相對路徑（可能失敗，不應影響 build 成功）

### Requirement: 前端公開可訪問
部署後，前端 SHALL 透過 Vercel 提供的 HTTPS URL 對外提供服務。

#### Scenario: 首頁正常載入
- **WHEN** 用戶訪問 Vercel 分配的 URL（`https://<project>.vercel.app/`）
- **THEN** 首頁正確渲染，頁面狀態碼為 200，無 JS 錯誤

#### Scenario: API 呼叫成功
- **WHEN** 用戶在已部署的前端執行 analyze 功能
- **THEN** 前端成功呼叫 `https://vibe-track.onrender.com/analyze`，回傳結果正常顯示
