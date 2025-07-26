// 全域變數
let playlists = [];
let currentPlaylist = null;
let currentSongs = [];
let currentPage = 1;
let totalPages = 1;
let songsPerPage = 10;
let deleteTarget = { type: null, id: null, playlistId: null };

// DOM 元素
const playlistsContainer = document.getElementById('playlistsContainer');
const songsContainer = document.getElementById('songsContainer');
const statisticsContainer = document.getElementById('statisticsContainer');
const statsDisplay = document.getElementById('statsDisplay');
const deleteModal = document.getElementById('deleteModal');
const addSongsSection = document.getElementById('addSongsSection');
const songsSection = document.getElementById('songsSection');

// 頁面狀態
let currentView = 'playlists'; // 'playlists', 'songs', 'addSongs'
let currentInputFormat = 'standard'; // 'standard', 'markdown'

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up...');
    
    // 先載入資料
    loadPlaylists();
    loadStatistics();
    
    // 再設定事件監聽器
    setupEventListeners();
});

// 設定事件監聽器
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // 播放清單管理
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const refreshPlaylistsBtn = document.getElementById('refreshPlaylistsBtn');
    
    console.log('createPlaylistBtn:', createPlaylistBtn);
    console.log('refreshPlaylistsBtn:', refreshPlaylistsBtn);
    
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', createPlaylist);
        console.log('Added click listener to createPlaylistBtn');
    } else {
        console.error('找不到 createPlaylistBtn 元素');
    }
    
    if (refreshPlaylistsBtn) {
        refreshPlaylistsBtn.addEventListener('click', loadPlaylists);
        console.log('Added click listener to refreshPlaylistsBtn');
    } else {
        console.error('找不到 refreshPlaylistsBtn 元素');
    }
    
    // 批量新增歌曲
    const addBatchSongsBtn = document.getElementById('addBatchSongsBtn');
    const cancelBatchBtn = document.getElementById('cancelBatchBtn');
    
    if (addBatchSongsBtn) {
        addBatchSongsBtn.addEventListener('click', addBatchSongs);
    }
    
    if (cancelBatchBtn) {
        cancelBatchBtn.addEventListener('click', cancelBatchAdd);
    }
    
    // 歌曲列表控制
    const backToPlaylistsBtn = document.getElementById('backToPlaylistsBtn');
    const statusFilter = document.getElementById('statusFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (backToPlaylistsBtn) {
        backToPlaylistsBtn.addEventListener('click', showPlaylistsView);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterSongs);
    }
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterSongs);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterSongs, 300));
    }
    
    // 刪除對話框
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    }
    
    // 點擊對話框外部關閉
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
    
    // Enter 鍵支援
    const newPlaylistName = document.getElementById('newPlaylistName');
    if (newPlaylistName) {
        newPlaylistName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                createPlaylist();
            }
        });
    }
    
    console.log('Event listeners setup complete');
}

// 載入播放清單
async function loadPlaylists() {
    try {
        const response = await fetch('/api/playlists');
        const data = await response.json();
        
        if (data.success) {
            playlists = data.playlists;
            displayPlaylists(playlists);
            updateStatsDisplay(data.statistics);
        } else {
            showMessage('載入播放清單失敗', 'error');
        }
    } catch (error) {
        showMessage('載入播放清單時發生錯誤', 'error');
        console.error('Error:', error);
    }
}

// 顯示播放清單
function displayPlaylists(playlistsToDisplay) {
    if (playlistsToDisplay.length === 0) {
        playlistsContainer.innerHTML = '<div class="loading">目前沒有播放清單，請建立一個新的清單</div>';
        return;
    }
    
    const playlistsHTML = playlistsToDisplay.map(playlist => createPlaylistCard(playlist)).join('');
    playlistsContainer.innerHTML = playlistsHTML;
}

// 創建播放清單卡片
function createPlaylistCard(playlist) {
    const totalSongs = playlist.songs.length;
    const playedSongs = playlist.songs.filter(song => song.played).length;
    const progress = totalSongs > 0 ? Math.round((playedSongs / totalSongs) * 100) : 0;
    const createdDate = new Date(playlist.createdAt).toLocaleDateString('zh-TW');
    
    return `
        <div class="playlist-card" onclick="showPlaylistSongs(${playlist.id})">
            <div class="playlist-header">
                <div class="playlist-name">${escapeHtml(playlist.name)}</div>
                <button class="btn btn-danger btn-small" onclick="event.stopPropagation(); showDeleteModal('playlist', ${playlist.id})" title="刪除清單">
                    🗑️
                </button>
            </div>
            
            <div class="playlist-stats">
                <div class="stat-item">
                    <div class="stat-number">${totalSongs}</div>
                    <div class="stat-label">總歌曲</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${playedSongs}</div>
                    <div class="stat-label">已遊玩</div>
                </div>
            </div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            
            <div class="playlist-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showAddSongsView(${playlist.id})">
                    ➕ 新增歌曲
                </button>
                <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); showPlaylistSongs(${playlist.id})">
                    📋 查看清單
                </button>
            </div>
            
            <div style="margin-top: 15px; font-size: 0.8rem; color: #718096;">
                建立時間: ${createdDate}
            </div>
        </div>
    `;
}

