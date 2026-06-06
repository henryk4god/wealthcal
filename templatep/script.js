// --- Database Storage System Matrix ---
const database = {
template1: {
guidelines: [
"Problem Idea",
"The Skill/Topic Being Taught",
"The Resource the Audience Already Has",
"Logical Step-By-Step Solution",
"Key Pain Points",
"Unique Value Proposition",
"Target Audience"
],
buildPrompt: (v) => `# Digital Product Name & Subtitle Generator

Act as a world-class Direct Response Marketing Strategist, Product Naming Expert, and Brand Positioning Consultant.

Your task is to create compelling digital product names and subtitles that instantly communicate value, transformation, curiosity, and outcomes.

I will provide all product information in a single input, which may include:

- Problem Idea
- The Skill/Topic Being Taught
- The Resource the Audience Already Has
- Logical Step-By-Step Solution
- Key Pain Points
- Unique Value Proposition
- Target Audience

INPUT:

${v.userInput}

Instructions:

1. Analyze the entire input and identify the:
   
   - Core problem
   - Desired outcome
   - Target audience
   - Existing resource available to the audience
   - Unique mechanism or advantage
   - Most compelling transformation

2. Generate exactly 3 product name options.

3. The product name must:
   
   - Be short, memorable, and marketable.
   - Sound like a premium digital product.
   - Focus on a clear benefit or transformation.
   - End with one of the following words:
     - System
     - Blueprint
     - Challenge
     - Framework
     - Method
     - Formula
     - Playbook
     - Roadmap
     - Accelerator
     - Toolkit

4. Each option should use a different marketing angle:
   
   - Option 1 = Fast Result Angle
   - Option 2 = Simplicity/Ease Angle
   - Option 3 = Unique Mechanism Angle

5. Create a powerful subtitle for each name using formats such as:
   
   - How to [Desired Result] Using [Existing Resource] Without [Major Pain Point]
   - A Step-by-Step System for [Desired Result] Even If [Common Objection]
   - The Proven Blueprint for [Desired Result] Without [Traditional Frustration]

6. Avoid generic, boring, or overly clever names.

7. Prioritize names that sound valuable, practical, and easy to understand.

Output Format:

OPTION 1

Product Name:
[NAME]

Subtitle:
[SUBTITLE]

---

OPTION 2

Product Name:
[NAME]

Subtitle:
[SUBTITLE]

---

OPTION 3

Product Name:
[NAME]

Subtitle:
[SUBTITLE]

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
