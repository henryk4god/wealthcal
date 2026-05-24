document.addEventListener('DOMContentLoaded', () => {
    const promptForm = document.getElementById('promptForm');
    const outlineInput = document.getElementById('outlineInput');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    const resultCard = document.getElementById('resultCard');
    const outputPrompt = document.getElementById('outputPrompt');
    const copyBtn = document.getElementById('copyBtn');

    // Form submission processing
    promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const outlineValue = outlineInput.value.trim();
        if (!outlineValue) return;

        // UI Feedback: Loading State
        generateBtn.disabled = true;
        generateBtn.classList.remove('pulse-glow');
        btnText.textContent = 'Generating...';
        spinner.classList.remove('hidden');
        resultCard.classList.add('hidden');

        // Simulate a sleek execution delay (800ms) for enhanced UX feeling
        setTimeout(() => {
            const compiledPrompt = buildPrompt(outlineValue);
            outputPrompt.textContent = compiledPrompt;

            // Reset Button State
            generateBtn.disabled = false;
            generateBtn.classList.add('pulse-glow');
            btnText.textContent = 'Generate Prompt';
            spinner.classList.add('hidden');

            // Show Result Configuration
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
    });

    // Copy To Clipboard System
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputPrompt.textContent;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '✨ Copied successfully!';
            copyBtn.style.backgroundColor = '#bbf7d0';
            copyBtn.style.color = '#166534';
            copyBtn.style.borderColor = '#166534';

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Could not copy automatically. Please select text manually.');
        });
    });

    // Function to assemble the system prompt with user input injection
    function buildPrompt(outline) {
        return `You are a bestselling author and expert content creator. I need you to expand a complete book or course outline into detailed chapters.


MY OUTLINE (paste below):

${outline}


INSTRUCTIONS FOR HOW YOU MUST RESPOND:


1. DO NOT write all chapters at once.

2. Write ONLY Chapter 1 first.

3. After finishing Chapter 1, STOP and ask me: "Chapter 1 complete. Shall I proceed to Chapter 2?"

4. Wait for my response.

5. When I say "yes," "next," "continue," or "proceed," write Chapter 2.

6. After Chapter 2, ask me again: "Chapter 2 complete. Shall I proceed to Chapter 3?"

7. Repeat this pattern until all chapters in the outline are complete.


FORMAT FOR EACH CHAPTER:


For each chapter, follow this exact structure:


# Chapter [Number]: [Chapter Title]


## [Engaging Introduction]

(A personal story, relatable scenario, or surprising statistic that hooks the reader. Write in friendly, conversational tone.)


## [Main Content Section 1]

(Cover the first subtopic from the outline. Use subheadings, bullet points, and real examples.)


## [Main Content Section 2]

(Cover the second subtopic from the outline.)


## [Main Content Section 3]

(Cover the second subtopic from the outline.)


## [Main Content Section 4]

(Cover the fourth subtopic or additional depth.)


## Actionable Steps

(3–5 concrete actions the reader can take immediately after reading this chapter.)


## Summary & Key Takeaways

(A bulleted list of the most important points from the chapter.)


## Learning Outcomes Check

(Restate the learning outcome from the outline and show how the reader achieved it.)



STYLE REQUIREMENTS:

- Tone: Friendly, conversational, and encouraging (like a knowledgeable friend)

- Use "you" and "I" (first and second person)

- Include real-world examples and mini-stories

- Never write "in conclusion" or "as discussed"

- Keep paragraphs short (3–4 sentences max)

- Use bold for key phrases

- Use bullet points for lists


CONTENT REQUIREMENTS:

- Do NOT give away proprietary frameworks without naming them (if a framework emerges, give it a unique name like "The [Something] Method")

- Make the content non-Googleable by adding unique sequencing, warnings about common mistakes, and specific numbers

- Each chapter must deliver the stated learning outcome


ACKNOWLEDGE YOU UNDERSTAND:

Before you start Chapter 1, write: "I understand. I will write one chapter at a time and wait for your approval before moving to the next chapter. Please confirm you want me to begin with Chapter 1."


Then wait for my confirmation before writing.`;
    }
});