// 建立新播放清單
async function createPlaylist() {
    console.log('createPlaylist function called');
    
    const nameInput = document.getElementById('newPlaylistName');
    const authCodeInput = document.getElementById('createAuthCode');
    
    console.log('nameInput:', nameInput);
    console.log('authCodeInput:', authCodeInput);
    
    if (!nameInput || !authCodeInput) {
        console.error('找不到輸入欄位');
        alert('找不到輸入欄位，請重新整理頁面');
        return;
    }
    
    const name = nameInput.value.trim();
    const authCode = authCodeInput.value;
    
    console.log('name:', name);
    console.log('authCode:', authCode ? '***' : 'empty');
    
    if (!name) {
        showMessage('請輸入清單名稱', 'error');
        return;
    }
    
    if (!authCode) {
        showMessage('請輸入授權碼', 'error');
        return;
    }
    
    console.log('Sending request to create playlist...');
    
    try {
        const response = await fetch('/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, authCode })
        });
        
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Response result:', result);
        
        if (result.success) {
            showMessage(result.message, 'success');
            nameInput.value = '';
            authCodeInput.value = '';
            loadPlaylists();
            loadStatistics();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showMessage('建立播放清單時發生錯誤', 'error');
    }
}

// 顯示新增歌曲界面
function showAddSongsView(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    currentPlaylist = playlist;
    currentView = 'addSongs';
    
    document.getElementById('currentPlaylistName').textContent = playlist.name;
    document.querySelector('.playlist-management').style.display = 'none';
    document.querySelector('.statistics-section').style.display = 'none';
    addSongsSection.style.display = 'block';
    songsSection.style.display = 'none';
}

// 取消批量新增
function cancelBatchAdd() {
    showPlaylistsView();
}

// 切換輸入格式
function switchInputFormat(format) {
    currentInputFormat = format;
    
    // 更新分頁樣式
    document.getElementById('standardFormatTab').classList.remove('active');
    document.getElementById('markdownFormatTab').classList.remove('active');
    document.getElementById(format + 'FormatTab').classList.add('active');
    
    // 顯示/隱藏對應的輸入區域
    document.getElementById('standardFormatInput').style.display = format === 'standard' ? 'block' : 'none';
    document.getElementById('markdownFormatInput').style.display = format === 'markdown' ? 'block' : 'none';
}

