// Phase and prompt data
const phases = [
    {
        id: 1,
        title: "IDEA DISCOVERY & NICHE DEFINITION",
        description: "Find profitable niches and define video goals",
        prompts: [
            {
                id: 1,
                title: "Find the Best Whiteboard Video Niche",
                template: `Act as a professional whiteboard video creator. Suggest 10 profitable niches for whiteboard videos that have high viewer engagement and can easily go viral. Include audience type, emotional hook, and monetization method for each.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: []
            },
            {
                id: 2,
                title: "Identify Video Goals",
                template: `I want to create a whiteboard video in the [niche] niche. Generate a clear objective, target audience, and emotional outcome that the video should achieve (e.g., inspire, educate, entertain, sell, or raise awareness).

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "niche", label: "Enter your niche:", type: "text", required: true }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "RESEARCH & OUTLINE CREATION",
        description: "Generate topic ideas and create detailed outlines",
        prompts: [
            {
                id: 3,
                title: "Generate Topic Ideas",
                template: `Generate 10 whiteboard video topic ideas for the [niche] niche that can attract high YouTube engagement. Include the core message and ideal video length for each.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "niche", label: "Enter your niche:", type: "text", required: true }
                ]
            },
            {
                id: 4,
                title: "Outline Structure",
                template: `Create a detailed 7-step outline for a whiteboard video titled: [title]. The structure should include:
1️⃣ Hook
2️⃣ Problem
3️⃣ Story or Explanation
4️⃣ Solution
5️⃣ Key Takeaway
6️⃣ Call to Action
7️⃣ Closing message.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "title", label: "Enter video title:", type: "text", required: true }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "SCRIPT WRITING",
        description: "Write engaging scripts with emotional storytelling",
        prompts: [
            {
                id: 5,
                title: "Write Engaging Script",
                template: `Write a full professional whiteboard video script based on this outline: [outline].
Style: conversational, simple, and visually descriptive (so it fits with whiteboard animations).
Include pauses, transitions, and drawing suggestions for each scene.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "outline", label: "Paste your outline:", type: "textarea", required: true }
                ]
            },
            {
                id: 6,
                title: "Add Emotion & Storytelling",
                template: `Enhance the script with emotional storytelling, metaphors, and curiosity hooks that make it more engaging and human. Keep it suitable for whiteboard-style visuals.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "script", label: "Paste your script:", type: "textarea", required: true }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "SCENE & VISUAL PLANNING",
        description: "Break down scenes and plan visual elements",
        prompts: [
            {
                id: 7,
                title: "Scene-by-Scene Breakdown",
                template: `Convert this script into a whiteboard animation storyboard. For each line, include:
🎬 Scene Number
🖍 Drawing Description (what appears on screen)
🗣 Narration Text
⏱ Suggested Duration (in seconds).

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "script", label: "Paste your script:", type: "textarea", required: true }
                ]
            },
            {
                id: 8,
                title: "Add Transitions and Effects",
                template: `Add suggestions for transitions, camera pans, and drawing effects (e.g., hand-drawing text, icons appearing, erasing effect, etc.) to make the animation visually dynamic.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "storyboard", label: "Paste your storyboard:", type: "textarea", required: true }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "VOICEOVER CREATION",
        description: "Generate voiceover scripts and directions",
        prompts: [
            {
                id: 9,
                title: "Generate Voiceover Script",
                template: `Rewrite the narration text for natural flow and clarity. Optimize it for voiceover tone: clear, friendly, and expressive, matching a whiteboard explainer video style.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "narration", label: "Paste your narration text:", type: "textarea", required: true }
                ]
            },
            {
                id: 10,
                title: "Create Voiceover Prompts",
                template: `Generate professional voiceover directions for each scene (e.g., tone, pacing, emphasis, and emotion cues) that will help voice actors or AI TTS sound more engaging.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "script", label: "Paste your script:", type: "textarea", required: true }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "ANIMATION EXECUTION",
        description: "Setup animation tools and plan scene timing",
        prompts: [
            {
                id: 11,
                title: "Doodly or Videoscribe Animation Setup",
                template: `Based on the storyboard, list all visual assets (characters, icons, text, backgrounds) required to animate this video in Doodly or Videoscribe. Include suggested drawing order and duration per element.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "storyboard", label: "Paste your storyboard:", type: "textarea", required: true }
                ]
            },
            {
                id: 12,
                title: "Scene Timing & Rhythm",
                template: `Suggest the best animation pacing and scene timing for this whiteboard video. Include ideal video duration, scene length, and transition rhythm to keep audience retention high.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "storyboard", label: "Paste your storyboard:", type: "textarea", required: true }
                ]
            }
        ]
    },
    {
        id: 7,
        title: "SOUND DESIGN & BACKGROUND MUSIC",
        description: "Recommend music and sound effects",
        prompts: [
            {
                id: 13,
                title: "Music and Sound Effects",
                template: `Recommend 3 types of background music and 5 types of sound effects suitable for a whiteboard video about [topic]. Each should match the tone (educational, emotional, motivational, etc.).

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "topic", label: "Enter video topic:", type: "text", required: true }
                ]
            }
        ]
    },
    {
        id: 8,
        title: "CTA & OUTRO OPTIMIZATION",
        description: "Create strong calls to action and outros",
        prompts: [
            {
                id: 14,
                title: "Create Strong Call to Action",
                template: `Write 5 powerful call-to-action lines for the end of the video that can boost engagement (subscribe, follow, buy, learn more, or comment). Match the tone of the video.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "videoTone", label: "Enter video tone:", type: "text", required: true }
                ]
            },
            {
                id: 15,
                title: "Outro Script",
                template: `Write a short and memorable outro for the whiteboard video, including logo placement, slogan, and final hook that leaves the audience inspired or curious.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "brandName", label: "Enter your brand name:", type: "text", required: true },
                    { id: "slogan", label: "Enter your slogan (optional):", type: "text", required: false }
                ]
            }
        ]
    },
    {
        id: 9,
        title: "TITLE, THUMBNAIL, AND SEO OPTIMIZATION",
        description: "Optimize for YouTube and social media",
        prompts: [
            {
                id: 16,
                title: "YouTube Optimization",
                template: `Generate 5 SEO-optimized YouTube titles, 10 high-click thumbnail text ideas, and a keyword-rich video description for this whiteboard video titled: [title].

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "title", label: "Enter video title:", type: "text", required: true }
                ]
            },
            {
                id: 17,
                title: "Hashtags & Keywords",
                template: `Provide 15 relevant hashtags and 10 long-tail keywords to boost organic reach on YouTube and social media platforms.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "topic", label: "Enter video topic:", type: "text", required: true }
                ]
            }
        ]
    },
    {
        id: 10,
        title: "MARKETING & MONETIZATION",
        description: "Create marketing strategies and monetization plans",
        prompts: [
            {
                id: 18,
                title: "Video Marketing Strategy",
                template: `Create a 7-day marketing plan to promote my whiteboard video organically on YouTube, Facebook, TikTok, and Instagram. Include captions, posting times, and engagement tips.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "videoTitle", label: "Enter video title:", type: "text", required: true }
                ]
            },
            {
                id: 19,
                title: "Monetization Plan",
                template: `Suggest 5 monetization methods for my whiteboard video content (ads, affiliate links, digital products, email opt-ins, or course promotions). Explain how to implement each.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "niche", label: "Enter your niche:", type: "text", required: true }
                ]
            }
        ]
    },
    {
        id: 11,
        title: "VIDEO PERFORMANCE IMPROVEMENT",
        description: "Analyze performance and suggest improvements",
        prompts: [
            {
                id: 20,
                title: "Video Feedback Loop",
                template: `Analyze viewer engagement data (average watch time, likes, and comments). Suggest 5 ways to improve my next whiteboard video for higher retention and conversions.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "engagementData", label: "Describe your engagement data:", type: "textarea", required: true }
                ]
            }
        ]
    },
    {
        id: 12,
        title: "BONUS - FULL AUTOMATED CREATION PIPELINE",
        description: "Generate complete workflow in one go",
        prompts: [
            {
                id: 21,
                title: "One-Click Workflow",
                template: `Create a complete workflow prompt that generates the whiteboard video script, storyboard, voiceover text, and animation plan in one go. I will input: niche: [niche], topic: [topic], and goal: [goal]. Output everything structured and ready for production.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary.`,
                inputs: [
                    { id: "niche", label: "Enter your niche:", type: "text", required: true },
                    { id: "topic", label: "Enter your topic:", type: "text", required: true },
                    { id: "goal", label: "Enter your goal:", type: "text", required: true }
                ]
            }
        ]
    }
];

