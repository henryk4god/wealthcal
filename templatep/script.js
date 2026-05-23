/* =============================================
   FILL IN THE GAP – TEMPLATE PROMPT BUILDER
   script.js
   ============================================= */

// ─── TEMPLATE DATABASE ─────────────────────────────────────────────────────

const TEMPLATES = {
  1: {
    badge:  "Template 1",
    title:  "The Idea Generator",
    desc:   "Brainstorm 12 product ideas across 4 formulas based on your skill and available resources.",
    fields: [
      {
        id:          "skill",
        label:       "The Skill / Topic You Teach",
        placeholder: "e.g., Video Editing / Crypto Trading / Fashion Design",
        hint:        "What niche or expertise are you sharing?",
        type:        "input",
      },
      {
        id:          "resource",
        label:       "The Resource They Already Have",
        placeholder: "e.g., A smartphone / ₦5,000 / 1 hour a day",
        hint:        "What low-barrier asset does your audience already own?",
        type:        "input",
      },
      {
        id:          "audience",
        label:       "The Target Audience",
        placeholder: "e.g., Complete beginners / University students",
        hint:        "Who exactly is this product for?",
        type:        "input",
      },
    ],
    buildPrompt: (v) => `TASK PROMPT: THE IDEA GENERATOR BRIEF

Instructions for AI: Reference Section 4 (Product Naming Archetypes) and Section 6 of the attached "Resource-Based Positioning Strategy" document to execute this task.

* THE SKILL/TOPIC I TEACH: ${v.skill}
* THE RESOURCE THEY ALREADY HAVE: ${v.resource}
* THE TARGET AUDIENCE: ${v.audience}

TASK:
Please brainstorm a comprehensive list of 12 distinct product ideas based on the details above. Organize them clearly under the four formulas from the document:
1. Three ideas using the "Start With" Formula
2. Three ideas using the "Blueprint" Formula
3. Three ideas using the "System" Formula
4. Three ideas using the "Challenge" Formula

Ensure every single idea highlights what they already HAVE and makes the entry barrier feel incredibly low.

No explanations, no introductions, no additional text.`,
  },

  2: {
    badge:  "Template 2",
    title:  "The Ad Copywriter",
    desc:   "Write 3 high-converting Facebook Ad variations for your product using a proven 4-part structure.",
    fields: [
      {
        id:          "productType",
        label:       "Your Product Type",
        placeholder: "e.g., Ebook / Video Course / Paid Community",
        hint:        "What format is your product delivered in?",
        type:        "input",
      },
      {
        id:          "productName",
        label:       "Product Name",
        placeholder: "e.g., The Smartphone Income Blueprint",
        hint:        "What is the exact name of your product?",
        type:        "input",
      },
      {
        id:          "barrierPoint",
        label:       "The Low Barrier Point",
        placeholder: "e.g., Just ₦3,000 capital / Using only WhatsApp",
        hint:        "What makes it easy or affordable for anyone to start?",
        type:        "input",
      },
      {
        id:          "audience",
        label:       "The Target Audience",
        placeholder: "e.g., Corpers / Unemployed graduates in Nigeria",
        hint:        "Describe your ideal buyer precisely.",
        type:        "input",
      },
    ],
    buildPrompt: (v) => `TASK PROMPT: THE AD COPYWRITER BRIEF

Instructions for AI: Reference Section 5 (Cardinal Rule of Believability) and Section 6 (High-Converting Facebook Ad Framework) of the attached document.

* MY PRODUCT TYPE: ${v.productType}
* PRODUCT NAME: ${v.productName}
* THE LOW BARRIER POINT: ${v.barrierPoint}
* THE TARGET AUDIENCE: ${v.audience}

TASK:
Write 3 highly compelling variations of Facebook Ad Primary Text for this product.

For each variation, you must strictly follow the 4-part structure from Section 6:
1. Hook (Attack a common, legacy belief that keeps them stuck)
2. Curiosity (Introduce our low-barrier resource alternative)
3. Simplicity (Remove technical complexity or financial fear)
4. CTA (Direct action to download/buy the blueprint)

CRITICAL CONSTRAINT: Adhere completely to the Cardinal Rule of Believability in Section 5. Keep the tone emotional and realistic. Do NOT use fake, overnight-millionaire hype.

No explanations, no introductions, no additional text.`,
  },

  3: {
    badge:  "Template 3",
    title:  "The Offer Diagnostic",
    desc:   "Diagnose why your offer is stalling and reframe it using resource-based positioning strategy.",
    fields: [
      {
        id:          "currentName",
        label:       "Current Product Name",
        placeholder: "e.g., Advanced Forex Mastery Course",
        hint:        "The exact name of your existing product.",
        type:        "input",
      },
      {
        id:          "currentSelling",
        label:       "What You Are Currently Selling",
        placeholder: "e.g., 20 hours of charts and technical analysis video lectures",
        hint:        "Describe the core content or deliverable.",
        type:        "textarea",
      },
      {
        id:          "currentPrice",
        label:       "Current Price",
        placeholder: "e.g., ₦25,000",
        hint:        "What is the asking price right now?",
        type:        "input",
      },
      {
        id:          "stallingReason",
        label:       "Why It Is Stalling",
        placeholder: "e.g., People click but say they don't have a laptop or time to learn charts",
        hint:        "What objection or friction are you hearing most?",
        type:        "textarea",
      },
    ],
    buildPrompt: (v) => `TASK PROMPT: THE OFFER DIAGNOSTIC & PIVOT BRIEF

Instructions for AI: Reference Section 1 (Core Concept), Section 3 (Resource Angles), and Section 5 (The 4 Elements) of the attached document.

* CURRENT PRODUCT NAME: ${v.currentName}
* WHAT I AM CURRENTLY SELLING: ${v.currentSelling}
* CURRENT PRICE: ${v.currentPrice}
* THE REASON IT IS STALLING: ${v.stallingReason}

TASK:
Act as a conversion optimization expert. Analyze my current product details above through the lens of the Resource-Based Positioning Strategy.

1. DIAGNOSIS: Tell me where my current offer is causing psychological friction, overwhelm, or fear based on Section 1.
2. THE PIVOT: Identify the strongest "Resource Angle" (Money, Time, Gadget, or Skill from Section 3) we should switch to.
3. THE RE-WRITE: Reframe and re-write this exact same offer using the new strategy. Give me a new, high-converting product name, a new entry vehicle hook, and structure it using the "4 Elements of Direct Conversion" from Section 5.

No explanations, no introductions, no additional text.`,
  },

  4: {
    badge:  "Template 4",
    title:  "The Landing Page Copywriter",
    desc:   "Generate complete long-form landing page copy across 5 structured sections for your product.",
    fields: [
      {
        id:          "productName",
        label:       "Product Name",
        placeholder: "e.g., The ₦5k Wealth Blueprint",
        hint:        "What is the product's name?",
        type:        "input",
      },
      {
        id:          "skillTopic",
        label:       "The Skill / Topic You Are Teaching",
        placeholder: "e.g., Micro-investing and automated daily savings systems",
        hint:        "What transformation or knowledge are you delivering?",
        type:        "textarea",
      },
      {
        id:          "resource",
        label:       "The Resource They Already Have",
        placeholder: "e.g., A smartphone and ₦5,000 weekly",
        hint:        "What do they already own that makes this accessible?",
        type:        "input",
      },
      {
        id:          "audience",
        label:       "Target Audience",
        placeholder: "e.g., Busy young professionals and beginners in Nigeria",
        hint:        "Who is this landing page speaking to?",
        type:        "input",
      },
      {
        id:          "price",
        label:       "Core Price of the Product",
        placeholder: "e.g., ₦3,500",
        hint:        "The actual selling price.",
        type:        "input",
      },
    ],
    buildPrompt: (v) => `TASK PROMPT: THE LANDING PAGE COPYWRITER BRIEF

Instructions for AI: Reference Section 1 (Psychological Shift), Section 4 (Naming Archetypes), and Section 5 (The 4 Elements) of the attached document.

* PRODUCT NAME: ${v.productName}
* THE SKILL/TOPIC I AM TEACHING: ${v.skillTopic}
* THE RESOURCE THEY ALREADY HAVE: ${v.resource}
* TARGET AUDIENCE: ${v.audience}
* THE CORE PRICE OF THE PRODUCT: ${v.price}

TASK:
Write the complete text/copy for a high-converting, long-form landing page for this product. Organize the output into the following distinct sections:

SECTION 1: THE ABOVE-THE-FOLD HERO SECTION
* Pre-Headline: [Call out the target audience and validate their current situation]
* Main Headline: [Use a high-converting formula connecting what they HAVE to what they WANT]
* Sub-Headline: [Inject immediate hope, simplicity, and state the low barrier to entry]
* Primary CTA Button Text: [Action-oriented and low friction]

SECTION 2: THE PROBLEM / EMPATHY BRIDGE (The Psychological Shift)
* Write 3-4 bullet points highlighting the common friction, overwhelm, fear, and generic complexity they currently face (based on Section 1 of the doc).
* End with a transition sentence: "It's not your fault. You don't need millions to start. You just need a system for what you already have."

SECTION 3: THE ENTRY VEHICLE REVEAL & CORE VALUE PROPOSITION
* Introduce the product as the ultimate simplified vehicle.
* Break the core offer down into the "4 Elements of Direct Conversion" from Section 5:
  1. Clear Starting Point
  2. Clear Outcome
  3. Clear Path
  4. Clear Audience

SECTION 4: WHAT IS INSIDE THE SYSTEM (The Step-by-Step Path)
* Provide 3 clear, benefit-driven modules or chapters showing how easy the transformation is. Keep the titles grounded in the "Cardinal Rule of Believability" (Section 5)—no hyper-exaggerated claims.

SECTION 5: FINAL CALL TO ACTION & RISK REVERSAL
* Reiterate the price and emphasize how low the personal/financial risk is compared to the massive transformation they are buying.
* Final CTA Button Text.

CRITICAL FORMATTING: Keep all text strictly left-aligned. Use bolding for emphasis on key phrases. Avoid marketing fluff or overly hype-driven words. Keep the tone grounded, encouraging, and highly professional.

No explanations, no introductions, no additional text.`,
  },
};

