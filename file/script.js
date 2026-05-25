
document.addEventListener('DOMContentLoaded', () => {
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const btn = e.currentTarget;
            const filePath = btn.getAttribute('data-filepath');
            const fileName = btn.getAttribute('data-filename');
            const btnText = btn.querySelector('.btn-text');

            // Prevent multi-clicks during process
            btn.disabled = true;
            btn.classList.add('loading');
            btnText.textContent = 'Downloading...';

            try {
                // Fetch resource from target directory path
                const response = await fetch(filePath);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error Status: ${response.status}`);
                }

                // Process blob response stream
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                
                // Form structural DOM element to force target download behavior
                const anchor = document.createElement('a');
                anchor.href = downloadUrl;
                anchor.download = fileName;
                
                document.body.appendChild(anchor);
                anchor.click();
                
                // Clean system allocation
                document.body.removeChild(anchor);
                window.URL.revokeObjectURL(downloadUrl);

            } catch (error) {
                console.error('Asset execution downpath halted:', error);
                alert('Unable to process request. Ensure the file path targets an active repo asset.');
            } finally {
                // Revert component back to actionable status
                btn.disabled = false;
                btn.classList.remove('loading');
                btnText.textContent = 'Download File';
            }
        });
    });
});