// 批量新增歌曲
async function addBatchSongs() {
    let inputText = '';
    let isMarkdown = false;
    
    if (currentInputFormat === 'markdown') {
        inputText = document.getElementById('markdownSongs').value.trim();
        isMarkdown = true;
    } else {
        inputText = document.getElementById('batchSongs').value.trim();
        isMarkdown = false;
    }
    
    const authCode = document.getElementById('batchAuthCode').value;
    
    if (!inputText) {
        showMessage('請輸入歌曲清單', 'error');
        return;
    }
    
    if (!authCode) {
        showMessage('請輸入授權碼', 'error');
        return;
    }
    
    let requestBody = { authCode };
    
    if (isMarkdown) {
        // 發送 Markdown 文字給後端解析
        requestBody.markdownText = inputText;
    } else {
        // 解析標準格式
        const lines = inputText.split('\n').filter(line => line.trim());
        const songs = [];
        
        for (const line of lines) {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length >= 2) {
                const song = {
                    name: parts[0],
                    difficulty: parts[1],
                    notes: parts[2] || ''
                };
                
                // 驗證難度
                const validDifficulties = ['Basic', 'Advanced', 'Expert', 'Master', 'Re:Master'];
                if (validDifficulties.includes(song.difficulty)) {
                    songs.push(song);
                }
            }
        }
        
        if (songs.length === 0) {
            showMessage('沒有找到有效的歌曲格式', 'error');
            return;
        }
        
        requestBody.songs = songs;
    }
    
    try {
        const response = await fetch(`/api/playlists/${currentPlaylist.id}/songs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`${result.message}`, 'success');
            
            // 清空輸入欄位
            if (isMarkdown) {
                document.getElementById('markdownSongs').value = '';
            } else {
                document.getElementById('batchSongs').value = '';
            }
            document.getElementById('batchAuthCode').value = '';
            
            loadPlaylists();
            loadStatistics();
            setTimeout(() => showPlaylistSongs(currentPlaylist.id), 1000);
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('新增歌曲時發生錯誤', 'error');
        console.error('Error:', error);
    }
}

// 顯示播放清單歌曲
async function showPlaylistSongs(playlistId, page = 1) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    currentPlaylist = playlist;
    currentPage = page;
    currentView = 'songs';
    
    await loadPlaylistSongs(playlistId, page);
    
    document.getElementById('songListPlaylistName').textContent = playlist.name;
    document.querySelector('.playlist-management').style.display = 'none';
    document.querySelector('.statistics-section').style.display = 'none';
    addSongsSection.style.display = 'none';
    songsSection.style.display = 'block';
}

// 載入播放清單歌曲
async function loadPlaylistSongs(playlistId, page = 1) {
    try {
        const response = await fetch(`/api/playlists/${playlistId}/songs?page=${page}&limit=${songsPerPage}`);
        const data = await response.json();
        
        if (data.success) {
            currentSongs = data.songs;
            displaySongs(data.songs);
            updatePagination(data.pagination);
        } else {
            showMessage('載入歌曲清單失敗', 'error');
        }
    } catch (error) {
        showMessage('載入歌曲清單時發生錯誤', 'error');
        console.error('Error:', error);
    }
}

// 顯示歌曲清單
function displaySongs(songsToDisplay) {
    if (songsToDisplay.length === 0) {
        songsContainer.innerHTML = '<div class="loading">此清單目前沒有歌曲</div>';
        return;
    }
    
    const songsHTML = songsToDisplay.map(song => createSongItem(song)).join('');
    songsContainer.innerHTML = songsHTML;
}

// 創建歌曲項目
function createSongItem(song) {
    const difficultyClass = getDifficultyClass(song.difficulty);
    const addedDate = new Date(song.addedAt).toLocaleDateString('zh-TW');
    const playedDate = song.playedAt ? new Date(song.playedAt).toLocaleDateString('zh-TW') : null;
    
    return `
        <div class="song-item ${song.played ? 'played' : ''}">
            <input type="checkbox" class="song-checkbox" ${song.played ? 'checked' : ''} 
                   onchange="toggleSongStatus(${currentPlaylist.id}, ${song.id}, this.checked)">
            
            <div class="song-details">
                <div class="song-name">${escapeHtml(song.name)}</div>
                <div class="song-meta">
                    <span class="song-difficulty difficulty-${difficultyClass}">${song.difficulty}</span>
                    <span class="song-status ${song.played ? 'status-played' : 'status-pending'}">
                        ${song.played ? '✅ 已遊玩' : '⏳ 待遊玩'}
                    </span>
                    <span>新增: ${addedDate}</span>
                    ${playedDate ? `<span>遊玩: ${playedDate}</span>` : ''}
                </div>
                ${song.notes ? `<div class="song-notes">${escapeHtml(song.notes)}</div>` : ''}
            </div>
            
            <button class="btn btn-danger btn-small" onclick="showDeleteModal('song', ${song.id}, ${currentPlaylist.id})" title="刪除歌曲">
                🗑️
            </button>
        </div>
    `;
}

// 切換歌曲狀態
async function toggleSongStatus(playlistId, songId, played) {
    const authCode = prompt('請輸入授權碼：');
    if (!authCode) return;
    
    try {
        const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ played, authCode })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            loadPlaylists();
            loadStatistics();
            loadPlaylistSongs(playlistId, currentPage);
        } else {
            showMessage(result.message, 'error');
            // 重置勾選狀態
            loadPlaylistSongs(playlistId, currentPage);
        }
    } catch (error) {
        showMessage('更新歌曲狀態時發生錯誤', 'error');
        console.error('Error:', error);
        // 重置勾選狀態
        loadPlaylistSongs(playlistId, currentPage);
    }
}

// 更新分頁控制
function updatePagination(pagination) {
    const paginationHTML = createPaginationHTML(pagination);
    document.getElementById('paginationTop').innerHTML = paginationHTML;
    document.getElementById('paginationBottom').innerHTML = paginationHTML;
    totalPages = pagination.totalPages;
}

// 創建分頁 HTML
function createPaginationHTML(pagination) {
    if (pagination.totalPages <= 1) return '';
    
    let html = '<div class="pagination-controls">';
    
    // 上一頁
    html += `<button class="page-btn ${!pagination.hasPrev ? 'disabled' : ''}" 
             onclick="changePage(${pagination.currentPage - 1})" 
             ${!pagination.hasPrev ? 'disabled' : ''}>‹ 上一頁</button>`;
    
    // 頁碼
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === pagination.currentPage ? 'active' : ''}" 
                 onclick="changePage(${i})">${i}</button>`;
    }
    
    // 下一頁
    html += `<button class="page-btn ${!pagination.hasNext ? 'disabled' : ''}" 
             onclick="changePage(${pagination.currentPage + 1})" 
             ${!pagination.hasNext ? 'disabled' : ''}>下一頁 ›</button>`;
    
    html += `<div class="pagination-info">
        第 ${pagination.currentPage} 頁，共 ${pagination.totalPages} 頁 (${pagination.totalSongs} 首歌曲)
    </div>`;
    
    html += '</div>';
    return html;
}

