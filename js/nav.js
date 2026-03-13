/* ================================================================
   SavahLifestyle v6 — Nav Builder
   Desktop right-side order: Profile avatar → Bell → Theme → Hamburger
   Mobile: hamburger only (profile card at top of menu)
   ================================================================ */

function buildNav(activePage) {
  const navLinks = [
    { href:'index.html',      label:'Dashboard',  key:'dashboard' },
    { href:'weather.html',    label:'Weather',    key:'weather' },
    { href:'calculator.html', label:'Calculator', key:'calculator' },
    { href:'todo.html',       label:'Tasks',      key:'todo' },
    { href:'expenses.html',   label:'Finance',    key:'expenses' },
    { href:'focus.html',      label:'Focus',      key:'focus' },
    { href:'journal.html',    label:'Journal',    key:'journal' },
  ];

  const links = navLinks.map(l =>
    `<a href="${l.href}" class="nav-link${activePage===l.key?' active':''}">${l.label}</a>`
  ).join('');

  const allModules = [
    { href:'index.html',           icon:'home',    label:'Dashboard' },
    { href:'weather.html',         icon:'cloud',   label:'Weather' },
    { href:'calculator.html',      icon:'hash',    label:'Calculator' },
    { href:'quickcalculators.html',icon:'calc',    label:'Quick Calculators' },
    { href:'todo.html',            icon:'check',   label:'Todo & Tasks' },
    { href:'habits.html',          icon:'repeat',  label:'Habits' },
    { href:'goals.html',           icon:'target',  label:'Goals' },
    { href:'focus.html',           icon:'timer',   label:'Focus Mode' },
    { href:'journal.html',         icon:'book',    label:'Journal' },
    { href:'expenses.html',        icon:'dollar',  label:'Expenses' },
    { href:'analytics.html',       icon:'bar',     label:'Analytics' },
    { href:'calendar.html',        icon:'cal',     label:'Calendar' },
    { href:'music.html',           icon:'music',   label:'Focus Music' },
    { href:'notes.html',           icon:'note',    label:'Sticky Notes' },
    { href:'braindump.html',       icon:'brain',   label:'Brain Dump' },
    { href:'stickynotes.html',     icon:'sticky',  label:'Kanban Board' },
    { href:'quicklinks.html',      icon:'link',    label:'Quick Links' },
    { href:'passwordgen.html',     icon:'lock',    label:'Password Gen' },
    { href:'countdown.html',       icon:'clock',   label:'Countdown' },
    { href:'knowledge.html',       icon:'book2',   label:'Knowledge Base' },
    { href:'motivation.html',      icon:'star',    label:'Motivation' },
    { href:'readingtimer.html',    icon:'read',    label:'Reading Timer' },
    { href:'filezone.html',        icon:'file',    label:'File Zone' },
    { href:'timezone.html',        icon:'globe',   label:'Timezone' },
    { href:'ideagenerator.html',   icon:'light',   label:'Idea Generator' },
    { href:'puzzles.html',         icon:'puzzle',  label:'Games & Puzzles' },
    { href:'bodymetrics.html',     icon:'heart',   label:'Body Metrics' },
    { href:'moodtracker.html',     icon:'smile',   label:'Mood Tracker' },
    { href:'watertracker.html',    icon:'drop',    label:'Water Tracker' },
    { href:'sleeptracker.html',    icon:'moon',    label:'Sleep Tracker' },
    { href:'codesnippets.html',    icon:'code',    label:'Code Snippets' },
    { href:'pomodoro.html',        icon:'pomo',    label:'Pomodoro Timer' },
    { href:'flashcards.html',      icon:'cards',   label:'Flashcards' },
    { href:'mindmap.html',         icon:'mind',    label:'Mind Map' },
    { href:'whiteboard.html',      icon:'board',   label:'Whiteboard' },
    { href:'netspeed.html',        icon:'wifi',    label:'Net Speed Test' },
    { href:'profile.html',         icon:'user',    label:'My Profile' },
    { href:'settings.html',        icon:'settings',label:'Settings' },
  ];

  const iconSvg = (key) => {
    const map = {
      home:     `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
      check:    `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
      repeat:   `<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>`,
      target:   `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
      book:     `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>`,
      dollar:   `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
      hash:     `<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>`,
      music:    `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>`,
      timer:    `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
      cloud:    `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>`,
      cal:      `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
      bar:      `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
      note:     `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>`,
      brain:    `<path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.81A3 3 0 0 1 4.5 14a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 1.07-4.81A2.5 2.5 0 0 1 9.5 2z"/>`,
      sticky:   `<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/>`,
      link:     `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
      lock:     `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
      clock:    `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
      book2:    `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>`,
      star:     `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
      read:     `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`,
      file:     `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
      globe:    `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
      light:    `<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><circle cx="12" cy="12" r="4"/>`,
      puzzle:   `<path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"/>`,
      calc:     `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/>`,
      heart:    `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
      smile:    `<circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>`,
      drop:     `<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>`,
      moon:     `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
      code:     `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
      pomo:     `<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>`,
      cards:    `<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 9v6"/><path d="M9 12h6"/>`,
      mind:     `<circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>`,
      board:    `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/>`,
      wifi:     `<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>`,
      user:     `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
      settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>`,
    };
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${map[key]||''}</svg>`;
  };

  const groups = [
    { title:'Core & Productivity', items:['home','check','repeat','target','book','dollar','hash','timer','pomo'] },
    { title:'Health & Wellness',   items:['heart','smile','drop','moon','cloud'] },
    { title:'Creative & Learning', items:['brain','book2','star','read','light','puzzle','cards','mind','board'] },
    { title:'Tools & Utilities',   items:['link','lock','clock','file','globe','calc','wifi','code','bar','cal'] },
    { title:'Music & Media',       items:['music','note','sticky'] },
    { title:'Account',             items:['user','settings'] },
  ];

  let mobileHTML = '';
  groups.forEach(g => {
    mobileHTML += `<div class="mobile-section">${g.title}</div>`;
    g.items.forEach(icon => {
      const m = allModules.find(x => x.icon===icon);
      if (m) mobileHTML += `<a href="${m.href}" class="mobile-link${activePage===m.href.replace('.html','')?' active':''}">${iconSvg(icon)}<span>${m.label}</span></a>`;
    });
  });

  /* Mobile menu top profile card */
  const mobileProfileCard = `
    <div class="mobile-profile-card" id="mobile-profile-card">
      <div class="mobile-profile-ring" id="mobile-profile-ring">
        <div class="mobile-profile-avatar" id="mobile-profile-avatar">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
      <div class="mobile-profile-info">
        <div class="mobile-profile-name" id="mobile-profile-name">My Account</div>
        <div class="mobile-profile-sub" id="mobile-profile-sub">Sign in to sync your data</div>
        <div class="mobile-profile-actions" id="mobile-profile-actions">
          <a href="login.html" class="mobile-profile-btn mobile-profile-btn-primary" id="mobile-profile-cta">Sign In</a>
        </div>
      </div>
    </div>`;

  /* Nav HTML — profile avatar slot inserted by initNavUser */
  const navHtml = `
    <nav class="nav" id="main-nav">
      <a href="index.html" class="nav-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        Savah<span>Lifestyle</span>
      </a>
      <div class="nav-links">${links}</div>
      <div class="nav-actions" id="nav-actions">
        <!-- Profile avatar injected here by initNavUser (desktop only) -->
        <div id="nav-profile-slot"></div>
        <!-- Notifications injected here -->
        <div id="nav-notif-slot"></div>
        <!-- Theme toggle -->
        <button class="theme-toggle" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme"></button>
        <!-- Hamburger — module menu (all devices) -->
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
          <span class="ham-line"></span><span class="ham-line"></span><span class="ham-line"></span>
        </button>
      </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
      ${mobileProfileCard}
      <div class="mobile-links-wrap">${mobileHTML}</div>
    </div>`;

  document.body.insertAdjacentHTML('afterbegin', navHtml);
}

/* ── Footer ── */
function buildFooter() {
  const user = (typeof Auth !== 'undefined') ? Auth.getUser() : null;
  const isAdmin = user && (user.isAdmin || user.email === 'njugunaboniface211@gmail.com');
  const adminLink = isAdmin ? `<li><a href="admin.html">Admin Panel</a></li>` : '';

  document.body.insertAdjacentHTML('beforeend', `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-name">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            Savah<span>Lifestyle</span>
          </div>
          <p class="footer-brand-desc">Your all-in-one digital productivity hub — weather, tasks, finance, focus, health, games and more. Works offline too.</p>
          <div class="footer-social">
            <a href="https://facebook.com/savahvfx" class="social-link fb" title="Facebook" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="https://instagram.com/savahvfx" class="social-link ig" title="Instagram" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="https://tiktok.com/@savahvfx" class="social-link tt" title="TikTok" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.69a4.86 4.86 0 0 1-1-.0z"/></svg></a>
            <a href="https://youtube.com/@savahvfx" class="social-link yt" title="YouTube" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>
            <a href="https://x.com/savahvfx" class="social-link tw" title="X / Twitter" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </div>
        </div>
        <div>
          <div class="footer-col-title">Features</div>
          <ul class="footer-links">
            <li><a href="weather.html">Weather</a></li><li><a href="todo.html">Todo &amp; Tasks</a></li>
            <li><a href="habits.html">Habit Tracker</a></li><li><a href="expenses.html">Expense Manager</a></li>
            <li><a href="journal.html">Daily Journal</a></li><li><a href="goals.html">Goal Planner</a></li>
            <li><a href="focus.html">Focus Mode</a></li><li><a href="filezone.html">File Zone</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">Tools</div>
          <ul class="footer-links">
            <li><a href="music.html">Focus Music</a></li><li><a href="pomodoro.html">Pomodoro Timer</a></li>
            <li><a href="flashcards.html">Flashcards</a></li><li><a href="mindmap.html">Mind Map</a></li>
            <li><a href="whiteboard.html">Whiteboard</a></li><li><a href="puzzles.html">Games</a></li>
            <li><a href="passwordgen.html">Password Gen</a></li><li><a href="quicklinks.html">Quick Links</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-title">Company</div>
          <ul class="footer-links">
            <li><a href="about.html">About Us</a></li><li><a href="faq.html">FAQ</a></li>
            <li><a href="suggest.html">Suggest Feature</a></li><li><a href="profile.html">My Profile</a></li>
            <li><a href="settings.html">Settings</a></li><li><a href="privacy.html">Privacy Policy</a></li>
            <li><a href="terms.html">Terms of Service</a></li>${adminLink}
          </ul>
        </div>
      </div>
      <div class="footer-offline">
        <div class="footer-offline-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
          Works Offline
        </div>
        <div class="offline-tools">
          <a href="calculator.html" class="offline-badge">Calculator</a><a href="todo.html" class="offline-badge">Tasks</a>
          <a href="journal.html" class="offline-badge">Journal</a><a href="notes.html" class="offline-badge">Sticky Notes</a>
          <a href="passwordgen.html" class="offline-badge">Password Gen</a><a href="pomodoro.html" class="offline-badge">Pomodoro</a>
          <a href="whiteboard.html" class="offline-badge">Whiteboard</a><a href="flashcards.html" class="offline-badge">Flashcards</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; ${new Date().getFullYear()} SavahLifestyle. All rights reserved.</div>
        <div class="footer-bottom-links">
          <a href="privacy.html">Privacy</a><a href="terms.html">Terms</a>
          <a href="cookies.html">Cookies</a><a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </footer>`);
}

/* ── Nav User Init — runs after DOMContentLoaded ── */
function initNavUser() {
  /* Fix theme toggle — fresh bind */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const fresh = themeBtn.cloneNode(true);
    themeBtn.parentNode.replaceChild(fresh, themeBtn);
    fresh.addEventListener('click', e => { e.stopPropagation(); Theme.toggle(); });
    Theme.updateToggle(document.documentElement.getAttribute('data-theme'));
  }

  /* Clock (desktop only, hidden on mobile via CSS) */
  const navActions = document.getElementById('nav-actions');
  const clockEl = document.createElement('div');
  clockEl.id = 'nav-datetime';
  clockEl.className = 'nav-datetime';
  navActions.insertBefore(clockEl, navActions.firstChild);
  const tick = () => {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  };
  tick(); setInterval(tick, 1000);

  const user = Auth.getUser();
  const isAdmin = user && (user.isAdmin || user.email === 'njugunaboniface211@gmail.com');

  /* ── DESKTOP PROFILE AVATAR (slot before notifications) ── */
  const profileSlot = document.getElementById('nav-profile-slot');
  if (user) {
    const initials = (user.name||user.email||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const avatarInner = user.avatar
      ? `<img src="${user.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
      : `<span class="nav-av-initials">${initials}</span>`;

    const adminItem = isAdmin ? `
      <div class="nav-drop-divider"></div>
      <a href="admin.html" class="nav-drop-item" style="color:var(--purple)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Admin Panel
      </a>` : '';

    profileSlot.innerHTML = `
      <div class="nav-profile-wrap" id="nav-profile-wrap">
        <button class="nav-av-btn" id="nav-av-btn" title="${user.name||user.email}" aria-label="Account menu" aria-expanded="false">
          ${avatarInner}
        </button>
        <div class="nav-profile-dropdown" id="nav-profile-dropdown">
          <div class="nav-drop-header">
            <div class="nav-drop-av">${avatarInner}</div>
            <div>
              <div class="nav-drop-name">${user.name||'User'}</div>
              <div class="nav-drop-email">${user.email||''}</div>
            </div>
          </div>
          <a href="profile.html" class="nav-drop-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Profile
          </a>
          <a href="filezone.html" class="nav-drop-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            My Files
          </a>
          <a href="analytics.html" class="nav-drop-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Analytics
          </a>
          <a href="settings.html" class="nav-drop-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            Settings
          </a>
          ${adminItem}
          <div class="nav-drop-divider"></div>
          <button class="nav-drop-item nav-drop-danger" onclick="Auth.logout()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>`;

    document.getElementById('nav-av-btn').addEventListener('click', e => {
      e.stopPropagation();
      const dd = document.getElementById('nav-profile-dropdown');
      const isOpen = dd.classList.toggle('open');
      document.getElementById('nav-av-btn').setAttribute('aria-expanded', isOpen);
    });
  } else {
    /* Not logged in — show ghost avatar that links to login */
    profileSlot.innerHTML = `
      <a href="login.html" class="nav-av-btn nav-av-ghost" title="Sign in" aria-label="Sign in">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </a>`;
  }

  /* ── NOTIFICATIONS (second slot) ── */
  const notifSlot = document.getElementById('nav-notif-slot');
  notifSlot.innerHTML = `
    <div style="position:relative" id="notif-wrap">
      <button class="notif-btn" id="notif-btn" title="Notifications" aria-label="Notifications">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <span class="notif-badge" id="notif-badge"></span>
      </button>
      <div class="notif-panel" id="notif-panel">
        <div class="notif-head">
          <span>Notifications</span>
          <button onclick="Notifs.markAll()" style="background:none;border:none;font-size:0.75rem;color:var(--blue);cursor:pointer;font-family:var(--font-body)">Mark all read</button>
        </div>
        <div class="notif-list" id="notif-list"></div>
      </div>
    </div>`;
  document.getElementById('notif-btn').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('notif-panel').classList.toggle('open');
  });
  Notifs.init();

  /* ── Update mobile profile card ── */
  const mpRing    = document.getElementById('mobile-profile-ring');
  const mpAv      = document.getElementById('mobile-profile-avatar');
  const mpName    = document.getElementById('mobile-profile-name');
  const mpSub     = document.getElementById('mobile-profile-sub');
  const mpActions = document.getElementById('mobile-profile-actions');

  if (user) {
    const initials = (user.name||user.email||'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    if (user.avatar) {
      mpAv.innerHTML = `<img src="${user.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    } else {
      mpAv.innerHTML = `<span style="font-family:var(--font-head);font-size:1.5rem;font-weight:800;color:#fff;line-height:1">${initials}</span>`;
    }
    mpName.textContent = user.name || 'My Account';
    mpSub.textContent  = user.email || '';
    if (mpRing) mpRing.style.background = 'linear-gradient(135deg,var(--blue),var(--purple))';

    let actHTML = `
      <a href="profile.html" class="mobile-profile-btn mobile-profile-btn-primary">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        View Profile
      </a>
      <button class="mobile-profile-btn mobile-profile-btn-ghost" onclick="Auth.logout()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>`;
    if (isAdmin) {
      actHTML += `
      <a href="admin.html" class="mobile-profile-btn mobile-profile-btn-admin">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Admin Panel
      </a>`;
    }
    mpActions.innerHTML = actHTML;
  }

  /* ── Hamburger ── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
  }

  /* Close all on outside click */
  document.addEventListener('click', e => {
    if (!e.target.closest('#notif-panel') && !e.target.closest('#notif-btn'))
      document.getElementById('notif-panel')?.classList.remove('open');
    if (!e.target.closest('#nav-profile-dropdown') && !e.target.closest('#nav-av-btn')) {
      document.getElementById('nav-profile-dropdown')?.classList.remove('open');
      document.getElementById('nav-av-btn')?.setAttribute('aria-expanded','false');
    }
    if (!e.target.closest('#mobile-menu') && !e.target.closest('#hamburger')) {
      mobileMenu?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded','false');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => { initNavUser(); });

window.buildNav    = buildNav;
window.buildFooter = buildFooter;
window.initNavUser = initNavUser;
