## ADDED Requirements

### Requirement: Audio preview plays preview_url on play button click
系統 SHALL 管理一個 `<audio>` 元素，同一時間最多播放一首；點擊播放鈕 → 播放該首；再次點擊或點擊另一首 → 停止/切換。

#### Scenario: Click play starts audio
- **WHEN** 使用者點擊 preview_url 非 null 的歌曲卡播放鈕
- **THEN** 該首開始播放，播放鈕換為 PauseIcon，波形動畫啟動（萊姆綠）

#### Scenario: Click another card stops previous
- **WHEN** 歌曲 A 正在播放，使用者點擊歌曲 B 的播放鈕
- **THEN** 歌曲 A 停止（播放鈕恢復 PlayIcon），歌曲 B 開始播放

#### Scenario: Click pause stops audio
- **WHEN** 使用者點擊正在播放卡片的 PauseIcon
- **THEN** 音樂暫停，圖示恢復 PlayIcon

#### Scenario: Preview ends naturally
- **WHEN** audio 播放完畢（`onended` 事件）
- **THEN** `playingId` 清除，播放鈕恢復 PlayIcon
