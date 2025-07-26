# maimai 歌曲紀錄系統

一個簡易但功能完整的 Node.js 網頁應用程式，用於紀錄 maimai 音樂遊戲的歌曲遊玩記錄。  
注意:此專案初步編寫完後已透過github copilot進行專案說明(README)填寫&註解編寫&程式審查
可能會產生預期外的資訊以及在使用該技術前的錯誤
若有問題請向開發者回報以修正內容

# maimai 待遊玩清單系統

一個專為 maimai 音樂遊戲設計的待遊玩歌曲管理系統，幫助您在遊戲前預先規劃要遊玩的歌曲，避免到現場忘記想玩的歌曲。

## 功能特色

### 🎵 核心功能
- **多播放清單管理**: 建立和管理多個不同主題的歌曲清單
- **批量歌曲輸入**: 支援一次輸入多首歌曲，格式簡潔易用
- **待遊玩標記**: 可勾選已遊玩的歌曲，清晰追蹤進度
- **分頁系統**: 大量歌曲時自動分頁，避免畫面混亂
- **難度分類**: 支援 Basic、Advanced、Expert、Master、Re:Master 五種難度

### 🔒 安全機制
- **授權碼保護**: 所有修改操作都需要輸入授權碼
- **資料驗證**: 完整的前後端資料驗證機制
- **錯誤處理**: 友善的錯誤訊息和異常處理

### 📊 統計分析
- **清單統計**: 顯示各清單的總歌曲數和完成進度
- **總體統計**: 所有清單的歌曲總數、已遊玩數、待遊玩數
- **進度追蹤**: 視覺化進度條顯示各清單完成度

### 🔍 搜尋篩選
- **狀態篩選**: 依據已遊玩/待遊玩狀態篩選
- **難度篩選**: 依據難度快速篩選歌曲
- **關鍵字搜尋**: 支援歌曲名稱和備註內容搜尋

### 🎨 使用者體驗
- **三層式導航**: 清單管理 → 歌曲檢視 → 批量新增
- **響應式設計**: 完美適配桌面和行動裝置
- **現代化介面**: 美觀的卡片式設計和流暢動畫
- **直覺操作**: 簡潔明瞭的操作流程

## 使用流程

### 1. 建立播放清單
1. 在首頁輸入清單名稱（例如：「新歌練習」、「挑戰高難度」）
2. 輸入授權碼
3. 點擊「建立清單」

### 2. 批量新增歌曲
1. 點擊清單卡片上的「➕ 新增歌曲」
2. 在文字區域中輸入歌曲，每行一首
3. 格式：`歌曲名稱|難度|備註（選填）`
4. 輸入授權碼並點擊「批量新增歌曲」

**批量輸入範例：**
```
Connect|Master|練習手速
Brain Power|Expert
夜に駆ける|Advanced|新歌
FREEDOM DiVE|Master|挑戰FC
```

### 3. 管理歌曲進度
1. 點擊清單卡片上的「📋 查看清單」
2. 使用勾選框標記已遊玩的歌曲
3. 利用篩選功能查看特定狀態或難度的歌曲
4. 使用分頁瀏覽大量歌曲

## 技術架構

### 後端技術
- **Node.js**: 伺服器運行環境
- **Express.js**: Web 應用程式框架
- **RESTful API**: 標準化 API 設計
- **JSON 檔案**: 輕量級資料儲存

### 前端技術
- **原生 HTML/CSS/JavaScript**: 無框架依賴
- **CSS Grid & Flexbox**: 現代化佈局技術
- **ES6+ 語法**: 現代 JavaScript 特性
- **響應式設計**: 支援各種螢幕尺寸

### 資料結構
```json
{
  "playlists": [
    {
      "id": "時間戳記",
      "name": "清單名稱",
      "songs": [
        {
          "id": "唯一識別碼",
          "name": "歌曲名稱",
          "difficulty": "難度",
          "notes": "備註",
          "played": false,
          "addedAt": "新增時間",
          "playedAt": null
        }
      ],
      "createdAt": "建立時間",
      "lastUpdated": "最後更新時間"
    }
  ],
  "statistics": {
    "totalSongs": "總歌曲數",
    "totalPlayed": "已遊玩數",
    "lastUpdated": "最後更新時間"
  }
}
```

## 技術架構

### 後端技術
- **Node.js**: 伺服器運行環境
- **Express.js**: Web 應用程式框架
- **JSON 檔案**: 輕量級資料儲存
- **RESTful API**: 標準化 API 設計

### 前端技術
- **原生 HTML/CSS/JavaScript**: 無框架依賴
- **CSS Grid & Flexbox**: 現代化佈局技術
- **ES6+ 語法**: 現代 JavaScript 特性
- **響應式設計**: 支援各種螢幕尺寸

### 資料結構
```json
{
  "songs": [
    {
      "id": "時間戳記",
      "name": "歌曲名稱",
      "difficulty": "難度",
      "score": "分數",
      "notes": "備註",
      "playedAt": "遊玩時間",
      "playCount": "遊玩次數"
    }
  ],
  "statistics": {
    "totalPlayed": "總遊玩次數",
    "lastUpdated": "最後更新時間"
  }
}
```

## 安裝與使用

### 系統需求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安裝步驟

1. **克隆或下載專案**
```bash
git clone <repository-url>
cd maiamaimapsystem
```

2. **安裝依賴套件**
```bash
npm install
```