// ─── STATE ──────────────────────────────────────────────────────────────────

let activeTemplate = 1;

// ─── DOM REFERENCES ──────────────────────────────────────────────────────────

const templateTabs    = document.getElementById("templateTabs");
const fieldsContainer = document.getElementById("fieldsContainer");
const formCard        = document.getElementById("formCard");
const outputCard      = document.getElementById("outputCard");
const outputBody      = document.getElementById("outputBody");
const generateBtn     = document.getElementById("generateBtn");
const copyBtn         = document.getElementById("copyBtn");
const copyLabel       = document.getElementById("copyLabel");
const resetBtn        = document.getElementById("resetBtn");
const formTitle       = document.getElementById("formTitle");
const formDesc        = document.getElementById("formDesc");
const templateBadge   = document.getElementById("templateBadge");

// ─── RENDER TEMPLATE ─────────────────────────────────────────────────────────

function renderTemplate(id) {
  const tmpl = TEMPLATES[id];
  if (!tmpl) return;

  // Update header
  formTitle.textContent     = tmpl.title;
  formDesc.textContent      = tmpl.desc;
  templateBadge.textContent = tmpl.badge;

  // Render fields
  fieldsContainer.innerHTML = "";
  tmpl.fields.forEach((f) => {
    const group = document.createElement("div");
    group.className = "field-group";

    const label = document.createElement("label");
    label.className = "field-label";
    label.setAttribute("for", f.id);
    label.textContent = f.label;

    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
      input.className = "field-textarea";
      input.rows = 3;
    } else {
      input = document.createElement("input");
      input.className = "field-input";
      input.type = "text";
    }
    input.id          = f.id;
    input.placeholder = f.placeholder;

    const hint = document.createElement("span");
    hint.className   = "field-hint";
    hint.textContent = f.hint;

    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(hint);
    fieldsContainer.appendChild(group);

    // Clear error on input
    input.addEventListener("input", () => {
      input.classList.remove("error");
      const errEl = group.querySelector(".error-msg");
      if (errEl) errEl.remove();
    });
  });

  // Hide output, show form
  outputCard.style.display = "none";
  formCard.style.display   = "block";
}

