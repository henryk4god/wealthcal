document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.category-tab');
    const wrappers = document.querySelectorAll('.select-wrapper');
    const generateBtn = document.getElementById('generateBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');
    const resultCard = document.getElementById('resultCard');
    const promptResultOutput = document.getElementById('promptResultOutput');
    const copyBtn = document.getElementById('copyBtn');
    const copyBtnText = document.getElementById('copyBtnText');

    let currentActiveWrapperId = 'womensSelect';

    // 1. Handling Tab Switching Engine
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset Tabs Active States
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Map Select drop downs view state
            const targetSelectId = tab.getAttribute('data-target');
            currentActiveWrapperId = targetSelectId;

            wrappers.forEach(wrap => {
                if(wrap.id === targetSelectId) {
                    wrap.classList.add('active');
                } else {
                    wrap.classList.remove('active');
                }
            });
        });
    });

    // 2. Generate Engine Implementation mapping local static layout format database rules
    generateBtn.addEventListener('click', () => {
        // UI Visual loading state trigger
        generateBtn.disabled = true;
        btnSpinner.style.display = 'block';
        btnText.textContent = 'Generating...';
        resultCard.classList.remove('show');

        // Simulate processing latency
        setTimeout(() => {
            // Extract active selection configuration input text
            const dynamicContainer = document.getElementById(currentActiveWrapperId);
            const selectedMenu = dynamicContainer.querySelector('.select-menu');
            const targetGroupValue = selectedMenu.value;

            // Form building string literal without using any unapproved markdown configurations
            const compiledDatabasePrompt = `Analyze the following target audience: 
"${targetGroupValue}" and design a high-converting digital product strategy for them.

You MUST format the response EXACTLY like this layout below. Do not use markdown bolding, symbols, or extra text outside of this exact layout template:

📦 OUTPUT FORMAT

Product Name

[Create a powerful, marketable, benefit-driven name here]

Subtitle

[One clear sentence explaining the transformation and outcome here]

The Skill/Topic I Will Teach

[Identify the core teachable skill behind the product here]

The Resource They Already Have

[Explain what the user already has that makes this possible (knowledge, experience, ideas, etc.) here]

Logical Step-By-Step Solution

[Break the system into 3–7 simple steps that lead to the promised result]

Key Pain Points

[Summarize exactly 7 pain points into a sharp, emotionally compelling list]

Unique Value Proposition

[Explain what makes this system different, faster, easier, or more effective than alternatives here]

Target Audience

[Clearly define who this product is for (specific and focused) here]


OUTPUT RULES

No explanations

No introductions

No marketing theory`;

            // Injection process onto front screen output module
            promptResultOutput.textContent = compiledDatabasePrompt;
            
            // UI Restore visual controls
            generateBtn.disabled = false;
            btnSpinner.style.display = 'none';
            btnText.textContent = 'Generate Engineered Prompt';
            
            // Display response component matching slide in effects
            resultCard.classList.add('show');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 750);
    });

    // 3. Clip Board copy features implementation
    copyBtn.addEventListener('click', () => {
        const textContentToSave = promptResultOutput.textContent;
        navigator.clipboard.writeText(textContentToSave).then(() => {
            copyBtnText.textContent = 'Copied!';
            copyBtn.style.background = '#d1fae5';
            copyBtn.style.color = '#065f46';
            copyBtn.style.borderColor = 'rgba(6, 95, 70, 0.2)';
            
            setTimeout(() => {
                copyBtnText.textContent = 'Copy Prompt';
                copyBtn.style.background = 'var(--accent2)';
                copyBtn.style.color = 'var(--accent)';
                copyBtn.style.borderColor = 'rgba(249, 115, 22, 0.2)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text into clipboard: ', err);
        });
    });
});
