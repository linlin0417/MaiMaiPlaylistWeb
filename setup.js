#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 專案初始化腳本
 * 用於設定新環境或重置資料檔案
 */

const dataDir = path.join(__dirname, 'data');
const playlistsFile = path.join(dataDir, 'playlists.json');
const songsFile = path.join(dataDir, 'songs.json');

console.log('🎵 maimai 待遊玩清單系統 - 初始化腳本');
console.log('=====================================');

// 建立資料目錄
if (!fs.existsSync(dataDir)) {
    console.log('✅ 建立 data 目錄...');
    fs.mkdirSync(dataDir, { recursive: true });
} else {
    console.log('✅ data 目錄已存在');
}

// 建立播放清單檔案
if (!fs.existsSync(playlistsFile)) {
    console.log('✅ 建立 playlists.json...');
    const playlistsData = {
        playlists: [],
        statistics: {
            totalSongs: 0,
            totalPlayed: 0,
            lastUpdated: new Date().toISOString()
        }
    };
    fs.writeFileSync(playlistsFile, JSON.stringify(playlistsData, null, 2), 'utf8');
} else {
    console.log('✅ playlists.json 已存在');
}

// 建立舊版歌曲檔案（向後相容）
if (!fs.existsSync(songsFile)) {
    console.log('✅ 建立 songs.json（向後相容）...');
    const songsData = {
        songs: [],
        statistics: {
            totalPlayed: 0,
            lastUpdated: new Date().toISOString()
        }
    };
    fs.writeFileSync(songsFile, JSON.stringify(songsData, null, 2), 'utf8');
} else {
    console.log('✅ songs.json 已存在');
}

// 檢查 .gitignore
const gitignoreFile = path.join(__dirname, '.gitignore');
if (!fs.existsSync(gitignoreFile)) {
    console.log('⚠️  建議建立 .gitignore 檔案來忽略使用者資料');
} else {
    console.log('✅ .gitignore 檔案已存在');
}

console.log('=====================================');
console.log('🎉 初始化完成！');
console.log('');
console.log('下一步：');
console.log('1. 執行 npm start 啟動應用程式');
console.log('2. 開啟瀏覽器造訪 http://localhost:3000');
console.log('3. 使用預設授權碼: maimai2024 (或透過環境變數 AUTH_CODE 設定)');
console.log('');
console.log('注意事項：');
console.log('- data/ 目錄中的檔案包含使用者資料，已設定為不提交到 Git');
console.log('- 如需備份資料，請手動複製 data/ 目錄');
console.log('- 建議使用環境變數 AUTH_CODE 設定授權碼（更安全）');
