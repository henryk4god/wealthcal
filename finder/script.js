// 📦 BACKEND PROMPT DATABASE
const SYSTEM_PROMPT = `You are a Market Research Strategist + Digital Product Consultant with expertise in identifying trending, high-demand, and profitable niches globally and regionally.
Your specialty: spotting “hot” opportunities where urgent audience pain meets willingness to pay, and packaging them into sellable digital products (ebooks, courses, toolkits, memberships, template packs) using Resource-Based Positioning.

🎯 TRIGGER INPUT
User Command: "trending now"
(Optional modifiers: [niche], [region], [audience], [price-point])

🔍 YOUR TASK
When triggered, generate 7 high-potential problem ideas and the Step-by-Step solution to SOLVE that particular problem idea. For every problem, explicitly identify the underlying skill to teach and the exact resource the audience already owns to frame it as a low-barrier offer.

📦 OUTPUT FORMAT
For each of the 7 generated problems, output exactly this structured template:
- Problem Idea: [Clear statement of the urgent problem]
- The Skill/Topic I Will Teach: [The specific execution skill or knowledge module being sold]
- The Resource They Already Have: [The tool, specific low capital, or asset the user already owns to remove entry fear]
- Logical Step-By-Step Solution:
  Step 1: [Immediate, accessible starting action step]
  Step 2: [Next logical execution step]
  Step 3: [Clear path to the final transformation step]
- Key Pain Points: [6–7 specific frustrations this audience faces right now]
- Unique Value Proposition: [One-sentence differentiator: “The only [product] that helps [audience] do [X] in [Y way]”]
- Target Audience: [Detailed persona: demographics + psychographics + context]

⚠️ STRICT RULES:
No introductions, conclusions, or commentary outside the deliverable
Output must be ready for direct use in the MASTER DIGITAL PRODUCT GENERATOR PROMPT`;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('finder-form');
    const resultsContainer = document.getElementById('results-container');
    const outputSection = document.getElementById('output-section');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const commandDisplay = document.getElementById('command-display');
    const inputs = ['niche', 'region', 'audience', 'price'].map(id => document.getElementById(id));
    
    let rawOutput = '';

    // Real-time command preview builder
    inputs.forEach(input => {
        input.addEventListener('input', updateCommandPreview);
    });

    function updateCommandPreview() {
        const [niche, region, audience, price] = inputs.map(i => i.value.trim());
        let cmd = 'trending now';
        if (niche) cmd += ` in ${niche}`;
        if (audience) cmd += ` for ${audience}`;
        if (region) cmd += ` in ${region}`;        if (price) cmd += ` under ${price}`;
        commandDisplay.textContent = cmd;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const [niche, region, audience, price] = inputs.map(i => i.value.trim());
        let triggerCommand = 'trending now';
        if (niche) triggerCommand += ` in ${niche}`;
        if (audience) triggerCommand += ` for ${audience}`;
        if (region) triggerCommand += ` in ${region}`;
        if (price) triggerCommand += ` under ${price}`;

        generateBtn.disabled = true;
        generateBtn.classList.add('loading');
        outputSection.classList.remove('visible');
        resultsContainer.innerHTML = '';

        // Simulate backend AI latency
        await new Promise(res => setTimeout(res, 1600));

        const generatedData = generateStructuredIdeas(niche || 'digital products', region || 'global', audience || 'creators & solopreneurs', price || '$50-$200');
        rawOutput = formatRawOutput(triggerCommand, generatedData);

        renderCards(generatedData);
        outputSection.classList.add('visible');
        generateBtn.disabled = false;
        generateBtn.classList.remove('loading');
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(rawOutput).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied to Clipboard!';
            copyBtn.style.background = '#dcfce7';
            copyBtn.style.color = '#166534';
            copyBtn.style.borderColor = '#bbf7d0';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        });
    });

    function generateStructuredIdeas(niche, region, audience, price) {
        // Core problem templates aligned with prompt categories
        const templates = [
            { problem: 'Launch a profitable micro-business without technical debt', skill: 'Lean Startup Validation & MVP Building', resource: 'Notion/Google Docs + existing knowledge' },            { problem: 'Monetize existing content without burning out', skill: 'Content Repurposing & Automated Funnel Design', resource: 'Smartphone + free scheduling tools' },
            { problem: 'Secure high-ticket clients in a saturated market', skill: 'Authority Positioning & Direct Outreach Systems', resource: 'LinkedIn profile + email inbox' },
            { problem: 'Build recurring revenue without monthly subscriptions fatigue', skill: 'Digital Template & Toolkit Packaging', resource: 'Canva + basic spreadsheet skills' },
            { problem: 'Scale a side hustle while working full-time', skill: 'Batch Processing & Async Operations', resource: 'Calendar app + free automation (Zapier free tier)' },
            { problem: 'Convert followers into paying buyers instantly', skill: 'Low-Friction Offer Architecture', resource: 'Social media account + payment gateway' },
            { problem: 'Master a high-income skill with zero upfront investment', skill: 'AI-Assisted Workflow Optimization', resource: 'Free AI platforms + internet access' }
        ];

        return templates.map((t, i) => ({
            id: i + 1,
            problem: `${t.problem} for ${audience} in ${region} (${niche})`,
            skill: t.skill,
            resource: t.resource,
            steps: [
                `Audit your current workflow & identify the single biggest bottleneck costing time or money in ${niche.toLowerCase()}.`,
                `Deploy the ${t.skill} framework using only ${t.resource.toLowerCase()} to build a repeatable 5-day action loop.`,
                `Package the exact workflow into a step-by-step digital asset and position it at ${price} for targeted buyers.`
            ],
            painPoints: [
                `Overwhelmed by expensive, bloated software stacks`,
                `Lack of technical execution skills in ${niche.toLowerCase()}`,
                `Struggling to monetize existing knowledge or audience effectively`,
                `High market saturation with generic, theory-heavy advice`,
                `Uncertainty around pricing, positioning, and offer structure`,
                `Difficulty finding consistent, qualified buyers in ${region.toLowerCase()}`,
                `Analysis paralysis preventing first product or offer launch`
            ],
            uvp: `The only actionable playbook that helps ${audience.toLowerCase()} deploy ${t.skill.toLowerCase()} in under 5 days using only free/owned assets, positioned for ${price} buyers in ${niche.toLowerCase()}.`,
            target: `Demographics: 22-45yo, ${region}-based. Psychographics: Action-oriented, values ROI over theory, time-constrained but highly motivated. Context: Actively seeking scalable ${niche.toLowerCase()} income streams with minimal upfront risk and clear execution paths.`
        }));
    }

    function formatRawOutput(trigger, data) {
        return `SYSTEM PROMPT:\n${SYSTEM_PROMPT}\n\nTRIGGER COMMAND: "${trigger}"\n\n` + 
               data.map(d => `
- Problem Idea: ${d.problem}
- The Skill/Topic I Will Teach: ${d.skill}
- The Resource They Already Have: ${d.resource}
- Logical Step-By-Step Solution:
  Step 1: ${d.steps[0]}
  Step 2: ${d.steps[1]}
  Step 3: ${d.steps[2]}
- Key Pain Points: ${d.painPoints.join(' | ')}
- Unique Value Proposition: "${d.uvp}"
- Target Audience: ${d.target}`).join('\n\n---\n\n');
    }

    function renderCards(data) {
        data.forEach((d, idx) => {
            const card = document.createElement('div');            card.className = 'result-card';
            card.innerHTML = `
                <h3>📌 Idea #${d.id}</h3>
                <div class="card-section">
                    <span class="card-label">Problem Idea</span>
                    <div class="card-text">${d.problem}</div>
                </div>
                <div class="card-section">
                    <span class="card-label">The Skill/Topic I Will Teach</span>
                    <div class="card-text">${d.skill}</div>
                </div>
                <div class="card-section">
                    <span class="card-label">The Resource They Already Have</span>
                    <div class="card-text">${d.resource}</div>
                </div>
                <div class="card-section">
                    <span class="card-label">Logical Step-By-Step Solution</span>
                    <ul class="card-steps">
                        <li><strong>Step 1:</strong> ${d.steps[0]}</li>
                        <li><strong>Step 2:</strong> ${d.steps[1]}</li>
                        <li><strong>Step 3:</strong> ${d.steps[2]}</li>
                    </ul>
                </div>
                <div class="card-section">
                    <span class="card-label">Key Pain Points</span>
                    <div class="card-highlight">• ${d.painPoints.join('<br>• ')}</div>
                </div>
                <div class="card-section">
                    <span class="card-label">Unique Value Proposition</span>
                    <div class="card-highlight em">"${d.uvp}"</div>
                </div>
                <div class="card-section">
                    <span class="card-label">Target Audience</span>
                    <div class="card-highlight">${d.target}</div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }
});
