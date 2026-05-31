## 1. Reducer Actions

- [ ] 1.1 在 `src/store/reducer.ts` 加入 `replayHistory(entry: HistoryEntry)` action：設 `page: 'analyze'`、`result: { mood: entry.mood, tracks: entry.tracks }`

## 2. RateRing 元件

- [ ] 2.1 建立 `src/components/dashboard/RateRing.tsx`：接受 `value: number`（0–1）、`size?: number` props；計算 SVG arc 的 `strokeDashoffset = circumference * (1 - value)`；`transition: stroke-dashoffset 0.5s ease`
- [ ] 2.2 依閾值切換 stroke 顏色（≥0.99 → `var(--neon-danger)`；≥0.6 → `var(--neon-warn)`；else → `var(--neon-c)`）並套用對應 glow filter

## 3. Statistics Cards

- [ ] 3.1 建立 `src/components/dashboard/StatsCard.tsx`（通用卡片 shell，接受 `label`、`children` props）
- [ ] 3.2 在 `src/pages/DashboardPage.tsx` 組合 4 張統計卡：Total（history.length）、Today（today midnight 後計數）、Rate limit（RateRing + `remaining/limit`）、Last vibe（history[0]?.mood.label）

## 4. History List

- [ ] 4.1 建立 `src/components/dashboard/HistoryItem.tsx`（type badge、相對時間、market、輸入摘要 2 行省略、mood chip、歌曲數；active prop 控制漸層 border）
- [ ] 4.2 建立 `src/components/dashboard/HistoryList.tsx`（映射 history array 渲染 HistoryItem；無資料顯示空狀態）
- [ ] 4.3 在 DashboardPage 加入 `selectedId` local state，預設 `history[0]?.id`；點擊 HistoryItem 更新 selectedId

## 5. History Preview

- [ ] 5.1 建立 `src/components/dashboard/SongMini.tsx`（40×40 封面 + 歌名單行省略 + 藝人；null 封面顯示漸層色塊）
- [ ] 5.2 建立 `src/components/dashboard/HistoryPreview.tsx`（meta 列 + 輸入區塊 + MoodPanel + mini songs grid 2 欄；Replay 按鈕 dispatch `replayHistory`，`useNavigate` 跳回 `/`）
- [ ] 5.3 在 DashboardPage 依 selectedId 找到對應 entry，傳入 HistoryPreview

## 6. Dashboard Page 組合

- [ ] 6.1 建立 `src/pages/DashboardPage.module.css`（page-header、stats grid `repeat(4, 1fr)`、dashboard grid `340px 1fr`；≤900px → stats 2 欄、dashboard 單欄）
- [ ] 6.2 組合所有元件至 `src/pages/DashboardPage.tsx`
- [ ] 6.3 左側 HistoryList 設 `position: sticky; top: topbarH; max-height: calc(100vh - topbarH - padding); overflow-y: auto`

## 7. 驗收

- [ ] 7.1 啟動 dev server，確認統計卡顯示正確數值
- [ ] 7.2 送出分析後切換至 Dashboard，確認最新一筆出現在清單
- [ ] 7.3 點擊清單項，確認右側 preview 顯示正確 mood + 歌曲
- [ ] 7.4 點擊 Replay，確認跳回 Analyze 頁並立即顯示該筆結果
- [ ] 7.5 縮小視窗至 900px，確認 split view 變單欄
- [ ] 7.6 RateRing 在 remaining = 0 時顯示紅色，> 0 顯示青色
