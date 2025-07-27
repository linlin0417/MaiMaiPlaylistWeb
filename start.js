#!/usr/bin/env node

/**
 * maimai 播放清單系統啟動腳本
 * 用於生產環境部署
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🎵 maimai 播放清單系統 - 生產環境啟動');
console.log('=====================================');

// 檢查環境
const nodeVersion = process.version;
console.log('Node.js 版本:', nodeVersion);

// 設定環境變數（如果尚未設定）
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    console.log('✅ 設定 NODE_ENV=production');
}

// 檢查授權碼
if (!process.env.AUTH_CODE) {
    console.log('⚠️  未設定 AUTH_CODE 環境變數，將使用預設值');
    console.log('   建議在 DirectAdmin 中設定 AUTH_CODE 環境變數');
}

// 啟動應用程式
console.log('🚀 啟動 maimai 系統...');
console.log('=====================================');

// 使用當前目錄的 app.js
const appPath = path.join(__dirname, 'app.js');
const child = spawn('node', [appPath], {
    stdio: 'inherit',
    env: process.env
});

child.on('error', (error) => {
    console.error('❌ 啟動失敗:', error.message);
    process.exit(1);
});

child.on('exit', (code) => {
    if (code !== 0) {
        console.error(`❌ 程序異常退出，代碼: ${code}`);
        process.exit(code);
    }
});

// 處理程序終止信號
process.on('SIGTERM', () => {
    console.log('📴 接收到終止信號，正在關閉...');
    child.kill('SIGTERM');
});

process.on('SIGINT', () => {
    console.log('📴 接收到中斷信號，正在關閉...');
    child.kill('SIGINT');
});
