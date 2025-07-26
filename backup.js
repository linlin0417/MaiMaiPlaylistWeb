#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 資料備份腳本
 * 備份使用者的播放清單和歌曲資料
 */

const dataDir = path.join(__dirname, 'data');
const backupDir = path.join(__dirname, 'backup');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

console.log('🔄 maimai 資料備份工具');
console.log('========================');

// 建立備份目錄
if (!fs.existsSync(backupDir)) {
    console.log('✅ 建立備份目錄...');
    fs.mkdirSync(backupDir, { recursive: true });
}

// 備份播放清單檔案
const playlistsFile = path.join(dataDir, 'playlists.json');
if (fs.existsSync(playlistsFile)) {
    const backupPlaylistsFile = path.join(backupDir, `playlists_${timestamp}.json`);
    fs.copyFileSync(playlistsFile, backupPlaylistsFile);
    console.log(`✅ 已備份播放清單: ${backupPlaylistsFile}`);
} else {
    console.log('⚠️  找不到播放清單檔案');
}

// 備份歌曲檔案
const songsFile = path.join(dataDir, 'songs.json');
if (fs.existsSync(songsFile)) {
    const backupSongsFile = path.join(backupDir, `songs_${timestamp}.json`);
    fs.copyFileSync(songsFile, backupSongsFile);
    console.log(`✅ 已備份歌曲資料: ${backupSongsFile}`);
} else {
    console.log('⚠️  找不到歌曲檔案');
}

console.log('========================');
console.log('🎉 備份完成！');
console.log('');
console.log('備份檔案位置: ./backup/');
console.log('如需還原，請手動將檔案複製回 ./data/ 目錄並重新命名');
