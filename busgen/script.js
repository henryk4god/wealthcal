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
    const dueDateGroup = document.getElementById('dueDateGroup');
    const paymentAmountGroup = document.getElementById('paymentAmountGroup');

    let currentDocType = 'invoice';
    let itemCount = 0;

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

        // Add event listeners for auto-update
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
                <td style="padding:6px 8px;">${idx + 1}</td>
                <td style="padding:6px 8px;">${item.desc}</td>
                <td style="padding:6px 8px; text-align:right;">${item.qty.toFixed(2)}</td>
                <td style="padding:6px 8px; text-align:right;">${formatCurrency(item.rate)}</td>
                <td style="padding:6px 8px; text-align:right;">${formatCurrency(item.amount)}</td>
            </tr>
        `).join('');

        return `
            <div class="invoice-preview" id="pdfContent">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 20px; margin-bottom: 2px;">Mchyrte Digital Agency</h3>
                        <div>Lagos, Nigeria</div>
                        <div style="color: #2a6fdb;">${email}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 26px; font-weight: 700; color: #0b1a33;">INVOICE</div>
                        <div style="background: #eaf0f8; padding: 2px 16px; border-radius: 40px; font-weight: 600; display: inline-block;"># ${invNum}</div>
                    </div>
                </div>

                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; margin: 18px 0 12px 0; background: #f5f9ff; padding: 12px 16px; border-radius: 20px; gap: 10px;">
                    <div><span class="text-muted">Balance Due</span><br><strong style="font-size: 18px;">${formatCurrency(total)}</strong></div>
                    <div><span class="text-muted">Invoice Date</span><br>${date}</div>
                    <div><span class="text-muted">Due Date</span><br>${due}</div>
                </div>

                <div style="margin-bottom: 14px;">
                    <div><span class="fw-bold">Bill To</span>  ${name}</div>
                    <div><span class="text-muted">Subject:</span> ${subject}</div>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; min-width: 300px;">
                        <thead>
                            <tr style="background: #e8eff9;">
                                <th style="padding:8px 8px; text-align:left;">#</th>
                                <th style="padding:8px 8px; text-align:left;">Item & Description</th>
                                <th style="padding:8px 8px; text-align:right;">Qty</th>
                                <th style="padding:8px 8px; text-align:right;">Rate</th>
                                <th style="padding:8px 8px; text-align:right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>${itemsHTML}</tbody>
                    </table>
                </div>

                <div style="border-top: 1px solid #dce5f0; padding-top: 8px; margin-top: 6px;">
                    <div class="flex-space"><span>Sub Total</span> <span>${formatCurrency(subTotal)}</span></div>
                    ${vat > 0 ? `<div class="flex-space"><span>VAT (${vat}%)</span> <span>${formatCurrency(vatAmount)}</span></div>` : ''}
                    <div class="flex-space" style="font-weight: 700; font-size: 16px; margin-top: 4px;">
                        <span>Total</span> <span>${formatCurrency(total)}</span>
                    </div>
                    <div class="flex-space" style="background: #ecf3fa; padding: 6px 12px; border-radius: 40px; margin-top: 8px;">
                        <span>Balance Due</span> <span>${formatCurrency(total)}</span>
                    </div>
                </div>

                <hr>
                <div style="font-size: 12px; color: #3d506e;">
                    <span class="fw-bold">Notes</span>  Make payment via this account details: <br> ${bankNote}
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
            <div class="receipt-preview" id="pdfContent">
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <h3 style="font-size: 20px;">Michyrite Digital Agency</h3>
                        <div>Lagos, Nigeria</div>
                        <div>${email}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:22px; font-weight:700;">PAYMENT RECEIPT</div>
                        <div style="background: #eaf0f8; padding: 2px 16px; border-radius: 40px; font-weight: 600; display: inline-block;"># ${invNum}</div>
                    </div>
                </div>
                <hr>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; background: #f5f9ff; padding: 12px; border-radius: 18px; margin: 8px 0;">
                    <div><span class="text-muted">Payment Date</span><br><strong>${date}</strong></div>
                    <div><span class="text-muted">Reference</span><br>—</div>
                    <div><span class="text-muted">Payment Mode</span><br>Bank Transfer</div>
                    <div style="margin-left: auto;">
                        <span class="text-muted">Amount Received</span><br>
                        <strong style="font-size:20px;">${formatCurrency(paidAmount)}</strong>
                    </div>
                </div>
                
                <div><span class="fw-bold">Received From</span>  ${name}</div>
                
                <div style="margin: 14px 0;"><span class="fw-bold">Payment for</span></div>
                
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse: collapse; font-size:13px; min-width: 250px;">
                        <thead>
                            <tr style="background:#eef3fc;">
                                <th style="padding:6px 8px; text-align:left;">Item</th>
                                <th style="padding:6px 8px; text-align:right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td style="padding:4px 8px;">${item.desc}</td>
                                    <td style="padding:4px 8px; text-align:right;">${formatCurrency(item.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr><td style="padding:4px 8px; border-top:1px solid #dce5f0;"><strong>Sub Total</strong></td><td style="padding:4px 8px; text-align:right; border-top:1px solid #dce5f0;">${formatCurrency(subTotal)}</td></tr>
                            ${vat > 0 ? `<tr><td style="padding:4px 8px;">VAT (${vat}%)</td><td style="padding:4px 8px; text-align:right;">${formatCurrency(vatAmount)}</td></tr>` : ''}
                            <tr><td style="padding:4px 8px;"><strong>Total</strong></td><td style="padding:4px 8px; text-align:right;"><strong>${formatCurrency(total)}</strong></td></tr>
                            <tr><td style="padding:4px 8px;">Amount Paid</td><td style="padding:4px 8px; text-align:right;">${formatCurrency(paidAmount)}</td></tr>
                            ${balanceDue > 0 ? `<tr style="background:#fff5f5;"><td style="padding:4px 8px; font-weight:bold; color:#c00;">Balance Due</td><td style="padding:4px 8px; text-align:right; font-weight:bold; color:#c00;">${formatCurrency(balanceDue)}</td></tr>` : ''}
                        </tfoot>
                    </table>
                </div>
                
                <hr>
                <div style="font-size: 12px; color: #3d506e;">
                    <span class="fw-bold">Notes</span>  ${bankNote}
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

    // Download PDF
    function downloadPDF() {
        const element = document.getElementById('pdfContent');
        if (!element) {
            alert('Please generate a document first.');
            return;
        }

        const filename = currentDocType === 'invoice' ?
            `invoice-${docNumber.value || 'INV'}-${docDate.value || '2025'}.pdf` :
            `receipt-${docNumber.value || 'REC'}-${docDate.value || '2025'}.pdf`;

        const opt = {
            margin: [0.6, 0.6, 0.6, 0.6],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePreview);
    downloadPdfBtn.addEventListener('click', downloadPDF);

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

})();