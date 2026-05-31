## ADDED Requirements

### Requirement: Song card displays album art with cover shade
每張歌曲卡 SHALL 顯示 1:1 正方形封面（`album_image_url`），並疊加頂部/底部兩層黑色漸層遮罩（cover-shade）確保文字可讀；無封面時退回 `var(--grad-primary)` 漸層占位。

#### Scenario: Album image displayed
- **WHEN** track.album_image_url 非 null
- **THEN** 顯示封面圖片，object-fit: cover，上下各有漸層遮罩

#### Scenario: Fallback gradient when no image
- **WHEN** track.album_image_url 為 null
- **THEN** 封面區顯示 `var(--grad-primary)` 漸層，無圖片元素

### Requirement: Rank badge and conditional POP badge
左上 SHALL 顯示 `#01`、`#02`... 格式的 rank 徽章（JetBrains Mono）；右上 SHALL **僅當** `popularity` 為非 null 數字時顯示 `POP nn` 徽章。

#### Scenario: POP badge shown when popularity exists
- **WHEN** track.popularity = 72
- **THEN** 右上顯示 `POP 72`

#### Scenario: POP badge hidden when popularity null
- **WHEN** track.popularity 為 null
- **THEN** 右上不渲染任何 POP 元素

### Requirement: Play button and wave animation are conditional on preview_url
迷你播放鈕（右下）與播放波形（左下）SHALL **僅當** `preview_url` 非 null 時渲染；hover 時浮現；播放中變萊姆綠（`var(--neon-d)`）+ 波形動畫。

#### Scenario: Play controls hidden when no preview
- **WHEN** track.preview_url 為 null
- **THEN** 右下無播放鈕，左下無波形元素

#### Scenario: Play button visible on hover when preview exists
- **WHEN** track.preview_url 非 null，使用者 hover 卡片
- **THEN** 播放鈕浮現（opacity 1），波形出現

### Requirement: Song card content area shows title, artist, reason, and Spotify link
底部內容區 SHALL 顯示歌名（Space Grotesk，單行省略）、藝人名、reason 引言（上方分隔線，min-height 50px）；底列有 Spotify 連結按鈕（萊姆綠 pill，含 SpotifyIcon + ExternalLinkIcon，`target="_blank"`）+ 右側 `30s preview` 或 `no preview` 狀態文字。

#### Scenario: Song title truncated at one line
- **WHEN** 歌名超過卡片寬度
- **THEN** 單行省略（`text-overflow: ellipsis`）

#### Scenario: Spotify link opens in new tab
- **WHEN** 使用者點擊 Spotify 連結按鈕
- **THEN** 在新分頁開啟 track.spotify_url

### Requirement: Placeholder cards shown before first submission
首次渲染（`result === null`）時 SHALL 顯示 8 張半透明 placeholder 卡，無封面圖且所有文字欄位為空骨架。

#### Scenario: Placeholder cards rendered initially
- **WHEN** 頁面載入且 result 為 null
- **THEN** results section 顯示 8 張半透明灰色卡片（`opacity: 0.35`）
