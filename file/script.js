document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const btnText = btn.querySelector('.btn-text');
            
            // Extract attributes
            const filePath = btn.getAttribute('data-filepath');
            const fileName = btn.getAttribute('data-filename');
            const externalLink = btn.getAttribute('data-link');

            // Freeze the button state
            btn.disabled = true;
            btn.classList.add('loading');

            // --- Case A: If it's the external Workspace Link ---
            if (externalLink) {
                btnText.textContent = 'Launching...';
                
                // Keep the loading spinner visible for a brief moment for visual polish
                setTimeout(() => {
                    window.open(externalLink, '_blank', 'noopener,noreferrer');
                    
                    // Reset button after window opens
                    btn.disabled = false;
                    btn.classList.remove('loading');
                    btnText.textContent = 'Open Workspace';
                }, 800);
                
                return;
            }

            // --- Case B: Regular File Downloader Logic ---
            btnText.textContent = 'Downloading...';

            try {
                const response = await fetch(filePath);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error Status: ${response.status}`);
                }

                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                
                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = fileName;
                
                document.body.appendChild(anchor);
                anchor.click();
                
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Asset execution downpath halted:', error);
                alert('Unable to process download request. Ensure the file path targets an active repo asset.');
            } finally {
                btn.disabled = false;
                btn.classList.remove('loading');
                btnText.textContent = 'Download File';
            }
        });
    });
});
