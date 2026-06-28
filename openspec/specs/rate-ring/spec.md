## ADDED Requirements

### Requirement: RateRing is an SVG arc progress indicator with color thresholds
`RateRing` 元件 SHALL 接受 `value: number`（0–1，已使用比例 = `(limit - remaining) / limit`）與 `size?: number`（預設 72）props，渲染 SVG 圓環；顏色依 value 閾值：`value ≥ 0.99` → `var(--neon-danger)`；`value ≥ 0.6` → `var(--neon-warn)`；其餘 → `var(--neon-c)`；arc 有 glow filter（對應顏色的 box-shadow）。

#### Scenario: Low usage renders cyan arc
- **WHEN** `value = 0.4`（已使用 40%）
- **THEN** arc 顯示青色（`var(--neon-c)`），glow 為青色

#### Scenario: High usage renders yellow arc
- **WHEN** `value = 0.7`（已使用 70%）
- **THEN** arc 顯示黃色（`var(--neon-warn)`）

#### Scenario: Exhausted renders red arc
- **WHEN** `value = 1.0`（已使用 100%）
- **THEN** arc 顯示紅色（`var(--neon-danger)`），glow 為紅色

#### Scenario: Arc length proportional to value
- **WHEN** `value = 0.5`
- **THEN** SVG arc 填充圓環的 50%（strokeDashoffset 計算）

#### Scenario: Arc transitions smoothly on value change
- **WHEN** value 從 0.3 更新至 0.8
- **THEN** arc 以 0.4–0.6s ease 動畫過渡