// 切換頁面
function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    showPlaylistSongs(currentPlaylist.id, page);
}

// 篩選歌曲
function filterSongs() {
    // 這裡可以實作客戶端篩選，或者重新載入伺服器端篩選的結果
    loadPlaylistSongs(currentPlaylist.id, 1);
}

// 顯示播放清單視圖
function showPlaylistsView() {
    currentView = 'playlists';
    
    document.querySelector('.playlist-management').style.display = 'block';
    document.querySelector('.statistics-section').style.display = 'block';
    addSongsSection.style.display = 'none';
    songsSection.style.display = 'none';
    
    loadPlaylists();
}

// 其餘的工具函數和模態框處理... (繼續在下一部分)

// 載入統計資料
async function loadStatistics() {
    try {
        const response = await fetch('/api/statistics');
        const data = await response.json();
        
        if (data.success) {
            displayStatistics(data.statistics);
        }
    } catch (error) {
        console.error('載入統計資料錯誤:', error);
    }
}

// 顯示統計資料
function displayStatistics(stats) {
    const statisticsHTML = `
        <div class="statistics-grid">
            <div class="stat-card">
                <div class="stat-number">${stats.totalPlaylists || 0}</div>
                <div class="stat-label">播放清單</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalSongs || 0}</div>
                <div class="stat-label">總歌曲數</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalPlayed || 0}</div>
                <div class="stat-label">已遊玩</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.totalPending || 0}</div>
                <div class="stat-label">待遊玩</div>
            </div>
        </div>
        
        ${stats.playlistStats && stats.playlistStats.length > 0 ? createPlaylistStats(stats.playlistStats) : ''}
    `;
    
    statisticsContainer.innerHTML = statisticsHTML;
}

// 創建播放清單統計
function createPlaylistStats(playlistStats) {
    const playlistHTML = playlistStats.map(stats => {
        return `
            <div class="difficulty-stat">
                <span style="font-weight: bold;">${escapeHtml(stats.name)}</span>
                <span>${stats.playedSongs}/${stats.totalSongs} (${stats.progress}%)</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="difficulty-stats">
            <h3>清單進度</h3>
            ${playlistHTML}
        </div>
    `;
}

// 更新頂部統計顯示
function updateStatsDisplay(stats) {
    if (stats) {
        statsDisplay.innerHTML = `${stats.totalSongs || 0} 首歌曲 | ${stats.totalPlayed || 0} 已遊玩 | ${(stats.totalSongs || 0) - (stats.totalPlayed || 0)} 待遊玩`;
    }
}

// 顯示刪除確認對話框
function showDeleteModal(type, id, playlistId = null) {
    deleteTarget = { type, id, playlistId };
    
    const title = document.getElementById('deleteModalTitle');
    const message = document.getElementById('deleteModalMessage');
    
    if (type === 'playlist') {
        title.textContent = '確認刪除播放清單';
        message.textContent = '確定要刪除這個播放清單嗎？此操作將刪除清單中的所有歌曲。';
    } else if (type === 'song') {
        title.textContent = '確認刪除歌曲';
        message.textContent = '確定要從清單中刪除這首歌曲嗎？';
    }
    
    document.getElementById('deleteAuthCode').value = '';
    deleteModal.style.display = 'block';
}

// 關閉刪除對話框
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    deleteTarget = { type: null, id: null, playlistId: null };
}

// 確認刪除
async function confirmDelete() {
    const authCode = document.getElementById('deleteAuthCode').value;
    
    if (!authCode) {
        showMessage('請輸入授權碼', 'error');
        return;
    }
    
    try {
        let url = '';
        if (deleteTarget.type === 'playlist') {
            url = `/api/playlists/${deleteTarget.id}`;
        } else if (deleteTarget.type === 'song') {
            url = `/api/playlists/${deleteTarget.playlistId}/songs/${deleteTarget.id}`;
        }
        
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ authCode })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            closeDeleteModal();
            
            if (deleteTarget.type === 'playlist') {
                loadPlaylists();
                showPlaylistsView();
            } else if (deleteTarget.type === 'song') {
                loadPlaylists();
                loadPlaylistSongs(deleteTarget.playlistId, currentPage);
            }
            
            loadStatistics();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('刪除時發生錯誤', 'error');
        console.error('Error:', error);
    }
}

