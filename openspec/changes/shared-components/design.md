## Context

專案已有 design tokens、型別定義與路由 shell（scaffold-project）。現在需要建立所有頁面共用的視覺元件，包含動態背景、頂列、速率 pill、錯誤 toast 和 icon 集合。設計稿的原型用 `window` 全域共享元件，此處改為正規 React module 匯出。

## Goals / Non-Goals

**Goals:**
- Atmosphere 背景：三顆 radial-gradient 光暈球，22–30s CSS keyframe 漂移動畫，覆蓋全螢幕 fixed
- 顆粒紋理：內聯 SVG feTurbulence 疊加層（opacity 0.03），純 CSS 不需圖檔
- Topbar：sticky，品牌左、nav 中（Analyze / Dashboard pill 切換）、UsagePill 右
- UsagePill：顯示 `remaining/limit`，`remaining === 0` 時紅點；讀 AppContext 取速率資料
- RateLimitToast：429 時從螢幕底部滑入，顯示倒數，`retry_after` 倒數至 0 自動消失
- formatCountdown：`45` → `45s`；`119` → `1m 59s`；`3665` → `1h 1m`
- Icon：包含設計稿需要的所有 SVG（SpotifyIcon、ExternalLinkIcon、PlayIcon、WaveIcon、SparkleIcon、CloseIcon）

**Non-Goals:**
- 頁面主體內容（由後續 change 負責）
- 真實速率資料（初期可用 AppContext 預設值）
- 主題切換邏輯（由 theme-persistence change 負責）

## Decisions

**Atmosphere 動畫：純 CSS keyframe，不用 JS**
- 三顆球各有獨立 `@keyframes`，offset 不同避免同步
- `will-change: transform` 鎖定 GPU 合成層，避免 layout paint

**Icon：內聯 SVG function component**
- 每個 icon 是一個 React functional component，接受 `size`、`className` props
- 不引入 lucide-react 或 heroicons，避免 bundle 膨脹（設計稿僅需約 6 個 icon）

**UsagePill 資料來源：AppContext**
- 讀 `state.usage`、`state.maxUsage`；`remaining = maxUsage - usage` 在 UI 層計算
- 實際後端數值由 api-integration change 更新至 context

**RateLimitToast：AppContext `state.error`**
- `error.type === '429'` 時顯示，`error.retryIn` 為初始秒數
- 元件內用 `useEffect + setInterval` 跑本地倒數，歸零時 dispatch `dismissError`

**formatCountdown 邊界**
- `< 60s` → `Xs`
- `< 3600s` → `Xm Ys`
- `≥ 3600s` → `Xh Ym`（不顯示秒）

## Risks / Trade-offs

- [Atmosphere will-change 記憶體] → 三顆球共三個合成層，現代裝置無問題；若低端裝置需考慮 `prefers-reduced-motion` 停用動畫
- [Toast 多個並存] → 目前設計只有一個 429 toast，無佇列需求；若未來多種 toast 需重構
