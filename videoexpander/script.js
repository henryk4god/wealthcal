document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('promptForm');
  const outlineInput = document.getElementById('outlineInput');
  const generateBtn = document.getElementById('generateBtn');
  const btnText = generateBtn.querySelector('.btn-text');
  const spinner = generateBtn.querySelector('.spinner');
  const outputSection = document.getElementById('outputSection');
  const outputContent = document.getElementById('outputContent');
  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');

  const PROMPT_TEMPLATE = `You are an expert instructional designer and an elite video course scriptwriter. Your task is to transform the provided course lesson/module outline into a comprehensive, highly engaging video walkthrough script.

[INSERT COURSE/MODULE/LESSON OUTLINE HERE]

Please adhere strictly to the following framework and execution rules:

 1. Tone, Style, and Delivery

- Tone: Warm, friendly, supportive, and conversational (like an experienced mentor or a trusted peer breaking down complex topics). Avoid dry, overly academic, or lecturing tones.

- Style: Highly actionable, practical, and clear. Emphasize *why* this matters to the student's real life.

- Format: Divide the script into clear, chronological, time-coded sections. For each section, provide specific "Visual" directions (what is happening on screen/slides/b-roll) and the corresponding "Audio / Script" (what the host actually says).

 2. Structural Requirements

Your script must include the following sections chronologically:

- Section 1: Intro / The Real-World Problem: Frame the context immediately. Explain why traditional or generic advice on this topic fails and why this specific lesson is an absolute necessity.

- Section 2: Real-World Case Study: Introduce a relatable fictional character or scenario matching this niche. Walk through their specific pain points, an immediate crisis or challenge they faced, and the negative consequences of doing things the "wrong" way. 

- Section 3: The Target & The Pitfalls: Define the exact target or outcome the student needs to achieve. Call out the common mistakes or traps people fall into when trying to solve this problem.

- Section 4: The Framework/Toolkit: Introduce the specific tools, methods, or resources needed. Walk through how to access or utilize them practically (mentioning relevant apps, software, or habits based on the niche).

- Section 5: Mastery Strategy (The Core Concept): Present a unique, multi-layered framework or strategy to solve the problem systematically. Tie the Case Study character back into this section to show how this exact framework would have solved their crisis perfectly.

- Section 6: Action Plan (Outro): Conclude with a warm, encouraging wrap-up and a clear, 3-step homework assignment/action plan for the student to complete before moving to the next video.

 3. Guardrails

- Output format: Do NOT use tables anywhere in the script. Use clean markdown headings, horizontal rules, and bullet points for high readability and scannability.

- Include a single, friendly follow-up question at the very end of the response to guide the user to the next step of their course creation process.

4. Do each module or lesson one after the other when your are done with any module ask me to proceed before you do the next module.

5. ⚠️ STRICT RULES:
No introductions, conclusions, or commentary outside the deliverable

No filler text or motivational preamble

Output Strictly only

No explanations,no introductions, no additional text.`;

  const setLoading = (isLoading) => {
    generateBtn.disabled = isLoading;
    if (isLoading) {
      btnText.classList.add('hidden');
      spinner.classList.remove('hidden');
      outputSection.classList.add('hidden');
    } else {
      btnText.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  };

  const copyToClipboard = async () => {
    const textToCopy = outputContent.textContent;
    try {
      await navigator.clipboard.writeText(textToCopy);
      copyBtn.classList.add('copied');
      copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyText.textContent = 'Copy Prompt';
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      copyText.textContent = 'Failed to copy';
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const outline = outlineInput.value.trim();
    if (!outline) return;

    setLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const assembledPrompt = PROMPT_TEMPLATE.replace('[INSERT COURSE/MODULE/LESSON OUTLINE HERE]', outline);
    outputContent.textContent = assembledPrompt;
    outputSection.classList.remove('hidden');    outputSection.style.animation = 'fadeIn 0.5s ease-out';
    setLoading(false);
  });

  copyBtn.addEventListener('click', copyToClipboard);
});
