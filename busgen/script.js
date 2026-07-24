(function() {
    "use strict";

    // DOM refs
    const clientName = document.getElementById('clientName');
    const clientEmail = document.getElementById('clientEmail');
    const docDate = document.getElementById('docDate');
    const dueDate = document.getElementById('dueDate');
    const docNumber = document.getElementById('docNumber');
    const subjectLine = document.getElementById('subjectLine');
    const vatRate = document.getElementById('vatRate');
    const bankDetails = document.getElementById('bankDetails');
    const paymentAmount = document.getElementById('paymentAmount');
    const itemsContainer = document.getElementById('itemsContainer');
    const addItemBtn = document.getElementById('addItemBtn');
    const previewContent = document.getElementById('previewContent');
    const generateBtn = document.getElementById('generateBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const shareBtn = document.getElementById('shareBtn');
    const dueDateGroup = document.getElementById('dueDateGroup');
    const paymentAmountGroup = document.getElementById('paymentAmountGroup');

    // Share modal elements
    const shareModal = document.getElementById('shareModal');
    const shareCloseBtn = document.getElementById('shareCloseBtn');

    let currentDocType = 'invoice';
    let itemCount = 0;
    let currentPdfData = null;

    // Document type switching
    document.getElementById('docTypeInvoice').addEventListener('click', function() {
        setDocType('invoice');
    });
    document.getElementById('docTypeReceipt').addEventListener('click', function() {
        setDocType('receipt');
    });

    function setDocType(type) {
        currentDocType = type;
        document.querySelectorAll('.doc-type-btn').forEach(btn => btn.classList.remove('active'));
        if (type === 'invoice') {
            document.getElementById('docTypeInvoice').classList.add('active');
            dueDateGroup.style.display = 'block';
            paymentAmountGroup.style.display = 'none';
            document.getElementById('docNumber').value = 'INV-000002';
        } else {
            document.getElementById('docTypeReceipt').classList.add('active');
            dueDateGroup.style.display = 'none';
            paymentAmountGroup.style.display = 'block';
            document.getElementById('docNumber').value = 'REC-000001';
        }
        generatePreview();
    }

    // Item management
    function addItem(desc = '', qty = 1, rate = 0) {
        itemCount++;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';
        itemDiv.dataset.index = itemCount;
        itemDiv.innerHTML = `
            <button class="remove-item" onclick="this.closest('.item-row').remove(); generatePreview();">
                <i class="fas fa-times"></i>
            </button>
            <div class="inline-group">
                <div class="form-group" style="flex:2;">
                    <label>Description</label>
                    <input type="text" class="item-desc" value="${desc}" placeholder="Item description">
                </div>
            </div>
            <div class="inline-group">
                <div class="form-group" style="flex:0.5;">
                    <label>Qty</label>
                    <input type="number" class="item-qty" value="${qty}" min="0" step="1">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Rate (NGN)</label>
                    <input type="number" class="item-rate" value="${rate}" min="0" step="0.01">
                </div>
            </div>
        `;
        itemsContainer.appendChild(itemDiv);

        itemDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', generatePreview);
            input.addEventListener('change', generatePreview);
        });

        generatePreview();
    }

    // Initialize with sample items
    function initializeItems() {
        itemsContainer.innerHTML = '';
        itemCount = 0;
        addItem('Domain Renewal - samchiska.com - 1 Year/s (23/08/2025 - 22/08/2026)', 1, 25000);
        addItem('Package - samchiska.com (23/08/2025 - 22/08/2026) = N=35000.00', 1, 45000);
    }

    addItemBtn.addEventListener('click', function() {
        addItem('New Item', 1, 0);
    });

    // Helper: format currency
    function formatCurrency(amount) {
        return 'NGN' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Get items data
    function getItems() {
        const items = [];
        document.querySelectorAll('.item-row').forEach(row => {
            const desc = row.querySelector('.item-desc').value || 'Item';
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            if (desc.trim() && qty > 0 && rate > 0) {
                items.push({ desc, qty, rate, amount: qty * rate });
            }
        });
        return items;
    }

    // Get document summary
    function getDocumentSummary() {
        const items = getItems();
        const name = clientName.value.trim() || 'SAMCHISKA';
        const email = clientEmail.value.trim() || 'henryk4chosen@gmail.com';
        const invNum = docNumber.value.trim() || 'INV-000002';
        const subject = subjectLine.value.trim() || 'Hosting And Domain Subscription';
        const vat = parseFloat(vatRate.value) || 0;
        const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
        const vatAmount = subTotal * (vat / 100);
        const total = subTotal + vatAmount;
        const docType = currentDocType === 'invoice' ? 'Invoice' : 'Receipt';
        const date = docDate.value || '2025-08-01';
        
        return {
            type: docType,
            number: invNum,
            client: name,
            email: email,
            subject: subject,
            total: total,
            formattedTotal: formatCurrency(total),
            items: items,
            date: date,
            vat: vat,
            bankDetails: bankDetails.value.trim() || 'Account No: 2023268027 · Bank: UBA · Henry Lucky'
        };
    }

    // Build invoice HTML
    function buildInvoiceHTML() {
        const items = getItems();
        if (items.length === 0) {
            return '<p class="text-muted" style="text-align:center; padding:20px;">Please add at least one item.</p>';
        }

        const name = clientName.value.trim() || 'SAMCHISKA';
        const email = clientEmail.value.trim() || 'henryk4chosen@gmail.com';
        const date = docDate.value || '2025-08-01';
        const due = dueDate.value || '2025-08-23';
        const invNum = docNumber.value.trim() || 'INV-000002';
        const subject = subjectLine.value.trim() || 'Hosting And Domain Subscription';
        const vat = parseFloat(vatRate.value) || 0;
        const bankNote = bankDetails.value.trim() || 'Account No: 2023268027 · Bank: UBA · Henry Lucky';

        const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
        const vatAmount = subTotal * (vat / 100);
        const total = subTotal + vatAmount;

        let itemsHTML = items.map((item, idx) => `
            <tr>
                <td style="padding:6px 8px; border: 1px solid #ddd;">${idx + 1}</td>
                <td style="padding:6px 8px; border: 1px solid #ddd;">${item.desc}</td>
                <td style="padding:6px 8px; border: 1px solid #ddd; text-align:right;">${item.qty.toFixed(2)}</td>
                <td style="padding:6px 8px; border: 1px solid #ddd; text-align:right;">${formatCurrency(item.rate)}</td>
                <td style="padding:6px 8px; border: 1px solid #ddd; text-align:right;">${formatCurrency(item.amount)}</td>
            </tr>
        `).join('');

        return `
            <div style="padding: 20px; background: white; font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 20px; margin-bottom: 2px; color: #0b1a33;">Mchyrte Digital Agency</h3>
                        <div style="color: #444;">Lagos, Nigeria</div>
                        <div style="color: #2a6fdb;">${email}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 26px; font-weight: 700; color: #0b1a33;">INVOICE</div>
                        <div style="background: #eaf0f8; padding: 2px 16px; border-radius: 40px; font-weight: 600; display: inline-block; margin-top: 4px;"># ${invNum}</div>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 18px 0 12px 0; background: #f5f9ff; padding: 12px 16px; border-radius: 20px; gap: 10px;">
                    <div><span style="color: #607080;">Balance Due</span><br><strong style="font-size: 18px;">${formatCurrency(total)}</strong></div>
                    <div><span style="color: #607080;">Invoice Date</span><br>${date}</div>
                    <div><span style="color: #607080;">Due Date</span><br>${due}</div>
                </div>

                <div style="margin-bottom: 14px;">
                    <div><strong>Bill To</strong>  ${name}</div>
                    <div><span style="color: #607080;">Subject:</span> ${subject}</div>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; min-width: 300px;">
                        <thead>
                            <tr style="background: #e8eff9;">
                                <th style="padding:8px 8px; text-align:left; border: 1px solid #ddd;">#</th>
                                <th style="padding:8px 8px; text-align:left; border: 1px solid #ddd;">Item & Description</th>
                                <th style="padding:8px 8px; text-align:right; border: 1px solid #ddd;">Qty</th>
                                <th style="padding:8px 8px; text-align:right; border: 1px solid #ddd;">Rate</th>
                                <th style="padding:8px 8px; text-align:right; border: 1px solid #ddd;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHTML}</tbody>
                    </table>
                </div>

                <div style="border-top: 1px solid #dce5f0; padding-top: 8px; margin-top: 6px;">
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;"><span>Sub Total</span> <span>${formatCurrency(subTotal)}</span></div>
                    ${vat > 0 ? `<div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;"><span>VAT (${vat}%)</span> <span>${formatCurrency(vatAmount)}</span></div>` : ''}
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; font-weight: 700; font-size: 16px; margin-top: 4px;">
                        <span>Total</span> <span>${formatCurrency(total)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; background: #ecf3fa; padding: 6px 12px; border-radius: 40px; margin-top: 8px;">
                        <span>Balance Due</span> <span>${formatCurrency(total)}</span>
                    </div>
                </div>

                <hr style="margin: 14px 0; border: 0; border-top: 1px solid #e5ecf5;">
                <div style="font-size: 12px; color: #3d506e;">
                    <strong>Notes</strong>  Make payment via this account details: <br> ${bankNote}
                </div>
                <div style="font-size: 11px; color: #6a7f9a; margin-top: 10px; text-align: right;">Generated · Mchyrte Digital</div>
            </div>
        `;
    }

    // Build receipt HTML
    function buildReceiptHTML() {
        const items = getItems();
        if (items.length === 0) {
            return '<p class="text-muted" style="text-align:center; padding:20px;">Please add at least one item.</p>';
        }

        const name = clientName.value.trim() || 'SAMCHISKA';
        const email = clientEmail.value.trim() || 'henryk4chosen@gmail.com';
        const date = docDate.value || '2025-08-01';
        const invNum = docNumber.value.trim() || 'REC-000001';
        const subject = subjectLine.value.trim() || 'Hosting And Domain Subscription';
        const vat = parseFloat(vatRate.value) || 0;
        const bankNote = bankDetails.value.trim() || 'Account No: 2023268027 · Bank: UBA · Henry Lucky';
        const paymentAmt = parseFloat(paymentAmount.value) || 0;

        const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
        const vatAmount = subTotal * (vat / 100);
        const total = subTotal + vatAmount;
        const paidAmount = paymentAmt > 0 ? paymentAmt : total;
        const balanceDue = total - paidAmount;

        const today = new Date().toISOString().slice(0, 10);

        return `
            <div style="padding: 20px; background: white; font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 20px; color: #0b1a33;">Michyrite Digital Agency</h3>
                        <div style="color: #444;">Lagos, Nigeria</div>
                        <div style="color: #2a6fdb;">${email}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:22px; font-weight:700; color: #0b1a33;">PAYMENT RECEIPT</div>
                        <div style="background: #eaf0f8; padding: 2px 16px; border-radius: 40px; font-weight: 600; display: inline-block; margin-top: 4px;"># ${invNum}</div>
                    </div>
                </div>
                <hr style="margin: 14px 0; border: 0; border-top: 1px solid #e5ecf5;">
                <div style="display: flex; flex-wrap: wrap; gap: 12px; background: #f5f9ff; padding: 12px; border-radius: 18px; margin: 8px 0;">
                    <div><span style="color: #607080;">Payment Date</span><br><strong>${date}</strong></div>
                    <div><span style="color: #607080;">Reference</span><br>—</div>
                    <div><span style="color: #607080;">Payment Mode</span><br>Bank Transfer</div>
                    <div style="margin-left: auto;">
                        <span style="color: #607080;">Amount Received</span><br>
                        <strong style="font-size:20px;">${formatCurrency(paidAmount)}</strong>
                    </div>
                </div>
                
                <div><strong>Received From</strong>  ${name}</div>
                
                <div style="margin: 14px 0;"><strong>Payment for</strong></div>
                
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse: collapse; font-size:13px; min-width: 250px;">
                        <thead>
                            <tr style="background:#eef3fc;">
                                <th style="padding:6px 8px; text-align:left; border: 1px solid #ddd;">Item</th>
                                <th style="padding:6px 8px; text-align:right; border: 1px solid #ddd;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td style="padding:4px 8px; border: 1px solid #ddd;">${item.desc}</td>
                                    <td style="padding:4px 8px; text-align:right; border: 1px solid #ddd;">${formatCurrency(item.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr><td style="padding:4px 8px; border: 1px solid #ddd;"><strong>Sub Total</strong></td><td style="padding:4px 8px; text-align:right; border: 1px solid #ddd;">${formatCurrency(subTotal)}</td></tr>
                            ${vat > 0 ? `<tr><td style="padding:4px 8px; border: 1px solid #ddd;">VAT (${vat}%)</td><td style="padding:4px 8px; text-align:right; border: 1px solid #ddd;">${formatCurrency(vatAmount)}</td></tr>` : ''}
                            <tr><td style="padding:4px 8px; border: 1px solid #ddd;"><strong>Total</strong></td><td style="padding:4px 8px; text-align:right; border: 1px solid #ddd;"><strong>${formatCurrency(total)}</strong></td></tr>
                            <tr><td style="padding:4px 8px; border: 1px solid #ddd;">Amount Paid</td><td style="padding:4px 8px; text-align:right; border: 1px solid #ddd;">${formatCurrency(paidAmount)}</td></tr>
                            ${balanceDue > 0 ? `<tr style="background:#fff5f5;"><td style="padding:4px 8px; border: 1px solid #ddd; font-weight:bold; color:#c00;">Balance Due</td><td style="padding:4px 8px; text-align:right; border: 1px solid #ddd; font-weight:bold; color:#c00;">${formatCurrency(balanceDue)}</td></tr>` : ''}
                        </tfoot>
                    </table>
                </div>
                
                <hr style="margin: 14px 0; border: 0; border-top: 1px solid #e5ecf5;">
                <div style="font-size: 12px; color: #3d506e;">
                    <strong>Notes</strong>  ${bankNote}
                </div>
                <div style="font-size: 11px; margin-top: 8px; color: #6a7f9a; text-align: right;">
                    Receipt generated · ${today} ${balanceDue > 0 ? '· Partial payment' : '· Full payment'}
                </div>
            </div>
        `;
    }

    // Generate preview
    function generatePreview() {
        if (currentDocType === 'invoice') {
            previewContent.innerHTML = buildInvoiceHTML();
        } else {
            previewContent.innerHTML = buildReceiptHTML();
        }
    }

    // Generate PDF Blob
    function generatePDFBlob() {
        return new Promise((resolve, reject) => {
            const content = previewContent.innerHTML;
            
            if (!content || content.includes('Please add at least one item')) {
                reject(new Error('Please add items and generate a document first.'));
                return;
            }

            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'fixed';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0';
            pdfContainer.style.width = '800px';
            pdfContainer.style.background = 'white';
            pdfContainer.style.padding = '20px';
            pdfContainer.style.fontFamily = "'Segoe UI', Arial, sans-serif";
            pdfContainer.innerHTML = content;
            document.body.appendChild(pdfContainer);

            const filename = currentDocType === 'invoice' ?
                `invoice-${docNumber.value || 'INV'}-${docDate.value || '2025'}.pdf` :
                `receipt-${docNumber.value || 'REC'}-${docDate.value || '2025'}.pdf`;

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    letterRendering: true,
                    useCORS: true,
                    logging: false
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'a4', 
                    orientation: 'portrait' 
                }
            };

            html2pdf()
                .set(opt)
                .from(pdfContainer)
                .outputPdf('blob')
                .then(function(pdfBlob) {
                    document.body.removeChild(pdfContainer);
                    resolve({ blob: pdfBlob, filename: filename });
                })
                .catch(function(error) {
                    document.body.removeChild(pdfContainer);
                    reject(error);
                });
        });
    }

    // Download PDF
    function downloadPDF() {
        generatePDFBlob()
            .then(({ blob, filename }) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => {
                    URL.revokeObjectURL(link.href);
                }, 100);
                showToast('PDF downloaded successfully!', 'success');
            })
            .catch((error) => {
                showToast(error.message || 'Error generating PDF.', 'error');
            });
    }

    // Share via Email
    function shareViaEmail() {
        const summary = getDocumentSummary();
        generatePDFBlob()
            .then(({ blob, filename }) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Data = e.target.result.split(',')[1];
                    const subject = `${summary.type} ${summary.number} for ${summary.client}`;
                    const body = `
Hello,

Please find attached the ${summary.type.toLowerCase()} document.

Document Details:
- ${summary.type}: ${summary.number}
- Client: ${summary.client}
- Subject: ${summary.subject}
- Total: ${summary.formattedTotal}
- Date: ${summary.date}

---
Generated using Invoice & Receipt Generator
                    `.trim();

                    // For email clients that support base64 attachments
                    const mailtoLink = `mailto:${summary.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    
                    // Try to open email client
                    window.open(mailtoLink, '_blank');
                    
                    // Also offer download as fallback
                    showToast('Email opened. Attach the PDF manually if needed.', 'info');
                    
                    // Download the PDF as well (since most email clients don't support attachments via mailto)
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => {
                        URL.revokeObjectURL(link.href);
                    }, 100);
                    
                    closeShareModal();
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                showToast(error.message || 'Error generating PDF for email.', 'error');
            });
    }

    // Share via Gmail
    function shareViaGmail() {
        const summary = getDocumentSummary();
        generatePDFBlob()
            .then(({ blob, filename }) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Data = e.target.result.split(',')[1];
                    
                    // Gmail compose URL
                    const subject = `${summary.type} ${summary.number} for ${summary.client}`;
                    const body = `
Hello,

Please find attached the ${summary.type.toLowerCase()} document.

Document Details:
- ${summary.type}: ${summary.number}
- Client: ${summary.client}
- Subject: ${summary.subject}
- Total: ${summary.formattedTotal}
- Date: ${summary.date}

---
Generated using Invoice & Receipt Generator
                    `.trim();

                    // Open Gmail compose
                    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(summary.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    window.open(gmailUrl, '_blank');
                    
                    // Download the PDF for manual attachment
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => {
                        URL.revokeObjectURL(link.href);
                    }, 100);
                    
                    showToast('Gmail opened. PDF downloaded for attachment.', 'success');
                    closeShareModal();
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                showToast(error.message || 'Error generating PDF.', 'error');
            });
    }

    // Share via WhatsApp
    function shareViaWhatsApp() {
        const summary = getDocumentSummary();
        generatePDFBlob()
            .then(({ blob, filename }) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Create a message with document details
                    const message = `
📄 *${summary.type}*: ${summary.number}
👤 *Client*: ${summary.client}
📋 *Subject*: ${summary.subject}
💰 *Total*: ${summary.formattedTotal}
📅 *Date*: ${summary.date}

Items:
${summary.items.map((item, idx) => `${idx + 1}. ${item.desc} - ${formatCurrency(item.amount)}`).join('\n')}

Generated using Invoice & Receipt Generator
                    `.trim();

                    // Open WhatsApp
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                    
                    // Download the PDF as well
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => {
                        URL.revokeObjectURL(link.href);
                    }, 100);
                    
                    showToast('WhatsApp opened. PDF downloaded for sharing.', 'success');
                    closeShareModal();
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                showToast(error.message || 'Error generating PDF.', 'error');
            });
    }

    // Share modal
    function showShareModal() {
        const content = previewContent.innerHTML;
        if (!content || content.includes('Please add at least one item')) {
            showToast('Please generate a document first.', 'warning');
            return;
        }
        shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeShareModal() {
        shareModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast-message');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        
        const colors = {
            success: '#0f7b3a',
            error: '#c00',
            warning: '#f59e0b',
            info: '#0b1a33'
        };
        toast.style.background = colors[type] || colors.info;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePreview);
    downloadPdfBtn.addEventListener('click', downloadPDF);
    shareBtn.addEventListener('click', showShareModal);
    shareCloseBtn.addEventListener('click', closeShareModal);
    
    shareModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeShareModal();
        }
    });

    // Share option buttons
    document.getElementById('shareEmail').addEventListener('click', shareViaEmail);
    document.getElementById('shareGmail').addEventListener('click', shareViaGmail);
    document.getElementById('shareWhatsApp').addEventListener('click', shareViaWhatsApp);
    document.getElementById('shareDownload').addEventListener('click', function() {
        closeShareModal();
        downloadPDF();
    });

    // Auto-generate on input change
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', generatePreview);
    });

    // Initialize
    initializeItems();
    generatePreview();

    // Expose functions for inline onclick
    window.addItem = addItem;
    window.generatePreview = generatePreview;

    // Keyboard shortcut: Escape to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });

})();