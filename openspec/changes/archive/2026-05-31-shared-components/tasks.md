## 1. 工具函式

- [x] 1.1 建立 `src/lib/utils.ts`，實作 `formatCountdown`（< 60s → `Xs`；< 3600s → `Xm Ys`；≥ 3600s → `Xh Ym`）
- [x] 1.2 在同檔實作 `formatRelativeTime`（Unix ms → 中文相對時間，精確至分/時/天）
- [x] 1.3 在同檔實作 `formatFileSize`（bytes → `x.x KB` / `x.x MB`）

## 2. Icon 系統

- [x] 2.1 建立 `src/lib/icons.tsx`，實作 `SpotifyIcon`（接受 `size`、`className` props）
- [x] 2.2 加入 `ExternalLinkIcon`、`PlayIcon`、`PauseIcon`
- [x] 2.3 加入 `WaveIcon`（波形動畫用，三條垂直線）、`SparkleIcon`（✦ 裝飾）、`CloseIcon`（✕）

## 3. Atmosphere 背景

- [x] 3.1 建立 `src/components/layout/Atmosphere.module.css`，定義三顆光暈球的 keyframe 動畫（drift1 / drift2 / drift3，各 22–30s）、`@media (prefers-reduced-motion: reduce)` 停用
- [x] 3.2 建立 `src/components/layout/Atmosphere.tsx`，渲染三顆 `div`（各有 radial-gradient）加上顆粒紋理 `div`（內聯 SVG feTurbulence，opacity 0.03）

## 4. Topbar

- [x] 4.1 建立 `src/components/layout/Topbar.module.css`（sticky、背景 `var(--bg-0)` + border-bottom `var(--line)`、flex 左中右三區）
- [x] 4.2 建立 `src/components/layout/Topbar.tsx`：左側品牌（Space Grotesk）、中央用 `NavLink` 的 pill nav（active 時 `var(--surface-2)` 背景）、右側掛入 `UsagePill`

## 5. UsagePill

- [x] 5.1 建立 `src/components/ui/UsagePill.module.css`（pill 外形，點狀指示燈 `green`/`red` CSS 變數）
- [x] 5.2 建立 `src/components/ui/UsagePill.tsx`：讀 AppContext `state.usage`、`state.maxUsage`，計算 remaining，`remaining === 0` 時紅點，否則綠點

## 6. RateLimitToast

- [x] 6.1 建立 `src/components/ui/RateLimitToast.module.css`（fixed bottom-right，0.3s slide-in，`var(--bg-2)` 背景，`var(--line-strong)` 邊框）
- [x] 6.2 建立 `src/components/ui/RateLimitToast.tsx`：讀 `state.error`，`type === '429'` 時顯示；用 `setInterval` 跑倒數，歸零時 dispatch `dismissError`；顯示 `formatCountdown(remaining)` 格式

## 7. 整合 App Shell

- [x] 7.1 在 `src/App.tsx` 的 Router 內加入 `<Atmosphere />` 與 `<Topbar />`
- [x] 7.2 在 `src/App.tsx` 加入 `<RateLimitToast />`（置於 Router 外層或同層）
- [x] 7.3 啟動 dev server，確認背景光暈、Topbar、pill 在 `/#/` 與 `/#/dashboard` 均正常顯示
