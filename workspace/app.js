/* ============================================================
   CREATOR WORKSPACE PRO — app.js
   All logic: notes, editor, snippets, search, import/export,
   keyboard shortcuts, drag-drop, autosave, backup
   ============================================================ */

'use strict';

/* ── CONSTANTS ──────────────────────────────────────────── */
const WORKSPACES = ['scratch','research','ebook','ads','ideas','client'];
const WS_LABELS  = { scratch:'Scratch Pad', research:'Research', ebook:'Ebook', ads:'Ads', ideas:'Ideas', client:'Client' };
const LS = {
  NOTES:    'cwp_notes',
  SNIPPETS: 'cwp_snippets',
  HISTORY:  'cwp_history',
  PREFS:    'cwp_prefs',
  BACKUP:   'cwp_backup',
};

const DEFAULT_SNIPPETS = [
  { id: uid(), name: '[CTA]', body: 'Click the button below to get instant access →', fav: false },
  { id: uid(), name: '[Facebook Ad]', body: '🔥 Attention [AUDIENCE]!\nAre you tired of [PROBLEM]?\nDiscover how [SOLUTION] can change everything.\n👇 Tap below to learn more.', fav: false },
  { id: uid(), name: '[Offer Stack]', body: '✅ You\'ll get:\n• [Bonus 1] (worth $X)\n• [Bonus 2] (worth $X)\n• [Bonus 3] (worth $X)\n\nTotal value: $XXX | Your price: $XX', fav: false },
  { id: uid(), name: '[Guarantee]', body: '100% Money-Back Guarantee\nIf you\'re not completely satisfied within 30 days, we\'ll refund every penny. No questions asked.', fav: false },
];

/* ── STATE ──────────────────────────────────────────────── */
let notes     = [];
let snippets  = [];
let history   = [];
let prefs     = { dark: true, autosave: true };
let activeNoteId   = null;
let currentView    = 'dashboard';
let currentWorkspace = 'scratch';
let autoSaveTimer  = null;
let backupTimer    = null;
let isDirty        = false;

/* ── UTILITIES ──────────────────────────────────────────── */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}
function now() {
  return new Date().toISOString();
}
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' })
       + ' ' + d.toLocaleTimeString(undefined, { hour:'2-digit', minute:'2-digit' });
}
function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || d.innerText || '';
}
function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function charCount(text) { return text.length; }
function paraCount(text) { return text.split(/\n\n+/).filter(Boolean).length; }
function sentCount(text) { return (text.match(/[.!?]+/g) || []).length; }
function readTime(wc)  { return Math.max(1, Math.ceil(wc / 238)); }
function speakTime(wc) { return Math.max(1, Math.ceil(wc / 130)); }

function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { toast('⚠ Storage limit reached!'); }
}
function load(key, def) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : def;
  } catch { return def; }
}

function toast(msg, dur=2500) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), dur);
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  buildWorkspaceViews();
  renderSidebar();
  attachNav();
  attachTopbar();
  attachEditor();
  attachMeta();
  attachSnippets();
  attachSettings();
  attachSearch();
  attachKeyboard();
  attachFindReplace();
  attachModals();
  attachMobileMenu();
  applyPrefs();
  navigateTo('dashboard');
  startAutoSave();
  startAutoBackup();
  refreshDashboard();
});

/* ── LOAD / SAVE STATE ──────────────────────────────────── */
function loadState() {
  notes    = load(LS.NOTES, []);
  snippets = load(LS.SNIPPETS, DEFAULT_SNIPPETS);
  history  = load(LS.HISTORY, []);
  prefs    = load(LS.PREFS, { dark: true, autosave: true });
}
function saveNotes()    { save(LS.NOTES, notes); }
function saveSnippets() { save(LS.SNIPPETS, snippets); }
function saveHistory()  { save(LS.HISTORY, history.slice(0,100)); }
function savePrefs()    { save(LS.PREFS, prefs); }

