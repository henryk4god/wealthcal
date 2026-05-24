document.addEventListener('DOMContentLoaded', () => {
    const promptForm = document.getElementById('promptForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    const resultCard = document.getElementById('resultCard');
    const outputPrompt = document.getElementById('outputPrompt');
    const copyBtn = document.getElementById('copyBtn');

    promptForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // UI state management during submission execution loop
        generateBtn.disabled = true;
        generateBtn.classList.remove('pulse-glow');
        btnText.textContent = 'Generating...';
        spinner.classList.remove('hidden');
        resultCard.classList.add('hidden');

        // Extracting form entries
        const bookContent = document.getElementById('bookContent').value;
        const tone = document.querySelector('input[name="tone"]:checked').value;

        // Constructing target system template
        const baseTemplate = `You are a bestselling author and professional book formatter. I need you to generate the complete front matter and back matter for my book with these provide information:

INPUT:
${bookcontent_placeholder}


INSTRUCTIONS:

Generate the following FIVE sections in this exact order. Write each section completely and professionally.

SECTION 1: INTRODUCTION

Write a compelling book introduction that includes:
- A personal story or relatable problem the reader faces
- Why you wrote this book
- What makes this book different (including any proprietary frameworks)
- What the reader will learn (list 5-7 key outcomes)
- Who this book is for
- How to use the book
- A promise to the reader
- A call to action to begin

Length: 400-600 words
Tone: ${tone_placeholder}

SECTION 2: DISCLAIMER

Write a complete legal disclaimer that includes:
- Statement that content is for educational and informational purposes only
- Statement that no professional-client relationship is formed
- Statement that there are no guarantees of results
- Statement about third-party platforms and services
- Statement about regulatory changes
- Statement of no liability
- Acknowledgment that reader is responsible for their own decisions

Tone: Professional, clear, legally protective but not intimidating

SECTION 3: COPYRIGHT

Write a complete copyright notice that includes:
- Copyright symbol, year, and author name
- Statement of all rights reserved
- Rules for unauthorized reproduction
- Rules for permitted excerpts with attribution
- Statement about proprietary frameworks (if applicable)
- Contact email for permission requests
- Publishing details (edition, place of publication)

Tone: Professional and firm but fair

SECTION 4: TABLE OF CONTENTS

Generate a formatted Table of Contents that includes:
- Book title at the top
- "At a Glance" or brief description
- Each chapter number and title (from the outline provided) NO SUB-TOPICS.
- A "Quick Reference" box at the end listing any proprietary frameworks

Format: Clean, scannable, easy to read

SECTION 5: CONCLUSION

Write a powerful book conclusion that includes:
- Acknowledgment that the reader has completed the journey
- Summary of what they should now know or be able to do
- Encouragement to take action (not just read)
- A reminder of the most important framework or lesson from the book
- What comes next (next steps for the reader)
- A final inspiring message
- An invitation to connect or share their success (optional)

Length: 300-500 words
Tone: ${tone_placeholder} - warm, encouraging, and action-oriented

ADDITIONAL REQUIREMENTS:

- Use [Your Name] as the author placeholder (I will replace it later)
- Use [Your Email Address] as the contact placeholder
- For proprietary frameworks mentioned in the outline, highlight them with 🔷 symbols
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

⚠️ STRICT RULES:
No introductions, conclusions, or commentary outside the deliverable
No filler text or motivational preamble

Now generate these five sections based on my book information above.`;

        // Injecting user variables into the structural prompt string template
        const absolutePrompt = baseTemplate
            .replace(/\${bookcontent_placeholder}/g, bookContent)
            .replace(/\${tone_placeholder}/g, tone);

        // Mimic a network parsing asynchronous timeout delay for interface aesthetics
        setTimeout(() => {
            outputPrompt.textContent = absolutePrompt;
            
            // Reverting UI interactives back to native focus rules
            spinner.classList.add('hidden');
            btnText.textContent = 'Generate Prompt';
            generateBtn.disabled = false;
            generateBtn.classList.add('pulse-glow');
            
            // Present output frame elements sequentially
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 750);
    });

    // Handle string content copy requests targeting the platform clipboard API
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputPrompt.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalBtnText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#10b981'; // Dynamic validation coloring feedback
            
            setTimeout(() => {
                copyBtn.textContent = originalBtnText;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    });
});
