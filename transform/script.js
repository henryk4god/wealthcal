document.addEventListener('DOMContentLoaded', () => {
  const outlineInput = document.getElementById('outlineInput');
  const transformBtn = document.getElementById('transformBtn');
  const loader = document.getElementById('loader');
  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('outputContent');
  const copyBtn = document.getElementById('copyBtn');

  const PROMPT_TEMPLATE = `ACT AS A PROFESSIONAL PROMPT ENGINEER AND OUTLINE ARCHITECT.

Your task is to transform the [PROVIDED OUTLINE] below into a proprietary, unique, and non-Googleable framework. The output must NOT sound like generic AI or standard financial advice. It must feel like a signature methodology.

Follow these strict modification rules to create "SAMPLE 2" style output:

**RULE 1: The Framework Signature**
For every major chapter or module, identify the core strategic concept and rebrand it with a unique, memorable, proprietary name using this pattern: 🔷 [Unique Name]: [Bold claim or sequence]
(Examples from sample: "The Emergency Trinity: My 3-layer, 20%+ naira strategy" / "The Lagos Dollar Bridge: The exact safe sequence")

**RULE 2: The "Trap vs. Move" Reframing**
Identify a common misconception or high-risk action in each chapter and contrast it with a low-risk, smart action using this pattern: 🔷 [Low Amount/Simple Action] vs. [High Amount/Common Trap]
(Example: "The ₦50k Real Estate Move vs. The ₦500k Trap")

**RULE 3: The "Guilt-Free" / Behavioral Upgrade**
Where the outline mentions psychological, social, or family pressure, introduce a behavioral framework named "The Guilt-Free [X]" with a specific script or rule.
(Example: "The Guilt-Free No: Family boundary scripts that work")

**RULE 4: The Sequence Compression**
Convert standard timelines or lists into a staged sequence: Layer 1 → Layer 2 → Layer 3 OR Stage 1 → Stage 2 → Stage 3. The original subtopics become the content WITHIN each layer/stage.

**RULE 5: Structural Cleanup**
- Flatten the structure: Remove separate "Learning outcomes" and "Suggested visuals" subheadings. Integrate the learning outcome as the final bullet point of each chapter.
- Move all visual suggestions (charts, tables, checklists) to a separate section at the very end of the output titled "=== VISUAL ASSETS REQUESTS ===".
- Move all bonus materials (Excel, PDF, videos) to a separate section at the very end titled "=== BONUS MATERIALS ===".

**RULE 6: Tone & Originality**
- Do NOT use phrases like "in conclusion", "to summarize", "in this chapter you will learn".
- Use active, declarative sentences.
- Every unique framework name (🔷) must be memorable and not easily searchable as a standard term.

Apply these rules to the [PROVIDED OUTLINE] below and output ONLY the modified outline in the exact style of SAMPLE 2.

[PROVIDED OUTLINE]
{{OUTLINE_HERE}}

**RULE 7**: no additional explanation outside the output ie No introduction or conclusion
- No explanations,no introductions, no additional text.`;

  transformBtn.addEventListener('click', async () => {
    const outline = outlineInput.value.trim();
    if (!outline) {      alert('Please paste your outline in the input field.');
      return;
    }

    // UI State: Loading
    transformBtn.disabled = true;
    transformBtn.textContent = 'Processing...';
    loader.classList.remove('hidden');
    outputSection.classList.add('hidden');

    // Simulate backend processing delay
    // Replace this setTimeout with actual fetch() to your AI backend/database
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Construct final prompt
    const finalPrompt = PROMPT_TEMPLATE.replace('{{OUTLINE_HERE}}', outline);

    // Display output
    outputContent.textContent = finalPrompt;
    
    // UI State: Success
    loader.classList.add('hidden');
    outputSection.classList.remove('hidden');
    outputSection.style.display = 'block';
    transformBtn.disabled = false;
    transformBtn.textContent = 'Transform Outline';
    copyBtn.textContent = '📋 Copy Output';
    copyBtn.style.backgroundColor = '';
  });

  copyBtn.addEventListener('click', async () => {
    const textToCopy = outputContent.textContent;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.textContent = '✅ Copied!';
      copyBtn.style.backgroundColor = 'var(--success-color)';
      copyBtn.style.color = '#ffffff';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy Output';
        copyBtn.style.backgroundColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      // Fallback for unsupported browsers
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => copyBtn.textContent = '📋 Copy Output', 2000);
    }
  });
});
