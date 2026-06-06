document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('generatorForm');
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('btnText');
    const resultCard = document.getElementById('resultCard');
    const promptOutput = document.getElementById('promptOutput');
    const copyBtn = document.getElementById('copyBtn');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        // Set Loading state
        submitBtn.disabled = true;
        spinner.style.display = 'block';
        btnText.textContent = 'Generating...';

        setTimeout(() => {
            const problemIdea = document.getElementById('problemIdea').value.trim();
            const productName = document.getElementById('productName').value.trim();
            const subtitle = document.getElementById('subtitle').value.trim();
            const skillTopic = document.getElementById('skillTopic').value.trim();
            const resourceHave = document.getElementById('resourceHave').value.trim();
            const solution = document.getElementById('solution').value.trim();
            const painPoints = document.getElementById('painPoints').value.trim();
            const uvp = document.getElementById('uvp').value.trim();
            const audience = document.getElementById('audience').value.trim();

            const corePrompt = `You are an Elite Direct Response Funnel Architect, Facebook Ads Strategist, Copywriting Expert, and Digital Product Launch Consultant.

Your task is to transform a single product input into a complete Facebook marketing, advertising, and sales system.

INPUT FORMAT (single block)

Problem Idea: ${problemIdea}
Product Name: ${productName}
Subtitle: ${subtitle}
The Skill/Topic I Will Teach: ${skillTopic}
The Resource They Already Have: ${resourceHave}
Logical Step-By-Step Solution: ${solution}
Key Pain Points: ${painPoints}
Unique Value Proposition: ${uvp}
Target Audience: ${audience}

CORE EXECUTION RULE

You MUST work in sequential modules.
You are NOT allowed to output everything at once.

After completing EACH module, STOP and ask: "Proceed to next step?"

Do not add explanations, introductions, or extra commentary.


MODULE STRUCTURE

MODULE 1: FACEBOOK PAGE NAMING

Generate 3 high-converting Facebook page names aligned with the product and audience.


STOP → Ask: "Proceed to next step?"


MODULE 2: FACEBOOK PAGE SETUP

Step-by-step guide to create and optimize Facebook page for conversion (beginner friendly but strategic).


STOP → Ask: "Proceed to next step?"


MODULE 3: BRAND ASSET PROMPTS

Provide ONLY prompts for AI image generation:

1. Facebook Cover Image Prompt (high-converting marketing style)
2. Facebook Profile Picture Prompt (brand identity focused)


STOP → Ask: "Proceed to next step?"


MODULE 4: CONTENT SYSTEM

Provide:
7 Facebook post ideas

Each post must include:
Hook
Body copy
CTA
Suggested image description


STOP → Ask: "Proceed to next step?"


MODULE 5: FACEBOOK ADS MANAGER SETUP

Provide step-by-step guide covering:
Campaign creation
Ad set setup
Ad creation
Budgeting
Targeting
Optimization


STOP → Ask: "Proceed to next step?"


MODULE 6: PIXEL SETUP GUIDE

Provide step-by-step setup for:
1. Selar
2. Systeme.io
3. WordPress


STOP → Ask: "Proceed to next step?"


MODULE 7: ADS STRATEGY BREAKDOWN

Provide step-by-step setup for:
1. Sales Campaign
2. Traffic Campaign
3. Lead Generation Campaign
4. Retargeting Campaign


STOP → Ask: "Proceed to next step?"


MODULE 8: WHATSAPP SALES CLOSING SYSTEM

Provide:
7 high-converting WhatsApp sales scripts
Include objection handling
Focus on closing techniques


STOP → Ask: "Proceed to next step?"


MODULE 9: EMAIL SEQUENCE

Provide:
7-email marketing sequence
Include:
Subject lines
Email body
CTA
Psychological triggers


STOP → END PROCESS


OUTPUT RULES

No explanations
No introductions
No marketing theory
Only actionable output
Must follow module order strictly
Must wait for confirmation before continuing each module.`;

            // Render result
            promptOutput.textContent = corePrompt;
            resultCard.classList.add('active');
            
            // Reset button state
            submitBtn.disabled = false;
            spinner.style.display = 'none';
            btnText.textContent = 'Generate Master Prompt';
            
            // Scroll smoothly to output
            resultCard.scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    });

    copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(promptOutput.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.backgroundColor = 'var(--accent)';
            copyBtn.style.color = '#ffffff';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = 'var(--primary-light)';
                copyBtn.style.color = 'var(--primary-dark)';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy prompt text: ', err);
        });
    });
});