/* ── BUILD WORKSPACE VIEWS ──────────────────────────────── */
function buildWorkspaceViews() {
  const template = document.getElementById('view-scratch');
  WORKSPACES.filter(w => w !== 'scratch').forEach(ws => {
    const sec = document.getElementById(`view-${ws}`);
    sec.innerHTML = template.innerHTML
      .replace(/id="list-scratch"/g, `id="list-${ws}"`)
      .replace(/data-workspace="scratch"/g, `data-workspace="${ws}"`)
      .replace(/id="new-scratch"/g, `id="new-${ws}"`);
    // Wire up the new-note button
    sec.querySelector(`[id="new-${ws}"]`).addEventListener('click', () => createNote(ws));
  });
  // Wire scratch new-note button
  document.getElementById('new-scratch').addEventListener('click', () => createNote('scratch'));

  // All workspace views share the editor — clicking a note card opens it in the shared editor area
  WORKSPACES.forEach(ws => {
    const list = document.getElementById(`list-${ws}`);
    if (list) list.addEventListener('click', e => {
      const card = e.target.closest('.note-card');
      if (card) openNote(card.dataset.id);
    });
  });

  // Rich toolbar (shared, in scratch — cloned for others by innerHTML)
  wireToolbar(template.querySelector('#rich-toolbar'));
  WORKSPACES.filter(w => w !== 'scratch').forEach(ws => {
    const tb = document.getElementById(`view-${ws}`).querySelector('#rich-toolbar');
    if (tb) wireToolbar(tb);
  });
}

function wireToolbar(toolbar) {
  if (!toolbar) return;
  toolbar.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd  = btn.dataset.cmd;
      const val  = btn.dataset.val || null;
      document.execCommand(cmd, false, val);
      getEditor().focus();
      onEditorChange();
    });
  });
  const findReplBtn = toolbar.querySelector('#btn-find-replace');
  if (findReplBtn) findReplBtn.addEventListener('click', () => openModal('modal-find-replace'));
  const tableBtn = toolbar.querySelector('#btn-table');
  if (tableBtn) tableBtn.addEventListener('click', () => {
    const html = '<table><tr><th>Col 1</th><th>Col 2</th></tr><tr><td>Data</td><td>Data</td></tr></table>';
    document.execCommand('insertHTML', false, html);
    getEditor().focus();
  });
  const linkBtn = toolbar.querySelector('#btn-link');
  if (linkBtn) linkBtn.addEventListener('click', () => {
    const url = prompt('Enter URL:');
    if (url) { document.execCommand('createLink', false, url); getEditor().focus(); }
  });
}

/* ── NAVIGATION ─────────────────────────────────────────── */
function attachNav() {
  document.querySelectorAll('.nav-item').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(a.dataset.view);
      closeMobileMenu();
    });
  });
}

