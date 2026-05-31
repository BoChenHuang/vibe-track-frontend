## ADDED Requirements

### Requirement: Atmosphere background renders neon glow orbs
系統 SHALL 渲染三顆固定位置的 blur 光暈球（radial-gradient），各自以 22–30s CSS keyframe 持續漂移，並疊加 feTurbulence 顆粒紋理層（opacity ≤ 0.04）。

#### Scenario: Atmosphere covers full viewport
- **WHEN** Atmosphere 元件掛載
- **THEN** 元件以 `position: fixed`、`inset: 0`、`z-index: 0` 覆蓋全螢幕，不影響頁面捲動

#### Scenario: Reduced motion disables animation
- **WHEN** 系統 `prefers-reduced-motion: reduce`
- **THEN** 光暈球停止漂移動畫，保持靜止

### Requirement: Topbar is sticky with brand, nav, and usage pill
系統 SHALL 渲染一條 sticky topbar，左側為 VibeTrack 品牌文字（Space Grotesk），中央為 Analyze / Dashboard pill 切換 nav，右側為 UsagePill。

#### Scenario: Active nav item highlighted
- **WHEN** 目前路由為 `/`（Analyze）
- **THEN** Analyze nav 項目顯示較亮背景；Dashboard 項目為一般態

#### Scenario: Nav click changes route
- **WHEN** 使用者點擊 Dashboard nav 項目
- **THEN** 路由切換至 `/#/dashboard`

### Requirement: UsagePill displays rate limit status
系統 SHALL 顯示 `remaining/limit RATE / HR`，當 `remaining === 0` 時點狀指示燈變紅，否則為綠。

#### Scenario: Normal usage shown
- **WHEN** `remaining = 3`、`limit = 5`
- **THEN** pill 顯示 `3/5 RATE / HR`，綠色指示燈

#### Scenario: Exhausted usage shown in red
- **WHEN** `remaining = 0`、`limit = 5`
- **THEN** pill 顯示 `0/5 RATE / HR`，紅色指示燈

### Requirement: RateLimitToast shows countdown on 429
系統 SHALL 在 `AppState.error.type === '429'` 時從螢幕底部滑入一條 toast，顯示倒數計時（`formatCountdown` 格式），倒數歸零後自動消失並 dispatch `dismissError`。

#### Scenario: Toast appears with countdown
- **WHEN** `state.error = { type: '429', retryIn: 119 }`
- **THEN** toast 顯示「請稍後再試 — 1m 59s」

#### Scenario: Toast auto-dismisses at zero
- **WHEN** 倒數到 0
- **THEN** toast 淡出，`dismissError` action 被 dispatch
