# maimai 播放清單系統 - DirectAdmin 部署故障排除指南

## 🔧 部署問題診斷步驟

### 1. 環境檢查
首先執行環境檢查腳本：
```bash
node check-env.js
```

### 2. 常見問題及解決方案

#### 問題 A: 授權碼不一致
**症狀**: 無法登入或授權碼錯誤
**原因**: DirectAdmin 中設定的 AUTH_CODE 與應用程式不符
**解決方案**:
1. 檢查 DirectAdmin 環境變數設定
2. 確認 AUTH_CODE 值是否正確
3. 如圖片所示，您設定的是 `maimai`，但預設值是 `maimai2024`

#### 問題 B: 檔案權限錯誤
**症狀**: 無法建立 data/ 或 backup/ 目錄
**原因**: Node.js 程序沒有寫入權限
**解決方案**:
1. 手動建立目錄：
   ```bash
   mkdir data backup
   chmod 755 data backup
   ```
2. 檢查檔案擁有者權限

#### 問題 C: 依賴項缺失
**症狀**: 模組找不到或 require 錯誤
**原因**: npm 依賴項未正確安裝
**解決方案**:
1. 刪除 node_modules：`rm -rf node_modules`
2. 重新安裝：`npm install --production`
3. 確認 Node.js 版本 >= 14.0.0

#### 問題 D: 埠號衝突
**症狀**: 伺服器無法啟動，埠號被佔用
**原因**: 指定的埠號已被使用
**解決方案**:
1. 在 DirectAdmin 中設定不同的 PORT 環境變數
2. 或讓系統自動分配埠號

#### 問題 E: 靜態檔案無法載入
**症狀**: 網頁樣式異常或 JavaScript 錯誤
**原因**: public/ 目錄檔案缺失或路徑錯誤
**解決方案**:
1. 確認上傳了完整的 public/ 目錄
2. 檢查檔案權限：`chmod 644 public/*`

## 🚀 正確部署步驟

### 1. 檔案準備
確保上傳以下檔案到伺服器：
```
app.js
package.json
start.js
check-env.js
public/
├── index.html
├── script.js
└── styles.css
```

### 2. DirectAdmin 設定
在 Node.js 應用程式設定中：
- **Application root**: `domains/note.yukimurasaya.top/web/maimai`
- **Application URL**: `maimai.note.yukimurasaya.top` 
- **Application startup file**: `app.js`
- **Node.js version**: 選擇 14.0.0 或更高版本

### 3. 環境變數設定
在 DirectAdmin 中新增以下環境變數：
```
AUTH_CODE=maimai
NODE_ENV=production
```

### 4. 依賴安裝
在 DirectAdmin 的終端機或透過控制面板執行：
```bash
npm install --production
```

### 5. 啟動測試
```bash
# 環境檢查
npm run check

# 啟動應用程式
npm start
```

## 🔍 除錯指令

### 檢查日誌
```bash
# 檢查應用程式日誌
tail -f logs/nodejs.log

# 檢查系統日誌  
journalctl -u nodejs-app
```

### 測試連線
```bash
# 測試本機連線
curl http://localhost:3000

# 測試網域連線
curl http://maimai.note.yukimurasaya.top
```

### 檢查程序
```bash
# 查看 Node.js 程序
ps aux | grep node

# 檢查埠號使用情況
netstat -tulpn | grep :3000
```

## 📞 尋求協助

如果問題仍然存在，請提供以下資訊：
1. `node check-env.js` 的完整輸出
2. DirectAdmin 中的錯誤訊息
3. 瀏覽器開發者工具的錯誤資訊
4. 系統日誌的相關片段

## 💡 生產環境最佳實務

1. **安全性**:
   - 使用強密碼作為 AUTH_CODE
   - 定期更換授權碼
   - 啟用 HTTPS

2. **效能**:
   - 使用 PM2 或類似工具管理程序
   - 設定日誌輪轉
   - 定期備份資料

3. **監控**:
   - 設定健康檢查
   - 監控磁碟空間使用
   - 定期檢查錯誤日誌