function navigateTo(view) {
  currentView = view;
  document.querySelectorAll('.nav-item').forEach(a => a.classList.toggle('active', a.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(`view-${view}`);
  if (target) target.classList.add('active');

  if (WORKSPACES.includes(view)) {
    currentWorkspace = view;
    renderNotesList(view);
  } else if (view === 'favorites') {
    renderFavorites();
  } else if (view === 'pinned') {
    renderPinned();
  } else if (view === 'history') {
    renderHistory();
  } else if (view === 'snippets') {
    renderSnippets();
  } else if (view === 'dashboard') {
    refreshDashboard();
  }
}

/* ── TOP BAR ────────────────────────────────────────────── */
function attachTopbar() {
  document.getElementById('btn-new-note').addEventListener('click', () => {
    const ws = WORKSPACES.includes(currentView) ? currentView : 'scratch';
    navigateTo(ws);
    createNote(ws);
  });
  document.getElementById('btn-export-all').addEventListener('click', exportAllNotes);
  document.getElementById('btn-import').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', handleImport);
}

/* ── NOTE CRUD ──────────────────────────────────────────── */
function createNote(ws) {
  const note = {
    id: uid(),
    title: 'Untitled Note',
    content: '',
    workspace: ws,
    created: now(),
    modified: now(),
    pinned: false,
    favorited: false,
    archived: false,
  };
  notes.unshift(note);
  saveNotes();
  renderNotesList(ws);
  openNote(note.id);
  addHistory('created', note);
  refreshDashboard();
  toast('✨ New note created');
}

function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  activeNoteId = id;
  const editor = getEditor();
  document.getElementById('note-title').value = note.title;
  editor.innerHTML = note.content || '<p><br></p>';
  updateMeta(note);
  updateStats();
  highlightActiveCard(id);
}

function getActiveNote() {
  return notes.find(n => n.id === activeNoteId);
}

function saveCurrentNote() {
  const note = getActiveNote();
  if (!note) return;
  note.title    = document.getElementById('note-title').value || 'Untitled Note';
  note.content  = getEditor().innerHTML;
  note.modified = now();
  saveNotes();
  updateMeta(note);
  renderNotesList(note.workspace);
  refreshDashboard();
  isDirty = false;
  document.getElementById('save-status').textContent = 'All saved ✓';
  addHistory('saved', note);
}

function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  notes = notes.filter(n => n.id !== id);
  saveNotes();
  activeNoteId = null;
  getEditor().innerHTML = '<p>Select or create a note to begin…</p>';
  document.getElementById('note-title').value = '';
  renderNotesList(currentWorkspace);
  refreshDashboard();
  toast('🗑 Note deleted');
}

function duplicateNote(id) {
  const src = notes.find(n => n.id === id);
  if (!src) return;
  const copy = { ...src, id: uid(), title: src.title + ' (copy)', created: now(), modified: now() };
  notes.unshift(copy);
  saveNotes();
  renderNotesList(currentWorkspace);
  openNote(copy.id);
  toast('⧉ Note duplicated');
}

function toggleFavorite(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  note.favorited = !note.favorited;
  saveNotes();
  renderNotesList(note.workspace);
  updateMeta(note);
  toast(note.favorited ? '⭐ Added to favorites' : '☆ Removed from favorites');
}

function togglePin(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  note.pinned = !note.pinned;
  saveNotes();
  renderNotesList(note.workspace);
  updateMeta(note);
  toast(note.pinned ? '📌 Note pinned' : '📌 Note unpinned');
}

function archiveNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  note.archived = !note.archived;
  saveNotes();
  renderNotesList(note.workspace);
  activeNoteId = null;
  toast(note.archived ? '📦 Note archived' : '♻ Note restored');
}

function copyNoteContent(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  const text = stripHtml(note.content);
  navigator.clipboard.writeText(text).then(() => toast('📋 Copied to clipboard'));
  addHistory('copied', note);
}

