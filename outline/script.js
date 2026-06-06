function generatePrompt(event) {
    event.preventDefault();

    const productInfo = document.getElementById('productInfo').value;
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    const resultCard = document.getElementById('resultCard');
    const outputPrompt = document.getElementById('outputPrompt');

    // UI Loading State
    generateBtn.disabled = true;
    btnText.textContent = 'Generating...';
    spinner.classList.remove('hidden');

    // Simulate database assembly processing timeout
    setTimeout(() => {
        // Build Blueprint from local Prompt Template Database
        const systemPrompt = `You are a Digital Product Creation Specialist with expertise in packaging problem-based ideas into profitable, market-ready digital products.

I will provide you with  product information details below:

 INPUT:
${productInfo}

⚙️ YOUR TASK
Using the input above, generate a FULL digital product package 
with TWO deliverables:

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
- Recommended Ebook Length: [X pages]
- Suggested Price Point: [₦ or $ range


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
- No filler content — every lesson must deliver one clear outcome
- Output must be ready to use immediately without editing
- No introductions, conclusions, or commentary outside the deliverable
- No filler text or motivational preamble`;

        // Populate and display result asset
        outputPrompt.textContent = systemPrompt;
        resultCard.classList.remove('hidden');
        resultCard.classList.add('slide-in');

        // Reset UI Processing State
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Prompt Blueprint';
        spinner.classList.add('hidden');

        // Smooth scroll view to the output configuration
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, 800);
}

function copyToClipboard() {
    const outputText = document.getElementById('outputPrompt').textContent;
    const copyBtn = document.getElementById('copyBtn');

    navigator.clipboard.writeText(outputText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✨ Copied!';
        copyBtn.style.borderColor = '#4299e1';
        copyBtn.style.color = '#4299e1';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.borderColor = 'var(--border)';
            copyBtn.style.color = 'var(--text)';
        }, 2000);
    }).catch(err => {
        console.error('Could not copy system prompt assets: ', err);
    });
}
