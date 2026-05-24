// ============================================================
//  LOCAL PROMPT DATABASE
//  The full system prompt lives here as the backend "database"
// ============================================================
const OFFER_PROMPT = `
You are a high-level direct response marketer, product strategist, and funnel expert.

Your task is to take ANY idea or niche provided by the user and transform it into a
high-converting digital product offer using the EXACT structure below.

The output must be practical, specific, conversion-focused, and tailored to the niche provided.

INPUT:
- Product Name: {title}
- Subtitle: {subtitle}
- Logical Step-By-Step Solution: {steps}
- Key Pain Points: {painPoints}
- Unique Value Proposition: {uvp}
- Target Audience: {persona}
- Proprietary Framework: {framework}

OUTPUT STRUCTURE:
Seven (7) Pain Points | Seven (7) Transformations | Big Promise |
Educational Teaching (3 Steps) | OFFER (Price ₦5,000–₦7,500) |
Core Product + 6 Bonuses | Payment Guide (Selar Checkout Link)

RULES: No introductions. No conclusions. Output ONLY the structured result.
Keep language simple, clear, persuasive. Tailor EVERYTHING to the niche provided.
`;

// ============================================================
//  simulateAIResponse(prompt, inputData)
//  Fills the prompt placeholders and builds a structured offer
// ============================================================
function simulateAIResponse(prompt, inputData) {
  const { title, subtitle, steps, painPoints, uvp, persona, framework } = inputData;

  // ── Parse pain points from user input ──────────────────────
  const rawPains = painPoints
    .split(/[\n,;]+/)
    .map(p => p.trim())
    .filter(Boolean);

  while (rawPains.length < 7) {
    rawPains.push(`Lack of a clear system to get results with ${title}`);
  }
  const pains = rawPains.slice(0, 7);

  // ── Build transformations (before → after) ─────────────────
  const transformations = pains.map((pain, i) => {
    const befores = pain.replace(/^(no |lack of |unable to |can't |cannot )/i, '');
    const afters = [
      `From struggling to → Confidently growing with ${title}`,
      `From confused to → Clear, step-by-step using the ${framework}`,
      `From no results to → Consistent outcomes in 30 days`,
      `From overwhelmed to → Focused and taking daily action`,
      `From broke to → Earning your first ₦50,000 using this system`,
      `From zero audience to → Building a loyal, paying community`,
      `From ignored to → Seen as an authority in your niche`,
    ];
    return afters[i] || `From "${befores}" to achieving real results with ${title}`;
  });

  // ── Parse steps ────────────────────────────────────────────
  const rawSteps = steps
    .split(/step\s*\d*[:\-.]?\s*/i)
    .map(s => s.trim())
    .filter(Boolean);
  const step1 = rawSteps[0] || `Identify your target audience using the ${framework}`;
  const step2 = rawSteps[1] || `Set up and deploy ${title} using the done-for-you templates`;
  const step3 = rawSteps[2] || `Launch your offer and start generating income within 7 days`;

  // ── Generate price (random within ₦5,000–₦7,500) ──────────
  const priceOptions = ['₦5,000', '₦5,500', '₦6,000', '₦6,500', '₦7,000', '₦7,500'];
  const price = priceOptions[Math.floor(Math.random() * priceOptions.length)];

  // ── Build core product value ───────────────────────────────
  const globalValue = price === '₦5,000' ? '$50' :
                      price === '₦5,500' ? '$55' :
                      price === '₦6,000' ? '$60' :
                      price === '₦6,500' ? '$65' :
                      price === '₦7,000' ? '$70' : '$75';

  // ── Bonuses ────────────────────────────────────────────────
  const bonuses = [
    {
      icon: '📋',
      title: `${title} Quick-Start Cheat Sheet`,
      desc: `Everything you need on one page — zero fluff`,
      value: '₦3,000',
    },
    {
      icon: '📈',
      title: `Advanced ${framework} Expansion Guide`,
      desc: `Scale from ₦50k to ₦200k/month step-by-step`,
      value: '₦5,000',
    },
    {
      icon: '⚠️',
      title: `Top 10 Mistakes Checklist for ${persona.split(' ').slice(0, 3).join(' ')}`,
      desc: `Avoid costly errors that kill your results before they start`,
      value: '₦2,500',
    },
    {
      icon: '📊',
      title: `90-Day Income Tracking Template`,
      desc: `Know your numbers, grow your numbers`,
      value: '₦2,000',
    },
    {
      icon: '🗓️',
      title: `Daily Execution Workflow for ${title}`,
      desc: `A simple routine that keeps you consistent every day`,
      value: '₦3,500',
    },
    {
      icon: '👥',
      title: `Private Community Access + Live Q&A`,
      desc: `Join others building with the same system — get support anytime`,
      value: '₦10,000',
    },
  ];

  // ── Return structured result object ───────────────────────
  return {
    title,
    subtitle,
    uvp,
    pains,
    transformations,
    bigPromise: `Using the ${framework}, ${persona.split(' ').slice(0,3).join(' ')} can now ${step3.toLowerCase()} — without needing experience, a big budget, or tech skills — in under 7 days.`,
    steps: [step1, step2, step3],
    price,
    globalValue,
    coreProduct: {
      name: `✅ The ${title} Complete System`,
      items: [
        `The full ${framework} explained step-by-step — nothing held back`,
        `Done-for-you templates, scripts, and prompts tailored to your niche`,
        `Quick setup promise: Go from zero to launch in 48 hours or less`,
      ],
    },
    bonuses,
  };
}

// ============================================================
//  HANDLE GENERATE CLICK
// ============================================================
function handleGenerate() {
  const inputData = {
    title:      document.getElementById('title').value.trim(),
    subtitle:   document.getElementById('subtitle').value.trim(),
    steps:      document.getElementById('steps').value.trim(),
    painPoints: document.getElementById('painPoints').value.trim(),
    uvp:        document.getElementById('uvp').value.trim(),
    persona:    document.getElementById('persona').value.trim(),
    framework:  document.getElementById('framework').value.trim(),
  };

  const errorEl  = document.getElementById('error-msg');
  const btnText  = document.querySelector('.btn-text');
  const btnLoader = document.getElementById('btnLoader');
  const btn      = document.getElementById('generateBtn');

  // Validate
  const emptyField = Object.values(inputData).some(v => v === '');
  if (emptyField) {
    errorEl.classList.remove('hidden');
    return;
  }
  errorEl.classList.add('hidden');

  // Simulate loading state
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  setTimeout(() => {
    const result = simulateAIResponse(OFFER_PROMPT, inputData);
    renderResult(result);

    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }, 1200); // simulated "processing" delay
}

// ============================================================
//  RENDER RESULT
// ============================================================
function renderResult(data) {
  const resultCard = document.getElementById('resultCard');
  const resultBody = document.getElementById('resultBody');

  const painHTML = data.pains.map((p, i) => `
    <li><span class="li-num">${i + 1}.</span> ${p}</li>
  `).join('');

  const transHTML = data.transformations.map((t, i) => `
    <li><span class="li-num">${i + 1}.</span> ${t}</li>
  `).join('');

  const stepsHTML = data.steps.map((s, i) => `
    <div class="webinar-step">
      <div class="step-num">${i + 1}</div>
      <div class="step-text">${s}</div>
    </div>
  `).join('');

  const coreItemsHTML = data.coreProduct.items.map(item => `<li>${item}</li>`).join('');

  const bonusHTML = data.bonuses.map(b => `
    <div class="bonus-item">
      <div class="bonus-icon">${b.icon}</div>
      <div class="bonus-text">
        <div class="bonus-title">${b.title}</div>
        <div class="bonus-desc">${b.desc}</div>
        <div class="bonus-value">Value: ${b.value}</div>
      </div>
    </div>
  `).join('');

  resultBody.innerHTML = `

    <!-- Pain Points -->
    <div class="result-section">
      <div class="result-section-title">🔥 Seven (7) Pain Points</div>
      <ul class="result-list">${painHTML}</ul>
    </div>

    <!-- Transformations -->
    <div class="result-section">
      <div class="result-section-title">✨ Seven (7) Transformations Expected</div>
      <ul class="result-list">${transHTML}</ul>
    </div>

    <!-- Big Promise -->
    <div class="result-section">
      <div class="result-section-title">🎯 Big Promise</div>
      <div class="big-promise-box">${data.bigPromise}</div>
    </div>

    <!-- Webinar Teaching -->
    <div class="result-section">
      <div class="result-section-title">🎓 Educational Teaching To Use In Webinar</div>
      <div class="webinar-steps">${stepsHTML}</div>
    </div>

    <!-- Offer -->
    <div class="result-section">
      <div class="result-section-title">💰 OFFER</div>
      <div class="offer-price-tag">
        <div class="price-label">INVESTMENT</div>
        <div class="price-value">${data.price} <span style="font-size:14px;opacity:0.75;">(≈ ${data.globalValue} USD)</span></div>
      </div>

      <!-- Core Product -->
      <div class="core-product-box">
        <div class="core-product-title">${data.coreProduct.name}</div>
        <ul>${coreItemsHTML}</ul>
        <div class="core-value">Global Value: ${data.globalValue} | Nigeria Value: ${data.price}</div>
      </div>

      <!-- Bonuses -->
      <div class="result-section-title" style="margin-top:16px;">🎁 Bonuses</div>
      <div class="bonus-list">${bonusHTML}</div>
    </div>

    <!-- Payment Guide -->
    <div class="result-section">
      <div class="result-section-title">💳 Payment Guide</div>
      <div class="payment-box">
        <p>Complete your purchase via Selar Checkout below</p>
        <a class="payment-link" href="https://selar.co" target="_blank">
          👉 Pay ${data.price} on Selar
        </a>
      </div>
    </div>

  `;

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
//  COPY RESULT
// ============================================================
function copyResult() {
  const body = document.getElementById('resultBody');
  const text = body.innerText;
  const btn  = document.getElementById('copyBtn');

  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✅ Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = '📋 Copy Output';
      btn.classList.remove('copied');
    }, 2500);
  }).catch(() => {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy Output'; }, 2500);
  });
}