/* ── RENDER NOTES LIST ──────────────────────────────────── */
function renderNotesList(ws) {
  const list = document.getElementById(`list-${ws}`);
  if (!list) return;
  const wsNotes = notes.filter(n => n.workspace === ws && !n.archived)
    .sort((a,b) => (b.pinned - a.pinned) || (new Date(b.modified) - new Date(a.modified)));

  if (!wsNotes.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📄</div>No notes yet. Create one!</div>`;
    return;
  }
  list.innerHTML = wsNotes.map(n => `
    <div class="note-card ${n.id === activeNoteId ? 'active' : ''} ${n.pinned ? 'pinned' : ''} ${n.favorited ? 'favorited' : ''}"
         data-id="${n.id}" draggable="true">
      <div class="note-card-title">${escHtml(n.title)}</div>
      <div class="note-card-meta">${fmtDate(n.modified)} · ${wordCount(stripHtml(n.content))}w</div>
    </div>
  `).join('');

  // Drag-drop
  list.querySelectorAll('.note-card').forEach(card => {
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('note-id', card.dataset.id);
    });
    card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag-over'); });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const draggedId = e.dataTransfer.getData('note-id');
      if (draggedId === card.dataset.id) return;
      const draggedNote = notes.find(n => n.id === draggedId);
      const targetNote  = notes.find(n => n.id === card.dataset.id);
      if (draggedNote && targetNote) {
        const di = notes.indexOf(draggedNote);
        const ti = notes.indexOf(targetNote);
        notes.splice(di, 1);
        notes.splice(ti, 0, draggedNote);
        saveNotes();
        renderNotesList(ws);
      }
    });
  });
}

function highlightActiveCard(id) {
  document.querySelectorAll('.note-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
}

/* ── EDITOR ─────────────────────────────────────────────── */
function getEditor() {
  // Find the editor in the active view
  const activeView = document.querySelector('.view.active');
  if (!activeView) return document.getElementById('editor');
  return activeView.querySelector('.rich-editor') || document.getElementById('editor');
}

function attachEditor() {
  // Delegate to active view's editor
  document.addEventListener('input', e => {
    if (e.target.classList.contains('rich-editor') || e.target.id === 'note-title') {
      onEditorChange();
    }
  });
}

function onEditorChange() {
  isDirty = true;
  document.getElementById('save-status').textContent = 'Unsaved…';
  updateStats();
}

function updateStats() {
  const text = stripHtml(getEditor()?.innerHTML || '');
  const wc   = wordCount(text);
  document.getElementById('stat-words').textContent  = `${wc} words`;
  document.getElementById('stat-chars').textContent  = `${charCount(text)} chars`;
  document.getElementById('stat-paras').textContent  = `${paraCount(text)} paras`;
  document.getElementById('stat-read').textContent   = `~${readTime(wc)} min read`;
  document.getElementById('stat-speak').textContent  = `~${speakTime(wc)} min speak`;
}

/* ── META PANEL ─────────────────────────────────────────── */
function updateMeta(note) {
  document.getElementById('meta-created').textContent   = fmtDate(note.created);
  document.getElementById('meta-modified').textContent  = fmtDate(note.modified);
  document.getElementById('meta-workspace').textContent = WS_LABELS[note.workspace] || note.workspace;
}

function attachMeta() {
  document.getElementById('btn-save').addEventListener('click',     () => saveCurrentNote());
  document.getElementById('btn-duplicate').addEventListener('click',() => activeNoteId && duplicateNote(activeNoteId));
  document.getElementById('btn-copy-note').addEventListener('click',() => activeNoteId && copyNoteContent(activeNoteId));
  document.getElementById('btn-favorite').addEventListener('click', () => activeNoteId && toggleFavorite(activeNoteId));
  document.getElementById('btn-pin').addEventListener('click',      () => activeNoteId && togglePin(activeNoteId));
  document.getElementById('btn-archive').addEventListener('click',  () => activeNoteId && archiveNote(activeNoteId));
  document.getElementById('btn-delete').addEventListener('click',   () => activeNoteId && deleteNote(activeNoteId));

  document.getElementById('btn-exp-txt').addEventListener('click',  () => exportNote('txt'));
  document.getElementById('btn-exp-md').addEventListener('click',   () => exportNote('md'));
  document.getElementById('btn-exp-html').addEventListener('click', () => exportNote('html'));
  document.getElementById('btn-exp-json').addEventListener('click', () => exportNote('json'));
}

/* ── EXPORT / IMPORT ────────────────────────────────────── */
function exportNote(format) {
  const note = getActiveNote();
  if (!note) return toast('No note selected');
  const title = note.title.replace(/[^a-z0-9]/gi, '_');
  let content, mime, ext;
  const plain = stripHtml(note.content);
  switch (format) {
    case 'txt':  content = `${note.title}\n\n${plain}`;  mime = 'text/plain'; ext = 'txt'; break;
    case 'md':   content = `# ${note.title}\n\n${plain}`; mime = 'text/markdown'; ext = 'md'; break;
    case 'html': content = `<!DOCTYPE html><html><head><title>${escHtml(note.title)}</title></head><body><h1>${escHtml(note.title)}</h1>${note.content}</body></html>`; mime = 'text/html'; ext = 'html'; break;
    case 'json': content = JSON.stringify(note, null, 2); mime = 'application/json'; ext = 'json'; break;
  }
  downloadFile(`${title}.${ext}`, content, mime);
  toast(`✅ Exported as .${ext}`);
}

