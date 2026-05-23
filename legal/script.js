document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const outputSection = document.getElementById('output-section');
    const outputContent = document.getElementById('output-content');
    const copyBtn = document.getElementById('copy-btn');
    const copyToast = document.getElementById('copy-toast');
    const generateBtn = document.getElementById('generate-btn');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');

    // Local Prompt Database (as requested)
    const PROMPT_TEMPLATE = (data) => `
You are a bestselling author and professional book formatter. I need you to generate the complete front matter and back matter for my book.

HERE IS MY BOOK INFORMATION:
Book Title: ${data.title}
Book Subtitle: ${data.subtitle}
Target Audience: ${data.audience}
Tone: ${data.tone}
Complete Chapter Outline:
${data.outline}

---

INSTRUCTIONS:
Generate the following FIVE sections in this exact order. Write each section completely and professionally.

SECTION 1: INTRODUCTION
- A personal story or relatable problem the reader faces
- Why you wrote this book
- What makes this book different (including any proprietary frameworks)
- What the reader will learn (list 5-7 key outcomes)
- Who this book is for
- How to use the book
- A promise to the reader
- A call to action to begin
Length: 400-600 words | Tone: ${data.tone}

SECTION 2: DISCLAIMER
- Content is for educational and informational purposes only
- No professional-client relationship is formed
- No guarantees of results
- Statement about third-party platforms and services
- Statement about regulatory changes
- Statement of no liability
- Acknowledgment that reader is responsible for their own decisions
Tone: Professional, clear, legally protective but not intimidating

SECTION 3: COPYRIGHT
- Copyright symbol, year, and author name- Statement of all rights reserved
- Rules for unauthorized reproduction
- Rules for permitted excerpts with attribution
- Statement about proprietary frameworks (if applicable)
- Contact email for permission requests: [Your Email Address]
- Publishing details (edition, place of publication)
Tone: Professional and firm but fair

SECTION 4: TABLE OF CONTENTS
- Book title at the top
- "At a Glance" or brief description
- Each chapter number and title (from outline provided)
- 2-3 bullet points under each chapter summarizing what it covers
- Page numbers placeholders as "[Page X]"
- Learning outcome for each chapter
- A "Quick Reference" box at the end listing any proprietary frameworks 🔷
Format: Clean, scannable, easy to read

SECTION 5: CONCLUSION
- Acknowledgment that the reader has completed the journey
- Summary of what they should now know or be able to do
- Encouragement to take action
- Reminder of the most important framework or lesson
- What comes next (next steps)
- Final inspiring message
- Invitation to connect or share success
Length: 300-500 words | Tone: ${data.tone} - warm, encouraging, and action-oriented

---
ADDITIONAL REQUIREMENTS:
- Use [Your Name] as author placeholder
- Use [Your Email Address] as contact placeholder
- Use "[Page X]" for page numbers
- Highlight proprietary frameworks with 🔷
- Keep formatting clean and ready to copy-paste into a manuscript

OUTPUT FORMAT:
Label each section clearly with headers:
--- SECTION 1: INTRODUCTION ---
[content]
--- SECTION 2: DISCLAIMER ---
[content]
--- SECTION 3: COPYRIGHT ---
[content]
--- SECTION 4: TABLE OF CONTENTS ---
[content]
--- SECTION 5: CONCLUSION ---
[content]

Now generate these five sections based on my book information above.⚠️ STRICT RULES: No introductions, conclusions, or commentary outside the deliverable. No filler text. Output Strictly only.`;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Collect & Validate Inputs
        const data = {
            title: document.getElementById('book-title').value.trim(),
            subtitle: document.getElementById('book-subtitle').value.trim(),
            audience: document.getElementById('target-audience').value.trim(),
            tone: document.getElementById('tone').value.trim(),
            outline: document.getElementById('chapter-outline').value.trim()
        };

        if (!data.title || !data.subtitle || !data.audience || !data.tone || !data.outline) {
            alert('Please fill in all fields before generating.');
            return;
        }

        // UI Loading State
        setLoading(true);
        outputSection.classList.remove('visible');
        outputSection.classList.add('hidden');
        copyToast.classList.remove('visible');

        // Simulate AI Processing Delay
        await new Promise(res => setTimeout(res, 1200));

        // Generate Output (Client-side template simulation matching exact prompt rules)
        // Note: In production, replace this with a fetch() to your AI API endpoint.
        const generatedOutput = constructDraftOutput(data);
        
        outputContent.textContent = generatedOutput;
        outputSection.classList.remove('hidden');
        // Trigger reflow for animation
        void outputSection.offsetWidth; 
        outputSection.classList.add('visible');
        
        setLoading(false);
    });

    // Copy Functionality
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(outputContent.textContent);
            copyToast.classList.remove('hidden');
            copyToast.classList.add('visible');
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyToast.classList.remove('visible');                copyBtn.textContent = '📋 Copy Output';
            }, 2500);
        } catch (err) {
            copyBtn.textContent = '❌ Failed';
            setTimeout(() => copyBtn.textContent = '📋 Copy Output', 2000);
        }
    });

    // Helper: Set Loading State
    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        btnText.textContent = isLoading ? 'Generating...' : 'Generate Pages';
        spinner.classList.toggle('hidden', !isLoading);
    }

    // Helper: Construct Draft Output (Matches Prompt Format Exactly)
    function constructDraftOutput(data) {
        return `--- SECTION 1: INTRODUCTION ---
[Draft will populate here. Based on your inputs, the AI will generate a compelling introduction featuring a relatable problem for ${data.audience}, your core motivation for writing "${data.title}", and 5-7 clear outcomes. Tone: ${data.tone}. Length: 400-600 words.]

--- SECTION 2: DISCLAIMER ---
The information contained in this book is provided for educational and informational purposes only and is not intended as professional advice. No professional-client relationship is formed by reading this material. The author makes no guarantees, express or implied, regarding specific results, financial outcomes, or career advancements. Third-party platforms, tools, and services mentioned are subject to change, and their inclusion does not constitute an endorsement. Readers are solely responsible for their decisions and actions. By using this book, you acknowledge that the author assumes no liability for any damages, direct or indirect, arising from the application of these concepts. Always consult qualified professionals before making significant life, financial, or health decisions.

--- SECTION 3: COPYRIGHT ---
© ${new Date().getFullYear()} [Your Name]. All rights reserved.
No part of this publication may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without prior written permission from the author, except in the case of brief quotations embodied in critical reviews and certain other noncommercial uses permitted by copyright law. Proprietary frameworks, methodologies, and models presented herein are intellectual property of the author. For permission requests, please contact: [Your Email Address].
Published by: [Publisher Name] | Edition: 1.0 | Place of Publication: [City, Country]

--- SECTION 4: TABLE OF CONTENTS ---
${data.title}
At a Glance: A practical, step-by-step roadmap designed specifically for ${data.audience}.

${data.outline.split('\n').filter(line => line.trim() !== '').map((line, i) => `Chapter ${i + 1}: ${line.trim()}
• Key concept and practical application
• Real-world examples tailored to your goals
• Actionable exercise to cement your learning
[Page ${i * 15 + 1}] | Outcome: ${line.trim()} mastery

`).join('\n')}
🔷 Quick Reference: [Proprietary Frameworks mentioned in your outline will be summarized here for quick access.]

--- SECTION 5: CONCLUSION ---
[Draft will populate here. The conclusion will acknowledge your journey, summarize core takeaways, and push you toward immediate implementation. It will reinforce the central 🔷 framework, outline clear next steps for sustained growth, and leave you with an empowering final message. Tone: ${data.tone}. Length: 300-500 words.]

⚠️ STRICT RULES APPLIED: No extra text, no preamble, strictly formatted output ready for manuscript insertion.`;
    }
});
