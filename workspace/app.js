/**
 * CREATOR WORKSPACE PRO — STREAMLINED TASK OPERATIONS ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    // RUNNING RUNTIME APP CORE DATA STATE
    let state = {
        theme: 'dark',
        content: ''
    };

    const STORAGE_CONTENT_KEY = 'CWP_WORKSPACE_ACTIVE_CANVAS_TEXT';
    const STORAGE_THEME_KEY = 'CWP_WORKSPACE_UI_THEME';
    let undoStack = [];
    const MAX_STACK_DEPTH = 50;

    const editorCore = document.getElementById('editor-core');
    const activeNoteTitle = document.getElementById('active-note-title');
    const autosaveIndicator = document.getElementById('autosave-indicator');
    const lastSavedStamp = document.getElementById('last-saved-stamp');

    function initApplication() {
        // Hydrate from previous local state configurations
        const savedContent = localStorage.getItem(STORAGE_CONTENT_KEY);
        const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark';

        if (savedContent) {
            editorCore.innerHTML = savedContent;
        } else {
            editorCore.innerHTML = '<h1>Workspace Production Matrix</h1><p>Start your script processes, paste generations or pull blueprints here directly.</p>';
        }

        applyTheme(savedTheme);
        setupEventListeners();
        trackHistoryStateSnapshot();
        updateMetrics();

        // Continuous local structural safeguard loop
        setInterval(triggerAutosaveLoop, 4000);
    }

    function applyTheme(themeName) {
        state.theme = themeName;
        document.documentElement.setAttribute('data-theme', themeName);
        localStorage.setItem(STORAGE_THEME_KEY, themeName);
    }

    function triggerAutosaveLoop() {
        const currentContent = editorCore.innerHTML;
        if (localStorage.getItem(STORAGE_CONTENT_KEY) !== currentContent) {
            autosaveIndicator.textContent = "Saving...";
            localStorage.setItem(STORAGE_CONTENT_KEY, currentContent);
            lastSavedStamp.textContent = `Last Saved: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
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
        const payload = editorCore.innerHTML;
        if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== payload) {
            undoStack.push(payload);
            if (undoStack.length > MAX_STACK_DEPTH) undoStack.shift();
        }
    }

    // CROSS-PLATFORM HARDENED MOBILE SELECTION RANGE COLOR ENFORCER
    function applyTextColorMatrix(colorValue) {
        if (!colorValue) return;
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && selection.toString().length > 0) {
            // Apply standard design coloring onto highlighted vector properties
            document.execCommand('foreColor', false, colorValue);
        } else {
            // Mobile safe rule: If selection target loses context, apply color globally to current block
            document.execCommand('foreColor', false, colorValue);
        }
        trackHistoryStateSnapshot();
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
                alert("Target string properties not found.");
            }
        } else {
            if (!window.find) {
                alert("Sequential finding unsupported on this container resolution view. Use Replace All.");
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

    function setupEventListeners() {
        editorCore.addEventListener('keyup', () => { updateMetrics(); trackHistoryStateSnapshot(); });

        document.querySelectorAll('.editor-toolbar .tb-btn[data-command]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                execEditorCommand(btn.dataset.command, btn.dataset.value || null);
            });
        });

        // BIND HARDENED INPUT EVENT LISTENERS FOR FULL MOBILE OS RESPONSE
        const colorPicker = document.getElementById('tb-forecolor');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => applyTextColorMatrix(e.target.value));
            colorPicker.addEventListener('change', (e) => applyTextColorMatrix(e.target.value));
        }

        // DYNAMIC WORKSPACE CLEAR PLATFORM CONTROLLER
        document.getElementById('btn-clear-workspace').addEventListener('click', () => {
            if (confirm("Are you sure you want to clear the entire content canvas area?")) {
                editorCore.innerHTML = '';
                trackHistoryStateSnapshot();
                updateMetrics();
                triggerAutosaveLoop();
            }
        });

        // DYNAMIC CONFIGURATION FETCH ROUTING: PATH TARGET MATRIX FILE DIRECTORY
        document.getElementById('btn-fetch-instructions').addEventListener('click', async () => {
            try {
                const response = await fetch('./File Folder/instructions.txt');
                if (!response.ok) throw new Error('File architecture access validation failed.');
                const textData = await response.text();
                
                // Convert incoming source break sequences cleanly to DOM strings
                editorCore.innerHTML = textData.replace(/\n/g, '<br>');
                trackHistoryStateSnapshot();
                updateMetrics();
                triggerAutosaveLoop();
                alert("Instructions blueprint fetched and injected into live workspace memory.");
            } catch (err) {
                alert("Fetch Error: Verify file location parameters point exactly to: ./File Folder/instructions.txt");
            }
        });

        // SOURCE TARGET SYSTEM TEMPLATE DOWNLOADING TRIGGER
        document.getElementById('btn-download-source').addEventListener('click', () => {
            const anchor = document.createElement('a');
            anchor.href = './File Folder/source.txt';
            anchor.download = 'source.txt';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        });

        // SMART MOBILE POPUP FALLBACK DIALOG LAYER FOR SEARCH ENGINE WHEN SIDEBAR COLLAPSES
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
            const url = prompt("Enter Hyperlink Target Vector:", "https://");
            if (url) execEditorCommand('createLink', url);
        });

        document.getElementById('tb-table').addEventListener('click', () => {
            execEditorCommand('insertHTML', '<table border="1"><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table><p></p>');
        });

        document.getElementById('tb-undo').addEventListener('click', () => {
            if (undoStack.length > 1) {
                undoStack.pop();
                editorCore.innerHTML = undoStack[undoStack.length - 1];
                updateMetrics();
            }
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        });

        document.getElementById('btn-fr-all').addEventListener('click', () => executeFindReplace(true));
        document.getElementById('btn-fr-next').addEventListener('click', () => executeFindReplace(false));

        document.querySelectorAll('.btn-snippet').forEach(btn => {
            btn.addEventListener('click', () => {
                execEditorCommand('insertHTML', `<b>${btn.dataset.snippet}</b> `);
            });
        });
    }

    function updateMetrics() {
        const text = editorCore.textContent || editorCore.innerText || '';
        const clean = text.trim().replace(/\s+/g, ' ');
        document.getElementById('metric-words').textContent = clean === '' ? 0 : clean.split(' ').length;
        document.getElementById('metric-chars').textContent = text.length;
    }

    initApplication();
});