function exportAllNotes() {
  const data = JSON.stringify({ notes, snippets, exportedAt: now() }, null, 2);
  downloadFile('creator-workspace-backup.json', data, 'application/json');
  toast('✅ All notes exported');
}

function downloadFile(name, content, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name;
  a.click();
}

function handleImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      if (file.name.endsWith('.json')) {
        const data = JSON.parse(ev.target.result);
        if (data.notes) {
          notes = [...data.notes, ...notes];
          saveNotes();
          navigateTo(currentView);
          refreshDashboard();
          toast(`✅ Imported ${data.notes.length} notes`);
        }
      } else {
        const ws = WORKSPACES.includes(currentWorkspace) ? currentWorkspace : 'scratch';
        const note = {
          id: uid(), title: file.name.replace(/\.[^.]+$/, ''),
          content: `<p>${ev.target.result.replace(/\n/g, '</p><p>')}</p>`,
          workspace: ws, created: now(), modified: now(),
          pinned: false, favorited: false, archived: false,
        };
        notes.unshift(note);
        saveNotes();
        renderNotesList(ws);
        openNote(note.id);
        toast('✅ Text file imported as note');
      }
    } catch { toast('⚠ Import failed — invalid file'); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

/* ── SEARCH ─────────────────────────────────────────────── */
function attachSearch() {
  const input = document.getElementById('global-search');
  const results = document.getElementById('search-results');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.add('hidden'); return; }
    const scope  = document.getElementById('search-scope').value;
    let pool = notes.filter(n => !n.archived);
    if (scope === 'current') pool = pool.filter(n => n.workspace === currentWorkspace);
    else if (scope === 'favorites') pool = pool.filter(n => n.favorited);
    else if (scope === 'pinned')    pool = pool.filter(n => n.pinned);
    const hits = pool.filter(n =>
      n.title.toLowerCase().includes(q) || stripHtml(n.content).toLowerCase().includes(q)
    ).slice(0, 20);
    if (!hits.length) {
      results.innerHTML = '<div class="empty-state">No results found.</div>';
    } else {
      results.innerHTML = hits.map(n => `
        <div class="search-result-item" data-id="${n.id}" data-ws="${n.workspace}">
          <span class="sr-ws">${WS_LABELS[n.workspace]}</span>
          <span class="sr-title">${escHtml(n.title)}</span>
          <span class="sr-preview">${escHtml(stripHtml(n.content).slice(0,100))}</span>
        </div>
      `).join('');
      results.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          navigateTo(item.dataset.ws);
          setTimeout(() => openNote(item.dataset.id), 50);
          results.classList.add('hidden');
          input.value = '';
        });
      });
    }
    results.classList.remove('hidden');
  });
  document.addEventListener('click', e => {
    if (!results.contains(e.target) && e.target !== input) results.classList.add('hidden');
  });
  input.addEventListener('keydown', e => { if (e.key === 'Escape') { results.classList.add('hidden'); input.value = ''; } });
}

/* ── FIND & REPLACE ─────────────────────────────────────── */
function attachFindReplace() {
  document.getElementById('fr-find-next').addEventListener('click', frFindNext);
  document.getElementById('fr-replace-one').addEventListener('click', frReplaceOne);
  document.getElementById('fr-replace-all').addEventListener('click', frReplaceAll);
}

