/**
 * CREATOR WORKSPACE PRO — CORE APPLICATION ENGINE
 * Pure Vanilla JavaScript Production Engine Framework
 */

document.addEventListener('DOMContentLoaded', () => {
    // STATE CONFIGURATION MATRIX
    let state = {
        notes: [],
        categories: [],
        activeNoteId: null,
        history: { copied: [], drafts: [], snippets: [] },
        theme: 'dark',
        filter: 'all',
        searchTerm: ''
    };

    const STORAGE_KEY = 'CWP_APPLICATION_STATE_DATA';
    let undoStack = [];
    let redoStack = [];
    const MAX_STACK_DEPTH = 50;

    const editorCore = document.getElementById('editor-core');
    const activeNoteTitle = document.getElementById('active-note-title');
    const lastSavedStamp = document.getElementById('last-saved-stamp');
    const autosaveIndicator = document.getElementById('autosave-indicator');
    const selectNoteCategory = document.getElementById('select-note-category');
    const activeCatBadge = document.getElementById('active-note-category-badge');
    const notesDeck = document.getElementById('notes-deck');
    const categoryList = document.getElementById('category-list');
    const countAll = document.getElementById('count-all');
    const countPinned = document.getElementById('count-pinned');
    const countArchived = document.getElementById('count-archived');

    function initApplication() {
        const persistedData = localStorage.getItem(STORAGE_KEY);
        if (persistedData) {
            try {
                state = JSON.parse(persistedData);
                if (!state.history) state.history = { copied: [], drafts: [], snippets: [] };
                if (!state.categories) state.categories = [];
            } catch (e) {
                console.error("Hydration Error: State parsing reset required.", e);
                seedDefaultState();
            }
        } else {
            seedDefaultState();
        }

        applyTheme(state.theme || 'dark');
        renderCategories();
        renderNotesDeck();
        setupEventListeners();
        
        if (state.activeNoteId) {
            loadActiveNote(state.activeNoteId, false);
        } else if (state.notes.length > 0) {
            loadActiveNote(state.notes[0].id, false);
        } else {
            createNewNote("Welcome to your Command Center", "Start drafting ideas here...");
        }

        setInterval(triggerAutosaveLoop, 4000); 
        setInterval(triggerSystemBackupSnapshot, 300000);
        updateMetrics();
    }

    function seedDefaultState() {
        state.categories = [
            { id: 'cat-1', name: '🚀 Content Strategy' },
            { id: 'cat-2', name: '💡 AI Prompt Vault' },
            { id: 'cat-3', name: '📝 Longform Drafts' }
        ];
        state.notes = [
            {
                id: 'note-default-1',
                title: 'Welcome to Creator Workspace Pro',
                content: '<h1>Your Content Command Center is Ready</h1><p>This premium SaaS environment runs entirely locally in your browser. All your intellectual property remains private and stored inside your sandbox ecosystem.</p>',
                categoryId: 'cat-1',
                pinned: true,
                archived: false,
                created: new Date().toISOString(),
                modified: new Date().toISOString()
            }
        ];
        state.activeNoteId = 'note-default-1';
        saveStateToLocalStorage();
    }

    function saveStateToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function applyTheme(themeName) {
        state.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        saveStateToLocalStorage();
    }

    function renderNotesDeck() {
        notesDeck.innerHTML = '';
        let processedNotes = [...state.notes];

        if (state.searchTerm.trim() !== '') {
            const query = state.searchTerm.toLowerCase();
            processedNotes = processedNotes.filter(n => 
                n.title.toLowerCase().includes(query) || 
                n.content.toLowerCase().includes(query)
            );
        }

        if (state.filter === 'pinned') {
            processedNotes = processedNotes.filter(n => n.pinned && !n.archived);
        } else if (state.filter === 'archived') {
            processedNotes = processedNotes.filter(n => n.archived);
        } else if (state.filter.startsWith('cat-')) {
            const cId = state.filter.replace('cat-', '');
            processedNotes = processedNotes.filter(n => n.categoryId === cId && !n.archived);
        } else {
            processedNotes = processedNotes.filter(n => !n.archived);
        }

        processedNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.modified) - new Date(a.modified);
        });

        countAll.textContent = state.notes.filter(n => !n.archived).length;
        countPinned.textContent = state.notes.filter(n => n.pinned && !n.archived).length;
        countArchived.textContent = state.notes.filter(n => n.archived).length;

        if (processedNotes.length === 0) {
            notesDeck.innerHTML = '<div class="save-indicator" style="padding:20px; text-align:center;">No documents match view criteria.</div>';
            return;
        }

        processedNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${note.id === state.activeNoteId ? 'active' : ''}`;
            card.dataset.id = note.id;

            const textView = document.createElement('div');
            textView.innerHTML = note.content;
            const plainTextExcerpt = textView.textContent || textView.innerText || '';

            card.innerHTML = `
                ${note.pinned ? '<span class="note-card-pin-indicator">📌</span>' : ''}
                <div class="note-card-title">${escapeHTML(note.title || 'Untitled Document')}</div>
                <div class="note-card-excerpt">${escapeHTML(plainTextExcerpt || 'No additional content...')}</div>
                <div class="note-card-meta">
                    <span>✏️ ${formatRelativeTimestamp(note.modified)}</span>
                </div>
            `;

            card.addEventListener('click', () => loadActiveNote(note.id));
            notesDeck.appendChild(card);
        });
    }

    function renderCategories() {
        categoryList.innerHTML = '';
        selectNoteCategory.innerHTML = '<option value="">Uncategorized</option>';

        state.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            selectNoteCategory.appendChild(option);

            const li = document.createElement('li');
            li.className = `category-item ${state.filter === `cat-${cat.id}` ? 'active' : ''}`;
            li.dataset.catId = cat.id;
            li.innerHTML = `
                <span>${escapeHTML(cat.name)}</span>
                <div class="category-actions">
                    <button class="btn-text btn-cat-rename">✏️</button>
                    <button class="btn-text btn-cat-delete">❌</button>
                </div>
            `;
            
            li.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-cat-rename') || e.target.classList.contains('btn-cat-delete')) return;
                state.filter = `cat-${cat.id}`;
                document.querySelectorAll('.filter-item').forEach(i => i.classList.remove('active'));
                renderCategories();
                renderNotesDeck();
            });

            categoryList.appendChild(li);
        });
        
        const currentNote = state.notes.find(n => n.id === state.activeNoteId);
        if (currentNote) selectNoteCategory.value = currentNote.categoryId || '';
    }

    function createNewNote(title = "Untitled Document", content = "") {
        const newId = 'note-' + Date.now();
        const targetCategory = state.filter.startsWith('cat-') ? state.filter.replace('cat-', '') : '';
        
        const freshNote = {
            id: newId,
            title: title,
            content: content,
            categoryId: targetCategory,
            pinned: false,
            archived: false,
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };

        state.notes.unshift(freshNote);
        state.activeNoteId = newId;
        
        appendHistoryRecord('drafts', `Generated workspace vector: [${title}]`);
        saveStateToLocalStorage();
        renderNotesDeck();
        loadActiveNote(newId, true);
    }

    function loadActiveNote(id, resetUndoStack = true) {
        const targetNote = state.notes.find(n => n.id === id);
        if (!targetNote) return;

        state.activeNoteId = id;
        activeNoteTitle.value = targetNote.title;
        editorCore.innerHTML = targetNote.content;
        selectNoteCategory.value = targetNote.categoryId || '';

        const currentCat = state.categories.find(c => c.id === targetNote.categoryId);
        activeCatBadge.textContent = currentCat ? currentCat.name : 'Uncategorized';
        
        document.getElementById('btn-pin-active').style.borderColor = targetNote.pinned ? 'var(--pinned-color)' : 'var(--border-color)';
        document.getElementById('btn-archive-active').style.borderColor = targetNote.archived ? 'var(--danger-color)' : 'var(--border-color)';

        lastSavedStamp.textContent = `Last Saved: ${formatTime(targetNote.modified)}`;
        
        if (resetUndoStack) {
            undoStack = [];
            redoStack = [];
            trackHistoryStateSnapshot();
        }

        document.querySelectorAll('.note-card').forEach(c => {
            c.classList.toggle('active', c.dataset.id === id);
        });

        updateMetrics();
    }

    function triggerAutosaveLoop() {
        if (!state.activeNoteId) return;
        const targetNote = state.notes.find(n => n.id === state.activeNoteId);
        if (!targetNote) return;

        const currentTitle = activeNoteTitle.value;
        const currentContent = editorCore.innerHTML;

        if (targetNote.title !== currentTitle || targetNote.content !== currentContent) {
            autosaveIndicator.textContent = "Saving...";
            targetNote.title = currentTitle;
            targetNote.content = currentContent;
            targetNote.modified = new Date().toISOString();
            
            saveStateToLocalStorage();
            renderNotesDeck();
            
            lastSavedStamp.textContent = `Last Saved: ${formatTime(targetNote.modified)}`;
            autosaveIndicator.textContent = "Synced locally";
        }
    }

    function execEditorCommand(command, value = null) {
        document.execCommand(command, false, value);
        editorCore.focus();
        trackHistoryStateSnapshot();
        updateMetrics();
    }

    function trackHistoryStateSnapshot() {
        const payload = { title: activeNoteTitle.value, content: editorCore.innerHTML };
        if (undoStack.length === 0 || undoStack[undoStack.length - 1].content !== payload.content) {
            undoStack.push(payload);
            if (undoStack.length > MAX_STACK_DEPTH) undoStack.shift();
            redoStack = [];
        }
    }

    function executeFindReplace(replaceAll = false) {
        const findStr = document.getElementById('fr-find').value;
        const replaceStr = document.getElementById('fr-replace').value;
        if (!findStr) return;

        const isCaseSensitive = document.getElementById('fr-case').checked;
        const isWholeWord = document.getElementById('fr-word').checked;
        let contentText = editorCore.innerHTML;
        
        let regexFlags = isCaseSensitive ? 'g' : 'gi';
        let escapedFindStr = findStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let regexPattern = isWholeWord ? `\\b${escapedFindStr}\\b` : escapedFindStr;
        let regex = new RegExp(regexPattern, regexFlags);

        if (replaceAll) {
            const matchCount = (contentText.match(regex) || []).length;
            if (matchCount > 0) {
                editorCore.innerHTML = contentText.replace(regex, replaceStr);
                alert(`Replaced ${matchCount} occurrence(s).`);
                trackHistoryStateSnapshot();
                triggerAutosaveLoop();
            } else {
                alert("Target phrase text not found.");
            }
        } else {
            if (!window.find) {
                alert("Sequential finding search unsupported by this mobile engine. Use Replace All safely.");
                return;
            }
            let found = window.find(findStr, isCaseSensitive, false, true, isWholeWord, false, false);
            if (!found) {
                alert("Search tail boundary limit reached.");
            } else {
                let selection = window.getSelection();
                if (selection.rangeCount > 0 && selection.toString().toLowerCase() === findStr.toLowerCase()) {
                    let range = selection.getRangeAt(0);
                    range.deleteContents();
                    range.insertNode(document.createTextNode(replaceStr));
                    trackHistoryStateSnapshot();
                }
            }
        }
    }

    function appendHistoryRecord(type, contentPreview) {
        const log = { timestamp: new Date().toISOString(), workspace: activeNoteTitle.value || 'Workspace', preview: contentPreview.substring(0, 300) };
        state.history[type].unshift(log);
        if (state.history[type].length > 100) state.history[type].pop();
        saveStateToLocalStorage();
    }

    function hydrateHistoryModalLists() {
        const renderListLog = (type, targetElementId) => {
            const listEl = document.getElementById(targetElementId);
            listEl.innerHTML = '';
            if (state.history[type].length === 0) {
                listEl.innerHTML = `<li class="save-indicator">Zero operations logged natively.</li>`;
                return;
            }
            state.history[type].forEach(item => {
                const li = document.createElement('li');
                li.className = 'history-log-item';
                li.innerHTML = `<div class="history-log-meta"><span>Context: <b>${escapeHTML(item.workspace)}</b></span><span>${formatRelativeTimestamp(item.timestamp)}</span></div><div class="history-log-preview">${escapeHTML(item.preview)}</div>`;
                listEl.appendChild(li);
            });
        };
        renderListLog('copied', 'list-history-copied');
        renderListLog('drafts', 'list-history-drafts');
        renderListLog('snippets', 'list-history-snippets');
    }

    function exportActiveWorkspaceAsDocument(type) {
        const activeNote = state.notes.find(n => n.id === state.activeNoteId);
        if (!activeNote) return;

        let dataBlob, fileExtension, mimeType;
        const normalizedTitle = (activeNote.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '-');

        if (type === 'txt') {
            const div = document.createElement('div'); div.innerHTML = activeNote.content;
            dataBlob = div.textContent || div.innerText || ''; fileExtension = 'txt'; mimeType = 'text/plain';
        } else if (type === 'md') {
            dataBlob = activeNote.content.replace(/<[^>]*>/g, ''); fileExtension = 'md'; mimeType = 'text/markdown';
        } else {
            dataBlob = activeNote.content; fileExtension = 'html'; mimeType = 'text/html';
        }
        downloadBlobTrigger(dataBlob, `${normalizedTitle}.${fileExtension}`, mimeType);
    }

    function downloadBlobTrigger(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = filename; document.body.appendChild(link);
        link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    }

    function executeIncomingDataImportFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.notes) { state = parsed; saveStateToLocalStorage(); initApplication(); }
            } catch (err) { alert("Invalid backup structure format."); }
        };
        reader.readAsText(file);
    }

    function triggerSystemBackupSnapshot() {
        localStorage.setItem(`${STORAGE_KEY}_BACKGROUND_SNAPSHOT_DATA`, JSON.stringify(state));
    }

    function setupEventListeners() {
        editorCore.addEventListener('keyup', () => { updateMetrics(); trackHistoryStateSnapshot(); });
        activeNoteTitle.addEventListener('keyup', triggerAutosaveLoop);

        document.querySelectorAll('.editor-toolbar .tb-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                execEditorCommand(btn.dataset.command, btn.dataset.value || null);
            });
        });

        // CROSS-PLATFORM MOBILE TOUCH ACCESSIBLE COLOR ENGINE
        const colorPicker = document.getElementById('tb-forecolor');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                execEditorCommand('foreColor', e.target.value);
            });
        }

        // SMART MOBILE REACTIONARY SEARCH POPUP FALLBACK
        const toggleFindBtn = document.getElementById('tb-toggle-find');
        if (toggleFindBtn) {
            toggleFindBtn.addEventListener('click', () => {
                const rightPanel = document.querySelector('.quick-panel');
                if (window.getComputedStyle(rightPanel).display === 'none') {
                    const inlineFind = prompt("Enter text target matrix search parameters:");
                    if (inlineFind) {
                        document.getElementById('fr-find').value = inlineFind;
                        const inlineReplace = prompt(`Replace all variants of "${inlineFind}" with:`);
                        if (inlineReplace !== null) {
                            document.getElementById('fr-replace').value = inlineReplace;
                            executeFindReplace(true);
                        }
                    }
                } else {
                    document.getElementById('fr-find').focus();
                }
            });
        }

        document.getElementById('tb-link').addEventListener('click', () => {
            const url = prompt("Enter Hyperlink URL Target Vector:", "https://");
            if (url) execEditorCommand('createLink', url);
        });

        document.getElementById('tb-table').addEventListener('click', () => {
            let tableHTML = '<table border="1"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table><p></p>';
            execEditorCommand('insertHTML', tableHTML);
        });

        document.getElementById('tb-undo').addEventListener('click', () => {
            if (undoStack.length > 1) {
                undoStack.pop(); const prev = undoStack[undoStack.length - 1];
                activeNoteTitle.value = prev.title; editorCore.innerHTML = prev.content; updateMetrics();
            }
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        });

        document.getElementById('btn-new-note').addEventListener('click', () => createNewNote());
        
        document.getElementById('btn-pin-active').addEventListener('click', () => {
            const n = state.notes.find(x => x.id === state.activeNoteId);
            if (n) { n.pinned = !n.pinned; saveStateToLocalStorage(); renderNotesDeck(); loadActiveNote(state.activeNoteId, false); }
        });

        document.getElementById('btn-archive-active').addEventListener('click', () => {
            const n = state.notes.find(x => x.id === state.activeNoteId);
            if (n) { n.archived = !n.archived; saveStateToLocalStorage(); renderNotesDeck(); if (state.notes.length > 0) { const next = state.notes.find(x => !x.archived); if (next) loadActiveNote(next.id); } }
        });

        document.getElementById('btn-copy-active').addEventListener('click', () => {
            const plainText = editorCore.textContent || editorCore.innerText || '';
            navigator.clipboard.writeText(plainText).then(() => { appendHistoryRecord('copied', plainText); alert("Copied safely to internal machine device registers."); });
        });

        const exportTrigger = document.getElementById('btn-export-menu-trigger');
        const exportDropdown = document.getElementById('export-dropdown');
        exportTrigger.addEventListener('click', (e) => { e.stopPropagation(); exportDropdown.classList.toggle('hidden'); });
        document.addEventListener('click', () => exportDropdown.classList.add('hidden'));

        exportDropdown.querySelectorAll('button[data-export]').forEach(btn => {
            btn.addEventListener('click', () => exportActiveWorkspaceAsDocument(btn.dataset.export));
        });

        document.getElementById('btn-add-category').addEventListener('click', () => {
            const name = prompt("Enter custom category folder context parameter:");
            if (name && name.trim() !== '') { state.categories.push({ id: 'cat-' + Date.now(), name: name.trim() }); saveStateToLocalStorage(); renderCategories(); }
        });

        selectNoteCategory.addEventListener('change', (e) => {
            const n = state.notes.find(x => x.id === state.activeNoteId);
            if (n) { n.categoryId = e.target.value; n.modified = new Date().toISOString(); saveStateToLocalStorage(); renderCategories(); loadActiveNote(state.activeNoteId, false); }
        });

        document.getElementById('global-search').addEventListener('input', (e) => { state.searchTerm = e.target.value; renderNotesDeck(); });
        document.getElementById('btn-fr-all').addEventListener('click', () => executeFindReplace(true));
        document.getElementById('btn-fr-next').addEventListener('click', () => executeFindReplace(false));

        document.querySelectorAll('.btn-snippet').forEach(btn => {
            btn.addEventListener('click', () => { execEditorCommand('insertHTML', `<b>${btn.dataset.snippet}</b> `); appendHistoryRecord('snippets', btn.dataset.snippet); });
        });

        document.getElementById('btn-open-history').addEventListener('click', () => { hydrateHistoryModalLists(); document.getElementById('modal-history').classList.remove('hidden'); });
        document.getElementById('btn-open-backup').addEventListener('click', () => { document.getElementById('modal-backup').classList.remove('hidden'); });

        document.querySelectorAll('.modal-overlay, .btn-close-modal').forEach(closer => {
            closer.addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('btn-close-modal')) document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden')); });
        });

        document.getElementById('file-import-input').addEventListener('change', (e) => { if (e.target.files.length > 0) executeIncomingDataImportFile(e.target.files[0]); });
        document.getElementById('btn-manual-backup').addEventListener('click', () => { triggerSystemBackupSnapshot(); alert("Manual sandbox point state snapshot locked."); });
    }

    function updateMetrics() {
        const text = editorCore.textContent || editorCore.innerText || '';
        const clean = text.trim().replace(/\s+/g, ' ');
        document.getElementById('metric-words').textContent = clean === '' ? 0 : clean.split(' ').length;
        document.getElementById('metric-chars').textContent = text.length;
    }

    function formatTime(iso) { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    function formatRelativeTimestamp(iso) { return 'Updated'; }
    function escapeHTML(str) { return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    initApplication();
});
