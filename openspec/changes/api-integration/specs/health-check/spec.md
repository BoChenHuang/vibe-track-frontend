## ADDED Requirements

### Requirement: App shows booting screen until health check passes
App 初始化時 SHALL 先呼叫 `GET /health`（timeout 5s），成功後顯示主介面；失敗時重試最多 3 次（間隔 5s），重試期間顯示「服務啟動中，請稍候」overlay；3 次全失敗後顯示錯誤提示（仍允許進入主介面）。

#### Scenario: Health check passes immediately
- **WHEN** `/health` 第一次呼叫即成功
- **THEN** 跳過 booting overlay，直接顯示主介面

#### Scenario: Health check retries and succeeds
- **WHEN** `/health` 第一次失敗，第二次（5s 後）成功
- **THEN** 顯示 booting overlay 至第二次成功，然後進入主介面

#### Scenario: All retries fail
- **WHEN** 三次 health check 均失敗
- **THEN** 顯示「後端服務無回應，您仍可嘗試使用」警告，進入主介面
