// script.js

// ===== GLOBAL STATE =====
let albums = [];           // will be initialized after login
let likedSongs = [];
let selectedFolderIndex = null;

// ===== GOOGLE SIGN-IN INITIALIZATION =====
window.onload = () => {
  // render Google Sign-In button
  google.accounts.id.initialize({
    client_id: 'YOUR_GOOGLE_CLIENT_ID',
    callback: handleCredentialResponse,
    ux_mode: 'popup'
  });
  google.accounts.id.renderButton(
    document.getElementById('g_id_signin'),
    { theme: 'outline', size: 'large' }
  );

  // wire up theme toggle
  document.getElementById('themeToggle')
    .addEventListener('click', () => document.body.classList.toggle('light-theme'));

  // feedback form
  document.getElementById('modalFeedbackForm')
    .addEventListener('submit', handleFeedbackSubmit);

  // add-song form
  document.getElementById('addSongForm')
    .addEventListener('submit', handleAddSong);

  // login form (email)
  document.getElementById('loginForm')
    .addEventListener('submit', loginWithEmail);
};

// ===== AUTH HANDLERS =====
function handleCredentialResponse(res) {
  const payload = JSON.parse(atob(res.credential.split('.')[1]));
  if (payload.email.toLowerCase().endsWith('@gmail.com')) {
    loginSuccess(payload.email);
  } else {
    alert('Please use a Gmail address.');
  }
}

function loginWithEmail(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (email.toLowerCase().endsWith('@gmail.com')) {
    loginSuccess(email);
  } else {
    document.getElementById('loginMessage').innerText = 'Invalid @gmail.com address.';
  }
}

function loginSuccess(email) {
  // show main UI
  document.getElementById('loginContainer').style.display = 'none';
  document.getElementById('sidebar').style.display = 'flex';
  document.getElementById('mainContent').style.display = 'block';
  document.getElementById('profileTool').style.display = 'block';
  // show initial profile avatar (first letter)
  document.querySelector('#profileTool button').innerText = email.charAt(0).toUpperCase();

  // initialize data
  loadInitialAlbums();
  populateFolders();
  displayAlbums();
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  document.getElementById('loginContainer').style.display = 'flex';
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('mainContent').style.display = 'none';
  document.getElementById('profileTool').style.display = 'none';
}

// profile menu toggle
function toggleProfileMenu() {
  const menu = document.getElementById('profileMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
document.addEventListener('click', e => {
  if (!document.getElementById('profileTool').contains(e.target)) {
    document.getElementById('profileMenu').style.display = 'none';
  }
});

// ===== DATA INITIALIZATION =====
function loadInitialAlbums() {
  // replace with your actual album list
  albums = [
    { title: "BEESALU", image: "...png", songs: [
        { name: "USARAY", url: "https://..." },
        /* ... */
      ]
    },
    /* ... other albums ... */
  ];
}

// ===== FOLDERS / PLAYLISTS =====
function populateFolders() {
  const list = document.getElementById('folderList');
  list.innerHTML = '';
  albums.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'list-group-item list-group-item-action';
    btn.innerText = a.title;
    btn.onclick = () => {
      selectedFolderIndex = i;
      document.querySelectorAll('#folderList button')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('newFolderDiv').style.display = 'none';
    };
    list.appendChild(btn);
  });
  // "Create New Folder" button
  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'list-group-item list-group-item-action';
  newBtn.innerText = '+ Create New Folder';
  newBtn.onclick = () => {
    selectedFolderIndex = 'new';
    document.querySelectorAll('#folderList button')
      .forEach(b => b.classList.remove('active'));
    newBtn.classList.add('active');
    document.getElementById('newFolderDiv').style.display = 'block';
  };
  list.appendChild(newBtn);
}

function handleAddSong(e) {
  e.preventDefault();
  const title = document.getElementById('songTitle').value.trim();
  const file = document.getElementById('songFile').files[0];
  const msg = document.getElementById('addSongMessage');

  if (selectedFolderIndex === null) {
    msg.innerText = 'Select or create a folder.';
    return;
  }

  let idx;
  if (selectedFolderIndex === 'new') {
    const name = document.getElementById('newFolderName').value.trim();
    if (!name) { msg.innerText = 'Enter new folder name.'; return; }
    idx = albums.push({ title: name, image: 'https://via.placeholder.com/150', songs: [] }) - 1;
  } else {
    idx = selectedFolderIndex;
  }

  const url = URL.createObjectURL(file);
  albums[idx].songs.push({ name: title, url });
  msg.innerText = '✅ Song added!';
  e.target.reset();
  document.getElementById('newFolderDiv').style.display = 'none';
  selectedFolderIndex = null;
  populateFolders();
  displayAlbums();
}

