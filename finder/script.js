// ========== CONFIGURATION ==========
const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// ========== SYSTEM PROMPT (backend) ==========
const SYSTEM_PROMPT = `You are a Market Research Strategist + Digital Product Consultant with expertise in identifying trending, high-demand, and profitable niches globally and regionally.
Your specialty: spotting "hot" opportunities where urgent audience pain meets willingness to pay, and packaging them into sellable digital products (ebooks, courses, toolkits, memberships, template packs) using Resource-Based Positioning.

🎯 TRIGGER INPUT
User Command: "trending now"
(Optional modifiers: [niche], [region], [audience], [price-point])
Examples:
"trending now in health tech"
"trending now for Nigerian entrepreneurs"
"trending now under $50"

🔍 YOUR TASK
When triggered, generate 7 high-potential problem ideas and the Step-by-Step solution to SOLVE that particular problem idea. For every problem, you must explicitly identify the underlying skill to teach and the exact resource the audience already owns to frame it as a low-barrier offer.

📦 OUTPUT FORMAT
For each of the 7 generated problems, output exactly this structured template:

**IDEA [N]: [Short Title]**

- **Problem Idea:** [Clear statement of the urgent problem]
- **The Skill/Topic I Will Teach:** [The specific execution skill or knowledge module being sold]
- **The Resource They Already Have:** [The tool, specific low capital, or asset the user already owns to remove entry fear]
- **Logical Step-By-Step Solution:**
  Step 1: [Immediate, accessible starting action step]
  Step 2: [Next logical execution step]
  Step 3: [Clear path to the final transformation step]
- **Key Pain Points:** [6–7 specific frustrations this audience faces right now]
- **Unique Value Proposition:** [One-sentence differentiator: "The only [product] that helps [audience] do [X] in [Y way]"]
- **Target Audience:** [Detailed persona: demographics + psychographics + context]

📌 Sample Of Problem Categories To Draw From:
Business, Money, Health, Relationship, Skin Care, Educational, Traveling problems (as provided in your knowledge).

📤 OUTPUT RULES
- Output only the structured problem ideas in plain text
- Keep descriptions concise, specific, and actionable
- Use bold formatting for keys
- Prioritize sellable, implementable solution steps
- Tone: confident, opportunity-focused, data-informed
- No introductions, conclusions, or commentary outside the deliverable
- No filler text or motivational preamble
- Output must be ready for direct use in the MASTER DIGITAL PRODUCT GENERATOR PROMPT`;

// ========== HELPERS ==========
function $(id) { return document.getElementById(id); }

function fillExample(text) {
  $("userCommand").value = text;
  $("userCommand").focus();
}

function showLoader(show) {
  $("loader").style.display = show ? "flex" : "none";
}

function showOutput(show) {
  $("outputSection").style.display = show ? "block" : "none";
}

function showError(msg) {
  const el = $("errorBox");
  if (msg) {
    el.textContent = "⚠️ " + msg;
    el.style.display = "block";
  } else {
    el.style.display = "none";
  }
}

// ========== RENDER OUTPUT ==========
function renderOutput(text) {
  const box = $("outputBox");
  box.innerHTML = "";

  // Split into idea blocks by "**IDEA"
  const ideaRegex = /\*\*IDEA\s*\d+:/gi;
  const parts = text.split(ideaRegex);
  const titles = [...text.matchAll(/\*\*IDEA\s*(\d+):\s*(.*?)\*\*/gi)];

  if (parts.length <= 1) {
    // Fallback: render as formatted plain text
    box.innerHTML = formatMarkdown(text);
    return;
  }

  // Remove first empty part
  parts.shift();

  parts.forEach((part, i) => {
    const block = document.createElement("div");
    block.className = "idea-block";
    block.style.animationDelay = (i * 0.07) + "s";

    const numEl = document.createElement("div");
    numEl.className = "idea-number";
    const titleMatch = titles[i];
    numEl.textContent = titleMatch
      ? `Idea ${titleMatch[1]} · ${titleMatch[2].trim()}`
      : `Idea ${i + 1}`;

    const bodyEl = document.createElement("div");
    bodyEl.className = "idea-body";
    bodyEl.innerHTML = formatMarkdown(part.trim());

    block.appendChild(numEl);
    block.appendChild(bodyEl);
    box.appendChild(block);
  });
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

// ========== COPY OUTPUT ==========
function copyOutput() {
  const box = $("outputBox");
  const rawText = box.innerText || box.textContent;
  navigator.clipboard.writeText(rawText).then(() => {
    const btn = $("copyBtn");
    btn.innerHTML = "<span>✅</span> Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = "<span>📋</span> Copy All";
      btn.classList.remove("copied");
    }, 2200);
  }).catch(() => {
    alert("Could not copy. Please select and copy manually.");
  });
}

// ========== MAIN GENERATE FUNCTION ==========
async function generateIdeas() {
  const input = $("userCommand").value.trim();

  if (!input) {
    showError("Please enter a command, e.g. 'trending now in health tech'");
    return;
  }

  // Validate it contains "trending now" or accept any query
  const btn = $("generateBtn");
  btn.disabled = true;

  showError(null);
  showOutput(false);
  showLoader(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();

    const content = data?.content;
    if (!content || !Array.isArray(content)) {
      throw new Error("Unexpected API response format.");
    }

    const textBlocks = content.filter(b => b.type === "text").map(b => b.text).join("\n");

    if (!textBlocks) {
      throw new Error("No output returned. Please try again.");
    }

    showLoader(false);
    showOutput(true);
    renderOutput(textBlocks);

  } catch (err) {
    showLoader(false);
    showError(err.message || "Something went wrong. Please try again.");
  } finally {
    btn.disabled = false;
  }
}

// ========== ENTER KEY SUPPORT ==========
document.addEventListener("DOMContentLoaded", () => {
  const input = $("userCommand");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") generateIdeas();
    });
  }
});