function getFrOpts() {
  return {
    find:    document.getElementById('fr-find').value,
    replace: document.getElementById('fr-replace').value,
    caseSensitive: document.getElementById('fr-case').checked,
    whole:   document.getElementById('fr-whole').checked,
  };
}
function frFindNext() {
  const { find, caseSensitive } = getFrOpts();
  if (!find) return;
  window.find(find, caseSensitive);
}
function frReplaceOne() {
  const { find, replace, caseSensitive } = getFrOpts();
  if (!find) return;
  const ed = getEditor();
  const html = ed.innerHTML;
  const flags = caseSensitive ? 'g' : 'gi';
  const re = new RegExp(escapeRegex(find), flags);
  ed.innerHTML = html.replace(re, (m, offset) => {
    // Replace only first occurrence in plain text
    return replace;
  });
  onEditorChange();
}
function frReplaceAll() {
  const { find, replace, caseSensitive } = getFrOpts();
  if (!find) return;
  const ed = getEditor();
  const flags = caseSensitive ? 'g' : 'gi';
  const re = new RegExp(escapeRegex(find), flags);
  ed.innerHTML = ed.innerHTML.replace(re, replace);
  onEditorChange();
  toast(`Replaced all occurrences of "${find}"`);
}
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

/* ── KEYBOARD SHORTCUTS ─────────────────────────────────── */
function attachKeyboard() {
  document.addEventListener('keydown', e => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && e.key === 's') { e.preventDefault(); saveCurrentNote(); }
    if (ctrl && e.key === 'n') { e.preventDefault(); document.getElementById('btn-new-note').click(); }
    if (ctrl && e.key === 'd') { e.preventDefault(); activeNoteId && duplicateNote(activeNoteId); }
    if (ctrl && e.key === 'f') { e.preventDefault(); document.getElementById('global-search').focus(); }
    if (ctrl && e.key === 'h') { e.preventDefault(); openModal('modal-find-replace'); }
    if (ctrl && e.key === 'b') { if (e.target.closest('.rich-editor')) { e.preventDefault(); document.execCommand('bold',false,null); } }
    if (ctrl && e.key === 'i') { if (e.target.closest('.rich-editor')) { e.preventDefault(); document.execCommand('italic',false,null); } }
  });
}

/* ── AUTOSAVE & BACKUP ──────────────────────────────────── */
function startAutoSave() {
  setInterval(() => {
    if (prefs.autosave && isDirty && activeNoteId) {
      saveCurrentNote();
    }
  }, 4000);
}
function startAutoBackup() {
  setInterval(() => {
    const bk = JSON.stringify({ notes, snippets, backedUpAt: now() });
    save(LS.BACKUP, bk);
  }, 5 * 60 * 1000);
}

/* ── SNIPPETS ───────────────────────────────────────────── */
function attachSnippets() {
  document.getElementById('btn-add-snippet').addEventListener('click', () => {
    const name = document.getElementById('snippet-name').value.trim();
    const body = document.getElementById('snippet-body').value.trim();
    if (!name || !body) return toast('⚠ Name and content required');
    snippets.unshift({ id: uid(), name, body, fav: false });
    saveSnippets();
    renderSnippets();
    document.getElementById('snippet-name').value = '';
    document.getElementById('snippet-body').value = '';
    refreshDashboard();
    toast('⚡ Snippet added');
  });
}

