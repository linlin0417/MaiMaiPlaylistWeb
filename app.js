const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 配置設定
const CONFIG = {
    AUTH_CODE: 'maimai2024', // 授權碼，可在此修改
    DATA_FILE: path.join(__dirname, 'data', 'playlists.json'),
    SONGS_FILE: path.join(__dirname, 'data', 'songs.json'),
    STATIC_PATH: path.join(__dirname, 'public'),
    BACKUP_DIR: path.join(__dirname, 'backup')
};

// 中介軟體設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(CONFIG.STATIC_PATH));

// 完整的系統初始化函數
function initializeSystem() {
    console.log('🎵 maimai 待遊玩清單系統 - 系統初始化');
    console.log('=====================================');
    
    const dataDir = path.dirname(CONFIG.DATA_FILE);
    let isFirstRun = false;
    
    // 1. 建立資料目錄
    if (!fs.existsSync(dataDir)) {
        console.log('✅ 建立資料目錄:', dataDir);
        fs.mkdirSync(dataDir, { recursive: true });
        isFirstRun = true;
    }
    
    // 2. 建立備份目錄
    if (!fs.existsSync(CONFIG.BACKUP_DIR)) {
        console.log('✅ 建立備份目錄:', CONFIG.BACKUP_DIR);
        fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
    }
    
    // 3. 初始化播放清單檔案
    if (!fs.existsSync(CONFIG.DATA_FILE)) {
        console.log('✅ 建立播放清單資料檔案:', CONFIG.DATA_FILE);
        const initialPlaylistData = {
            playlists: [],
            statistics: {
                totalSongs: 0,
                totalPlayed: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(initialPlaylistData, null, 2), 'utf8');
        isFirstRun = true;
    }
    
    // 4. 初始化舊版歌曲檔案（向後相容）
    if (!fs.existsSync(CONFIG.SONGS_FILE)) {
        console.log('✅ 建立舊版歌曲資料檔案（向後相容）:', CONFIG.SONGS_FILE);
        const initialSongsData = {
            songs: [],
            statistics: {
                totalPlayed: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        fs.writeFileSync(CONFIG.SONGS_FILE, JSON.stringify(initialSongsData, null, 2), 'utf8');
    }
    
    // 5. 驗證現有資料檔案完整性
    try {
        const playlistData = JSON.parse(fs.readFileSync(CONFIG.DATA_FILE, 'utf8'));
        if (!playlistData.playlists || !playlistData.statistics) {
            console.log('⚠️  播放清單資料結構不完整，正在修復...');
            const repairedData = {
                playlists: playlistData.playlists || [],
                statistics: playlistData.statistics || {
                    totalSongs: 0,
                    totalPlayed: 0,
                    lastUpdated: new Date().toISOString()
                }
            };
            fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(repairedData, null, 2), 'utf8');
        }
    } catch (error) {
        console.error('❌ 播放清單資料檔案損壞，正在重建...');
        const defaultData = {
            playlists: [],
            statistics: {
                totalSongs: 0,
                totalPlayed: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
    }
    
    // 6. 建立範例檔案
    const examplePlaylistFile = path.join(dataDir, 'playlists.example.json');
    const exampleSongsFile = path.join(dataDir, 'songs.example.json');
    
    if (!fs.existsSync(examplePlaylistFile)) {
        const examplePlaylistData = {
            "playlists": [
                {
                    "id": "example_1234567890",
                    "name": "範例清單",
                    "songs": [
                        {
                            "id": "song_1234567890",
                            "name": "Connect",
                            "difficulty": "Master",
                            "notes": "練習手速",
                            "played": false,
                            "addedAt": "2025-01-01T00:00:00.000Z",
                            "playedAt": null
                        }
                    ],
                    "createdAt": "2025-01-01T00:00:00.000Z",
                    "lastUpdated": "2025-01-01T00:00:00.000Z"
                }
            ],
            "statistics": {
                "totalSongs": 1,
                "totalPlayed": 0,
                "lastUpdated": "2025-01-01T00:00:00.000Z"
            }
        };
        fs.writeFileSync(examplePlaylistFile, JSON.stringify(examplePlaylistData, null, 2), 'utf8');
    }
    
    if (!fs.existsSync(exampleSongsFile)) {
        const exampleSongsData = {
            "songs": [
                {
                    "id": "1234567890",
                    "name": "Connect",
                    "difficulty": "Master",
                    "score": 101000,
                    "notes": "練習手速",
                    "playedAt": "2025-01-01T00:00:00.000Z",
                    "playCount": 1
                }
            ],
            "statistics": {
                "totalPlayed": 1,
                "lastUpdated": "2025-01-01T00:00:00.000Z"
            }
        };
        fs.writeFileSync(exampleSongsFile, JSON.stringify(exampleSongsData, null, 2), 'utf8');
    }
    
    // 7. 顯示初始化結果
    if (isFirstRun) {
        console.log('=====================================');
        console.log('🎉 首次執行初始化完成！');
        console.log('');
        console.log('系統資訊：');
        console.log('- 伺服器埠號: ' + PORT);
        console.log('- 預設授權碼: ' + CONFIG.AUTH_CODE);
        console.log('- 資料儲存路徑: ' + CONFIG.DATA_FILE);
        console.log('');
        console.log('注意事項：');
        console.log('- data/ 目錄中的檔案包含使用者資料');
        console.log('- 授權碼可在 app.js 中的 CONFIG.AUTH_CODE 修改');
        console.log('- 建議定期備份 data/ 目錄');
    } else {
        console.log('✅ 系統檢查完成，所有必要檔案已就緒');
    }
    console.log('=====================================');
}

// 自動備份功能
function createBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        
        if (fs.existsSync(CONFIG.DATA_FILE)) {
            const backupFile = path.join(CONFIG.BACKUP_DIR, `playlists_${timestamp}.json`);
            if (!fs.existsSync(backupFile)) {
                fs.copyFileSync(CONFIG.DATA_FILE, backupFile);
                console.log('📦 已建立每日備份:', backupFile);
            }
        }
        
        if (fs.existsSync(CONFIG.SONGS_FILE)) {
            const backupFile = path.join(CONFIG.BACKUP_DIR, `songs_${timestamp}.json`);
            if (!fs.existsSync(backupFile)) {
                fs.copyFileSync(CONFIG.SONGS_FILE, backupFile);
            }
        }
    } catch (error) {
        console.warn('⚠️  備份建立失敗:', error.message);
    }
}

// 讀取播放清單資料
function loadPlaylists() {
    try {
        const data = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
        const parsedData = JSON.parse(data);
        
        // 確保資料結構完整性
        if (!parsedData.playlists) {
            parsedData.playlists = [];
        }
        if (!parsedData.statistics) {
            parsedData.statistics = {
                totalSongs: 0,
                totalPlayed: 0,
                lastUpdated: new Date().toISOString()
            };
        }
        
        return parsedData;
    } catch (error) {
        console.error('❌ 讀取播放清單資料錯誤:', error);
        console.log('🔧 嘗試重新初始化系統...');
        
        // 重新初始化並返回預設資料
        initializeSystem();
        const defaultData = {
            playlists: [],
            statistics: {
                totalSongs: 0,
                totalPlayed: 0,
                lastUpdated: new Date().toISOString()
            }
        };
        
        return defaultData;
    }
}

// 儲存播放清單資料
function savePlaylists(data) {
    try {
        data.statistics.lastUpdated = new Date().toISOString();
        fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('儲存資料錯誤:', error);
        return false;
    }
}

// 驗證授權碼
function verifyAuth(authCode) {
    return authCode === CONFIG.AUTH_CODE;
}

// 路由設定
// 首頁
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 獲取所有播放清單
app.get('/api/playlists', (req, res) => {
    const data = loadPlaylists();
    res.json({
        success: true,
        playlists: data.playlists,
        statistics: data.statistics
    });
});

// 新增播放清單
app.post('/api/playlists', (req, res) => {
    const { name, authCode } = req.body;

    if (!verifyAuth(authCode)) {
        return res.status(401).json({
            success: false,
            message: '授權碼錯誤'
        });
    }

    if (!name || name.trim() === '') {
        return res.status(400).json({
            success: false,
            message: '清單名稱為必填欄位'
        });
    }

    const data = loadPlaylists();
    
    // 檢查是否已存在相同名稱的清單
    const existingPlaylist = data.playlists.find(playlist => playlist.name === name.trim());
    if (existingPlaylist) {
        return res.status(400).json({
            success: false,
            message: '清單名稱已存在'
        });
    }

    const newPlaylist = {
        id: Date.now(),
        name: name.trim(),
        songs: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };

    data.playlists.push(newPlaylist);

    if (savePlaylists(data)) {
        res.json({
            success: true,
            message: '播放清單已建立',
            playlist: newPlaylist
        });
    } else {
        res.status(500).json({
            success: false,
            message: '建立清單失敗'
        });
    }
});

// 刪除播放清單
app.delete('/api/playlists/:id', (req, res) => {
    const { authCode } = req.body;
    const playlistId = parseInt(req.params.id);

    if (!verifyAuth(authCode)) {
        return res.status(401).json({
            success: false,
            message: '授權碼錯誤'
        });
    }

    const data = loadPlaylists();
    const playlistIndex = data.playlists.findIndex(playlist => playlist.id === playlistId);

    if (playlistIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該播放清單'
        });
    }

    data.playlists.splice(playlistIndex, 1);

    if (savePlaylists(data)) {
        res.json({
            success: true,
            message: '播放清單已刪除'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '刪除失敗'
        });
    }
});

