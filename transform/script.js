// script.js
document.getElementById('transformerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const outlineInput = document.getElementById('outlineInput').value;
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');
    const spinner = generateBtn.querySelector('.spinner');
    const resultCard = document.getElementById('resultCard');
    const promptOutput = document.getElementById('promptOutput');

    // Enter Loading State
    generateBtn.disabled = true;
    btnText.textContent = 'Generating...';
    spinner.classList.remove('hidden');
    resultCard.classList.add('hidden');
    resultCard.classList.remove('show');

    // Simulate an async generation process for elegant UX
    setTimeout(() => {
        const structuralPrompt = `ACT AS A PROFESSIONAL PROMPT ENGINEER AND OUTLINE ARCHITECT.

Your task is to transform the PROVIDED OUTLINE below into a proprietary, unique, and non-Googleable framework. The output must NOT sound like generic AI or standard financial advice. It must feel like a signature methodology.

${outlineInput}

Follow these strict modification rules to create "SAMPLE 2" style output:

### VARIATION 1: The "Asymmetry & Playbook" Rules
**RULE 1: The Asymmetric Signature**
For every major chapter or module, identify the highest-leverage, proprietary strategy that yields outsized results and rebrand it with a unique name using this pattern: 🔶 [Proprietary Playbook Title]: [The Asymmetric Leverage Point]
**RULE 2: The "Hedge vs. Gamble" Reframing**
Identify a standard, high-risk practice in each chapter and contrast it directly with a calculated, low-cost action using this pattern: 🔶 [Low-Barrier Hedge] vs. [High-Risk Gamble]
**RULE 3: The "Frictionless Shield" Framework**
Where the outline mentions cognitive bias, emotional fatigue, or interpersonal pressure, introduce an automated boundary framework named "The Frictionless Shield: [System Name]" accompanied by a specific operational script or rule.

### VARIATION 2: The "Mechanic & Friction" Rules
**RULE 1: The Blueprint Core**
Rebrand the central operational mechanism of every chapter into a proprietary, mechanical framework name using this pattern: ⚙️ [The Machine Construct]: [The High-Efficiency Output]
**RULE 2: The "Leverage vs. Friction" Reframing**
Expose a common, energy-draining trap or bottleneck and contrast it directly with a low-friction, high-leverage alternative using this pattern: ⚙️ [The High-Leverage Input] vs. [The High-Friction Drag]
**RULE 3: The "Fault-Tolerance" Protocol**
Where the outline highlights human error, bad habits, or emotional decision-making, embed a structural safeguard framework named "The Fault-Tolerance Protocol: [Mechanism Name]" with an immutable operational boundary.

### VARIATION 3: The "Velocity & Scale" Rules
**RULE 1: The Velocity Engine**
Isolate the primary growth or speed vector in each module and weaponize it under a proprietary, high-speed brand name using this pattern: 🚀 [Velocity Concept]: [The Scaled Breakthrough Formula]
**RULE 2: The "Scale Move vs. Scope Creep" Reframing**
Identify a bloated, high-overhead operational practice and contrast it directly with an agile, high-impact growth move using this pattern: 🚀 [The Lean Velocity Move] vs. [The Heavy Scale Trap]
**RULE 3: The "Zero-Drag" Protocol**
Where the text introduces hesitation, analysis paralysis, or bureaucratic delay, insert a fast-acting execution framework titled "The Zero-Drag Protocol: [Action Script Name]" featuring an immediate execution rule.

VARIATION 4:
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


SAMPLE 2 STYLE :

Chapter 1: The Nigerian Wealth Paradox
Why high income doesn't equal wealth in Nigeria
· Naira devaluation history (1972–2024) and its impact on savings
· Inflation vs. your salary: the silent shrink
· Why "saving in a bank" is actually losing money
· The difference between being "rich" (high spend) and "wealthy" (asset-rich)
· Learning outcome: Calculate your real (inflation-adjusted) net worth and identify wealth leaks

Chapter 2: The Emergency Shield – Introducing The Emergency Trinity
Before you invest, protect yourself from life's shocks
· Why an emergency fund matters more in Nigeria (job instability, health costs, family demands)
· Target: 6 months of living expenses – but in what form?
· Best low-risk naira vehicles: Money market funds, Treasury Bills, and fixed deposits
· How to access these via mobile apps (Cowrywise, PiggyVest, FirstBank, etc.)
· The "Liquidity Ladder" – matching access speed to need
· 🔷 The Emergency Trinity: My 3-layer, 20%+ naira strategy
· Learning outcome: Build a 6-month emergency fund earning double-digit returns without locking up cash for >90 days

Chapter 3: The Lagos Dollar Bridge
My 3-layer formula for owning USD assets without leaving your apartment
· Why dollar assets matter (hedging against naira devaluation)
· Layer 1: The Foundation (Stablecoins – USDC/USDT)
· Layer 2: The Anchor (Nigerian Eurobonds)
· Layer 3: The Accelerator (US stocks via Nigerian brokers)
· Crypto as a dollar substitute – custody, regulation, and exit strategy
· Avoid common traps: unlicensed forex "investment" schemes
· 🔷 The Lagos Dollar Bridge: The exact safe sequence (Layer 1 → Layer 2 → Layer 3)
· Learning outcome: Allocate 30–50% of long-term savings to dollar-linked assets without breaking CBN rules

Chapter 4: Real Estate for the 99%
The ₦50k move (and why ₦500k might be a trap)
· Realities of Nigerian real estate: High entry cost, illiquidity, title issues
· Fractional ownership: How it works (PropertyPro, Crowdyvest, PiggyVest)
· Land banking vs. finished properties – which for what goal?
· The "build and rent" model for mid-income earners (using mortgage alternatives)
· Due diligence: Verifying C of O, survey plan, and avoiding Omo Onile crises
· 🔷 The ₦50k Real Estate Move vs. The ₦500k Trap
· Learning outcome: Start a real estate position with as little as ₦500k and understand illiquidity trade-offs

Chapter 5: The USD Earner's Roadmap
Turning your skills into dollar revenue streams (without quitting your job)
· The best hedge: Earning in USD while living in ₦
· Remote skills in demand: Digital marketing, virtual assistance, no-code tools, data annotation
· Platforms that pay Nigerians reliably: Upwork, Fiverr, Contra, Turing
· Avoiding freelancer scams and payment delays (Grey, Geegpay, Wise alternatives)
· 🔷 The USD Earner's Roadmap (Stage 1 → Stage 2 → Stage 3)
· Mini-case: From ₦200k salary to $2k/month remote – the transition roadmap
· Learning outcome: Identify one remote skill to upskill in and open your first USD-receiving account within 7 days

Chapter 6: Avoiding Wealth Decay
Taxes, family pressure, scams – and The Guilt-Free No
· Tax basics for freelancers & small business owners (CAC, FIRS, LIRS – what you actually need)
· The "family and friends" drain: setting financial boundaries without guilt
· Common Nigerian investment scams: wonder banks, forex pools, "agric invest" fraud
· Behavioral pitfalls: lifestyle inflation, keeping up with neighbors, and "get rich quick" addiction
· 🔷 The Guilt-Free No: Family boundary scripts that work
· Learning outcome: Implement three "wealth protection rules" (separate accounts, no-lend policy, tax reserve)

Chapter 7: Your 12-Month Wealth Action Plan
From reading to doing – The Wealth Blueprint Timeline
· Month 1–3: The Emergency Trinity (Layer 1)
· Month 4–6: The Lagos Dollar Bridge (Layer 1 + 2)
· Month 7–9: The USD Earner's Roadmap (Stage 1–2)
· Month 10–12: The Lagos Dollar Bridge (Layer 3) + Rebalance
· Tracking progress: Net worth statement and "wealth rate" (savings / income)
· 🔷 The Wealth Blueprint Timeline: Your printable 12-month calendar
· Learning outcome: Complete a personalized 12-month timeline with specific monthly targets

Conclusion: You Are Now a Builder


**RULE 7**: no additional explanation outside the output ie No introduction or conclusion

Now transform the content I provide below using these rules.`;

        promptOutput.textContent = structuralPrompt;
        
        // Reset Button and Reveal Output Window
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Prompt Blueprint';
        spinner.classList.add('hidden');
        resultCard.classList.remove('hidden');
        resultCard.classList.add('show');
        
        // Dynamic viewport tracking
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);
});

// Implementation of Clipboard Management Subsystem
document.getElementById('copyBtn').addEventListener('click', function() {
    const promptText = document.getElementById('promptOutput').textContent;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.textContent = 'Copied to Clipboard! ✓';
        copyBtn.style.backgroundColor = '#22c55e'; // Green feedback confirmation state
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.backgroundColor = 'var(--primary)';
        }, 2500);
    }).catch(err => {
        console.error('Action execution failed: ', err);
    });
});
