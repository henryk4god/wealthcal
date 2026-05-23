// ===== OUTLINE TRANSFORMER — script.js =====


// ===== LOCAL PROMPT DATABASE =====
const SYSTEM_PROMPT = `ACT AS A PROFESSIONAL PROMPT ENGINEER AND OUTLINE ARCHITECT.

Your task is to transform the [PROVIDED OUTLINE] below into a proprietary, unique, and non-Googleable framework. The output must NOT sound like generic AI or standard financial advice. It must feel like a signature methodology.

Follow these strict modification rules to create "SAMPLE 2" style output:

RULE 1: The Framework Signature
For every major chapter or module, identify the core strategic concept and rebrand it with a unique, memorable, proprietary name using this pattern:
🔷 [Unique Name]: [Bold claim or sequence]

RULE 2: The "Trap vs. Move" Reframing
Identify a common misconception or high-risk action in each chapter and contrast it with a low-risk, smart action.

RULE 3: The "Guilt-Free" / Behavioral Upgrade
Introduce behavioral frameworks like "The Guilt-Free [X]" where needed.

RULE 4: The Sequence Compression
Convert timelines into staged sequences:
Stage 1 → Stage 2 → Stage 3

RULE 5: Structural Cleanup
Move visuals and bonus materials into separate ending sections.

RULE 6: Tone & Originality
Use active language and proprietary naming structures.

RULE 7:
No introduction or conclusion outside the transformed framework.

Now transform the provided content using these rules.`;


// ===== Character counter =====
const textarea = document.getElementById('outlineInput');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', () => {
  charCount.textContent = textarea.value.length.toLocaleString();
});


// ===== Main transform function =====
function transformOutline() {

  const outline = textarea.value.trim();

  // ===== Validate =====
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

    // ===== Split outline =====
    const sections = outline
      .split('\n')
      .filter(line => line.trim() !== '');

    let transformed = '';

    // ===== Include SYSTEM PROMPT in output =====
    transformed += `
==============================
LOCAL SYSTEM PROMPT DATABASE
==============================

${SYSTEM_PROMPT}

==============================
TRANSFORMED OUTLINE
==============================
`;

    // ===== Generate framework =====
    sections.forEach((section, index) => {

      const stage = index + 1;

      transformed += `

🔷 ${generateFrameworkName(stage)}:
${generateClaim(stage)}

🔷 Stage ${stage} → Strategic Compression Sequence

• ${section}

🔷 The ₦${stage * 50}k Smart Move vs. The ₦${stage * 500}k Trap

• Replace complexity with structured execution.
• Remove emotional decision-making.
• Build scalable systems before expansion.

🔷 The Guilt-Free Boundary

• Operate from rules instead of pressure.
• Use predefined responses instead of emotional reactions.
• Create systems that reduce decision fatigue.

`;

    });

    // ===== Add visual assets =====
    transformed += `

=== VISUAL ASSETS REQUESTS ===

• Layer breakdown diagrams
• Stage progression charts
• Framework maps
• Checklist summaries
• Decision trees
• Execution tables

=== BONUS MATERIALS ===

• Printable execution checklist
• PDF quick-start summary
• Swipe file examples
• Tracking worksheet
• Execution templates
`;

    showOutput(transformed.trim());

  } catch (err) {

    showError(err.message || 'Something went wrong.');

  } finally {

    setLoading(false);

  }
}


// ===== Framework Name Generator =====
function generateFrameworkName(index) {

  const names = [
    'The Silent Momentum Grid',
    'The Lagos Velocity Stack',
    'The Pressure Exit Sequence',
    'The Income Pivot Engine',
    'The Cashflow Rebuild Matrix',
    'The Quiet Wealth Ladder',
    'The Freedom Conversion System',
    'The Decision Compression Method',
    'The Micro-Win Expansion Loop',
    'The Authority Positioning Chain',
    'The Fast-Track Execution Grid',
    'The Stability Scaling System'
  ];

  return names[index % names.length];
}


// ===== Claim Generator =====
function generateClaim(index) {

  const claims = [
    'The low-risk acceleration structure',
    'The strategic execution sequence',
    'The pressure-resistant upgrade path',
    'The simplified scaling framework',
    'The momentum-building process',
    'The repeatable positioning formula',
    'The friction-removal blueprint',
    'The sustainable leverage cycle',
    'The action-first restructuring model',
    'The controlled expansion system',
    'The repeatable income transition path',
    'The execution-first growth formula'
  ];

  return claims[index % claims.length];
}


// ===== Show output =====
function showOutput(text) {

  const outputCard = document.getElementById('outputCard');
  const outputBox = document.getElementById('outputBox');

  outputBox.textContent = text;

  outputCard.style.display = 'block';

  // ===== Smooth scroll =====
  setTimeout(() => {

    outputCard.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

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

    setTimeout(() => {
      setCopied(false);
    }, 2200);

  } catch (err) {

    // ===== Fallback =====
    const ta = document.createElement('textarea');

    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';

    document.body.appendChild(ta);

    ta.select();

    document.execCommand('copy');

    document.body.removeChild(ta);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2200);
  }
}


// ===== Copy button state =====
function setCopied(state) {

  const btn = document.getElementById('copyBtn');
  const btn2 = document.getElementById('copyIcon2');

  if (state) {

    btn.classList.add('copied');

    btn.innerHTML = '✅ Copied!';

    if (btn2) {
      btn2.textContent = '✅';
    }

  } else {

    btn.classList.remove('copied');

    btn.innerHTML = '<span id="copyIcon">📋</span> Copy';

    if (btn2) {
      btn2.textContent = '📋';
    }
  }
}


// ===== Reset =====
function resetForm() {

  document.getElementById('outputCard').style.display = 'none';

  hideError();

  textarea.value = '';

  charCount.textContent = '0';

  textarea.focus();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
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

    setTimeout(() => {
      btn.classList.remove('pulse');
    }, 3000);
  }
}


// ===== Error helpers =====
function showError(msg) {

  const ec = document.getElementById('errorCard');

  const em = document.getElementById('errorMsg');

  em.textContent = msg;

  ec.style.display = 'flex';

  ec.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
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