// 獲取特定播放清單的歌曲
app.get('/api/playlists/:id/songs', (req, res) => {
    const playlistId = parseInt(req.params.id);
    const { page = 1, limit = 10 } = req.query;
    
    const data = loadPlaylists();
    const playlist = data.playlists.find(p => p.id === playlistId);
    
    if (!playlist) {
        return res.status(404).json({
            success: false,
            message: '找不到該播放清單'
        });
    }

    // 分頁處理
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedSongs = playlist.songs.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        songs: paginatedSongs,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(playlist.songs.length / limit),
            totalSongs: playlist.songs.length,
            hasNext: endIndex < playlist.songs.length,
            hasPrev: page > 1
        },
        playlistName: playlist.name
    });
});

// 解析 Markdown 格式的歌曲清單
function parseMarkdownSongs(markdownText) {
    const songs = [];
    const lines = markdownText.split('\n');
    let currentCategory = '';
    
    for (let line of lines) {
        line = line.trim();
        
        // 檢查是否為分類標題（以 ## 開頭，以 - 結尾）
        if (line.startsWith('##') && line.endsWith('-')) {
            currentCategory = line.replace(/^##\s*/, '').replace(/-$/, '').trim();
            continue;
        }
        
        // 檢查是否為歌曲項目（以 - [ 開頭）
        if (line.startsWith('- [') || line.startsWith('-[')) {
            // 解析 Markdown 連結格式：- [歌曲名稱](連結)
            const linkMatch = line.match(/^-\s*\[([^\]]+)\]\([^)]*\)/);
            if (linkMatch) {
                const songName = linkMatch[1].trim();
                songs.push({
                    name: songName,
                    difficulty: 'Master', // 預設難度
                    notes: currentCategory ? `分類: ${currentCategory}` : ''
                });
            }
        } else if (line.startsWith('- ') || line.startsWith('-')) {
            // 解析純文字格式：- 歌曲名稱
            const songName = line.replace(/^-\s*/, '').trim();
            if (songName && !songName.startsWith('[')) {
                // 處理可能包含多首歌曲的行（用 、 分隔）
                const songNames = songName.split(/[、,，]/).map(s => s.trim()).filter(s => s);
                
                for (const name of songNames) {
                    songs.push({
                        name: name,
                        difficulty: 'Master', // 預設難度
                        notes: currentCategory ? `分類: ${currentCategory}` : ''
                    });
                }
            }
        }
    }
    
    return songs;
}

