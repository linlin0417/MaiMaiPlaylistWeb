#!/usr/bin/env node

/**
 * maimai 系統環境檢查工具
 * 用於診斷部署問題
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 maimai 系統環境檢查');
console.log('=====================================');

// 1. 檢查 Node.js 版本
console.log('📋 系統資訊:');
console.log('- Node.js 版本:', process.version);
console.log('- 平台:', process.platform);
console.log('- 架構:', process.arch);
console.log('- 工作目錄:', process.cwd());
console.log('');

// 2. 檢查環境變數
console.log('🔑 環境變數:');
console.log('- NODE_ENV:', process.env.NODE_ENV || '(未設定)');
console.log('- PORT:', process.env.PORT || '(未設定，將使用預設值 3000)');
console.log('- AUTH_CODE:', process.env.AUTH_CODE ? '已設定' : '(未設定，將使用預設值)');
console.log('');

// 3. 檢查檔案結構
console.log('📁 檔案結構檢查:');
const requiredFiles = [
    'app.js',
    'package.json',
    'public/index.html',
    'public/script.js',
    'public/styles.css'
];

const optionalDirs = [
    'data',
    'backup'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    const exists = fs.existsSync(filePath);
    console.log(`- ${file}: ${exists ? '✅' : '❌'}`);
    if (!exists) allFilesExist = false;
});

console.log('');
console.log('📂 目錄檢查:');
optionalDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    const exists = fs.existsSync(dirPath);
    console.log(`- ${dir}/: ${exists ? '✅' : '⚠️  (將自動建立)'}`);
});

// 4. 檢查 package.json
console.log('');
console.log('📦 依賴項檢查:');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    console.log('- package.json: ✅ 有效');
    console.log('- 主要檔案:', packageJson.main);
    
    const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
    console.log('- node_modules: ' + (nodeModulesExists ? '✅' : '❌ (需要執行 npm install)'));
    
    if (nodeModulesExists) {
        const dependencies = packageJson.dependencies || {};
        console.log('- 依賴項檢查:');
        Object.keys(dependencies).forEach(dep => {
            const depPath = path.join(__dirname, 'node_modules', dep);
            const exists = fs.existsSync(depPath);
            console.log(`  - ${dep}: ${exists ? '✅' : '❌'}`);
        });
    }
} catch (error) {
    console.log('- package.json: ❌ 無效或損壞');
    allFilesExist = false;
}

// 5. 權限檢查
console.log('');
console.log('🔐 權限檢查:');
try {
    // 測試讀取權限
    fs.accessSync(__dirname, fs.constants.R_OK);
    console.log('- 讀取權限: ✅');
    
    // 測試寫入權限
    fs.accessSync(__dirname, fs.constants.W_OK);
    console.log('- 寫入權限: ✅');
    
    // 測試建立檔案
    const testFile = path.join(__dirname, '.test-write');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log('- 檔案建立權限: ✅');
    
} catch (error) {
    console.log('- 權限檢查: ❌', error.message);
    allFilesExist = false;
}

// 6. 總結
console.log('');
console.log('=====================================');
if (allFilesExist) {
    console.log('🎉 環境檢查通過！系統應該能正常啟動');
    console.log('');
    console.log('建議的啟動方式:');
    console.log('1. 執行 npm install (如果尚未安裝依賴)');
    console.log('2. 設定環境變數 AUTH_CODE');
    console.log('3. 執行 npm start 或 node app.js');
} else {
    console.log('❌ 環境檢查發現問題，請修正後再試');
    console.log('');
    console.log('常見解決方案:');
    console.log('1. 確保所有檔案都已上傳到伺服器');
    console.log('2. 執行 npm install 安裝依賴');
    console.log('3. 檢查檔案權限設定');
    console.log('4. 確認 Node.js 版本 >= 14.0.0');
}
console.log('=====================================');
