/* ==========================================================================
   VladSchool — App logic (vanilla JS, PWA-ready)
   ========================================================================== */

const STORAGE_KEY = 'vladschool_user';
const THEME_KEY = 'vladschool_theme';

// --- Elements ---
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const htmlEl = document.documentElement;
const sidebar = $('#sidebar');
const overlay = $('#overlay');
const btnMenu = $('#btnMenu');
const btnClose = $('#btnClose');
const btnTheme = $('#btnTheme');
const navLinks = $$('.nav-link');

const views = {
  home: $('#view-home'),
  tool: $('#view-tool'),
  login: $('#view-login'),
};

// --- Theme ---
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) {
  htmlEl.className = savedTheme;
  btnTheme.textContent = savedTheme === 'dark' ? '☀' : '🌙';
} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  htmlEl.className = 'dark';
  btnTheme.textContent = '☀';
}

btnTheme.addEventListener('click', () => {
  const isDark = htmlEl.classList.contains('dark');
  htmlEl.className = isDark ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, htmlEl.className);
  btnTheme.textContent = htmlEl.classList.contains('dark') ? '☀' : '🌙';
});

// --- Sidebar ---
function openSidebar() { sidebar.classList.add('open'); overlay.hidden = false; }
function closeSidebar() { sidebar.classList.remove('open'); overlay.hidden = true; }

btnMenu.addEventListener('click', openSidebar);
btnClose.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const tool = link.dataset.tool;
    closeSidebar();
    navigate(tool);
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// --- Navigation ---
function navigate(tool) {
  Object.values(views).forEach(v => v.hidden = true);

  if (tool === 'home') {
    views.home.hidden = false;
    return;
  }

  if (tool === 'login') {
    views.login.hidden = false;
    return;
  }

  showTool(tool);
}

function showTool(tool) {
  views.tool.hidden = false;
  const titleEl = $('#toolTitle');
  const content = $('#toolContent');

  const labels = {
    math: 'Matematica',
    science: 'Scienze',
    italian: 'Italiano',
    history: 'Storia & Geografia',
    english: 'Inglese',
    study: 'Studiare meglio',
    organize: 'Organizzazione',
    games: 'Giochi educativi',
    creative: 'Creatività',
    settings: 'Impostazioni',
    about: 'Info',
  };

  titleEl.textContent = labels[tool] || 'Strumento';
  content.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚧</div>
      <h3>${titleEl.textContent}</h3>
      <p>Questo strumento sarà disponibile nella prossima versione.</p>
      <p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">L'app è in fase di sviluppo (v1).</p>
    </div>
  `;
}

// Back buttons
$$('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    navigate('home');
    navLinks.forEach(l => l.classList.remove('active'));
    const home = $('[data-tool="home"]');
    if (home) home.classList.add('active');
  });
});

// --- Toast ---
function toast(msg, ms = 2500) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

// --- Auth (placeholder, chiama api/auth/login via fetch quando backend è online) ---
$('#formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = { email: fd.get('email'), password: fd.get('password') };

  try {
    // Per ora simulazione locale; sostituire con fetch verso api/auth/login
    toast('Login simulato — backend PHP da configurare su FTP.');
  } catch (err) {
    toast('Errore: ' + err.message);
  }
});

$('#formRegister').addEventListener('submit', (e) => {
  e.preventDefault();
  toast('Registrazione simulata — backend PHP da configurare su FTP.');
});

// --- Easter egg "VLAD" ---
let konami = [];
const pattern = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
window.addEventListener('keydown', (e) => {
  konami.push(e.key);
  konami = konami.slice(-pattern.length);
  if (konami.join(',') === pattern.join(',')) {
    const ee = $('#easterEgg');
    ee.hidden = false;
    ee.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('🦇 EASTER EGG VLAD attivato!');
    setTimeout(() => { ee.hidden = true; }, 5000);
  }
});

// --- Splash hide after load ---
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = $('#splash');
    splash.classList.remove('active');
  }, 900);
});