function renderSnippets() {
  const grid = document.getElementById('snippets-list');
  if (!snippets.length) { grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">⚡</div>No snippets yet</div>'; return; }
  grid.innerHTML = snippets.map(s => `
    <div class="snippet-card" data-id="${s.id}">
      <div class="snippet-name">${escHtml(s.name)}</div>
      <div class="snippet-body-preview">${escHtml(s.body)}</div>
      <div class="snippet-actions">
        <button class="snip-insert">Insert</button>
        <button class="snip-copy">Copy</button>
        <button class="snip-fav">${s.fav ? '⭐' : '☆'}</button>
        <button class="snip-del danger">Del</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.snippet-card').forEach(card => {
    const id = card.dataset.id;
    card.querySelector('.snip-insert').addEventListener('click', () => {
      const s = snippets.find(x => x.id === id);
      if (!s) return;
      const ed = getEditor();
      ed.focus();
      document.execCommand('insertText', false, s.body);
      onEditorChange();
      addHistory('snippet', { title: s.name, workspace: currentWorkspace, content: s.body });
      toast(`⚡ "${s.name}" inserted`);
    });
    card.querySelector('.snip-copy').addEventListener('click', () => {
      const s = snippets.find(x => x.id === id);
      if (!s) return;
      navigator.clipboard.writeText(s.body).then(() => toast('📋 Snippet copied'));
    });
    card.querySelector('.snip-fav').addEventListener('click', () => {
      const s = snippets.find(x => x.id === id);
      if (!s) return;
      s.fav = !s.fav;
      saveSnippets();
      renderSnippets();
      toast(s.fav ? '⭐ Snippet favorited' : '☆ Unfavorited');
    });
    card.querySelector('.snip-del').addEventListener('click', () => {
      if (!confirm('Delete snippet?')) return;
      snippets = snippets.filter(x => x.id !== id);
      saveSnippets();
      renderSnippets();
      refreshDashboard();
      toast('🗑 Snippet deleted');
    });
  });
}

/* ── FAVORITES & PINNED ─────────────────────────────────── */
function renderFavorites() {
  const list = document.getElementById('favorites-list');
  const favs = notes.filter(n => n.favorited && !n.archived);
  renderGridNotes(list, favs, '⭐ No favorites yet');
}

function renderPinned() {
  const list = document.getElementById('pinned-list');
  const pins = notes.filter(n => n.pinned && !n.archived);
  renderGridNotes(list, pins, '📌 No pinned notes yet');
}

function renderGridNotes(container, arr, emptyMsg) {
  if (!arr.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">${emptyMsg.slice(0,2)}</div>${emptyMsg}</div>`;
    return;
  }
  container.innerHTML = arr.map(n => `
    <div class="grid-note-card" data-id="${n.id}" data-ws="${n.workspace}">
      <div class="grid-note-ws">${WS_LABELS[n.workspace]}</div>
      <div class="grid-note-title">${escHtml(n.title)}</div>
      <div class="grid-note-preview">${escHtml(stripHtml(n.content).slice(0,180))}</div>
      <div class="grid-note-meta">${fmtDate(n.modified)} · ${wordCount(stripHtml(n.content))}w</div>
    </div>
  `).join('');
  container.querySelectorAll('.grid-note-card').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(card.dataset.ws);
      setTimeout(() => openNote(card.dataset.id), 60);
    });
  });
}

/* ── HISTORY ────────────────────────────────────────────── */
function addHistory(action, note) {
  history.unshift({ id: uid(), action, ts: now(), noteTitle: note.title || 'Untitled', workspace: note.workspace || currentWorkspace, preview: stripHtml(note.content || '').slice(0,80) });
  if (history.length > 100) history.pop();
  saveHistory();
}

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!history.length) { list.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📜</div>No history yet</div>'; return; }
  list.innerHTML = history.map(h => `
    <div class="history-item">
      <span class="history-ts">${fmtDate(h.ts)}</span>
      <span class="history-ws">${WS_LABELS[h.workspace] || h.workspace}</span>
      <span class="history-preview">${escHtml(h.noteTitle)} — ${escHtml(h.preview)}</span>
    </div>
  `).join('');
}

