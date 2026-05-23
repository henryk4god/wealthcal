// ===== OUTLINE TRANSFORMER — script.js =====

const SYSTEM_PROMPT = `ACT AS A PROFESSIONAL PROMPT ENGINEER AND OUTLINE ARCHITECT.

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

**RULE 7**: No additional explanation outside the output — no introduction or conclusion.

Apply these rules to the [PROVIDED OUTLINE] below and output ONLY the modified outline in the exact style of SAMPLE 2.

Now transform the content provided using these rules.`;

// ===== Character counter =====
const textarea = document.getElementById('outlineInput');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', () => {
  charCount.textContent = textarea.value.length.toLocaleString();
});

// ===== Main transform function =====
async function transformOutline() {
  const outline = textarea.value.trim();

  // Validate
  if (!outline) {
    showError('Please paste your outline before transforming.');
    return;
  }

  if (outline.length < 30) {
    showError('Your outline seems too short. Please provide more content.');
    return;
  }

  hideError();
  setLoading(true);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `[PROVIDED OUTLINE]\n\n${outline}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const outputText = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');

    if (!outputText) throw new Error('No output received. Please try again.');

    showOutput(outputText);

  } catch (err) {
    showError(err.message || 'Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
}

// ===== Show output =====
function showOutput(text) {
  const outputCard = document.getElementById('outputCard');
  const outputBox = document.getElementById('outputBox');

  outputBox.textContent = text;
  outputCard.style.display = 'block';

  // Smooth scroll to output
  setTimeout(() => {
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ===== Copy output =====
async function copyOutput() {
  const outputBox = document.getElementById('outputBox');
  const text = outputBox.textContent;

  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  } catch (err) {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
}

function setCopied(state) {
  const btn = document.getElementById('copyBtn');
  const btn2 = document.getElementById('copyIcon2');
  const icon = document.getElementById('copyIcon');

  if (state) {
    btn.classList.add('copied');
    btn.innerHTML = '✅ Copied!';
    if (btn2) btn2.textContent = '✅';
  } else {
    btn.classList.remove('copied');
    btn.innerHTML = '<span id="copyIcon">📋</span> Copy';
    if (btn2) btn2.textContent = '📋';
  }
}

// ===== Reset =====
function resetForm() {
  document.getElementById('outputCard').style.display = 'none';
  hideError();
  textarea.value = '';
  charCount.textContent = '0';
  textarea.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Loading state =====
function setLoading(state) {
  const btn = document.getElementById('transformBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const btnLoader = document.getElementById('btnLoader');

  if (state) {
    btnText.style.display = 'none';
    btnIcon.style.display = 'none';
    btnLoader.style.display = 'flex';
    btn.disabled = true;
    btn.classList.remove('pulse');
  } else {
    btnText.style.display = 'inline';
    btnIcon.style.display = 'inline';
    btnLoader.style.display = 'none';
    btn.disabled = false;
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 3000);
  }
}

// ===== Error helpers =====
function showError(msg) {
  const ec = document.getElementById('errorCard');
  const em = document.getElementById('errorMsg');
  em.textContent = msg;
  ec.style.display = 'flex';
  ec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
  document.getElementById('errorCard').style.display = 'none';
}

// ===== Allow Ctrl+Enter to submit =====
textarea.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    transformOutline();
  }
});
