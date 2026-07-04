# VibeTrack Frontend

VibeTrack 的前端 Demo 介面，求職 portfolio 專案。

使用者可以輸入文字心情描述或上傳圖片，系統呼叫後端 API 分析情緒後，返回對應的推薦歌單。歌單支援 30 秒試聽預覽，並提供 Spotify 連結跳轉至完整播放。

---

## 功能特色

- 文字輸入與圖片上傳雙模式
- 情緒分析驅動的個性化歌單推薦
- 內嵌 30 秒音樂試聽播放器
- 一鍵跳轉 Spotify 完整曲目
- 響應式設計，支援桌機與行動裝置

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 建置工具 | Vite |
| 樣式 | Tailwind CSS |
| 路由 | React Router v7 |
| 部署 | Vercel（SPA 模式） |

---

## 本地開發

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
```

開啟 `.env`，填入對應的值（見下方環境變數說明）。

### 3. 啟動開發伺服器

```bash
npm run dev
```

---

## 環境變數說明

| 變數名稱 | 說明 | 範例 |
|----------|------|------|
| `VITE_API_BASE_URL` | 後端 API 的基底網址 | `http://localhost:3000` |

---

## 常用指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動本地開發伺服器 |
| `npm run build` | 打包生產版本 |
| `npm run preview` | 預覽打包結果 |
| `npm run lint` | 執行 ESLint 檢查 |

---

## AI 輔助開發

本專案全程採用 AI 工具協作開發，是刻意選擇的現代工作流：

- **Claude Code** — AI 編程助手，協助程式碼撰寫、debug 與重構
- **ECC（Everything Claude Code）** — 擴充 Claude Code 的 agent 生態系，提供專業化子代理（如 code-reviewer、architect、security-reviewer）
- **OpenSpec** — 規格驅動的開發流程工具，管理需求規劃、設計文件與任務追蹤

---

## 後端專案

本專案依賴 VibeTrack 後端提供 API，詳見後端 README：
👉 https://github.com/BoChenHuang/vibe-track