// DOM Elements
const phaseGrid = document.getElementById('phaseGrid');
const inputSection = document.getElementById('inputSection');
const promptTitle = document.getElementById('promptTitle');
const inputFields = document.getElementById('inputFields');
const generateBtn = document.getElementById('generateBtn');
const resultSection = document.getElementById('resultSection');
const generatedPrompt = document.getElementById('generatedPrompt');
const copyBtn = document.getElementById('copyBtn');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');

// State variables
let currentPhase = null;
let currentPrompt = null;
let currentPhaseIndex = 0;
let currentPromptIndex = 0;

// Initialize the application
function init() {
    renderPhaseGrid();
    setupEventListeners();
}

// Render the phase grid
function renderPhaseGrid() {
    phaseGrid.innerHTML = '';
    
    phases.forEach((phase, index) => {
        const phaseCard = document.createElement('div');
        phaseCard.className = 'phase-card';
        phaseCard.innerHTML = `
            <div class="phase-number">${phase.id}</div>
            <h3 class="phase-title">${phase.title}</h3>
            <p class="phase-description">${phase.description}</p>
        `;
        
        phaseCard.addEventListener('click', () => {
            selectPhase(index);
        });
        
        phaseGrid.appendChild(phaseCard);
    });
}

// Set up event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyPrompt);
    backBtn.addEventListener('click', resetToInput);
    nextBtn.addEventListener('click', goToNextPhase);
}