// 新增歌曲到播放清單（支援批量和 Markdown）
app.post('/api/playlists/:id/songs', (req, res) => {
    const { songs, markdownText, authCode } = req.body;
    const playlistId = parseInt(req.params.id);

    if (!verifyAuth(authCode)) {
        return res.status(401).json({
            success: false,
            message: '授權碼錯誤'
        });
    }

    let songsToAdd = [];
    
    // 如果提供了 Markdown 格式文字，則解析它
    if (markdownText && markdownText.trim()) {
        songsToAdd = parseMarkdownSongs(markdownText);
    }
    // 否則使用標準格式
    else if (songs && Array.isArray(songs) && songs.length > 0) {
        songsToAdd = songs;
    }
    
    if (songsToAdd.length === 0) {
        return res.status(400).json({
            success: false,
            message: '歌曲清單不能為空'
        });
    }

    const data = loadPlaylists();
    const playlistIndex = data.playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該播放清單'
        });
    }

    let addedCount = 0;
    const addedSongs = [];

    songsToAdd.forEach(songData => {
        if (songData.name && songData.difficulty) {
            // 檢查是否已存在相同歌曲和難度
            const existingSong = data.playlists[playlistIndex].songs.find(
                s => s.name === songData.name && s.difficulty === songData.difficulty
            );

            if (!existingSong) {
                const newSong = {
                    id: Date.now() + Math.random(),
                    name: songData.name.trim(),
                    difficulty: songData.difficulty,
                    notes: songData.notes || '',
                    played: false,
                    addedAt: new Date().toISOString(),
                    playedAt: null
                };
                
                data.playlists[playlistIndex].songs.push(newSong);
                addedSongs.push(newSong);
                addedCount++;
            }
        }
    });

    data.playlists[playlistIndex].lastUpdated = new Date().toISOString();
    data.statistics.totalSongs = data.playlists.reduce((total, playlist) => total + playlist.songs.length, 0);

    if (savePlaylists(data)) {
        res.json({
            success: true,
            message: `成功新增 ${addedCount} 首歌曲`,
            addedSongs: addedSongs,
            addedCount: addedCount
        });
    } else {
        res.status(500).json({
            success: false,
            message: '新增歌曲失敗'
        });
    }
});

