// script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('offerForm');
  const generateBtn = document.getElementById('generateBtn');
  const resultSection = document.getElementById('resultSection');
  const resultOutput = document.getElementById('resultOutput');
  const copyBtn = document.getElementById('copyBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = {
      productName: document.getElementById('productName').value.trim(),
      targetAudience: document.getElementById('targetAudience').value.trim(),
      stepByStep: document.getElementById('stepByStep').value.trim(),
      painPoints: document.getElementById('painPoints').value.trim(),
      uvp: document.getElementById('uvp').value.trim(),
    };

    if (Object.values(inputs).some(val => !val)) return;

    setLoading(true);
    hideResult();

    const systemPrompt = `You are a high-level direct response marketer, product strategist, and funnel expert.

Your task is to take ANY idea or niche provided by the user and transform it into a high-converting digital product offer using the EXACT structure below.

The output must be practical, specific, conversion-focused, and tailored to the niche provided.

INPUT:
- Product Name: ${inputs.productName}
- Step-by-Step Solution: ${inputs.stepByStep}
- Key Pain Points: ${inputs.painPoints}
- Unique Value Proposition: ${inputs.uvp}
- Target Audience: ${inputs.targetAudience}

OUTPUT STRUCTURE:

- Seven (7) Pain Points:
  (List highly emotional, specific struggles the target audience faces in this niche)

- Seven (7) Transformations Expected:
  (Clear before → after outcomes tied to the pain points)

- Big Promise:
  (One bold, compelling outcome statement that combines speed, simplicity, and result)

- Educational Teaching To Use In Webinar:
  Step 1: (First simple action user takes)  Step 2: (System/process introduced)
  Step 3: (Execution path to result)

- OFFER:
  Price: (Set within ₦5,000 – ₦7,500 range)

Product:
✅ [Core System Name]. What is inside:
- (Main tool/system explained clearly)
- (Quick setup or implementation promise)
- (Instructional prompts/templates/scripts relevant to niche)

(Assign realistic Nigerian Naira value to core product)

- 🎁 BONUS 1: (Cheat Sheet / Guide specific to niche) (₦ value)

- 🎁 BONUS 2: (Advanced strategy or expansion guide) (₦ value)

- 🎁 BONUS 3: (Risk reduction / mistakes / checklist) (₦ value)

- 🎁 BONUS 4: (Tracking / template / system) (₦ value)

- 🎁 BONUS 5: (Routine / workflow / execution system) (₦ value)

- 🎁 BONUS 6: (Community / support / access) (₦ value)

- PAYMENT GUIDE:
  Selar Checkout Link

---

RULES (STRICT):

❌ Do NOT include:
- Introductions
- Conclusions
- Explanations outside the structure
- Any extra commentary

✅ Output ONLY the structured result
✅ Keep language simple, clear, and persuasive
✅ Make it feel like a real paid offer
✅ Tailor EVERYTHING to the niche provided

Now generate the result.`;

    try {
      // 🔌 BACKEND CONNECTION: Replace the URL below with your actual AI/Backend endpoint
      // const response = await fetch('https://your-backend.com/api/generate', {
      //   method: 'POST',      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt: systemPrompt })
      // });
      // const data = await response.json();
      // const result = data.output;

      // 🧪 DEMO FALLBACK: Simulates AI generation for immediate frontend testing
      const result = await simulateAIResponse(systemPrompt);
      displayResult(result);
    } catch (error) {
      displayResult('⚠️ Error generating offer. Please check your connection and try again.');
      console.error('Generation Error:', error);
    } finally {
      setLoading(false);
    }
  });

  copyBtn.addEventListener('click', () => {
    const text = resultOutput.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = '✅ Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  });

  function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    generateBtn.querySelector('.btn-text').classList.toggle('hidden', isLoading);
    generateBtn.querySelector('.btn-loading').classList.toggle('hidden', !isLoading);
    if (isLoading) generateBtn.classList.add('pulse');
    else generateBtn.classList.remove('pulse');
  }

  function hideResult() {
    resultSection.classList.add('hidden');
  }

  function displayResult(text) {
    resultOutput.textContent = text;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Mock AI Response Generator (Remove when connecting real backend)
  function simulateAIResponse(prompt) {    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`- Seven (7) Pain Points:
1. Struggling to understand how to start without massive upfront capital
2. Overwhelmed by confusing industry jargon and hidden compliance rules
3. Paralyzed by fear of investing in fake schemes or losing hard-earned money
4. Lack of a clear, step-by-step roadmap tailored to local markets
5. Inconsistent income that doesn't match lifestyle or family goals
6. No reliable mentorship network to validate decisions quickly
7. Wasting months on trial-and-error instead of executing proven systems

- Seven (7) Transformations Expected:
1. Capital-efficient entry strategy matched to your exact budget size
2. Confidence navigating regulations using simplified compliance checklists
3. Verified frameworks that eliminate scam risks and protect your capital
4. Exact daily & weekly action plan to launch your first offer in 14 days
5. Predictable cash flow engine that scales linearly with your effort
6. Direct access to a vetted community of serious, high-performing peers
7. Automated tracking & execution tools that save 10+ hours weekly

- Big Promise:
Go from confused and stuck to launching your first profitable digital offer in just 14 days using a simple, step-by-step system that requires zero prior experience.

- Educational Teaching To Use In Webinar:
Step 1: Identify your audience's exact bleeding-neck problem and map it to a low-ticket, high-perceived-value solution.
Step 2: Deploy the "3-Page Funnel Framework" that converts cold traffic into buyers without complex tech or coding.
Step 3: Scale using the "Repeat & Automate" workflow to turn one consistent sale into a predictable daily income stream.

- OFFER:
Price: ₦6,500

Product:
✅ The ${inputs.productName || 'Complete Blueprint'} System. What is inside:
- The core "3-Pillar Conversion Framework" broken into bite-sized, actionable modules
- 15-minute setup guide to launch your offer before the weekend ends
- Plug-and-play scripts, swipe files, and ready-to-use templates specific to your niche
(Valued at ₦25,000)

- 🎁 BONUS 1: Niche-Specific Pain Point to Profit Cheat Sheet (₦8,500)
- 🎁 BONUS 2: Advanced Scaling & Upsell Playbook for Rapid Growth (₦12,000)
- 🎁 BONUS 3: "Anti-Sabotage" Checklist & Common Beginner Mistakes Guide (₦5,000)
- 🎁 BONUS 4: ROI Tracking Dashboard & Conversion Optimization Spreadsheet (₦9,500)
- 🎁 BONUS 5: 30-Day Execution Routine & Daily Workflow System (₦7,000)
- 🎁 BONUS 6: Exclusive Telegram Community + Weekly Live Q&A Access (₦15,000)

- PAYMENT GUIDE:
Selar Checkout Link
[Insert your Selar product link here]`);
      }, 1500);
    });  }
});
