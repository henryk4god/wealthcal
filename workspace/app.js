/**
 * Creator Workspace Pro — Complete Core Application Engine Architecture
 * Built with declarative centralized state machines and vanilla browser subsystems.
 */

class CreatorWorkspacePro {
    constructor() {
        // --- Core Application Centralized Reactive States State Object ---
        this.state = {
            notes: [],
            categories: [],
            snippets: [],
            history: [],
            scratchpad: '',
            activeWorkspace: 'Research', // Initial workspace mount target
            activeNoteId: null,
            activeView: 'dashboard',
            theme: 'dark'
        };

        // --- Structured Memory Rollback Arrays for Action Tracking (Undo Engine) ---
        this.scratchpadHistory = [];
        this.scratchpadHistoryIndex = -1;

        this.init();
    }

    init() {
        this.loadLocalStorage();
        this.registerDOMReferences();
        this.bindEvents();
        this.injectDefaultSnippets();
        this.renderAllSystemViews();
        this.initBackupSystem();
        this.setupKeyboardShortcuts();
    }

    registerDOMReferences() {
        this.dom = {
            themeToggle: document.getElementById('theme-toggle'),
            sidebar: document.getElementById('sidebar'),
            mobileMenuBtn: document.getElementById('mobile-menu-btn'),
            viewPort: document.getElementById('view-port'),
            globalSearch: document.getElementById('global-search'),
            searchScope: document.getElementById('search-scope'),
            autoSaveIndicator: document.getElementById('auto-save-indicator'),
            dashboardScratchpad: document.getElementById('dashboard-scratchpad'),
            scratchUndo: document.getElementById('scratch-undo'),
            scratchRedo: document.getElementById('scratch-redo'),
            scratchSavedTime: document.getElementById('scratch-saved-time'),
            notesListTarget: document.getElementById('notes-list-target'),
            editorControlsBar: document.getElementById('editor-controls-bar'),
            activeNoteTitle: document.getElementById('active-note-title'),
            activeNoteCategory: document.getElementById('active-note-category'),
            richEditor: document.getElementById('rich-editor'),
            findInput: document.getElementById('find-input'),
            replaceInput: document.getElementById('replace-input'),
            btnFindNext: document.getElementById('btn-find-next'),
            btnReplace: document.getElementById('btn-replace'),
            btnReplaceAll: document.getElementById('btn-replace-all'),
            findCase: document.getElementById('find-case'),
            findWord: document.getElementById('find-word'),
            newCategoryName: document.getElementById('new-category-name'),
            btnAddCategory: document.getElementById('btn-add-category'),
            categoryListRender: document.getElementById('category-list-render'),
            favoritesGrid: document.getElementById('favorites-render-grid'),
            pinnedGrid: document.getElementById('pinned-render-grid'),
            historyTableBody: document.getElementById('history-table-body'),
            snippetsConfigList: document.getElementById('snippets-config-list'),
            snipTitle: document.getElementById('snip-title'),
            snipContent: document.getElementById('snip-content'),
            btnSaveSnippet: document.getElementById('btn-save-snippet'),
            importFileUploader: document.getElementById('import-file-uploader'),
            btnManualBackup: document.getElementById('btn-manual-backup'),
            btnQuickExportAll: document.getElementById('btn-quick-export-all'),
            btnCreateNote: document.getElementById('btn-create-note')
        };
    }

