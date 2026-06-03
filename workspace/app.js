/**
 * Creator Workspace Pro — Fully Synchronized Core Application Architecture Engine
 * Built using high performance Vanilla ECMAScript standards and atomic persistence layers.
 */

class CreatorWorkspacePro {
    constructor() {
        this.state = {
            notes: [],
            categories: ['Prototypes', 'Copywriting', 'Blueprints'],
            snippets: [],
            history: [],
            scratchpad: '',
            activeWorkspace: 'Research',
            activeNoteId: null,
            activeView: 'dashboard',
            theme: 'dark'
        };

        // Command Memory Buffers for Scratch Pad Undo/Redo System
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
            btnCreateNote: document.getElementById('btn-create-note'),
            dashActionCreate: document.getElementById('dash-action-create')
        };
    }

    loadLocalStorage() {
        try {
            const stored = localStorage.getItem('cwp_master_state');
            if (stored) {
                const parsed = JSON.parse(stored);
                this.state = { ...this.state, ...parsed };
            }
            // Set data attribute explicitly on load to guarantee UI synchronization
            document.documentElement.setAttribute('data-theme', this.state.theme || 'dark');
        } catch (e) {
            console.error("Master State Deserialization Fault:", e);
        }
    }

    saveStateToStorage() {
        localStorage.setItem('cwp_master_state', JSON.stringify(this.state));
        this.triggerVisualSavePill();
    }

    triggerVisualSavePill() {
        if (!this.dom.autoSaveIndicator) return;
        this.dom.autoSaveIndicator.textContent = 'Syncing Content...';
        this.dom.autoSaveIndicator.style.opacity = '1';
        setTimeout(() => {
            this.dom.autoSaveIndicator.textContent = 'System Synced';
        }, 800);
    }

    bindEvents() {
        // Core User Interface Engine Listeners
        this.dom.themeToggle.addEventListener('click', () => this.toggleThemeSystem());
        this.dom.mobileMenuBtn.addEventListener('click', () => this.dom.sidebar.classList.toggle('open'));

        // Left Menu Workspace Router Navigation
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
                } else {
                    this.switchView(targetView);
                }
                this.dom.sidebar.classList.remove('open');
            });
        });

        // Search Filters Registry Hooks
        this.dom.globalSearch.addEventListener('input', () => this.executeSearchPipeline());
        this.dom.searchScope.addEventListener('change', () => this.executeSearchPipeline());

        // Scratch Pad System Operations Sequence
        this.dom.dashboardScratchpad.addEventListener('input', (e) => {
            this.state.scratchpad = e.target.value;
            this.trackScratchpadMutation(this.state.scratchpad);
            this.persistScratchpadDelta();
        });
        this.dom.scratchUndo.addEventListener('click', () => this.executeScratchpadUndo());
        this.dom.scratchRedo.addEventListener('click', () => this.executeScratchpadRedo());

        // Document Processing Action Triggers
        this.dom.btnCreateNote.addEventListener('click', () => this.createNewDocumentNode());
        this.dom.dashActionCreate.addEventListener('click', () => {
            this.switchView('workspace-template');
            this.createNewDocumentNode();
        });

        this.dom.activeNoteTitle.addEventListener('input', (e) => {
            if (!this.state.activeNoteId) return;
            this.updateActiveNoteAttribute('title', e.target.value);
            this.renderWorkspaceNotesPipeline();
        });
        this.dom.activeNoteCategory.addEventListener('change', (e) => {
            this.updateActiveNoteAttribute('category', e.target.value);
            this.renderWorkspaceNotesPipeline();
        });
        this.dom.richEditor.addEventListener('input', () => {
            if (!this.state.activeNoteId) return;
            this.updateActiveNoteAttribute('content', this.dom.richEditor.innerHTML);
            this.runMetricsExecutionEngine();
        });

        // Dynamic Rich Text Content Editor Actions Ribbon Links Matrix
        document.querySelectorAll('.rich-toolbar .tool-btn[data-cmd]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const cmd = btn.getAttribute('data-cmd');
                const arg = btn.getAttribute('data-arg') || null;
                document.execCommand(cmd, false, arg);
                this.dom.richEditor.focus();
                if (this.state.activeNoteId) {
                    this.updateActiveNoteAttribute('content', this.dom.richEditor.innerHTML);
                }
            });
        });

        document.getElementById('tool-link').addEventListener('click', () => {
            const url = prompt("Enter target URL address pointer:");
            if (url) document.execCommand('createLink', false, url);
        });

        document.getElementById('tool-table').addEventListener('click', () => {
            const rows = prompt("Enter matrix row height count:", "3");
            const cols = prompt("Enter matrix columns width count:", "3");
            if (!rows || !cols) return;
            let tableHtml = '<table>';
            for (let i = 0; i < rows; i++) {
                tableHtml += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHtml += i === 0 ? '<th>Header Grid</th>' : '<td>Data Vector</td>';
                }
                tableHtml += '</tr>';
            }
            tableHtml += '</table><p></p>';
            document.execCommand('insertHTML', false, tableHtml);
        });

        // String Parsing Engine Search Component Logic
        this.dom.btnFindNext.addEventListener('click', () => this.findNextTextOccurence());
        this.dom.btnReplace.addEventListener('click', () => this.executeTextReplacement(false));
        this.dom.btnReplaceAll.addEventListener('click', () => this.executeTextReplacement(true));

        // Command Button Options Bar Connections
        document.getElementById('action-pin').addEventListener('click', () => this.toggleActiveNoteBooleanFlag('isPinned'));
        document.getElementById('action-fav').addEventListener('click', () => this.toggleActiveNoteBooleanFlag('isFavorite'));
        document.getElementById('action-duplicate').addEventListener('click', () => this.duplicateActiveDocumentNode());
        document.getElementById('action-copy-text').addEventListener('click', () => this.copyActiveDocumentPayloadToClipboard());
        document.getElementById('action-delete').addEventListener('click', () => this.deleteActiveDocumentNode());

        // Configuration Control Panel Ingestion Pipelines
        this.dom.btnAddCategory.addEventListener('click', () => this.createCustomCategoryTrack());
        this.dom.btnSaveSnippet.addEventListener('click', () => this.commitCustomSnippetAsset());
        this.dom.importFileUploader.addEventListener('change', (e) => this.handleSystemDataIngest(e));
        this.dom.btnManualBackup.addEventListener('click', () => this.exportGlobalBackup());
    }

    switchView(viewId) {
        this.state.activeView = viewId;
        document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));
        
        const targetViewElement = document.getElementById(`view-${viewId}`);
        if (targetViewElement) {
            targetViewElement.classList.add('active');
        }
        
        // Sync sub-element states highlighting on active navigation route change
        document.querySelectorAll('.menu-item').forEach(item => {
            if(item.getAttribute('data-target') === viewId) {
                item.classList.add('active');
            }
        });

        this.renderAllSystemViews();
    }

    persistScratchpadDelta() {
        if (this.scratchTimeDebounce) clearTimeout(this.scratchTimeDebounce);
        this.scratchTimeDebounce = setTimeout(() => {
            this.saveStateToStorage();
            this.dom.scratchSavedTime.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
            this.logSystemActivity('ScratchPad', 'Autosave Commit', this.state.scratchpad.substring(0, 50));
        }, 1200);
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

    injectDefaultSnippets() {
        if (this.state.snippets && this.state.snippets.length > 0) return;
        this.state.snippets = [
            { id: 'snip-1', title: '[CTA]', content: '🔥 Claim your access immediately before pricing scales up. Click below to begin operations now.', isFavorite: false },
            { id: 'snip-2', title: '[Facebook Ad]', content: '🚀 ATTENTION CREATORS: Stop building single assets. This modular framework turns browser caches into deployment channels.', isFavorite: false },
            { id: 'snip-3', title: '[Offer Stack]', content: '💎 The Complete Protocol Bundle ($997 Value)\n💎 1-on-1 Configuration Consult ($450 Value)\n🎯 Total Architectural Value: $1,447\n👉 Today Only: $47', isFavorite: false },
            { id: 'snip-4', title: '[Guarantee]', content: '🔒 100% Risk-Free Ironclad Implementation Guarantee: Execute this blueprint architectural system for 30 days. If you cannot convert deployment vectors, notify our engineering node.', isFavorite: false }
        ];
        this.saveStateToStorage();
    }

    createNewDocumentNode() {
        const newNote = {
            id: 'note_' + Date.now(),
            workspace: this.state.activeWorkspace,
            title: 'Untitled Production Asset Document',
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
        this.logSystemActivity(this.state.activeWorkspace, 'Created Note Entry', newNote.title);
    }

    loadActiveDocumentToEditor(noteId) {
        const note = this.state.notes.find(n => n.id === noteId);
        if (!note) return;
        this.state.activeNoteId = noteId;
        
        this.dom.editorControlsBar.style.display = 'flex';
        this.dom.activeNoteTitle.value = note.title;
        this.dom.activeNoteCategory.value = note.category || '';
        this.dom.richEditor.innerHTML = note.content || '';
        
        document.getElementById('action-pin').classList.toggle('active', note.isPinned);
        document.getElementById('action-fav').classList.toggle('active', note.isFavorite);
        
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
            title: `${srcNote.title} (Copy)`,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            isPinned: false
        };
        this.state.notes.unshift(clonedNote);
        this.state.activeNoteId = clonedNote.id;
        this.saveStateToStorage();
        this.renderWorkspaceNotesPipeline();
        this.loadActiveDocumentToEditor(clonedNote.id);
        this.logSystemActivity(this.state.activeWorkspace, 'Duplicated Core Node', clonedNote.title);
    }

    copyActiveDocumentPayloadToClipboard() {
        const note = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if (!note) return;
        const textData = this.dom.richEditor.innerText;
        navigator.clipboard.writeText(textData).then(() => {
            alert('Content committed to clipboard storage layout buffer.');
            this.logSystemActivity(this.state.activeWorkspace, 'Clipboard Extraction', note.title);
        });
    }

    deleteActiveDocumentNode() {
        if (!this.state.activeNoteId) return;
        if (!confirm('Erase selected file metadata structure permanently?')) return;
        
        const index = this.state.notes.findIndex(n => n.id === this.state.activeNoteId);
        if (index !== -1) {
            this.logSystemActivity(this.state.activeWorkspace, 'Evicted Document File Node', this.state.notes[index].title);
            this.state.notes.splice(index, 1);
            this.state.activeNoteId = null;
            this.saveStateToStorage();
            
            this.dom.editorControlsBar.style.display = 'none';
            this.dom.richEditor.innerHTML = '';
            this.dom.activeNoteTitle.value = '';
            
            this.renderWorkspaceNotesPipeline();
        }
    }

    renderWorkspaceNotesPipeline(notesDataset = null) {
        if (!this.dom.notesListTarget) return;
        this.dom.notesListTarget.innerHTML = '';
        
        this.dom.activeNoteCategory.innerHTML = '<option value="">No Category assigned</option>' + 
            this.state.categories.map(c => `<option value="${c}">${c}</option>`).join('');

        const dataSetSource = notesDataset || this.state.notes.filter(n => n.workspace === this.state.activeWorkspace && !n.isArchived);

        // Sort Processing Metric Layer: Pinned documents bubble up first
        dataSetSource.sort((a,b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

        if (dataSetSource.length === 0) {
            this.dom.notesListTarget.innerHTML = '<div class="empty-state-notice">Pipeline empty. Build fresh document files cards tracks to begin.</div>';
            return;
        }

        dataSetSource.forEach(note => {
            const card = document.createElement('div');
            card.className = `note-card ${this.state.activeNoteId === note.id ? 'active' : ''}`;
            card.setAttribute('data-id', note.id);
            
            const rawExcerpt = note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 80) : 'Blank asset compilation block data...';
            const dateFormattedString = new Date(note.lastModified).toLocaleDateString();
            
            card.innerHTML = `
                <div class="note-badge-row">
                    ${note.isPinned ? '<span>📌</span>' : ''}
                    ${note.isFavorite ? '<span>⭐</span>' : ''}
                </div>
                <div class="note-card-title">${note.title || 'Untitled Node File'}</div>
                <div class="note-card-excerpt">${rawExcerpt}</div>
                <div class="note-card-meta">
                    <span>${dateFormattedString}</span>
                    ${note.category ? `<span class="note-card-cat-tag">${note.category}</span>` : ''}
                </div>
            `;
            
            card.addEventListener('click', () => this.loadActiveDocumentToEditor(note.id));
            this.dom.notesListTarget.appendChild(card);
        });
    }

    renderAllSystemViews() {
        this.renderGlobalDashboardCounters();
        this.dom.dashboardScratchpad.value = this.state.scratchpad || '';
        
        if (this.state.activeView === 'workspace-template') {
            this.renderWorkspaceNotesPipeline();
            // Auto-load first file if active note context empty
            const activeWorkspaceNotes = this.state.notes.filter(n => n.workspace === this.state.activeWorkspace);
            if (activeWorkspaceNotes.length > 0 && !this.state.activeNoteId) {
                this.loadActiveDocumentToEditor(activeWorkspaceNotes[0].id);
            }
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
        
        const cumulativeWordsCount = this.state.notes.reduce((acc, curr) => {
            const parsedContentText = curr.content ? curr.content.replace(/<[^>]*>/g, '') : '';
            return acc + (parsedContentText.trim() ? parsedContentText.trim().split(/\s+/).length : 0);
        }, 0);
        
        document.getElementById('stat-total-words').textContent = cumulativeWordsCount;
        document.getElementById('stat-total-snippets').textContent = this.state.snippets.length;
        document.getElementById('stat-total-pinned').textContent = this.state.notes.filter(n => n.isPinned).length;
    }

    renderSystemFavoritesView() {
        this.dom.favoritesGrid.innerHTML = '';
        const favNotes = this.state.notes.filter(n => n.isFavorite);
        const favSnips = this.state.snippets.filter(s => s.isFavorite);

        if(favNotes.length === 0 && favSnips.length === 0) {
            this.dom.favoritesGrid.innerHTML = '<div class="empty-state-notice" style="grid-column: 1/-1;">No favorites tagged in current cluster tracks data profiles.</div>';
            return;
        }

        favNotes.forEach(n => {
            this.dom.favoritesGrid.appendChild(this.createShowcaseCardToken('Document Node File', n.title, n.workspace, () => {
                this.state.activeWorkspace = n.workspace;
                this.switchView('workspace-template');
                this.loadActiveDocumentToEditor(n.id);
            }));
        });
        favSnips.forEach(s => {
            this.dom.favoritesGrid.appendChild(this.createShowcaseCardToken('Snippet Block asset', s.title, s.content, () => {
                this.switchView('settings');
            }));
        });
    }

    renderSystemPinnedView() {
        this.dom.pinnedGrid.innerHTML = '';
        const pinned = this.state.notes.filter(n => n.isPinned);
        if(pinned.length === 0) {
            this.dom.pinnedGrid.innerHTML = '<div class="empty-state-notice" style="grid-column: 1/-1;">No priority production tracking markers deployed.</div>';
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
            <button class="btn btn-sm">Mount Anchor Context</button>
        `;
        item.querySelector('button').addEventListener('click', actionClick);
        return item;
    }

    renderSystemAuditTrailsView() {
        this.dom.historyTableBody.innerHTML = '';
        if(this.state.history.length === 0) {
            this.dom.historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-secondary);">Audit monitoring registries clean.</td></tr>';
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
                    <p>${s.content.substring(0, 60)}...</p>
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
        this.logSystemActivity(this.state.activeWorkspace, 'Snippet Macro Deployed', content.substring(0, 40));
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

    runMetricsExecutionEngine() {
        const textContentSourceStr = this.dom.richEditor.innerText || '';
        const charCount = textContentSourceStr.length;
        const wordCount = textContentSourceStr.trim() ? textContentSourceStr.trim().split(/\s+/).length : 0;
        const sentenceCount = textContentSourceStr.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphCount = textContentSourceStr.split(/\n+/).filter(p => p.trim().length > 0).length;

        const readingMinutes = Math.ceil(wordCount / 200);
        const speakingMinutes = Math.ceil(wordCount / 150);

        document.getElementById('m-words').textContent = wordCount;
        document.getElementById('m-chars').textContent = charCount;
        document.getElementById('m-paras').textContent = paragraphCount;
        document.getElementById('m-sentences').textContent = sentenceCount;
        document.getElementById('m-read').textContent = `${readingMinutes}m`;
        document.getElementById('m-speak').textContent = `${speakingMinutes}m`;

        const activeTrackingNode = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if(activeTrackingNode) {
            activeTrackingNode.wordCount = wordCount;
        }
    }

    executeSearchPipeline() {
        const searchQueryStr = this.dom.globalSearch.value.toLowerCase().trim();
        const scope = this.dom.searchScope.value;

        if(!searchQueryStr) {
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

        const filteredMatches = scopeDataset.filter(n => {
            return n.title.toLowerCase().includes(searchQueryStr) || n.content.toLowerCase().includes(searchQueryStr);
        });

        this.renderWorkspaceNotesPipeline(filteredMatches);
    }

    findNextTextOccurence() {
        const matchingTargetStr = this.dom.findInput.value;
        if (!matchingTargetStr) return;
        
        if (window.find) {
            const matchCaseSelectionFlag = this.dom.findCase.checked;
            window.find(matchingTargetStr, matchCaseSelectionFlag, false, true, this.dom.findWord.checked, false, false);
        }
    }

    executeTextReplacement(replaceAll = false) {
        const findStr = this.dom.findInput.value;
        const replaceStr = this.dom.replaceInput.value;
        if(!findStr) return;

        let editorContentSourceHtml = this.dom.richEditor.innerHTML;
        const regexFlagsStr = `g${this.dom.findCase.checked ? '' : 'i'}`;
        let computedRegexPattern = findStr;
        if(this.dom.findWord.checked) computedRegexPattern = `\\b${findStr}\\b`;

        const parsedRegexp = new RegExp(computedRegexPattern, regexFlagsStr);
        editorContentSourceHtml = editorContentSourceHtml.replace(parsedRegexp, replaceStr);

        this.dom.richEditor.innerHTML = editorContentSourceHtml;
        this.updateActiveNoteAttribute('content', editorContentSourceHtml);
        this.runMetricsExecutionEngine();
    }

    exportData(formatType) {
        const activeNote = this.state.notes.find(n => n.id === this.state.activeNoteId);
        if(!activeNote) { alert('Active workspace terminal mount node clear.'); return; }

        let compiledOutputPayloadStr = '';
        let mimeTypeString = 'text/plain';
        let fileExtensionTypeStr = 'txt';

        const rawPlainTextSource = this.dom.richEditor.innerText;
        const htmlTextContentSource = this.dom.richEditor.innerHTML;

        switch(formatType) {
            case 'txt':
                compiledOutputPayloadStr = `Title: ${activeNote.title}\nWorkspace: ${activeNote.workspace}\n\n${rawPlainTextSource}`;
                break;
            case 'md':
                compiledOutputPayloadStr = `# ${activeNote.title}\n\n*Target Channels Workspace: ${activeNote.workspace}*\n\n${rawPlainTextSource}`;
                fileExtensionTypeStr = 'md';
                break;
            case 'html':
                compiledOutputPayloadStr = `<!DOCTYPE html><html><head><title>${activeNote.title}</title></head><body>${htmlTextContentSource}</body></html>`;
                mimeTypeString = 'text/html';
                fileExtensionTypeStr = 'html';
                break;
            case 'doc':
                compiledOutputPayloadStr = htmlTextContentSource;
                mimeTypeString = 'application/msword';
                fileExtensionTypeStr = 'doc';
                break;
        }

        this.triggerBrowserDownloadAction(compiledOutputPayloadStr, `export_${activeNote.id}.${fileExtensionTypeStr}`, mimeTypeString);
    }

    exportGlobalBackup() {
        const dynamicBackupPayloadString = JSON.stringify(this.state, null, 2);
        this.triggerBrowserDownloadAction(dynamicBackupPayloadString, `cwp_global_backup_${Date.now()}.json`, 'application/json');
        this.logSystemActivity('System Control', 'Full Matrix Snapshot Configuration Exported', '');
    }

    triggerBrowserDownloadAction(payloadData, filename, contentType) {
        const blob = new Blob([payloadData], { type: contentType });
        const hiddenElementAnchor = document.createElement('a');
        hiddenElementAnchor.href = URL.createObjectURL(blob);
        hiddenElementAnchor.download = filename;
        document.body.appendChild(hiddenElementAnchor);
        hiddenElementAnchor.click();
        document.body.removeChild(hiddenElementAnchor);
    }

    handleSystemDataIngest(event) {
        const selectedLocalUploadFile = event.target.files[0];
        if (!selectedLocalUploadFile) return;

        const readerNode = new FileReader();
        readerNode.onload = (e) => {
            try {
                const verifiedParsedSchema = JSON.parse(e.target.result);
                if(verifiedParsedSchema.notes && verifiedParsedSchema.snippets) {
                    this.state = { ...this.state, ...verifiedParsedSchema };
                    this.saveStateToStorage();
                    this.renderAllSystemViews();
                    alert("System memory nodes mapped successfully.");
                }
            } catch (err) {
                alert("Corrupted configuration structural profile formatting validation error.");
            }
        };
        readerNode.readAsText(selectedLocalUploadFile);
    }

    initBackupSystem() {
        setInterval(() => {
            localStorage.setItem('cwp_automated_rolling_backup', JSON.stringify(this.state));
            this.logSystemActivity('System Engine', 'Automatic Point-in-time Snapshot Committed', '');
        }, 300000); // Executing rolling points every 5 minutes standard cycle
    }

    logSystemActivity(workspace, action, preview) {
        const logEventRegistryItem = {
            timestamp: new Date().toISOString(),
            workspace,
            action,
            preview: preview.substring(0, 80)
        };
        this.state.history.push(logEventRegistryItem);
        if(this.state.history.length > 100) this.state.history.shift();
        this.saveStateToStorage();
    }

    toggleThemeSystem() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        this.saveStateToStorage();
    }

    setupKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.saveStateToStorage();
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

let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new CreatorWorkspacePro();
});