// 更新歌曲狀態（標記為已遊玩/未遊玩）
app.patch('/api/playlists/:playlistId/songs/:songId', (req, res) => {
    const { played, authCode } = req.body;
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseFloat(req.params.songId);

    if (!verifyAuth(authCode)) {
        return res.status(401).json({
            success: false,
            message: '授權碼錯誤'
        });
    }

    const data = loadPlaylists();
    const playlistIndex = data.playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該播放清單'
        });
    }

    const songIndex = data.playlists[playlistIndex].songs.findIndex(s => s.id === songId);
    
    if (songIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該歌曲'
        });
    }

    data.playlists[playlistIndex].songs[songIndex].played = played;
    data.playlists[playlistIndex].songs[songIndex].playedAt = played ? new Date().toISOString() : null;
    data.playlists[playlistIndex].lastUpdated = new Date().toISOString();

    // 更新統計
    data.statistics.totalPlayed = data.playlists.reduce((total, playlist) => 
        total + playlist.songs.filter(song => song.played).length, 0
    );

    if (savePlaylists(data)) {
        res.json({
            success: true,
            message: played ? '歌曲已標記為已遊玩' : '歌曲已標記為未遊玩',
            song: data.playlists[playlistIndex].songs[songIndex]
        });
    } else {
        res.status(500).json({
            success: false,
            message: '更新失敗'
        });
    }
});

// 刪除播放清單中的歌曲
app.delete('/api/playlists/:playlistId/songs/:songId', (req, res) => {
    const { authCode } = req.body;
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseFloat(req.params.songId);

    if (!verifyAuth(authCode)) {
        return res.status(401).json({
            success: false,
            message: '授權碼錯誤'
        });
    }

    const data = loadPlaylists();
    const playlistIndex = data.playlists.findIndex(p => p.id === playlistId);
    
    if (playlistIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該播放清單'
        });
    }

    const songIndex = data.playlists[playlistIndex].songs.findIndex(s => s.id === songId);
    
    if (songIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '找不到該歌曲'
        });
    }

    data.playlists[playlistIndex].songs.splice(songIndex, 1);
    data.playlists[playlistIndex].lastUpdated = new Date().toISOString();
    
    // 更新統計
    data.statistics.totalSongs = data.playlists.reduce((total, playlist) => total + playlist.songs.length, 0);
    data.statistics.totalPlayed = data.playlists.reduce((total, playlist) => 
        total + playlist.songs.filter(song => song.played).length, 0
    );

    if (savePlaylists(data)) {
        res.json({
            success: true,
            message: '歌曲已刪除'
        });
    } else {
        res.status(500).json({
            success: false,
            message: '刪除失敗'
        });
    }
});

// 獲取統計資料
app.get('/api/statistics', (req, res) => {
    const data = loadPlaylists();
    
    let totalSongs = 0;
    let totalPlayed = 0;
    let playlistStats = [];
    
    data.playlists.forEach(playlist => {
        const playedCount = playlist.songs.filter(song => song.played).length;
        totalSongs += playlist.songs.length;
        totalPlayed += playedCount;
        
        playlistStats.push({
            name: playlist.name,
            totalSongs: playlist.songs.length,
            playedSongs: playedCount,
            progress: playlist.songs.length > 0 ? Math.round((playedCount / playlist.songs.length) * 100) : 0
        });
    });

    res.json({
        success: true,
        statistics: {
            totalPlaylists: data.playlists.length,
            totalSongs,
            totalPlayed,
            totalPending: totalSongs - totalPlayed,
            lastUpdated: data.statistics.lastUpdated,
            playlistStats
        }
    });
});

// 系統啟動流程
console.log('');
console.log('🚀 啟動 maimai 待遊玩清單系統...');

// 1. 系統初始化
initializeSystem();

// 2. 建立每日備份
createBackup();

// 3. 啟動伺服器
app.listen(PORT, () => {
    console.log('');
    console.log('🎉 系統啟動完成！');
    console.log('=====================================');
    console.log(`📡 伺服器運行於: http://localhost:${PORT}`);
    console.log(`🔑 授權碼: ${CONFIG.AUTH_CODE}`);
    console.log(`📁 資料目錄: ${path.relative(__dirname, path.dirname(CONFIG.DATA_FILE))}/`);
    console.log(`📦 備份目錄: ${path.relative(__dirname, CONFIG.BACKUP_DIR)}/`);
    console.log('=====================================');
    console.log('');
    console.log('使用方式：');
    console.log('1. 開啟瀏覽器造訪上述網址');
    console.log('2. 使用授權碼建立和管理播放清單');
    console.log('3. 享受你的 maimai 遊戲體驗！');
    console.log('');
});

module.exports = app;