    // --- Core Memory Persistence Subsystem Protocols ---
    loadLocalStorage() {
        try {
            const stored = localStorage.getItem('cwp_master_state');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.state = { ...this.state, ...parsed };
            } else {
                this.state.categories = ['Prototypes', 'Copywriting', 'Blueprints'];
            }
            document.documentElement.setAttribute('data-theme', this.state.theme || 'dark');
        } catch (e) {
            console.error("System Matrix State Restoration Failed:", e);
        }
    }

    saveStateToStorage() {
        localStorage.setItem('cwp_master_state', JSON.stringify(this.state));
        this.triggerVisualSavePill();
    }

    triggerVisualSavePill() {
        if (!this.dom.autoSaveIndicator) return;
        this.dom.autoSaveIndicator.textContent = 'Syncing Matrix...';
        this.dom.autoSaveIndicator.style.opacity = '1';
        setTimeout(() => {
            this.dom.autoSaveIndicator.textContent = 'System Synced';
        }, 800);
    }

    // --- Subsystem Pipeline Event Listeners Binding ---
    bindEvents() {
        // Theme / Mobile Sidebar Toggle UI Event Layers
        this.dom.themeToggle.addEventListener('click', () => this.toggleThemeSystem());
        this.dom.mobileMenuBtn.addEventListener('click', () => this.dom.sidebar.classList.toggle('open'));

        // Dynamic Router Links Mapping Loop Execution
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
                const btn = e.currentTarget;
                btn.classList.add('active');
                
                const targetView = btn.getAttribute('data-target');
                const workspaceType = btn.getAttribute('data-workspace');
                
                if (workspaceType) {
                    this.state.activeWorkspace = workspaceType;
                    this.switchView('workspace-template');
                    this.renderWorkspaceNotesPipeline();
                } else {
                    this.switchView(targetView.replace('sys-', ''));
                }
                this.dom.sidebar.classList.remove('open');
            });
        });

        // Instant Incremental Real-time Search Processing Subsystem
        this.dom.globalSearch.addEventListener('input', () => this.executeSearchPipeline());
        this.dom.searchScope.addEventListener('change', () => this.executeSearchPipeline());

        // Instant Rollback Engine Initialization via Scratchpad Typing Hook
        this.dom.dashboardScratchpad.addEventListener('input', (e) => {
            this.state.scratchpad = e.target.value;
            this.trackScratchpadMutation(this.state.scratchpad);
            this.persistScratchpadDelta();
        });
        this.dom.scratchUndo.addEventListener('click', () => this.executeScratchpadUndo());
        this.dom.scratchRedo.addEventListener('click', () => this.executeScratchpadRedo());

        // Document Manipulation Core Inputs Pipeline
        this.dom.btnCreateNote.addEventListener('click', () => this.createNewDocumentNode());
        this.dom.activeNoteTitle.addEventListener('input', (e) => {
            if (!this.state.activeNoteId) return;
            this.updateActiveNoteAttribute('title', e.target.value);
            this.renderWorkspaceNotesPipeline();
        });
        this.dom.activeNoteCategory.addEventListener('change', (e) => {
            this.updateActiveNoteAttribute('category', e.target.value);
            this.renderWorkspaceNotesPipeline();
        });

        // Event listener for Rich Text Editor changes
        this.dom.richEditor.addEventListener('input', () => {
            if (!this.state.activeNoteId) return;
            this.updateActiveNoteAttribute('content', this.dom.richEditor.innerHTML);
            this.runMetricsExecutionEngine();
        });

        // Rich Editing Core Command Bar Engine Assignment
        document.querySelectorAll('.rich-toolbar .tool-btn[data-cmd]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cmd = btn.getAttribute('data-cmd');
                const arg = btn.getAttribute('data-arg') || null;
                document.execCommand(cmd, false, arg);
                this.dom.richEditor.focus();
                // If it's standard input manipulation, save the mutation down-line
                if (this.state.activeNoteId) {
                    this.updateActiveNoteAttribute('content', this.dom.richEditor.innerHTML);
                }
            });
        });

        // Deep URL Hyperlink Generation Subsystem Link Tool
        document.getElementById('tool-link').addEventListener('click', () => {
            const url = prompt("Enter complete destination pointer anchor URL:");
            if (url) document.execCommand('createLink', false, url);
        });

        // Table Component Compiler Subsystem Insertion Logic
        document.getElementById('tool-table').addEventListener('click', () => {
            const rows = prompt("Enter grid layout count height (Rows):", "3");
            const cols = prompt("Enter grid layout count width (Columns):", "3");
            if (!rows || !cols) return;
            let tableHtml = '<table>';
            for (let i = 0; i < rows; i++) {
                tableHtml += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHtml += i === 0 ? '<th>Header</th>' : '<td>Data cell</td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</table><p></p>';
            document.execCommand('insertHTML', false, tableHtml);
        });

        // Integrated Local Find & Replace Evaluation System Subsystem Logic Hooks
        this.dom.btnFindNext.addEventListener('click', () => this.findNextTextOccurence());
        this.dom.btnReplace.addEventListener('click', () => this.executeTextReplacement(false));
        this.dom.btnReplaceAll.addEventListener('click', () => this.executeTextReplacement(true));

        // Note Pillar System Options Engine Connectors
        document.getElementById('action-pin').addEventListener('click', () => this.toggleActiveNoteBooleanFlag('isPinned'));
        document.getElementById('action-fav').addEventListener('click', () => this.toggleActiveNoteBooleanFlag('isFavorite'));
        document.getElementById('action-duplicate').addEventListener('click', () => this.duplicateActiveDocumentNode());
        document.getElementById('action-copy-text').addEventListener('click', () => this.copyActiveDocumentPayloadToClipboard());
        document.getElementById('action-delete').addEventListener('click', () => this.deleteActiveDocumentNode());

        // Advanced Content Ingestion Setup Controls
        this.dom.btnAddCategory.addEventListener('click', () => this.createCustomCategoryTrack());
        this.dom.btnSaveSnippet.addEventListener('click', () => this.commitCustomSnippetAsset());
        this.dom.importFileUploader.addEventListener('change', (e) => this.handleSystemDataIngest(e));
        this.dom.btnManualBackup.addEventListener('click', () => this.executeGlobalBackup());
        this.dom.btnQuickExportAll.addEventListener('click', () => this.exportGlobalBackup());
    }

    // --- Frameworkless View Switcher Routing Engine Engine ---
    switchView(viewId) {
        this.state.activeView = viewId;
        document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
        
        const targetElement = document.getElementById(`view-${viewId}`);
        if (targetElement) {
            targetElement.classList.add('active');
        } else {
            // System view layout fallback to dynamic template parser engine
            document.getElementById('view-workspace-template').classList.add('active');
        }
        this.renderAllSystemViews();
    }

    // --- Scratch Pad Engine Operations Suite ---
    persistScratchpadDelta() {
        if (this.scratchTimeDebounce) clearTimeout(this.scratchTimeDebounce);
        this.scratchTimeDebounce = setTimeout(() => {
            this.saveStateToStorage();
            this.dom.scratchSavedTime.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
            this.logSystemActivity('Dashboard', 'Autosave Scratchpad', this.state.scratchpad.substring(0, 60));
        }, 1500);
    }

    trackScratchpadMutation(content) {
        if (this.scratchpadHistoryIndex < this.scratchpadHistory.length - 1) {
            this.scratchpadHistory = this.scratchpadHistory.slice(0, this.scratchpadHistoryIndex + 1);
        }
        if (this.scratchpadHistory[this.scratchpadHistoryIndex] === content) return;
        this.scratchpadHistory.push(content);
        if (this.scratchpadHistory.length > 100) this.scratchpadHistory.shift();
        this.scratchpadHistoryIndex = this.scratchpadHistory.length - 1;
    }

    executeScratchpadUndo() {
        if (this.scratchpadHistoryIndex > 0) {
            this.scratchpadHistoryIndex--;
            this.state.scratchpad = this.scratchpadHistory[this.scratchpadHistoryIndex];
            this.dom.dashboardScratchpad.value = this.state.scratchpad;
            this.saveStateToStorage();
        }
    }

    executeScratchpadRedo() {
        if (this.scratchpadHistoryIndex < this.scratchpadHistory.length - 1) {
            this.scratchpadHistoryIndex++;
            this.state.scratchpad = this.scratchpadHistory[this.scratchpadHistoryIndex];
            this.dom.dashboardScratchpad.value = this.state.scratchpad;
            this.saveStateToStorage();
        }
    }

    // --- Global Snippets Data Initialization Mechanics ---
    injectDefaultSnippets() {
        if (this.state.snippets && this.state.snippets.length > 0) return;
        this.state.snippets = [
            { id: 'snip-1', title: '[CTA]', content: '🔥 Claim your access immediately before pricing scales up. Click below to begin operations now.', isFavorite: false },
            { id: 'snip-2', title: '[Facebook Ad]', content: '🚀 ATTENTION CREATORS: Stop building single assets. This modular framework turns browser caches into deployment channels.', isFavorite: false },
            { id: 'snip-3', title: '[Offer Stack]', content: '💎 The Complete Protocol Bundle ($997 Value)\n💎 1-on-1 Configuration Consult ($450 Value)\n🎯 Total Architectural Value: $1,447\n👉 Today Only: $47', isFavorite: false },
            { id: 'snip-4', title: '[Guarantee]', content: '🔒 100% Risk-Free Ironclad Implementation Guarantee: Execute this blueprint architectural system for 30 days. If you cannot convert deployment vectors, notify our engineering node for a prompt processing extraction structural return.', isFavorite: false }
        ];
        this.saveStateToStorage();
    }

    // --- Architectural Document Node Handling (CRUD Architecture) ---
    createNewDocumentNode() {
        const newNote = {
            id: 'note_' + Date.now(),
            workspace: this.state.activeWorkspace,
            title: 'Untitled Deployment Draft',
            category: '',
            content: '',
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            isPinned: false,
            isFavorite: false,
            isArchived: false
        };
        this.state.notes.unshift(newNote);
        this.state.activeNoteId = newNote.id;
        this.saveStateToStorage();
        this.renderWorkspaceNotesPipeline();
        this.loadActiveDocumentToEditor(newNote.id);
        this.logSystemActivity(this.state.activeWorkspace, 'Create Note Node', newNote.title);
    }

    loadActiveDocumentToEditor(noteId) {
        const note = this.state.notes.find(n => n.id === noteId);
        if (!note) return;
        this.state.activeNoteId = noteId;
        
        this.dom.editorControlsBar.style.display = 'flex';
        this.dom.activeNoteTitle.value = note.title;
        this.dom.activeNoteCategory.value = note.category || '';
        this.dom.richEditor.innerHTML = note.content || '';
        
        // Sync operation elements active display matrix attributes indicators state
        document.getElementById('action-pin').classList.toggle('active', note.isPinned);
        document.getElementById('action-fav').classList.toggle('active', note.isFavorite);
        
        // Highlight chosen selection within workflow pipeline selector tracking loop
        document.querySelectorAll('.note-card').forEach(card => {
            card.classList.toggle('active', card.getAttribute('data-id') === noteId);
        });

        this.runMetricsExecutionEngine();
    }

    updateActiveNoteAttribute(field, value) {
        const note = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if (!note) return;
        note[field] = value;
        note.lastModified = new Date().toISOString();
        
        // Continuous Debounced Internal Operations Saving Routine Sequence Loop
        if (this.noteAutoSaveDebounce) clearTimeout(this.noteAutoSaveDebounce);
        this.noteAutoSaveDebounce = setTimeout(() => {
            this.saveStateToStorage();
        }, 1000);
    }

    toggleActiveNoteBooleanFlag(field) {
        const note = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if (!note) return;
        note[field] = !note[field];
        note.lastModified = new Date().toISOString();
        this.saveStateToStorage();
        this.loadActiveDocumentToEditor(note.id);
        this.renderWorkspaceNotesPipeline();
    }

    duplicateActiveDocumentNode() {
        const srcNote = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if (!srcNote) return;
        const clonedNote = {
            ...srcNote,
            id: 'note_' + Date.now(),
            title: `${srcNote.title} (Clone)`,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            isPinned: false
        };
        this.state.notes.unshift(clonedNote);
        this.state.activeNoteId = clonedNote.id;
        this.saveStateToStorage();
        this.renderWorkspaceNotesPipeline();
        this.loadActiveDocumentToEditor(clonedNote.id);
        this.logSystemActivity(this.state.activeWorkspace, 'Duplicate Node Entry', clonedNote.title);
    }

    copyActiveDocumentPayloadToClipboard() {
        const note = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if (!note) return;
        const plainText = this.dom.richEditor.innerText;
        navigator.clipboard.writeText(plainText).then(() => {
            alert('Content successfully cloned into host system clipboard vector.');
            this.logSystemActivity(this.state.activeWorkspace, 'Copy Action (Clipboard)', note.title);
        });
    }

    deleteActiveDocumentNode() {
        if (!this.state.activeNoteId) return;
        if (!confirm('Execute terminal destruction sequence on active document?')) return;
        
        const index = this.state.notes.findIndex(n => n.id === this.state.activeNoteId);
        if (index !== -1) {
            this.logSystemActivity(this.state.activeWorkspace, 'Terminal Eviction Delete', this.state.notes[index].title);
            this.state.notes.splice(index, 1);
            this.state.activeNoteId = null;
            this.saveStateToStorage();
            
            this.dom.editorControlsBar.style.display = 'none';
            this.dom.richEditor.innerHTML = '';
            this.dom.activeNoteTitle.value = '';
            
            this.renderWorkspaceNotesPipeline();
        }
    }

    // --- Dynamic Pipeline Rendering Engines Interface Core Layer ---
    renderWorkspaceNotesPipeline(notesDataset = null) {
        if (!this.dom.notesListTarget) return;
        this.dom.notesListTarget.innerHTML = '';
        
        // Dynamically update dropdown structure filters options mapping matrix configurations items arrays loop processing
        this.dom.activeNoteCategory.innerHTML = '<option value="">No Category</option>' + 
            this.state.categories.map(c => `<option value="${c}">${c}</option>`).join('');

        // Apply fallback standard filter parsing layer
        const targetedDataset = notesDataset || this.state.notes.filter(n => n.workspace === this.state.stateWorkspaceMapping() && !n.isArchived);

        // Sorting Engine Framework Rule: Pinned Elements Array items Bubble Up First
        targetedDataset.sort((a,b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        if (targetedDataset.length === 0) {
            this.dom.notesListTarget.innerHTML = '<div class="empty-state-notice">Pipeline Clear. Click Create Entry to build workflow data streams.</div>';
            return;
        }

        targetedDataset.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${this.state.activeNoteId === note.id ? 'active' : ''}`;
            card.setAttribute('data-id', note.id);
            card.setAttribute('draggable', 'true');
            
            const excerpt = note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 80) : 'Empty text layout...';
            const dateStr = new Date(note.lastModified).toLocaleDateString();
            
            card.innerHTML = `
                <div class="note-badge-row">
                    ${note.isPinned ? '<span class="badge-ui">📌</span>' : ''}
                    ${note.isFavorite ? '<span class="badge-ui">⭐</span>' : ''}
                </div>
                <div class="note-card-title">${note.title || 'Untitled Node'}</div>
                <div class="note-card-excerpt">${excerpt}</div>
                <div class="note-card-meta">
                    <span>${dateStr}</span>
                    ${note.category ? `<span class="note-card-cat-tag">${note.category}</span>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => this.loadActiveDocumentToEditor(note.id));
            this.initializeDragAndDropHandlers(card);
            
            this.dom.notesListTarget.appendChild(card);
        });
    }

    stateWorkspaceMapping() {
        return this.state.activeWorkspace;
    }

    renderAllSystemViews() {
        this.renderGlobalDashboardCounters();
        this.dom.dashboardScratchpad.value = this.state.scratchpad || '';
        
        if (this.state.activeView === 'workspace-template') {
            this.renderWorkspaceNotesPipeline();
        } else if (this.state.activeView === 'favorites') {
            this.renderSystemFavoritesView();
        } else if (this.state.activeView === 'pinned') {
            this.renderSystemPinnedView();
        } else if (this.state.activeView === 'history') {
            this.renderSystemAuditTrailsView();
        } else if (this.state.activeView === 'settings') {
            this.renderSnippetsControlPanelConfiguration();
            this.renderSettingsCategoryPanelManager();
        }
    }

    renderGlobalDashboardCounters() {
        if (!document.getElementById('stat-total-notes')) return;
        document.getElementById('stat-total-notes').textContent = this.state.notes.length;
        
        const rawWordsSum = this.state.notes.reduce((acc, curr) => {
            const pureStr = curr.content ? curr.content.replace(/<[^>]*>/g, '') : '';
            return acc + (pureStr.trim() ? pureStr.trim().split(/\s+/).length : 0);
        }, 0);
        
        document.getElementById('stat-total-words').textContent = rawWordsSum;
        document.getElementById('stat-total-snippets').textContent = this.state.snippets.length;
        document.getElementById('stat-total-pinned').textContent = this.state.notes.filter(n => n.isPinned).length;
    }

    renderSystemFavoritesView() {
        this.dom.favoritesGrid.innerHTML = '';
        const favNotes = this.state.notes.filter(n => n.isFavorite);
        const favSnips = this.state.snippets.filter(s => s.isFavorite);

        if(favNotes.length === 0 && favSnips.length === 0) {
            this.dom.favoritesGrid.innerHTML = '<p class="text-secondary">No favorites tagged in the current workspace cluster.</p>';
            return;
        }

        favNotes.forEach(n => {
            this.dom.favoritesGrid.appendChild(this.createShowcaseCardToken('Document Node', n.title, n.workspace, () => {
                this.state.activeWorkspace = n.workspace;
                this.switchView('workspace-template');
                this.loadActiveDocumentToEditor(n.id);
            }));
        });
        favSnips.forEach(s => {
            this.dom.favoritesGrid.appendChild(this.createShowcaseCardToken('Snippet Payload', s.title, s.content, () => {
                this.switchView('settings');
            }));
        });
    }

    renderSystemPinnedView() {
        this.dom.pinnedGrid.innerHTML = '';
        const pinned = this.state.notes.filter(n => n.isPinned);
        if(pinned.length === 0) {
            this.dom.pinnedGrid.innerHTML = '<p class="text-secondary">No production documents pinned to the display panel grid.</p>';
            return;
        }
        pinned.forEach(n => {
            this.dom.pinnedGrid.appendChild(this.createShowcaseCardToken(n.workspace, n.title, n.content.replace(/<[^>]*>/g, '').substring(0, 140), () => {
                this.state.activeWorkspace = n.workspace;
                this.switchView('workspace-template');
                this.loadActiveDocumentToEditor(n.id);
            }));
        });
    }

    createShowcaseCardToken(badge, heading, text, actionClick) {
        const item = document.createElement('div');
        item.className = 'showcase-card';
        item.innerHTML = `
            <div class="showcase-header"><span>${badge}</span></div>
            <h3>${heading}</h3>
            <div class="showcase-body">${text}</div>
            <button class="btn btn-sm">Mount Anchor</button>
        `;
        item.querySelector('button').addEventListener('click', actionClick);
        return item;
    }

    renderSystemAuditTrailsView() {
        this.dom.historyTableBody.innerHTML = '';
        if(this.state.history.length === 0) {
            this.dom.historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-secondary);">Audit operational register data streams clear.</td></tr>';
            return;
        }
        this.state.history.slice().reverse().forEach(h => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(h.timestamp).toLocaleTimeString()}</td>
                <td><code>${h.workspace}</code></td>
                <td><b>${h.action}</b></td>
                <td style="color:var(--text-secondary);">${h.preview}</td>
            `;
            this.dom.historyTableBody.appendChild(row);
        });
    }

    renderSnippetsControlPanelConfiguration() {
        this.dom.snippetsConfigList.innerHTML = '';
        this.state.snippets.forEach(s => {
            const div = document.createElement('div');
            div.className = 'snippet-item-pill';
            div.innerHTML = `
                <div class="snippet-item-info">
                    <h4>${s.title} ${s.isFavorite ? '⭐' : ''}</h4>
                    <p>${s.content.substring(0, 70)}...</p>
                </div>
                <div style="display:flex; gap: 4px;">
                    <button class="btn btn-sm action-insert-snip">Insert</button>
                    <button class="btn btn-sm action-fav-snip">${s.isFavorite ? 'Unfav' : 'Fav'}</button>
                    <button class="btn btn-sm text-danger action-del-snip">🗑️</button>
                </div>
            `;
            
            div.querySelector('.action-insert-snip').addEventListener('click', () => this.injectSnippetToActiveEditorContext(s.content));
            div.querySelector('.action-fav-snip').addEventListener('click', () => {
                s.isFavorite = !s.isFavorite;
                this.saveStateToStorage();
                this.renderSnippetsControlPanelConfiguration();
            });
            div.querySelector('.action-del-snip').addEventListener('click', () => {
                this.state.snippets = this.state.snippets.filter(sn => sn.id !== s.id);
                this.saveStateToStorage();
                this.renderSnippetsControlPanelConfiguration();
            });

            this.dom.snippetsConfigList.appendChild(div);
        });
    }

    injectSnippetToActiveEditorContext(content) {
        this.switchView('workspace-template');
        this.dom.richEditor.focus();
        document.execCommand('insertText', false, content);
        if(this.state.activeNoteId) {
            this.updateActiveNoteAttribute('content', this.dom.richEditor.innerHTML);
        }
        this.logSystemActivity(this.state.activeWorkspace, 'Insert Snippet Template Block', content.substring(0, 40));
    }

    renderSettingsCategoryPanelManager() {
        this.dom.categoryListRender.innerHTML = '';
        this.state.categories.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'cat-pill';
            li.innerHTML = `<span>${cat}</span><button type="button">&times;</button>`;
            li.querySelector('button').addEventListener('click', () => {
                this.state.categories = this.state.categories.filter(c => c !== cat);
                this.saveStateToStorage();
                this.renderSettingsCategoryPanelManager();
            });
            this.dom.categoryListRender.appendChild(li);
        });
    }

    createCustomCategoryTrack() {
        const val = this.dom.newCategoryName.value.trim();
        if(!val || this.state.categories.includes(val)) return;
        this.state.categories.push(val);
        this.dom.newCategoryName.value = '';
        this.saveStateToStorage();
        this.renderSettingsCategoryPanelManager();
    }

    commitCustomSnippetAsset() {
        const title = this.dom.snipTitle.value.trim();
        const content = this.dom.snipContent.value.trim();
        if(!title || !content) return;
        
        this.state.snippets.push({
            id: 'snip_' + Date.now(),
            title,
            content,
            isFavorite: false
        });
        this.dom.snipTitle.value = '';
        this.dom.snipContent.value = '';
        this.saveStateToStorage();
        this.renderSnippetsControlPanelConfiguration();
    }

    // --- Metrics Processing Engine System Subsystem Module ---
    runMetricsExecutionEngine() {
        const text = this.dom.richEditor.innerText || '';
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphCount = text.split(/\n+/).filter(p => p.trim().length > 0).length;

        // Metrology metrics definitions benchmarks: 200WPM read rating, 150WPM speak tracking calculation
        const readingMinutes = Math.ceil(wordCount / 200);
        const speakingMinutes = Math.ceil(wordCount / 150);

        document.getElementById('m-words').textContent = wordCount;
        document.getElementById('m-chars').textContent = charCount;
        document.getElementById('m-paras').textContent = paragraphCount;
        document.getElementById('m-sentences').textContent = sentenceCount;
        document.getElementById('m-read').textContent = `${readingMinutes}m`;
        document.getElementById('m-speak').textContent = `${speakingMinutes}m`;

        // Pass calculated elements payload variables down to active layout reference metadata nodes blocks
        const node = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if(node) {
            node.wordCount = wordCount;
        }
    }

    // --- Instant Dynamic Evaluation System Processing Routing (Search Subsystem) ---
    executeSearchPipeline() {
        const query = this.dom.globalSearch.value.toLowerCase().trim();
        const scope = this.dom.searchScope.value;

        if(!query) {
            this.renderWorkspaceNotesPipeline();
            return;
        }

        let scopeDataset = [];
        if (scope === 'current') {
            scopeDataset = this.state.notes.filter(n => n.workspace === this.state.activeWorkspace);
        } else if (scope === 'all') {
            scopeDataset = this.state.notes;
        } else if (scope === 'favorites') {
            scopeDataset = this.state.notes.filter(n => n.isFavorite);
        } else if (scope === 'pinned') {
            scopeDataset = this.state.notes.filter(n => n.isPinned);
        }

        const matches = scopeDataset.filter(n => {
            return n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query);
        });

        this.renderWorkspaceNotesPipeline(matches);
    }

    // --- Advanced Interactive Localized Find & Replace System Engine ---
    findNextTextOccurence() {
        const findStr = this.dom.findInput.value;
        if (!findStr) return;
        
        // Native window selection parsing sequence algorithm initialization
        if (window.find) {
            const caseSensitive = this.dom.findCase.checked;
            window.find(findStr, caseSensitive, false, true, this.dom.findWord.checked, false, false);
        }
    }

    executeTextReplacement(replaceAll = false) {
        const findStr = this.dom.findInput.value;
        const replaceStr = this.dom.replaceInput.value;
        if(!findStr) return;

        let content = this.dom.richEditor.innerHTML;
        // Escape standard HTML tags context validation boundary execution flags
        const regexFlags = `g${this.dom.findCase.checked ? '' : 'i'}`;
        let regexPattern = findStr;
        if(this.dom.findWord.checked) regexPattern = `\\b${findStr}\\b`;

        const regex = new RegExp(regexPattern, regexFlags);

        if(replaceAll) {
            content = content.replace(regex, replaceStr);
        } else {
            content = content.replace(regex, replaceStr); // Fallback implementation strategy for localized compilation instance
        }

        this.dom.richEditor.innerHTML = content;
        this.updateActiveNoteAttribute('content', content);
        this.runMetricsExecutionEngine();
    }

    // --- Native Drag and Drop Logic Structure Pipelines Block ---
    initializeDragAndDropHandlers(cardElement) {
        cardElement.addEventListener('dragstart', (e) => {
            cardElement.classList.add('dragging');
            e.dataTransfer.setData('text/plain', cardElement.getAttribute('data-id'));
            e.dataTransfer.effectAllowed = 'move';
        });

        cardElement.addEventListener('dragend', () => {
            cardElement.classList.remove('dragging');
        });

        // Map operational nodes components sidebar nav points elements to receive files drops mutations arrays
        document.querySelectorAll('.menu-item[data-workspace]').forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const droppedNoteId = e.dataTransfer.getData('text/plain');
                const workspaceDestination = zone.getAttribute('data-workspace');
                
                const targetNote = this.state.notes.find(n => n.id === droppedNoteId);
                if(targetNote && targetNote.workspace !== workspaceDestination) {
                    this.logSystemActivity(targetNote.workspace, `Pipeline Migration Vector -> ${workspaceDestination}`, targetNote.title);
                    targetNote.workspace = workspaceDestination;
                    targetNote.lastModified = new Date().toISOString();
                    this.saveStateToStorage();
                    this.renderWorkspaceNotesPipeline();
                }
            });
        });
    }

    // --- System Asset Data Portability Suite Exports Subsystem Protocol ---
    exportData(formatType) {
        const activeNote = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if(!activeNote) { alert('No document actively compiled in system window mount point context.'); return; }

        let payload = '';
        let mimeType = 'text/plain';
        let extension = 'txt';

        const rawText = this.dom.richEditor.innerText;
        const htmlText = this.dom.richEditor.innerHTML;

        switch(formatType) {
            case 'txt':
                payload = `Title: ${activeNote.title}\nWorkspace: ${activeNote.workspace}\nModified: ${activeNote.lastModified}\n\n${rawText}`;
                break;
            case 'md':
                payload = `# ${activeNote.title}\n\n*Workspace Target: ${activeNote.workspace}*\n*Modified Datetime: ${activeNote.lastModified}*\n\n${rawText}`; // Simple baseline convert fallback parsing execution sequence
                break;
            case 'html':
                payload = `<!DOCTYPE html><html><head><title>${activeNote.title}</title><meta charset="utf-8"></head><body>${htmlText}</body></html>`;
                mimeType = 'text/html';
                extension = 'html';
                break;
            case 'doc':
                payload = htmlText;
                mimeType = 'application/msword';
                extension = 'doc';
                break;
        }

        this.triggerNativeBrowserAssetDownload(payload, `cwp_${activeNote.workspace.toLowerCase().replace(/\s+/g,'_')}_note.${extension}`, mimeType);
    }

    exportGlobalBackup() {
        const fullBackupPayload = JSON.stringify(this.state, null, 2);
        this.triggerNativeBrowserAssetDownload(fullBackupPayload, `cwp_system_integrity_snapshot_${Date.now()}.json`, 'application/json');
        this.logSystemActivity('System Control', 'Full Backup Engine Core Snapshot Created', '');
    }

    triggerNativeBrowserAssetDownload(payloadData, filename, contentType) {
        const blob = new Blob([payloadData], { type: contentType });
        const temporaryAnchor = document.createElement('a');
        temporaryAnchor.href = URL.createObjectURL(blob);
        temporaryAnchor.download = filename;
        document.body.appendChild(temporaryAnchor);
        temporaryAnchor.click();
        document.body.removeChild(temporaryAnchor);
    }

    handleSystemDataIngest(event) {
        const uploadedFile = event.target.files[0];
        if (!uploadedFile) return;

        const readerNode = new FileReader();
        readerNode.onload = (e) => {
            try {
                const parsedState = JSON.parse(e.target.result);
                if(parsedState.notes && parsedState.snippets) {
                    this.state = { ...this.state, ...parsedState };
                    this.saveStateToStorage();
                    this.renderAllSystemViews();
                    alert("System configuration and workspace data layers restored successfully.");
                } else {
                    alert("Invalid JSON architecture schematic configuration parameters mismatch.");
                }
            } catch (err) {
                alert("File corruption detected. Processing validation structural recovery failure.");
            }
        };
        readerNode.readAsText(uploadedFile);
    }

    // --- Automated Rollback Snapshot Matrix Scheduler ---
    initBackupSystem() {
        // Continuous Automated Background Core Iterations Interval Mapping: 5 Minutes (300000 ms)
        setInterval(() => {
            localStorage.setItem('cwp_automated_integrity_rollback', JSON.stringify(this.state));
            this.logSystemActivity('System Engine', 'Automatic Core State Rollback Point Committed', `Notes Count Stack: ${this.state.notes.length}`);
        }, 300000);
    }

    // --- Real-time Activity Logs Auditing Registry Node Generator ---
    logSystemActivity(workspace, action, preview) {
        const trackingLog = {
            timestamp: new Date().toISOString(),
            workspace,
            action,
            preview: preview.substring(0, 120)
        };
        this.state.history.push(trackingLog);
        if(this.state.history.length > 100) this.state.history.shift();
        this.saveStateToStorage();
    }

    // --- Advanced Native Core Theme Processing Logic ---
    toggleThemeSystem() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        this.saveStateToStorage();
    }

    // --- Key Down Event Capture Engine (Keyboard Shortcuts Matrix) ---
    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey)) {
                switch(e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.saveStateToStorage();
                        alert('System Core State Committed Successfully.');
                        break;
                    case 'f':
                        e.preventDefault();
                        this.dom.findInput.focus();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.dom.replaceInput.focus();
                        break;
                    case 'd':
                        e.preventDefault();
                        if (this.state.activeView === 'workspace-template') this.duplicateActiveDocumentNode();
                        break;
                    case 'z':
                        // If focusing on scratchpad intercept state parameters metrics definitions
                        if(document.activeElement === this.dom.dashboardScratchpad) {
                            e.preventDefault();
                            this.executeScratchpadUndo();
                        }
                        break;
                    case 'y':
                        if(document.activeElement === this.dom.dashboardScratchpad) {
                            e.preventDefault();
                            this.executeScratchpadRedo();
                        }
                        break;
                }
            }
        });
    }
}

// Instantiate App Engine
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new CreatorWorkspacePro();
});