// ─── TAB SWITCHING ───────────────────────────────────────────────────────────

templateTabs.addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  const id = parseInt(btn.dataset.template);
  if (id === activeTemplate) return;

  // Update active tab
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  activeTemplate = id;
  renderTemplate(id);
});

// ─── GENERATE PROMPT ─────────────────────────────────────────────────────────

generateBtn.addEventListener("click", () => {
  const tmpl  = TEMPLATES[activeTemplate];
  const values = {};
  let hasError = false;

  tmpl.fields.forEach((f) => {
    const el    = document.getElementById(f.id);
    const val   = el.value.trim();
    const group = el.closest(".field-group");

    // Remove old error
    el.classList.remove("error");
    const existing = group.querySelector(".error-msg");
    if (existing) existing.remove();

    if (!val) {
      el.classList.add("error");
      const err = document.createElement("span");
      err.className   = "error-msg";
      err.textContent = "This field is required.";
      group.appendChild(err);
      hasError = true;
    } else {
      values[f.id] = val;
    }
  });

  if (hasError) {
    // Scroll to first error
    const firstErr = fieldsContainer.querySelector(".error");
    if (firstErr) firstErr.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Build prompt
  const prompt = tmpl.buildPrompt(values);

  // Animate transition
  formCard.style.animation = "none";
  formCard.style.opacity   = "0";
  formCard.style.transform = "translateY(12px)";

  setTimeout(() => {
    formCard.style.display = "none";
    outputBody.textContent = prompt;
    outputCard.style.display = "block";
    outputCard.scrollIntoView({ behavior: "smooth", block: "start" });

    // Reset copy button
    copyBtn.classList.remove("copied");
    copyLabel.textContent = "Copy";
  }, 200);
});

// ─── COPY BUTTON ─────────────────────────────────────────────────────────────

copyBtn.addEventListener("click", async () => {
  const text = outputBody.textContent;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity  = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  copyBtn.classList.add("copied");
  copyLabel.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.classList.remove("copied");
    copyLabel.textContent = "Copy";
  }, 2500);
});

// ─── RESET BUTTON ────────────────────────────────────────────────────────────

resetBtn.addEventListener("click", () => {
  outputCard.style.display = "none";
  formCard.style.display   = "block";
  formCard.style.opacity   = "1";
  formCard.style.transform = "translateY(0)";
  formCard.style.animation = "fadeUp 0.4s ease both";
  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
});

// ─── INIT ────────────────────────────────────────────────────────────────────

renderTemplate(1);
