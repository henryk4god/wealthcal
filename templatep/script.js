// --- Database Storage System Matrix ---
const database = {
    template1: {
        guidelines: [
            "THE SKILL/TOPIC I TEACH: [e.g., Video Editing / Crypto Trading / Fashion Design]",
            "THE RESOURCE THEY ALREADY HAVE: [e.g., A smartphone / ₦5,000 / 1 hour a day]",
            "THE TARGET AUDIENCE: [e.g., Complete beginners / University students]"
        ],
        buildPrompt: (v) => `TASK PROMPT: THE IDEA GENERATOR BRIEF

Instructions for AI: Reference Section 4 (Product Naming Archetypes) and Section 6 of the attached "Resource-Based Positioning Strategy" document to execute this task.

I will provide you with the project details below:

 INPUT:
${v.userInput}

TASK:
Please extract the Problem Idea, The Skill/Topic Taught, The Resource They Already Have, and The Target Audience from the input above. Then, brainstorm a comprehensive list of 12 distinct product ideas based on those extracted details. Organize them clearly under the four formulas from the referenced document:
1. Three ideas using the "Start With" Formula
2. Three ideas using the "Blueprint" Formula
3. Three ideas using the "System" Formula
4. Three ideas using the "Challenge" Formula

Ensure every single idea highlights what they already HAVE and makes the entry barrier feel incredibly low.

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

// Update Guideline List
function updateGuidelines() {
    let activeKey = 'template1';
    
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

// App Initialization Execution
updateGuidelines();

// Form Presentation and Submission Operations
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Generating...';
    submitBtn.querySelector('.spinner').classList.remove('hidden');
    
    let activeKey = 'template1';
    
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
