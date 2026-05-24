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

    // Validate all fields
    if (Object.values(inputs).some(val => !val)) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

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

- Big Promise:  (One bold, compelling outcome statement that combines speed, simplicity, and result)

- Educational Teaching To Use In Webinar:
  Step 1: (First simple action user takes)
  Step 2: (System/process introduced)
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
      // Pass inputs to the mock function so it can interpolate correctly
      const result = await simulateAIResponse(systemPrompt, inputs);
      displayResult(result);
    } catch (error) {
      console.error('Generation Error:', error);
      displayResult('⚠️ Error generating offer. Please refresh and try again.');
    } finally {
      // Always reset loading state, even if an error occurs
      setLoading(false);
    }
  });

  copyBtn.addEventListener('click', () => {
    const text = resultOutput.textContent;
    if (!text || text.includes('⚠️')) return;
    
    navigator.clipboard.writeText(text).then(() => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '✅ Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(err => console.error('Copy failed:', err));
  });

  function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    generateBtn.querySelector('.btn-text').classList.toggle('hidden', isLoading);
    generateBtn.querySelector('.btn-loading').classList.toggle('hidden', !isLoading);
    if (isLoading) generateBtn.style.animation = 'pulse 1.5s infinite';
    else generateBtn.style.animation = '';
  }

  function hideResult() {
    resultSection.classList.add('hidden');
  }

  function displayResult(text) {
    resultOutput.textContent = text;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 🔁 MOCK AI RESPONSE (Fixed & Scoped Correctly)
  function simulateAIResponse(prompt, inputData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {        try {
          const name = inputData.productName || 'The Complete System';
          const result = `- Seven (7) Pain Points:
1. Struggling to start without massive upfront capital
2. Overwhelmed by confusing jargon and hidden rules
3. Paralyzed by fear of investing in fake schemes
4. Lack of a clear, step-by-step roadmap for local markets
5. Inconsistent income that doesn't match lifestyle goals
6. No reliable mentorship network to validate decisions
7. Wasting months on trial-and-error instead of execution

- Seven (7) Transformations Expected:
1. Capital-efficient entry strategy matched to your exact budget
2. Confidence navigating regulations using simplified checklists
3. Verified frameworks that eliminate scam risks
4. Exact daily action plan to launch in 14 days
5. Predictable cash flow that scales with effort
6. Direct access to a vetted community of serious peers
7. Automated tracking tools that save 10+ hours weekly

- Big Promise:
Go from confused and stuck to launching your first profitable digital offer in just 14 days using a simple, step-by-step system that requires zero prior experience.

- Educational Teaching To Use In Webinar:
Step 1: Identify your audience's exact bleeding-neck problem and map it to a low-ticket, high-value solution.
Step 2: Deploy the "3-Page Funnel Framework" that converts cold traffic without complex tech.
Step 3: Scale using the "Repeat & Automate" workflow to turn one sale into predictable daily income.

- OFFER:
Price: ₦6,500

Product:
✅ ${name}. What is inside:
- Core "3-Pillar Conversion Framework" broken into bite-sized modules
- 15-minute setup guide to launch before the weekend ends
- Plug-and-play scripts, swipe files, and ready-to-use templates
(Valued at ₦25,000)

- 🎁 BONUS 1: Niche-Specific Pain Point to Profit Cheat Sheet (₦8,500)
- 🎁 BONUS 2: Advanced Scaling & Upsell Playbook (₦12,000)
- 🎁 BONUS 3: "Anti-Sabotage" Checklist & Mistakes Guide (₦5,000)
- 🎁 BONUS 4: ROI Tracking Dashboard & Conversion Spreadsheet (₦9,500)
- 🎁 BONUS 5: 30-Day Execution Routine & Workflow System (₦7,000)
- 🎁 BONUS 6: Exclusive Community + Weekly Live Q&A Access (₦15,000)

- PAYMENT GUIDE:
Selar Checkout Link`;
          resolve(result);
        } catch (err) {
          reject(err);        }
      }, 1200);
    });
  }
});
