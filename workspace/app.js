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

    // LOCAL STORAGE CONFIGURATION KEYS
    const STORAGE_KEY = 'CWP_APPLICATION_STATE_DATA';
    
    // UNDO/REDO TRANSACTION STACKS FOR EDITOR
    let undoStack = [];
    let redoStack = [];
    const MAX_STACK_DEPTH = 50;

    // INTERMEDIATE UI COMPONENT REFERENCES
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

    /* ==========================================================================
       INITIALIZATION & STORAGE HYDRATION
       ========================================================================== */
    function initApplication() {
        const persistedData = localStorage.getItem(STORAGE_KEY);
        if (persistedData) {
            try {
                state = JSON.parse(persistedData);
                // Schema protection fallbacks
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
        
        // Load initial active document
        if (state.activeNoteId) {
            loadActiveNote(state.activeNoteId, false);
        } else if (state.notes.length > 0) {
            loadActiveNote(state.notes[0].id, false);
        } else {
            createNewNote("Welcome to your Command Center", "Start drafting ideas here...");
        }

        // Trigger Lifecycle Intervals
        setInterval(triggerAutosaveLoop, 4000); 
        setInterval(triggerSystemBackupSnapshot, 300000); // 5 Minutes Background Snapshot
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
                content: '<h1>Your Content Command Center is Ready</h1><p>This premium SaaS environment runs entirely locally in your browser. All your intellectual property remains private and stored inside your sandbox <code>LocalStorage</code> ecosystem.</p><h3>Key Features:</h3><ul><li><b>Rich Text Engine</b> with custom markdown/table structures.</li><li><b>Find & Replace</b> panel with full text criteria configurations.</li><li><b>Automation Tracking Logs</b> records last 100 asset mutations natively.</li></ul>',
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

    /* ==========================================================================
       THEME EXECUTION MANAGEMENT
       ========================================================================== */
    function applyTheme(themeName) {
        state.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        saveStateToLocalStorage();
    }

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const targetTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(targetTheme);
    });

    /* ==========================================================================
       RENDER CONTROLLERS: NOTES DECK & SIDEBARS
       ========================================================================== */
    function renderNotesDeck() {
        notesDeck.innerHTML = '';
        let processedNotes = [...state.notes];

        // Apply Instant Search Constraints
        if (state.searchTerm.trim() !== '') {
            const query = state.searchTerm.toLowerCase();
            processedNotes = processedNotes.filter(n => 
                n.title.toLowerCase().includes(query) || 
                n.content.toLowerCase().includes(query)
            );
        }

        // Apply Filter Navigation Constraints
        if (state.filter === 'pinned') {
            processedNotes = processedNotes.filter(n => n.pinned && !n.archived);
        } else if (state.filter === 'archived') {
            processedNotes = processedNotes.filter(n => n.archived);
        } else {
            // "all" view - standard unarchived documents
            processedNotes = processedNotes.filter(n => !n.archived);
        }

        // Priority Sorting Layer: Pinned entries always stack first, then newest updates
        processedNotes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.modified) - new Date(a.modified);
        });

        // Compute Metric Count Indicators
        countAll.textContent = state.notes.filter(n => !n.archived).length;
        countPinned.textContent = state.notes.filter(n => n.pinned && !n.archived).length;
        countArchived.textContent = state.notes.filter(n => n.archived).length;

        if (processedNotes.length === 0) {
            notesDeck.innerHTML = '<div class="save-indicator" style="padding:20px; text-align:center;">No documents match active constraints.</div>';
            return;
        }

        processedNotes.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${note.id === state.activeNoteId ? 'active' : ''}`;
            card.dataset.id = note.id;

            // Strip HTML elements out for card summary string
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
            // Render selector option drop targets
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            selectNoteCategory.appendChild(option);

            // Render Sidebar List Controls
            const li = document.createElement('li');
            li.className = `category-item ${state.filter === `cat-${cat.id}` ? 'active' : ''}`;
            li.dataset.catId = cat.id;
            li.innerHTML = `
                <span>${escapeHTML(cat.name)}</span>
                <div class="category-actions">
                    <button class="btn-text btn-cat-rename" title="Rename">✏️</button>
                    <button class="btn-text btn-cat-delete" title="Delete">❌</button>
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
        
        // Synchronize selected option view to currently active document element context
        const currentNote = state.notes.find(n => n.id === state.activeNoteId);
        if (currentNote) {
            selectNoteCategory.value = currentNote.categoryId || '';
        }
    }

    /* ==========================================================================
       DOCUMENT TRANSACTION MANAGEMENT ACTIONS
       ========================================================================== */
    function createNewNote(title = "Untitled Document", content = "") {
        const newId = 'note-' + Date.now() + Math.random().toString(36).substr(2, 5);
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
        
        // Push Automation History Log Record
        appendHistoryRecord('drafts', `Generated fresh workspace vector workspace: [${title}]`);
        
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

        // Manage Document Meta Configuration Badges
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

        // Set highlight accent execution focus in the layout view panel lists
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

        // Verify Mutation Delta Before Committing Writes
        if (targetNote.title !== currentTitle || targetNote.content !== currentContent) {
            autosaveIndicator.textContent = "Saving changes...";
            
            targetNote.title = currentTitle;
            targetNote.content = currentContent;
            targetNote.modified = new Date().toISOString();
            
            saveStateToLocalStorage();
            renderNotesDeck();
            
            lastSavedStamp.textContent = `Last Saved: ${formatTime(targetNote.modified)}`;
            autosaveIndicator.textContent = "Synced locally";
        }
    }

    /* ==========================================================================
       RICH TEXT EXECUTION INTERACTION WRAPPERS
       ========================================================================== */
    function execEditorCommand(command, value = null) {
        document.execCommand(command, false, value);
        editorCore.focus();
        trackHistoryStateSnapshot();
        updateMetrics();
    }

    // Capture Undo States through Keystroke Mutation Snapshots
    function trackHistoryStateSnapshot() {
        const payload = {
            title: activeNoteTitle.value,
            content: editorCore.innerHTML
        };
        if (undoStack.length === 0 || undoStack[undoStack.length - 1].content !== payload.content) {
            undoStack.push(payload);
            if (undoStack.length > MAX_STACK_DEPTH) undoStack.shift();
            redoStack = []; // Reset Redo Forward Chain
        }
    }

    /* ==========================================================================
       FIND & REPLACE INTELLIGENCE ALGORITHMS
       ========================================================================== */
    function executeFindReplace(replaceAll = false) {
        const findStr = document.getElementById('fr-find').value;
        const replaceStr = document.getElementById('fr-replace').value;
        if (!findStr) return;

        const isCaseSensitive = document.getElementById('fr-case').checked;
        const isWholeWord = document.getElementById('fr-word').checked;

        let contentText = editorCore.innerHTML;
        
        // Build accurate Regex evaluation patterns safely protecting HTML boundaries
        let regexFlags = isCaseSensitive ? 'g' : 'gi';
        let escapedFindStr = findStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let regexPattern = isWholeWord ? `\\b${escapedFindStr}\\b` : escapedFindStr;
        
        let regex = new RegExp(regexPattern, regexFlags);

        if (replaceAll) {
            const matchCount = (contentText.match(regex) || []).length;
            if (matchCount > 0) {
                editorCore.innerHTML = contentText.replace(regex, replaceStr);
                alert(`Successfully replaced ${matchCount} occurrence(s).`);
                trackHistoryStateSnapshot();
                triggerAutosaveLoop();
            } else {
                alert("Target phrase string variants not detected.");
            }
        } else {
            // Find Next Sequential Matching Mechanism via Native DOM Selection UI Windows
            if (!window.find) {
                alert("Sequential forward searching structural engine unsupported by this browser client architecture. Use Replace All safely instead.");
                return;
            }
            let found = window.find(findStr, isCaseSensitive, false, true, isWholeWord, false, false);
            if (!found) {
                // Wrap searching strategy back to stack top ceiling entry point
                alert("Search token boundary tail reached. No further occurrences found.");
            } else if (document.activeElement === editorCore || editorCore.contains(document.activeElement)) {
                // If text selection focus ranges within workspace scope, execute step replacement
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

    /* ==========================================================================
       AUTOMATION WORKFLOW HISTORY TRACKING
       ========================================================================== */
    function appendHistoryRecord(type, contentPreview) {
        const log = {
            timestamp: new Date().toISOString(),
            workspace: activeNoteTitle.value || 'System Core Workspace',
            preview: contentPreview.substring(0, 300)
        };
        
        state.history[type].unshift(log);
        if (state.history[type].length > 100) state.history[type].pop();
        saveStateToLocalStorage();
    }

    function hydrateHistoryModalLists() {
        const renderListLog = (type, targetElementId) => {
            const listEl = document.getElementById(targetElementId);
            listEl.innerHTML = '';
            if (state.history[type].length === 0) {
                listEl.innerHTML = `<li class="save-indicator">Zero operations logged natively under this system segment directory index.</li>`;
                return;
            }
            state.history[type].forEach(item => {
                const li = document.createElement('li');
                li.className = 'history-log-item';
                li.innerHTML = `
                    <div class="history-log-meta">
                        <span>Workspace Profile Context: <b>${escapeHTML(item.workspace)}</b></span>
                        <span>${formatRelativeTimestamp(item.timestamp)}</span>
                    </div>
                    <div class="history-log-preview">${escapeHTML(item.preview)}</div>
                `;
                listEl.appendChild(li);
            });
        };

        renderListLog('copied', 'list-history-copied');
        renderListLog('drafts', 'list-history-drafts');
        renderListLog('snippets', 'list-history-snippets');
    }

    /* ==========================================================================
       DATA SYSTEM MIGRATION ARCHITECTURE: EXPORTS
       ========================================================================== */
    function exportActiveWorkspaceAsDocument(type) {
        const activeNote = state.notes.find(n => n.id === state.activeNoteId);
        if (!activeNote) return;

        let dataBlob, fileExtension, mimeType;
        const normalizedTitle = (activeNote.title || 'untitled-document').toLowerCase().replace(/[^a-z0-9]/g, '-');

        switch (type) {
            case 'txt':
                const divContainer = document.createElement('div');
                divContainer.innerHTML = activeNote.content;
                dataBlob = divContainer.textContent || divContainer.innerText || '';
                fileExtension = 'txt';
                mimeType = 'text/plain;charset=utf-8';
                break;
            case 'md':
                dataBlob = convertHTMLToBasicMarkdown(activeNote.content);
                fileExtension = 'md';
                mimeType = 'text/markdown;charset=utf-8';
                break;
            case 'html':
                dataBlob = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${activeNote.title}</title><style>body{font-family:sans-serif;line-height:1.6;padding:40px;color:#333;}blockquote{border-left:4px solid #3b82f6;padding-left:15px;color:#666;font-style:italic;}pre{background:#f4f4f4;padding:10px;border-radius:5px;}</style></head><body>${activeNote.content}</body></html>`;
                fileExtension = 'html';
                mimeType = 'text/html;charset=utf-8';
                break;
            case 'doc':
                // Structured raw compatibility vector encoding allowing native word processors readable schemas
                dataBlob = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><title>${activeNote.title}</title><style>body{font-family:Arial;}</style></head><body>${activeNote.content}</body></html>`;
                fileExtension = 'doc';
                mimeType = 'application/msword';
                break;
            case 'json-active':
                dataBlob = JSON.stringify(activeNote, null, 2);
                fileExtension = 'json';
                mimeType = 'application/json';
                break;
            default:
                return;
        }

        downloadBlobTrigger(dataBlob, `${normalizedTitle}.${fileExtension}`, mimeType);
    }

    function exportSystemCollectionPackage(mode) {
        let payloadData;
        let fileName = `cwp-workspace-export-${Date.now()}.json`;

        if (mode === 'all-json') {
            payloadData = JSON.stringify(state, null, 2);
        } else if (mode === 'favs') {
            const pinnedNotes = state.notes.filter(n => n.pinned);
            payloadData = JSON.stringify({ pinnedNotes }, null, 2);
            fileName = `cwp-pinned-notes-${Date.now()}.json`;
        }

        downloadBlobTrigger(payloadData, fileName, 'application/json');
    }

    function downloadBlobTrigger(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const placeholderLink = document.createElement('a');
        placeholderLink.href = url;
        placeholderLink.download = filename;
        document.body.appendChild(placeholderLink);
        placeholderLink.click();
        document.body.removeChild(placeholderLink);
        URL.revokeObjectURL(url);
    }

    function convertHTMLToBasicMarkdown(htmlStr) {
        let md = htmlStr;
        md = md.replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n');
        md = md.replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n');
        md = md.replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n');
        md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
        md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
        md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
        md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
        md = md.replace(/<p>(.*?)<\/p>/gi, '$1\n\n');
        md = md.replace(/<br\s*\/?>/gi, '\n');
        md = md.replace(/<li>(.*?)<\/li>/gi, '* $1\n');
        md = md.replace(/<\/ul>/gi, '\n');
        md = md.replace(/<\/ol>/gi, '\n');
        // Strip other structural residual element bounds cleanly
        let div = document.createElement('div');
        div.innerHTML = md;
        return div.textContent || div.innerText || '';
    }

    /* ==========================================================================
       DATA SYSTEM MIGRATION ARCHITECTURE: IMPORTS
       ========================================================================== */
    function executeIncomingDataImportFile(file) {
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = function(e) {
            const rawContent = e.target.result;
            
            if (extension === 'json') {
                try {
                    const parsed = JSON.parse(rawContent);
                    if (parsed.notes && parsed.categories) {
                        // Core Workspace Restore Target System Map Verified
                        if (confirm("Valid full application backup matrix detected. Do you want to completely overwrite current workspace configurations?")) {
                            state = parsed;
                            saveStateToLocalStorage();
                            initApplication();
                        }
                    } else if (parsed.id && parsed.content) {
                        // Single Note Object Target Vector Injection Sequence
                        state.notes.unshift(parsed);
                        saveStateToLocalStorage();
                        initApplication();
                        loadActiveNote(parsed.id);
                    } else {
                        alert("Unrecognized internal variable arrays mapping schemas inside standard file envelope.");
                    }
                } catch (err) {
                    alert("Parsing execution fault reading JSON schema map parameters.");
                }
            } else {
                // Markdown or Standard Txt Stream Matrix Import Wrapper Processing
                const documentParsedTitle = file.name.replace(/\.[^/.]+$/, "");
                let cleanHTMLContent = rawContent.replace(/\n/g, "<br>");
                if (extension === 'md') {
                    // Convert basic layout items safely
                    cleanHTMLContent = cleanHTMLContent.replace(/### (.*?)(<br>|$)/g, "<h3>$1</h3>");
                    cleanHTMLContent = cleanHTMLContent.replace(/## (.*?)(<br>|$)/g, "<h2>$1</h2>");
                    cleanHTMLContent = cleanHTMLContent.replace(/# (.*?)(<br>|$)/g, "<h1>$1</h1>");
                }
                createNewNote(documentParsedTitle, cleanHTMLContent);
                document.getElementById('modal-backup').classList.add('hidden');
            }
        };

        reader.readAsText(file);
    }

    /* ==========================================================================
       SNAPSHOT STORAGE SYSTEM RESTORATION MIGRATIONS
       ========================================================================== */
    function triggerSystemBackupSnapshot() {
        const snapshotData = JSON.stringify(state);
        localStorage.setItem(`${STORAGE_KEY}_BACKGROUND_SNAPSHOT_DATA`, snapshotData);
        console.log("Automatic Workspace Core Snapshot Matrix State Preserved.");
    }

    /* ==========================================================================
       EVENT LISTENERS MECHANICS ASSEMBLY MAPPING
       ========================================================================== */
    function setupEventListeners() {
        // Core Keyboard Mutation Watchdogs
        editorCore.addEventListener('keyup', () => {
            updateMetrics();
            trackHistoryStateSnapshot();
        });
        activeNoteTitle.addEventListener('keyup', triggerAutosaveLoop);

        // Standard Rich Text Action Interceptors
        document.querySelectorAll('.editor-toolbar .tb-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                const val = btn.dataset.value || null;
                execEditorCommand(command, val);
            });
        });

        // Insert Rich Link Prompt Hook
        document.getElementById('tb-link').addEventListener('click', () => {
            const url = prompt("Enter Target Hyperlink Matrix Uniform Location (URL):", "https://");
            if (url) execEditorCommand('createLink', url);
        });

        // Insert Programmatic Structural Data Table Formats Matrix
        document.getElementById('tb-table').addEventListener('click', () => {
            const rows = prompt("Enter target data matrix row ceiling quantity:", "3");
            const cols = prompt("Enter target data matrix column metrics quantity:", "3");
            if (!rows || !cols) return;

            let tableHTML = '<table><thead><tr>';
            for (let c = 0; c < cols; c++) tableHTML += '<th>Header Element</th>';
            tableHTML += '</tr></thead><tbody>';
            for (let r = 0; r < rows; r++) {
                tableHTML += '<tr>';
                for (let c = 0; c < cols; c++) tableHTML += '<td>Cell Parameters</td>';
                tableHTML += '</tr>';
            }
            tableHTML += '</tbody></table><p></p>';
            execEditorCommand('insertHTML', tableHTML);
        });

        // Undo Redo Action Core Wrappers Interceptors
        document.getElementById('tb-undo').addEventListener('click', () => {
            if (undoStack.length > 1) {
                const current = undoStack.pop();
                redoStack.push(current);
                const previous = undoStack[undoStack.length - 1];
                
                activeNoteTitle.value = previous.title;
                editorCore.innerHTML = previous.content;
                updateMetrics();
            }
        });

        document.getElementById('tb-redo').addEventListener('click', () => {
            if (redoStack.length > 0) {
                const targetForwardState = redoStack.pop();
                undoStack.push(targetForwardState);
                
                activeNoteTitle.value = targetForwardState.title;
                editorCore.innerHTML = targetForwardState.content;
                updateMetrics();
            }
        });

        // Left Navigation Base Filter Action Iterators
        document.querySelectorAll('.filter-list .filter-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.filter-list .filter-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
                
                item.classList.add('active');
                state.filter = item.dataset.filter;
                renderNotesDeck();
            });
        });

        // Active Document State Mutation Controls
        document.getElementById('btn-new-note').addEventListener('click', () => createNewNote());
        
        document.getElementById('btn-pin-active').addEventListener('click', () => {
            const activeNote = state.notes.find(n => n.id === state.activeNoteId);
            if (activeNote) {
                activeNote.pinned = !activeNote.pinned;
                saveStateToLocalStorage();
                renderNotesDeck();
                loadActiveNote(state.activeNoteId, false);
            }
        });

        document.getElementById('btn-archive-active').addEventListener('click', () => {
            const activeNote = state.notes.find(n => n.id === state.activeNoteId);
            if (activeNote) {
                activeNote.archived = !activeNote.archived;
                saveStateToLocalStorage();
                renderNotesDeck();
                // Advance tracking view window frame index forward to protect layouts
                if (state.notes.length > 0) {
                    const nextAvailable = state.notes.find(n => !n.archived);
                    if (nextAvailable) loadActiveNote(nextAvailable.id);
                }
            }
        });

        document.getElementById('btn-copy-active').addEventListener('click', () => {
            const container = document.createElement('div');
            container.innerHTML = editorCore.innerHTML;
            const plainText = container.textContent || container.innerText || '';

            navigator.clipboard.writeText(plainText).then(() => {
                appendHistoryRecord('copied', plainText);
                alert("Plain text document content successfully bound inside client machine copy clipboard registers.");
            });
        });

        // Document Export Activation Routing
        const exportTrigger = document.getElementById('btn-export-menu-trigger');
        const exportDropdown = document.getElementById('export-dropdown');
        
        exportTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            exportDropdown.classList.toggle('hidden');
        });
        
        document.addEventListener('click', () => exportDropdown.classList.add('hidden'));

        exportDropdown.querySelectorAll('button[data-export]').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.export;
                if (['txt', 'md', 'html', 'doc', 'json-active'].includes(mode)) {
                    exportActiveWorkspaceAsDocument(mode);
                } else {
                    exportSystemCollectionPackage(mode);
                }
            });
        });

        // Category Engine Action Interceptors
        document.getElementById('btn-add-category').addEventListener('click', () => {
            const catName = prompt("Enter naming parameters for your custom functional workspace directory element segment:");
            if (catName && catName.trim() !== '') {
                state.categories.push({
                    id: 'cat-' + Date.now(),
                    name: catName.trim()
                });
                saveStateToLocalStorage();
                renderCategories();
            }
        });

        categoryList.addEventListener('click', (e) => {
            const target = e.target;
            const item = target.closest('.category-item');
            if (!item) return;
            const catId = item.dataset.catId;

            if (target.classList.contains('btn-cat-rename')) {
                e.stopPropagation();
                const targetCat = state.categories.find(c => c.id === catId);
                const freshName = prompt(`Modify workspace context directory name structural identities parameter mapping:`, targetCat.name);
                if (freshName && freshName.trim() !== '') {
                    targetCat.name = freshName.trim();
                    saveStateToLocalStorage();
                    renderCategories();
                }
            } else if (target.classList.contains('btn-cat-delete')) {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this custom category? Linked documents will remain active as Uncategorized items.")) {
                    state.categories = state.categories.filter(c => c.id !== catId);
                    state.notes.forEach(n => { if (n.categoryId === catId) n.categoryId = ''; });
                    if (state.filter === `cat-${catId}`) state.filter = 'all';
                    saveStateToLocalStorage();
                    renderCategories();
                    renderNotesDeck();
                }
            }
        });

        selectNoteCategory.addEventListener('change', (e) => {
            const activeNote = state.notes.find(n => n.id === state.activeNoteId);
            if (activeNote) {
                activeNote.categoryId = e.target.value;
                activeNote.modified = new Date().toISOString();
                saveStateToLocalStorage();
                renderCategories();
                loadActiveNote(state.activeNoteId, false);
            }
        });
                // 1. Color Picker Implementation Wire-Up
        const colorPicker = document.getElementById('tb-forecolor');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                execEditorCommand('foreColor', e.target.value);
            });
        }

        // 2. Toolbar Find & Replace Panel Quick-Focus Link
        const toggleFindBtn = document.getElementById('tb-toggle-find');
        if (toggleFindBtn) {
            toggleFindBtn.addEventListener('click', () => {
                const rightPanel = document.querySelector('.quick-panel');
                const findInput = document.getElementById('fr-find');
                
                // If hidden on tablets/mobile, let's pop an alert fallback or highlight it
                if (window.getComputedStyle(rightPanel).display === 'none') {
                    const inlineFind = prompt("Enter text matrix to find directly:");
                    if (inlineFind) {
                        document.getElementById('fr-find').value = inlineFind;
                        const inlineReplace = prompt(`Replace "${inlineFind}" with:`);
                        if (inlineReplace !== null) {
                            document.getElementById('fr-replace').value = inlineReplace;
                            executeFindReplace(true); // Fire dynamic replace all sequence directly
                        }
                    }
                } else {
                    findInput.focus();
                    findInput.style.borderColor = 'var(--accent-color)';
                    setTimeout(() => findInput.style.borderColor = 'var(--border-color)', 1500);
                }
            });
        }


        // Instant Engine Search Input Pipeline Threading
        document.getElementById('global-search').addEventListener('input', (e) => {
            state.searchTerm = e.target.value;
            renderNotesDeck();
        });

        // Find and Replace Core Buttons Execution Wiring
        document.getElementById('btn-fr-next').addEventListener('click', () => executeFindReplace(false));
        document.getElementById('btn-fr-replace').addEventListener('click', () => executeFindReplace(false));
        document.getElementById('btn-fr-all').addEventListener('click', () => executeFindReplace(true));

        // Prompt History Log Injection Utilities Routing
        document.querySelectorAll('.btn-snippet').forEach(btn => {
            btn.addEventListener('click', () => {
                const prefixSnippet = btn.dataset.snippet;
                execEditorCommand('insertHTML', `<b>${prefixSnippet}</b> `);
                appendHistoryRecord('snippets', prefixSnippet);
            });
        });

        // Global Automation Modals Display Navigation Bindings
        document.getElementById('btn-open-history').addEventListener('click', () => {
            hydrateHistoryModalLists();
            document.getElementById('modal-history').classList.remove('hidden');
        });

        document.getElementById('btn-open-backup').addEventListener('click', () => {
            document.getElementById('modal-backup').classList.remove('hidden');
        });

        document.querySelectorAll('.modal-overlay, .btn-close-modal').forEach(closer => {
            closer.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('btn-close-modal')) {
                    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
                }
            });
        });

        // Modal Embedded Tabs Control Routing Switchboards
        document.querySelectorAll('.modal-tabs .tab-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                const panelContainer = tabBtn.closest('.modal-surface');
                panelContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                panelContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
                
                tabBtn.classList.add('active');
                document.getElementById(`tab-${tabBtn.dataset.tab}`).classList.remove('hidden');
            });
        });

        // Drag & Drop Migration System Core Binding Points
        const fileImportInput = document.getElementById('file-import-input');
        fileImportInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) executeIncomingDataImportFile(e.target.files[0]);
        });

        // Manual Backup Snapshot Handling Button Links
        document.getElementById('btn-manual-backup').addEventListener('click', () => {
            triggerSystemBackupSnapshot();
            alert("A secure local manual snapshot backup point has been generated in your application sandbox storage system layout registry.");
        });

        document.getElementById('btn-manual-restore').addEventListener('click', () => {
            const rawSnapshot = localStorage.getItem(`${STORAGE_KEY}_BACKGROUND_SNAPSHOT_DATA`);
            if (rawSnapshot) {
                if (confirm("Are you sure you want to revert to the last local manual snapshot backup? Current changes will be overwritten.")) {
                    state = JSON.parse(rawSnapshot);
                    saveStateToLocalStorage();
                    initApplication();
                    document.getElementById('modal-backup').classList.add('hidden');
                }
            } else {
                alert("No manual snapshot recovery data maps located inside browser isolated vault profiles.");
            }
        });
    }

    /* ==========================================================================
       UTILITY PROCESSING METRICS HELPER CALCULATORS
       ========================================================================== */
    function updateMetrics() {
        const textContent = editorCore.textContent || editorCore.innerText || '';
        const cleanString = textContent.trim().replace(/\s+/g, ' ');
        const wordMetricsCount = cleanString === '' ? 0 : cleanString.split(' ').length;
        
        document.getElementById('metric-words').textContent = wordMetricsCount;
        document.getElementById('metric-chars').textContent = textContent.length;
    }

    function formatTime(isoString) {
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function formatRelativeTimestamp(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const secondsDelta = Math.floor((now - date) / 1000);
        
        if (secondsDelta < 60) return 'Just now';
        const minutesDelta = Math.floor(secondsDelta / 60);
        if (minutesDelta < 60) return `${minutesDelta}m ago`;
        const hoursDelta = Math.floor(minutesDelta / 60);
        if (hoursDelta < 24) return `${hoursDelta}h ago`;
        
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // RUN THE APPLICATION COMMAND CENTER LIFECYCLE INITIALIZER
    initApplication();
});