/* ── SETTINGS ───────────────────────────────────────────── */
function attachSettings() {
  const darkChk = document.getElementById('pref-dark');
  const asChk   = document.getElementById('pref-autosave');
  darkChk.checked = prefs.dark !== false;
  asChk.checked   = prefs.autosave !== false;
  darkChk.addEventListener('change', () => { prefs.dark = darkChk.checked; savePrefs(); applyPrefs(); });
  asChk.addEventListener('change',   () => { prefs.autosave = asChk.checked; savePrefs(); });

  document.getElementById('btn-backup').addEventListener('click', () => {
    const bk = JSON.stringify({ notes, snippets, backedUpAt: now() }, null, 2);
    downloadFile('cwp-backup-' + Date.now() + '.json', bk, 'application/json');
    toast('📦 Backup downloaded');
  });
  document.getElementById('btn-restore').addEventListener('click', () => document.getElementById('restore-file').click());
  document.getElementById('restore-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.notes) { notes = data.notes; saveNotes(); }
        if (data.snippets) { snippets = data.snippets; saveSnippets(); }
        refreshDashboard();
        toast('✅ Backup restored');
      } catch { toast('⚠ Invalid backup file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('btn-export-all-json').addEventListener('click', exportAllNotes);
  document.getElementById('btn-export-favs').addEventListener('click', () => {
    const favs = notes.filter(n => n.favorited);
    downloadFile('cwp-favorites.json', JSON.stringify(favs, null, 2), 'application/json');
    toast('⭐ Favorites exported');
  });
  document.getElementById('btn-clear-all').addEventListener('click', () => {
    if (!confirm('This will erase ALL notes, snippets, and history. Are you sure?')) return;
    notes = []; snippets = DEFAULT_SNIPPETS; history = [];
    saveNotes(); saveSnippets(); saveHistory();
    activeNoteId = null;
    refreshDashboard();
    navigateTo('dashboard');
    toast('🗑 All data cleared');
  });

  document.getElementById('theme-toggle').addEventListener('click', () => {
    prefs.dark = !prefs.dark;
    savePrefs();
    applyPrefs();
  });
}

function applyPrefs() {
  document.documentElement.setAttribute('data-theme', prefs.dark ? 'dark' : 'light');
  document.getElementById('theme-icon').textContent = prefs.dark ? '☀️' : '🌙';
  const darkChk = document.getElementById('pref-dark');
  if (darkChk) darkChk.checked = prefs.dark;
}

/* ── DASHBOARD ──────────────────────────────────────────── */
function refreshDashboard() {
  WORKSPACES.forEach(ws => {
    const el = document.getElementById(`count-${ws}`);
    if (el) el.textContent = notes.filter(n => n.workspace === ws && !n.archived).length + ' notes';
  });
  document.getElementById('stat-total').textContent = notes.filter(n => !n.archived).length;
  document.getElementById('stat-favs').textContent  = notes.filter(n => n.favorited).length;
  document.getElementById('stat-pins').textContent  = notes.filter(n => n.pinned).length;
  document.getElementById('stat-snips').textContent = snippets.length;

  const recent = [...notes].filter(n => !n.archived).sort((a,b) => new Date(b.modified) - new Date(a.modified)).slice(0,6);
  const rl = document.getElementById('recent-notes-list');
  if (!recent.length) { rl.innerHTML = '<div class="empty-state">No notes yet</div>'; return; }
  rl.innerHTML = recent.map(n => `
    <div class="recent-item" data-id="${n.id}" data-ws="${n.workspace}">
      <span class="recent-item-ws">${WS_LABELS[n.workspace]}</span>
      <span class="recent-item-title">${escHtml(n.title)}</span>
    </div>
  `).join('');
  rl.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.ws);
      setTimeout(() => openNote(item.dataset.id), 60);
    });
  });

  // Dashboard cards
  document.querySelectorAll('.dash-card[data-view]').forEach(card => {
    card.onclick = () => navigateTo(card.dataset.view);
  });
}

/* ── MODALS ─────────────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}
function attachModals() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal));
  });
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
  });
}

/* ── MOBILE MENU ────────────────────────────────────────── */
function attachMobileMenu() {
  document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('open');
  });
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileMenu);
}
function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

/* ── ESCAPE HTML ────────────────────────────────────────── */
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
