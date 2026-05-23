document.addEventListener('DOMContentLoaded', () => {
    const outlineInput = document.getElementById('outlineInput');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const loader = generateBtn.querySelector('.loader');
    const outputSection = document.getElementById('outputSection');
    const promptOutput = document.getElementById('promptOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Local Prompt Database Template
    const PROMPT_TEMPLATE = `You are a bestselling author and expert content creator. I need you to expand a complete book or course outline into detailed chapters.

MY OUTLINE (paste below):

[OUTLINE_PLACEHOLDER]

INSTRUCTIONS FOR HOW YOU MUST RESPOND:

1. DO NOT write all chapters at once.
2. Write ONLY Chapter 1 first.
3. After finishing Chapter 1, STOP and ask me: "Chapter 1 complete. Shall I proceed to Chapter 2?"
4. Wait for my response.
5. When I say "yes," "next," "continue," or "proceed," write Chapter 2.
6. After Chapter 2, ask me again: "Chapter 2 complete. Shall I proceed to Chapter 3?"
7. Repeat this pattern until all chapters in the outline are complete.

FORMAT FOR EACH CHAPTER:

──────────────────────────────────
# Chapter [Number]: [Chapter Title]

## [Engaging Introduction]
(A personal story, relatable scenario, or surprising statistic that hooks the reader. Write in friendly, conversational tone.)

## [Main Content Section 1]
(Cover the first subtopic from the outline. Use subheadings, bullet points, and real examples.)

## [Main Content Section 2]
(Cover the second subtopic from the outline.)

## [Main Content Section 3]
(Cover the third subtopic from the outline.)

## [Main Content Section 4]
(Cover the fourth subtopic or additional depth.)

## Actionable Steps
(3–5 concrete actions the reader can take immediately after reading this chapter.)

## Summary & Key Takeaways(A bulleted list of the most important points from the chapter.)

## Learning Outcomes Check
(Restate the learning outcome from the outline and show how the reader achieved it.)
──────────────────────────────────

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

    const REQUIRED_SUFFIX = `\n\n- No explanations, no introductions, no additional text.`;

    generateBtn.addEventListener('click', () => {
        const outline = outlineInput.value.trim();
        if (!outline) {
            alert('Please paste your complete outline to proceed.');
            outlineInput.focus();
            return;
        }

        // UI Loading State
        generateBtn.disabled = true;
        btnText.textContent = 'Formatting Prompt...';
        loader.classList.remove('hidden');
        outputSection.classList.add('hidden');

        // Simulate brief processing delay for polished UX
        setTimeout(() => {
            const finalPrompt = PROMPT_TEMPLATE.replace('[OUTLINE_PLACEHOLDER]', outline) + REQUIRED_SUFFIX;

            promptOutput.textContent = finalPrompt;
            outputSection.classList.remove('hidden');

            // Reset Button
            generateBtn.disabled = false;
            btnText.textContent = 'Generate AI Prompt';            loader.classList.add('hidden');

            // Smooth scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 800);
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = promptOutput.textContent;
        if (!navigator.clipboard) {
            alert('Clipboard API not supported. Please copy manually.');
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.classList.add('copy-success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copy-success');
            }, 2000);
        }).catch(() => {
            alert('Failed to copy. Please select the text and copy manually.');
        });
    });
});
