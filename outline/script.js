document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('promptForm');
    const outputSection = document.getElementById('outputSection');
    const promptOutput = document.getElementById('promptOutput');
    const copyBtn = document.getElementById('copyBtn');
    const generateBtn = document.querySelector('.btn-generate');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');

    // Base Prompt Template (Acts as Frontend Database)
    const BASE_PROMPT = `You are a Digital Product Creation Specialist with expertise in packaging problem-based ideas into profitable, market-ready digital products.

🎯 INPUT
I will provide you with a structured problem idea in this format:

- Product Name: {{title}}
- Step-by-Step Solution: {{steps}}
- Key Pain Points: {{painPoints}}
- Unique Value Proposition: {{uvp}}
- Target Audience: {{audience}}

⚙️ YOUR TASK
Using the input above, generate a FULL digital product package 
with TWO deliverables:

---

📘 DELIVERABLE 1 — EBOOK OUTLINE

- Ebook Title: (Compelling, benefit-driven title)
- Subtitle: (One-line promise)
- Introduction: (What the reader will gain + their current pain)

- Chapter 1: [Tie to Step 1 of solution]
  • Sub-topic A
  • Sub-topic B
  • Actionable Exercise

- Chapter 2: [Tie to Step 2]
  • Sub-topic A
  • Sub-topic B
  • Actionable Exercise

[Continue for all steps — minimum 5 chapters]

- Conclusion: (Transformation summary + call to action)
- Bonus Section: (One quick-win checklist or template)
- Recommended Ebook Length: [X pages]
- Suggested Price Point: [₦ or $ range]
---

🎓 DELIVERABLE 2 — ONLINE COURSE CURRICULUM

- Course Title: (Transformation-focused)
- Course Tagline: (One sentence promise)
- Course Format: (Video / PDF / Audio — recommend best fit)
- Ideal Platform: (Selar, Gumroad, Teachable, WhatsApp, etc.)

MODULE 1: [Foundation — tie to pain points]
  - Lesson 1.1: 
  - Lesson 1.2:
  - Lesson 1.3:
  - Module Assignment:

MODULE 2: [Core Skill — tie to Step 1 & 2]
  - Lesson 2.1:
  - Lesson 2.2:
  - Lesson 2.3:
  - Module Assignment:

MODULE 3: [Implementation — tie to Step 3 & 4]
  - Lesson 3.1:
  - Lesson 3.2:
  - Lesson 3.3:
  - Module Assignment:

MODULE 4: [Advanced Strategy — tie to Step 5+]
  - Lesson 4.1:
  - Lesson 4.2:
  - Lesson 4.3:
  - Module Assignment:

MODULE 5: [Results & Scaling]
  - Lesson 5.1:
  - Lesson 5.2:
  - Lesson 5.3:
  - Final Project / Capstone

- Estimated Course Length: [X hours]
- Suggested Price Point: [₦ or $ range]
- Upsell Opportunity: [Coaching / Template Pack / Community]

⚠️ STRICT RULES:
- Tie every chapter and module directly to the solution steps 
  and pain points provided
- Keep language simple, practical, and results-focused
- All price suggestions must reflect the Nigerian/African market 
  unless audience says otherwise
- No filler content — every lesson must deliver one clear outcome- Output must be ready to use immediately without editing
- No introductions, conclusions, or commentary outside the deliverable
- No filler text or motivational preamble
- No explanations,no introductions, no additional text.`;

    // Handle Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        btnText.textContent = 'Generating...';
        loader.classList.remove('hidden');
        generateBtn.disabled = true;

        // Simulate brief processing for UX
        setTimeout(() => {
            const title = document.getElementById('title').value.trim();
            const steps = document.getElementById('steps').value.trim();
            const painPoints = document.getElementById('painPoints').value.trim();
            const uvp = document.getElementById('uvp').value.trim();
            const audience = document.getElementById('audience').value.trim();

            // Inject values into template
            const generatedPrompt = BASE_PROMPT
                .replace('{{title}}', title)
                .replace('{{steps}}', steps)
                .replace('{{painPoints}}', painPoints)
                .replace('{{uvp}}', uvp)
                .replace('{{audience}}', audience);

            // Display result
            promptOutput.textContent = generatedPrompt;
            outputSection.classList.remove('hidden');
            outputSection.classList.add('fade-in');

            // Reset button
            btnText.textContent = 'Generate Prompt';
            loader.classList.add('hidden');
            generateBtn.disabled = false;

            // Smooth scroll to output
            setTimeout(() => {
                outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }, 600);
    });

    // Handle Copy to Clipboard
    copyBtn.addEventListener('click', () => {
        const textToCopy = promptOutput.textContent;        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => copyBtn.textContent = '📋 Copy to Clipboard', 2000);
        });
    });
});
