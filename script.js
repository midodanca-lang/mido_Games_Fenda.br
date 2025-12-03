
// Simple site logic: storage-backed games list + sidebar toggle + publish form handling

const STORAGE_KEY = "mido_games_list_v1";

function getGames(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }catch(e){ return []; }
}

function saveGames(games){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

// Sidebar
function toggleSidebar(){
  const s = document.getElementById('sidebar');
  if(!s) return;
  if(s.style.left === '0px' || s.style.left==='0%'){
    s.style.left = '-300px';
    document.querySelector('.content').style.marginLeft = '0';
  } else {
    s.style.left = '0px';
    document.querySelector('.content').style.marginLeft = '300px';
  }
}

// Render featured on index
function renderFeatured(){
  const featured = document.getElementById('featured-list');
  if(!featured) return;
  const games = getGames();
  featured.innerHTML = '';
  const slice = games.slice(0,6);
  slice.forEach(g => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${g.img || 'https://via.placeholder.com/96x96?text=GAME'}" alt="${escapeHtml(g.title)}">
      <div class="meta">
        <h3>${escapeHtml(g.title)}</h3>
        <p>${escapeHtml(g.desc || '')}</p>
      </div>
      <div class="actions">
        <a class="btn-cta" href="${g.apk}" download>Baixar APK</a>
      </div>
    `;
    featured.appendChild(div);
  });
}

// Render games list on download page
function renderGamesList(){
  const list = document.getElementById('games-list');
  if(!list) return;
  const games = getGames();
  list.innerHTML = '';
  if(games.length===0){
    list.innerHTML = '<div class="ad">Nenhum jogo publicado ainda. Use Publicar Jogo para adicionar.</div>';
    return;
  }
  games.forEach(g => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${g.img || 'https://via.placeholder.com/96x96?text=GAME'}" alt="${escapeHtml(g.title)}">
      <div class="meta">
        <h3>${escapeHtml(g.title)}</h3>
        <p>${escapeHtml(g.desc || '')}</p>
      </div>
      <div class="actions">
        <a class="btn-cta" href="${g.apk}" download>Baixar APK</a>
        <a class="btn-cta" style="background:#0aa; margin-top:6px" href="#">Ver mais</a>
      </div>
    `;
    list.appendChild(div);
  });
}

// Publish form handling
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('publish-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const img = document.getElementById('img').value.trim();
      const desc = document.getElementById('description').value.trim();
      const apk = document.getElementById('apk').value.trim();
      if(!title || !apk){
        alert('Nome e link do APK são obrigatórios.');
        return;
      }
      const games = getGames();
      games.unshift({ title, img, desc, apk, created:Date.now() });
      saveGames(games);
      alert('Jogo publicado!');
      window.location.href = 'download.html';
    });
  }
  // initial renders
  renderFeatured();
  renderGamesList();
});

function escapeHtml(text){
  if(!text) return '';
  return text.replace(/[&<>"']/g, (m)=> ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[m]);
}