// Select a phase and show its prompts
function selectPhase(phaseIndex) {
    // Remove active class from all phase cards
    document.querySelectorAll('.phase-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Add active class to selected phase card
    document.querySelectorAll('.phase-card')[phaseIndex].classList.add('active');
    
    currentPhase = phases[phaseIndex];
    currentPhaseIndex = phaseIndex;
    currentPromptIndex = 0;
    
    showPromptInput(currentPhase.prompts[0]);
}

// Show prompt input form
function showPromptInput(prompt) {
    currentPrompt = prompt;
    
    promptTitle.textContent = prompt.title;
    inputFields.innerHTML = '';
    
    if (prompt.inputs.length === 0) {
        // No inputs needed for this prompt
        const noInputMsg = document.createElement('p');
        noInputMsg.textContent = 'No inputs required for this prompt. Click Generate to create the prompt.';
        inputFields.appendChild(noInputMsg);
        generateBtn.disabled = false;
    } else {
        // Create input fields
        prompt.inputs.forEach(input => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const label = document.createElement('label');
            label.textContent = input.label;
            label.htmlFor = input.id;
            
            let inputElement;
            if (input.type === 'textarea') {
                inputElement = document.createElement('textarea');
                inputElement.rows = 4;
            } else {
                inputElement = document.createElement('input');
                inputElement.type = input.type;
            }
            
            inputElement.id = input.id;
            inputElement.placeholder = `Enter ${input.id}...`;
            inputElement.required = input.required;
            
            inputElement.addEventListener('input', validateInputs);
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(inputElement);
            inputFields.appendChild(inputGroup);
        });
        
        validateInputs();
    }
    
    inputSection.style.display = 'block';
    resultSection.style.display = 'none';
}

// Validate inputs and enable/disable generate button
function validateInputs() {
    if (!currentPrompt || currentPrompt.inputs.length === 0) {
        generateBtn.disabled = false;
        return;
    }
    
    const allValid = currentPrompt.inputs.every(input => {
        if (!input.required) return true;
        
        const inputElement = document.getElementById(input.id);
        return inputElement && inputElement.value.trim() !== '';
    });
    
    generateBtn.disabled = !allValid;
}

// Generate the prompt based on user inputs
function generatePrompt() {
    if (!currentPrompt) return;
    
    let promptText = currentPrompt.template;
    
    // Replace placeholders with user inputs
    currentPrompt.inputs.forEach(input => {
        const inputElement = document.getElementById(input.id);
        if (inputElement) {
            const value = inputElement.value.trim();
            promptText = promptText.replace(`[${input.id}]`, value);
        }
    });
    
    // Display the generated prompt
    generatedPrompt.textContent = promptText;
    
    // Show result section
    inputSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    // Reset copy button state
    copyBtn.classList.remove('copied');
    copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy Prompt';
}

// Copy prompt to clipboard
function copyPrompt() {
    const promptText = generatedPrompt.textContent;
    
    navigator.clipboard.writeText(promptText).then(() => {
        // Visual feedback for successful copy
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy Prompt';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy prompt: ', err);
        alert('Failed to copy prompt to clipboard. Please try again.');
    });
}

// Reset to input section
function resetToInput() {
    inputSection.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Move to next prompt in the same phase
    currentPromptIndex = (currentPromptIndex + 1) % currentPhase.prompts.length;
    showPromptInput(currentPhase.prompts[currentPromptIndex]);
}

// Go to the next phase
function goToNextPhase() {
    const nextPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    selectPhase(nextPhaseIndex);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