3. **啟動應用程式**（會自動初始化）
```bash
# 一般啟動（自動初始化系統）
npm start

# 開發模式（自動重啟）
npm run dev
```

4. **開啟瀏覽器**
```
http://localhost:3000
```

> **注意**：首次啟動時，系統會自動建立必要的資料目錄和檔案，無需額外設定。

### 預設設定
- **伺服器埠號**: 3000 (可透過環境變數 PORT 修改)
- **授權碼**: 優先使用環境變數 `AUTH_CODE`，若無則使用預設值 `maimai2024`
- **資料儲存**: `data/playlists.json`

### 🔐 環境變數設定範例
```bash
# Linux/Mac
export AUTH_CODE="your_secure_password"
npm start

# 或一次性執行
AUTH_CODE="your_secure_password" npm start

# Windows PowerShell
$env:AUTH_CODE="your_secure_password"
npm start

# Windows CMD
set AUTH_CODE=your_secure_password
npm start
```

## 資料管理

### 📁 檔案結構
```
maiamaimapsystem/
├── data/                    # 使用者資料目錄（不提交到 Git）
│   ├── playlists.json      # 播放清單資料
│   ├── songs.json          # 舊版歌曲資料（向後相容）
│   ├── playlists.example.json  # 範例資料結構
│   └── songs.example.json      # 舊版範例資料
├── backup/                 # 自動備份目錄
├── .gitignore             # Git 忽略檔案設定
└── setup.js               # 初始化腳本
```

### 🛠️ 資料管理指令

**自動初始化**：
```bash
# 啟動應用程式時會自動初始化
npm start
```

**手動備份資料**：
```bash
# 系統會自動建立每日備份，也可手動執行
npm run backup
```

**還原資料**：
```bash
# 手動將備份檔案複製回 data/ 目錄並重新命名
cp backup/playlists_YYYY-MM-DD.json data/playlists.json
```

### 🔄 自動化功能

1. **自動系統檢查**：每次啟動時自動檢查系統完整性
2. **自動初始化**：首次執行時自動建立所有必要檔案
3. **自動備份**：每日自動建立資料備份
4. **自動修復**：偵測到資料損壞時自動修復

### 🔒 資料安全

1. **Git 忽略設定**：使用者資料檔案已設定為不提交到版本控制
2. **自動備份**：系統啟動時自動建立每日備份
3. **錯誤恢復**：應用程式會自動處理缺失或損壞的資料檔案
4. **資料驗證**：載入時會驗證資料結構的完整性
5. **自動修復**：偵測到問題時會自動重建資料結構

## 擴充性設計

### 🔧 模組化架構
```
maiamaimapsystem/
├── app.js              # 主要伺服器檔案
├── package.json        # 專案設定檔
├── data/              # 資料存儲目錄
│   └── songs.json     # 歌曲資料檔案
└── public/            # 靜態檔案
    ├── index.html     # 主要頁面
    ├── styles.css     # 樣式檔案
    └── script.js      # 前端邏輯
```

### 🚀 擴充建議

#### 後端擴充
- **資料庫整合**: 可輕易替換為 MongoDB、MySQL 等資料庫
- **使用者系統**: 支援多使用者和權限管理
- **API 擴充**: 添加更多 RESTful API 端點
- **檔案上傳**: 支援歌曲封面或音檔上傳

#### 前端擴充
- **圖表視覺化**: 整合 Chart.js 或 D3.js 顯示統計圖表
- **主題系統**: 支援多種視覺主題切換
- **離線支援**: 實作 Service Worker 支援離線使用
- **PWA 功能**: 轉換為漸進式網頁應用程式

#### 功能擴充
- **匯入匯出**: 支援 CSV、JSON 格式的資料匯入匯出
- **分享功能**: 產生可分享的統計報告
- **目標設定**: 設定遊玩目標和進度追蹤
- **排行榜**: 顯示個人最高分排行榜

## API 文件

### 獲取歌曲清單
```http
GET /api/songs
```

### 新增/更新歌曲
```http
POST /api/songs
Content-Type: application/json

{
  "songName": "歌曲名稱",
  "difficulty": "難度",
  "score": 分數,
  "notes": "備註",
  "authCode": "授權碼"
}
```

### 刪除歌曲
```http
DELETE /api/songs/:id
Content-Type: application/json

{
  "authCode": "授權碼"
}
```

### 獲取統計資料
```http
GET /api/statistics
```

## 設定客製化

### 修改授權碼
推薦使用環境變數設定（更安全）：
```bash
# 設定環境變數後啟動
AUTH_CODE=your_secure_password npm start

# Windows PowerShell
$env:AUTH_CODE="your_secure_password"; npm start

# Windows CMD
set AUTH_CODE=your_secure_password && npm start
```

或在 `app.js` 中修改預設值：
```javascript
const CONFIG = {
    AUTH_CODE: process.env.AUTH_CODE || 'your_new_default_password',
    // ...其他設定
};
```

### 修改埠號
```bash
# 透過環境變數
PORT=8080 npm start

# 或修改 app.js 中的預設值
const PORT = process.env.PORT || 8080;
```

### 自訂難度選項
在 `public/index.html` 和相關檔案中修改難度選項清單。

## 授權與貢獻

此專案採用 GPL 授權條款。

---

**享受紀錄您的 maimai 遊玩歷程！** 🎵🎮