// ===== ALBUM & SONG UI =====
function displayAlbums() {
  const c = document.getElementById('albumContainer');
  c.innerHTML = '';
  albums.forEach((a, i) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';
    col.innerHTML = `
      <div class="card album-card h-100" onclick="openAlbum(${i})">
        <img src="${a.image}" class="card-img-top" alt="${a.title}">
        <div class="card-body text-center">
          <h5 class="card-title">${a.title}</h5>
        </div>
      </div>`;
    c.appendChild(col);
  });
}

function openAlbum(i) {
  const a = albums[i];
  document.getElementById('albumSection').style.display = 'none';
  document.getElementById('songSection').style.display = 'block';
  document.getElementById('albumTitle').innerText = a.title;

  const ul = document.getElementById('songList');
  ul.innerHTML = '';
  a.songs.forEach(s => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-light d-flex justify-content-between align-items-center';
    li.innerHTML = `
      ${s.name}
      <div>
        <span class="share-btn" onclick="showShareOptions(event,'${s.url}')">🔗</span>
        <span class="like-btn" onclick="likeSong(event,'${s.name}','${s.url}')">❤️</span>
        <button class="btn btn-sm btn-outline-light ms-2" onclick="playSong('${s.url}')">▶️</button>
      </div>`;
    ul.appendChild(li);
  });
}

function playSong(u) {
  const p = document.getElementById('audioPlayer');
  p.src = u; p.play();
}

function likeSong(e, n, u) {
  e.stopPropagation();
  if (!likedSongs.find(x => x.name === n)) {
    likedSongs.push({ name: n, url: u });
    e.target.classList.add('liked');
  }
}

function showShareOptions(e, url) {
  e.stopPropagation();
  const menu = document.createElement('div');
  menu.className = 'position-absolute bg-dark text-light p-2 rounded';
  menu.style.top = `${e.clientY}px`;
  menu.style.left = `${e.clientX}px`;
  menu.innerHTML = `
    <button class="btn btn-sm btn-link text-light" onclick="shareTo('whatsapp','${url}')">WhatsApp</button><br>
    <button class="btn btn-sm btn-link text-light" onclick="shareTo('telegram','${url}')">Telegram</button><br>
    <button class="btn btn-sm btn-link text-light" onclick="shareTo('mailto','${url}')">Email</button>
  `;
  document.body.appendChild(menu);
  document.addEventListener('click', () => menu.remove(), { once: true });
}

function shareTo(platform, url) {
  let shareUrl;
  switch(platform) {
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(url)}`; break;
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`; break;
    case 'mailto':
      shareUrl = `mailto:?body=${encodeURIComponent(url)}`; break;
  }
  window.open(shareUrl, '_blank');
}

function showLikedSongs() {
  document.getElementById('albumSection').style.display = 'none';
  document.getElementById('songSection').style.display = 'none';
  document.getElementById('likedSection').style.display = 'block';

  const ul = document.getElementById('likedList');
  ul.innerHTML = '';
  likedSongs.forEach(s => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark text-light d-flex justify-content-between';
    li.innerHTML = `
      ${s.name}
      <button class="btn btn-sm btn-outline-light" onclick="playSong('${s.url}')">▶️</button>`;
    ul.appendChild(li);
  });
}

function goBack() {
  document.getElementById('songSection').style.display = 'none';
  document.getElementById('albumSection').style.display = 'block';
}

function goBackToAlbums() {
  document.getElementById('likedSection').style.display = 'none';
  document.getElementById('albumSection').style.display = 'block';
}

// ===== SEARCH FILTERS =====
function filterAlbums() {
  const q = document.getElementById('albumSearchInput').value.toLowerCase();
  document.querySelectorAll('.album-card').forEach(c =>
    c.parentElement.style.display = c.innerText.toLowerCase().includes(q) ? '' : 'none'
  );
}

function filterSongs() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('#songList li').forEach(li =>
    li.style.display = li.innerText.toLowerCase().includes(q) ? '' : 'none'
  );
}

// ===== FEEDBACK =====
function handleFeedbackSubmit(e) {
  e.preventDefault();
  const txt = document.getElementById('modalFeedbackText').value.trim();
  const msg = document.getElementById('modalFeedbackMessage');
  if (txt) {
    msg.innerText = '🎶 Thanks for your feedback!';
    e.target.reset();
  } else {
    msg.innerText = '⚠️ Please type something.';
  }
}
