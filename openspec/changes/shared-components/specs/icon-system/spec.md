## ADDED Requirements

### Requirement: Inline SVG icon components
系統 SHALL 在 `src/lib/icons.tsx` 提供以下 React icon 元件，每個接受 `size?: number`（預設 16）與 `className?: string` props：`SpotifyIcon`、`ExternalLinkIcon`、`PlayIcon`、`PauseIcon`、`WaveIcon`、`SparkleIcon`、`CloseIcon`。

#### Scenario: Icon renders correct SVG
- **WHEN** 渲染 `<SpotifyIcon size={20} />`
- **THEN** 輸出 `<svg width="20" height="20">` 包含 Spotify 標誌路徑

#### Scenario: No external icon library imported
- **WHEN** 執行 `pnpm build`
- **THEN** bundle 中不包含 lucide-react、heroicons 等外部 icon 套件
