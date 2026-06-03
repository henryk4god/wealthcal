// --- Database Storage System Matrix ---
// Note: Object names (keys) are preserved to keep internal functions un-altered, 
// but titles and dynamic parameters map strictly to the requested sequence order.
const database = {
    template2: {
        guidelines: [
            "MY PRODUCT TYPE: [e.g., Ebook / Video Course / Paid Community]",
            "PRODUCT NAME: [e.g., The Smartphone Income Blueprint]",
            "THE LOW BARRIER POINT: [e.g., Just ₦3,000 capital / Using only WhatsApp]",
            "THE TARGET AUDIENCE: [e.g., Corpers / Unemployed graduates in Nigeria]"
        ],
        buildPrompt: (v) => `TASK PROMPT: THE AD COPYWRITER BRIEF

Instructions for AI: Reference Section 5 (Cardinal Rule of Believability) and Section 6 (High-Converting Facebook Ad Framework) of the attached document.

I will provide you with the product details below:

 INPUT:
${v.userInput}

TASK:
Please extract the Product Type, Product Name, The Low Barrier Point, and The Target Audience from the input above. Then, write 3 highly compelling variations of Facebook Ad Primary Text for this product.

For each variation, you must strictly follow the 4-part structure from Section 6:
1. Hook (Attack a common, legacy belief that keeps them stuck)
2. Curiosity (Introduce our low-barrier resource alternative)
3. Simplicity (Remove technical complexity or financial fear)
4. CTA (Direct action to download/buy the blueprint)

CRITICAL CONSTRAINT: Adhere completely to the Cardinal Rule of Believability in Section 5. Keep the tone emotional and realistic. Do NOT use fake, overnight-millionaire hype.

No explanations, no introductions, no additional text.`
    },
    template4: {
        guidelines: [
            "PRODUCT NAME: [e.g., The ₦5k Wealth Blueprint]",
            "THE SKILL/TOPIC I AM TEACHING: [e.g., Micro-investing and automated daily savings systems]",
            "THE RESOURCE THEY ALREADY HAVE: [e.g., A smartphone and ₦5,000 weekly]",
            "TARGET AUDIENCE: [e.g., Busy young professionals and beginners in Nigeria]",
            "THE CORE PRICE OF THE PRODUCT: [e.g., ₦3,500]"
        ],
        buildPrompt: (v) => `TASK PROMPT: THE LANDING PAGE COPYWRITER BRIEF

Instructions for AI: Reference Section 1 (Psychological Shift), Section 4 (Naming Archetypes), and Section 5 (The 4 Elements) of the attached document.

I will provide you with the product details below:

 INPUT:
${v.userInput}

TASK:
Please extract the Product Name, The Skill/Topic Being Taught, The Resource They Already Have, the Target Audience, and the Core Price from the input above. Then, write the complete text/copy for a high-converting, long-form landing page for this product organized into the following distinct sections:

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
* Provide 3 clear, benefit-driven modules or chapters showing how easy the transformation is. Keep the titles grounded in the "Cardinal Rule of Believability" (Section 5) — no hyper-exaggerated claims.

SECTION 5: FINAL CALL TO ACTION & RISK REVERSAL
* Reiterate the price and emphasize how low the personal/financial risk is compared to the massive transformation they are buying.
* Final CTA Button Text.

CRITICAL FORMATTING: Keep all text strictly left-aligned. Use bolding for emphasis on key phrases. Avoid marketing fluff or overly hype-driven words. Keep the tone grounded, encouraging, and highly professional.

No explanations, no introductions, no additional text.`
    },
    template3: {
        guidelines: [
            "CURRENT PRODUCT NAME: [e.g., Advanced Forex Mastery Course]",
            "WHAT I AM CURRENTLY SELLING: [e.g., 20 hours of charts and technical analysis video lectures]",
            "CURRENT PRICE: [e.g., ₦25,000]",
            "THE REASON IT IS STALLING: [e.g., People click but say they don't have a laptop or time to learn charts]"
        ],
        buildPrompt: (v) => `TASK PROMPT: THE OFFER DIAGNOSTIC & PIVOT BRIEF

Instructions for AI: Reference Section 1 (Core Concept), Section 3 (Resource Angles), and Section 5 (The 4 Elements) of the attached document.

I will provide you with the offer details below:

 INPUT:
${v.userInput}

TASK:
Act as a conversion optimization expert. Analyze the input above to isolate the Current Product Name, What is Currently Being Sold, the Current Price, and the Reason it is Stalling. Evaluate these details through the lens of the Resource-Based Positioning Strategy and complete the following:

1. DIAGNOSIS: Tell me where my current offer is causing psychological friction, overwhelm, or fear based on Section 1.
2. THE PIVOT: Identify the strongest "Resource Angle" (Money, Time, Gadget, or Skill from Section 3) we should switch to.
3. THE RE-WRITE: Reframe and re-write this exact same offer using the new strategy. Give me a new, high-converting product name, a new entry vehicle hook, and structure it using the "4 Elements of Direct Conversion" from Section 5.

No explanations, no introductions, no additional text.`
    }
};

// --- DOM Document Object Model Access Mapping ---
const form = document.getElementById('generatorForm');
const radioElements = document.getElementsByName('templateSelect');
const guidelineList = document.getElementById('guidelineList');
const userInputTextarea = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const resultCard = document.getElementById('resultCard');
const outputPrompt = document.getElementById('outputPrompt');
const copyBtn = document.getElementById('copyBtn');

// Update Guideline List when selected Template Changes
function updateGuidelines() {
    let activeKey = 'template2';
    
    for (const radio of radioElements) {
        if (radio.checked) {
            activeKey = radio.value;
            break;
        }
    }
    
    const currentData = database[activeKey];
    guidelineList.innerHTML = '';
    
    currentData.guidelines.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        guidelineList.appendChild(li);
    });
}

// Event Listeners for radio configuration changes
radioElements.forEach(radio => {
    radio.addEventListener('change', updateGuidelines);
});

// App Initialization Execution
updateGuidelines();

// Form Presentation and Submission Operations
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Generating...';
    submitBtn.querySelector('.spinner').classList.remove('hidden');
    
    let activeKey = 'template2';
    for (const radio of radioElements) {
        if (radio.checked) {
            activeKey = radio.value;
            break;
        }
    }
    
    const payload = {
        userInput: userInputTextarea.value.trim()
    };
    
    setTimeout(() => {
        const compiledResult = database[activeKey].buildPrompt(payload);
        
        outputPrompt.textContent = compiledResult;
        
        resultCard.classList.remove('hidden');
        resultCard.classList.add('result-card-active');
        
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Generate Framework Prompt';
        submitBtn.querySelector('.spinner').classList.add('hidden');
        
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 750);
});

// Copy-To-Clipboard Action Routine
copyBtn.addEventListener('click', function() {
    const outputText = outputPrompt.textContent;
    
    navigator.clipboard.writeText(outputText).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.backgroundColor = '#22c55e';
        copyBtn.style.color = '#ffffff';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
            copyBtn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Could not copy structural text context: ', err);
    });
});
