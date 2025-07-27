# 生產環境部署說明

## DirectAdmin 部署步驟

### 1. 環境變數設定
在 DirectAdmin 的 Node.js 設定中，確認以下環境變數：
- `AUTH_CODE`: maimai （或您想要的授權碼）
- `NODE_ENV`: production
- `PORT`: 3000 （或 DirectAdmin 指定的埠號）

### 2. 檔案上傳
確保上傳以下檔案到伺服器：
- app.js
- package.json
- public/ 目錄及其所有內容
- data/ 目錄（可選，系統會自動建立）

### 3. 依賴安裝
在 DirectAdmin 中執行 npm install 或讓系統自動安裝依賴

### 4. 應用程式根目錄設定
- Application root: domains/note.yukimurasaya.top/web/maimai
- Application URL: maimai.note.yukimurasaya.top
- Application startup file: app.js

### 5. 權限檢查
確保應用程式有權限在其目錄下建立以下資料夾：
- data/
- backup/

## 常見問題排除

### 問題 1: 授權碼錯誤
- 確認 DirectAdmin 中的 AUTH_CODE 環境變數設定正確
- 如果未設定環境變數，系統會使用預設值 'maimai2024'

### 問題 2: 無法建立檔案
- 檢查檔案權限，確保 Node.js 程序可以寫入檔案
- 手動建立 data/ 和 backup/ 目錄

### 問題 3: 埠號衝突
- 確認 PORT 環境變數設定正確
- 或讓系統自動分配埠號

### 問題 4: 依賴項缺失
- 執行 `npm install --production`
- 確認 Node.js 版本 >= 14.0.0

## 測試部署
部署完成後，可以透過以下方式測試：
1. 訪問應用程式 URL
2. 檢查是否能正常載入首頁
3. 嘗試建立播放清單（使用設定的授權碼）
