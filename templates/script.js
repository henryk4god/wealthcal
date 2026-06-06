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

I will provide you with the product details below:

 INPUT:
${v.userInput}

TASK:
Please extract the Product Type, Product Name, The Low Barrier Point, and The Target Audience from the input above. Then, write 5 distinct types of highly compelling Facebook Ad copies for this product as outlined below.

For each of the 5 variations, you must generate a high-performing headline followed by a 4-part direct-response body copy structure:

1. THE MYTH-BUSTER AD
   * Headline: A pattern-interrupt headline that shatters a common industry myth.
   * Hook: Attack the legacy belief or mainstream method that keeps them stuck.
   * Curiosity: Introduce our low-barrier resource alternative as the hidden solution.
   * Simplicity: Remove technical complexity or financial fear.
   * CTA: Direct action to download/buy.

2. THE STORY/EMPATHY AD
   * Headline: A deeply relatable headline focused on frustration or a turning point.
   * Hook: Start with a vulnerable or highly familiar narrative about the audience's struggle.
   * Curiosity: Reveal how discovering this low-barrier vehicle changed the game.
   * Simplicity: Show how easy it is to replicate without massive time or money.
   * CTA: Direct action to download/buy.

3. THE "RESOURCE-LEVERAGE" AD
   * Headline: A bold headline highlighting what they *already possess* vs what they want.
   * Hook: Call out the tools they already own (e.g., just a smartphone) that are going to waste.
   * Curiosity: Show them the bridge connecting their current tool to a new income stream.
   * Simplicity: Prove that no extra capital or advanced tech skills are required.
   * CTA: Direct action to download/buy.

4. THE BLUNT/DIRECT AD
   * Headline: A zero-fluff headline that directly calls out the exact target profile.
   * Hook: Front-load the exact pain point and identity of the target audience immediately.
   * Curiosity: State the exact name of the blueprint as the fast track out of that pain.
   * Simplicity: Keep it dead simple—highlight the low barrier entry point.
   * CTA: Direct action to download/buy.

5. THE COST-OF-INACTION (FOMO) AD
   * Headline: A striking headline contrasting the tiny cost of trying vs the massive cost of staying stuck.
   * Hook: Highlight the compounding penalty, stress, or missed opportunities of doing nothing.
   * Curiosity: Position this low-cost blueprint as the lowest-risk decision they can make today.
   * Simplicity: Remind them how minimal the effort and capital required actually is.
   * CTA: Direct action to download/buy.

CRITICAL PERFORMANCE CONSTRAINTS: 
* Adhere completely to the Cardinal Rule of Believability. The copy must feel deeply emotional, empathetic, grounded, and realistic. 
* Absolutely NO fake, overnight-millionaire hype, exaggerated claims, or generic marketing fluff. Speak like a trusted peer, not a sketchy salesman.

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

I will provide you with the product details below:

 INPUT:
${v.userInput}

TASK:
Please extract the Product Name, The Skill/Topic Being Taught, The Resource They Already Have, the Target Audience, and the Core Price from the input above. Then, write the complete copy for a high-converting, long-form landing page for this product organized into the following distinct sections:

SECTION 1: THE ABOVE-THE-FOLD HERO SECTION
* Pre-Headline: Call out the exact target audience and deeply validate their current daily frustration/situation.
* Main Headline: Use a high-converting formula that directly links what they ALREADY HAVE (their current accessible resources) to exactly what they WANT (the ultimate desired outcome).
* Sub-Headline: Inject immediate relief, hope, and absolute simplicity while stating the low barrier to entry.
* Primary CTA Button Text: Action-oriented, value-centric, and low friction.

SECTION 2: THE PROBLEM / EMPATHY BRIDGE
* Write 3-4 vivid bullet points highlighting the common friction, mental overwhelm, hidden fears, and generic complexity they currently face when trying mainstream methods. Shift the psychological blame away from their willpower and onto broken systems.
* End with this exact transition sentence: "It's not your fault. You don't need millions to start. You just need a system for what you already have."

SECTION 3: THE ENTRY VEHICLE REVEAL & CORE VALUE PROPOSITION
* Introduce the product as the ultimate simplified, alternative vehicle.
* Break the core offer down into these 4 explicit elements of direct conversion:
  1. Clear Starting Point: Exactly where they begin with what they have.
  2. Clear Outcome: The realistic, believable transformation.
  3. Clear Path: The straightforward milestones to get there.
  4. Clear Audience: Re-confirming exactly who this was built for.

SECTION 4: WHAT IS INSIDE THE SYSTEM (The Step-by-Step Path)
* Provide 3 clear, benefit-driven modules or chapters showing how frictionless the transformation is. 
* Keep the titles strictly grounded in maximum believability—use no hyper-exaggerated claims or unrealistic promises.

SECTION 5: FINAL CALL TO ACTION & RISK REVERSAL
* Reiterate the price and contextualize it against a mundane daily expense. Emphasize how low the personal/financial risk is compared to the permanent transformation they are purchasing.
* Final CTA Button Text.

CRITICAL FORMATTING & STYLE: 
* Keep all text strictly left-aligned. 
* Use bolding for emphasis on high-impact key phrases. 
* Avoid marketing fluff, exclamation-heavy hype, or generic corporate speak. Keep the tone grounded, encouraging, authoritative, and highly professional.

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

I will provide you with the offer details below:

 INPUT:
${v.userInput}

TASK:
Act as an elite conversion optimization and offer architecture expert. Analyze the input above to isolate the Current Product Name, What is Currently Being Sold, the Current Price, and the Reason it is Stalling. Evaluate these details through a Resource-Based Positioning Framework and complete the following three steps:

1. DIAGNOSIS: Clearly pinpoint where the current offer is causing psychological friction, cognitive overload, hidden resource gaps, or user anxiety that paralyzes buyers (based on what they lack, e.g., time, hardware, or complex skills).
2. THE PIVOT: Identify and explicitly state the single strongest accessible "Resource Angle" (leveraging assets they *already* possess in abundance: Money, Time, Gadgets, or basic Skills) that we must switch our positioning to.
3. THE RE-WRITE: Reframe and completely rewrite this exact same core offer using the new strategy. Provide:
   * A new, high-converting, believable product name based on leverage.
   * A compelling entry vehicle hook that removes the original friction.
   * The complete offer restructuring structured explicitly around these 4 Elements of Direct Conversion:
     1. Clear Starting Point (What asset they start with)
     2. Clear Outcome (The believable, tangible result)
     3. Clear Path (The simple milestones)
     4. Clear Audience (Who this perfectly fits)

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