// 工具函數
function getDifficultyClass(difficulty) {
    const classMap = {
        'Basic': 'basic',
        'Advanced': 'advanced',
        'Expert': 'expert',
        'Master': 'master',
        'Re:Master': 'remaster'
    };
    return classMap[difficulty] || 'basic';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(message, type) {
    console.log('showMessage called:', message, type);
    console.log('currentView:', currentView);
    
    // 移除現有訊息
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
        console.log('Removed existing message');
    }
    
    // 創建新訊息
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    console.log('Created message div:', messageDiv);
    
    // 找到當前可見的目標區域
    let targetSection = null;
    
    if (currentView === 'playlists') {
        targetSection = document.querySelector('.playlist-management');
        console.log('Looking for .playlist-management:', targetSection);
    } else if (currentView === 'songs') {
        targetSection = document.querySelector('.songs-section');
        console.log('Looking for .songs-section:', targetSection);
    } else if (currentView === 'addSongs') {
        targetSection = document.querySelector('.add-songs-section');
        console.log('Looking for .add-songs-section:', targetSection);
    }
    
    // 如果找不到目標區域，使用 container 作為備用
    if (!targetSection) {
        targetSection = document.querySelector('.container');
        console.log('Using .container as fallback:', targetSection);
    }
    
    if (targetSection) {
        // 插入到區域的第一個子元素前面
        if (targetSection.firstChild) {
            targetSection.insertBefore(messageDiv, targetSection.firstChild);
            console.log('Inserted message before first child');
        } else {
            targetSection.appendChild(messageDiv);
            console.log('Appended message to target section');
        }
    } else {
        // 最後的備用方案：直接添加到 body
        document.body.appendChild(messageDiv);
        console.log('Appended message to body');
    }
    
    console.log('Message added to DOM');
    
    // 3秒後自動移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
            console.log('Message removed after timeout');
        }
    }, 3000);
}

// 讓函數在全域可用
window.showDeleteModal = showDeleteModal;
window.showPlaylistSongs = showPlaylistSongs;
window.showAddSongsView = showAddSongsView;
window.toggleSongStatus = toggleSongStatus;
window.changePage = changePage;
window.switchInputFormat = switchInputFormat;

// 工具函數
function getDifficultyClass(difficulty) {
    const classMap = {
        'Basic': 'basic',
        'Advanced': 'advanced',
        'Expert': 'expert',
        'Master': 'master',
        'Re:Master': 'remaster'
    };
    return classMap[difficulty] || 'basic';
}

function formatScore(score) {
    if (!score || score === 0) return '0';
    return parseInt(score).toLocaleString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(message, type) {
    // 移除現有訊息
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 創建新訊息
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // 根據當前頁面決定插入位置
    let targetContainer;
    
    // 檢查是否在播放清單管理頁面
    const playlistManagement = document.querySelector('.playlist-management');
    if (playlistManagement && playlistManagement.style.display !== 'none') {
        targetContainer = playlistManagement;
        targetContainer.insertBefore(messageDiv, targetContainer.firstChild);
    }
    // 檢查是否在歌曲列表頁面
    else if (document.querySelector('.song-list-section') && document.querySelector('.song-list-section').style.display !== 'none') {
        const songListSection = document.querySelector('.song-list-section');
        targetContainer = songListSection;
        targetContainer.insertBefore(messageDiv, targetContainer.firstChild);
    }
    // 檢查是否在批量新增頁面
    else if (document.querySelector('.add-song-section') && document.querySelector('.add-song-section').style.display !== 'none') {
        const addSongSection = document.querySelector('.add-song-section');
        const songForm = document.querySelector('#batchSongForm');
        if (songForm) {
            addSongSection.insertBefore(messageDiv, songForm);
        } else {
            addSongSection.insertBefore(messageDiv, addSongSection.firstChild);
        }
    }
    // 預設插入到 body 開頭
    else {
        document.body.insertBefore(messageDiv, document.body.firstChild);
    }
    
    // 3秒後自動移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// 讓刪除函數在全域可用
window.showDeleteModal = showDeleteModal;
