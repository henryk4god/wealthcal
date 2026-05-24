document.addEventListener('DOMContentLoaded', () => {
    const generatorForm = document.getElementById('generatorForm');
    const productInfoInput = document.getElementById('productInfo');
    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const outputCode = document.getElementById('outputCode');
    const copyBtn = document.getElementById('copyBtn');

    generatorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const productInfoValue = productInfoInput.value.trim();
        if (!productInfoValue) return;

        // Visual presentation state transitions
        setLoadingState(true);

        // Simulation delay block matching dynamic functional expectations
        setTimeout(() => {
            const compiledPrompt = simulateAIResponse(productInfoValue);
            outputCode.textContent = compiledPrompt;
            
            setLoadingState(false);
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('show');
            
            // Auto smooth scroll mechanics to direct viewport focus
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
    });

    copyBtn.addEventListener('click', () => {
        const textToCopy = outputCode.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✨ Copied Blueprint!';
            copyBtn.style.backgroundColor = '#22c55e';
            copyBtn.style.color = '#ffffff';
            copyBtn.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.style.backgroundColor = '';
                copyBtn.style.color = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('System validation failed writing data content to system paste layer: ', err);
        });
    });

    function setLoadingState(isLoading) {
        const btnText = generateBtn.querySelector('.btn-text');
        const spinner = generateBtn.querySelector('.spinner');
        
        if (isLoading) {
            generateBtn.disabled = true;
            btnText.textContent = 'Generating Direct Response Structure...';
            spinner.classList.remove('hidden');
        } else {
            generateBtn.disabled = false;
            btnText.textContent = 'Generate Prompt Blueprint';
            spinner.classList.add('hidden');
        }
    }

    function simulateAIResponse(productInfo) {
        return `You are a high-level direct response marketer, product strategist, and funnel expert.

Your task is to take ANY idea or niche provided by the user and transform it into a high-converting digital product offer using the EXACT structure below.

The output must be practical, specific, conversion-focused, and tailored to the niche provided.

INPUT:
${productInfo}

Description Text for the product information: product information MAY include:
- Product Name,
- Subtitle,
- Logical Step-By-Step Solution,
- Key Pain Points,
- Unique Value Proposition,
- Target Audience or
- proprietary frameworks 


OUTPUT STRUCTURE:

- Seven (7) Pain Points:
  (List highly emotional, specific struggles the target audience faces in this niche)

- Seven (7) Transformations Expected:
  (Clear before → after outcomes tied to the pain points)

- Big Promise:
  (One bold, compelling outcome statement that combines speed, simplicity, and result)

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

(Assign realistic Global/ Location Country Currency value to core product)

- 🎁 BONUS 1: (Cheat Sheet / Guide specific to niche) (₦ value)

- 🎁 BONUS 2: (Advanced strategy or expansion guide)

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
    }
});
