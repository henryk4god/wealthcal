// Webinar prompts data structure
const webinarPrompts = {
    1: {
        title: "Phase 1: Discovery & Positioning",
        prompts: [
            {
                id: 1,
                title: "Webinar Core Blueprint",
                description: "Define the purpose, target audience, and main outcome of your evergreen webinar",
                inputs: [
                    { id: "audience", label: "Ideal Audience", type: "text", placeholder: "e.g., Small business owners, Freelancers" },
                    { id: "painPoints", label: "Main Pain Points", type: "textarea", placeholder: "e.g., Struggling to find clients, Low conversion rates" },
                    { id: "transformation", label: "Big Promise/Transformation", type: "textarea", placeholder: "e.g., Learn how to double your client base in 30 days" },
                    { id: "offer", label: "Main Offer", type: "text", placeholder: "e.g., Course, Coaching program, Software" },
                    { id: "topic", label: "Core Topic/Title", type: "text", placeholder: "e.g., The Ultimate Guide to Client Acquisition" }
                ],
                template: (data) => `Act as a top-tier webinar strategist. Help me define the purpose, target audience, and main outcome of my evergreen webinar.

My ideal audience: ${data.audience}
Their main pain points: ${data.painPoints}
The big promise or transformation: ${data.transformation}
The main offer I'll sell at the end: ${data.offer}
The core topic or title: ${data.topic}

Then summarize everything into a clear webinar strategy blueprint.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            }
        ]
    },
    2: {
        title: "Phase 2: Slide Structure Development",
        prompts: [
            {
                id: 2,
                title: "Irresistible Webinar Title & Hook",
                description: "Generate powerful evergreen webinar titles with emotional hooks and curiosity triggers",
                inputs: [
                    { id: "blueprint", label: "Webinar Strategy Blueprint", type: "textarea", placeholder: "Paste your webinar strategy blueprint here" }
                ],
                template: (data) => `You are a conversion-focused copywriter. Based on the webinar strategy blueprint, generate 10 powerful evergreen webinar titles with emotional hooks and curiosity triggers.

Webinar Strategy Blueprint: ${data.blueprint}

Each title should create desire and urgency to attend the session.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 3,
                title: "Webinar Slide Outline",
                description: "Create a complete slide outline for a high-converting evergreen webinar",
                inputs: [
                    { id: "webinarTitle", label: "Webinar Title", type: "text", placeholder: "Enter your chosen webinar title" },
                    { id: "targetAudience", label: "Target Audience", type: "text", placeholder: "e.g., Small business owners" }
                ],
                template: (data) => `As a professional webinar presentation architect, create a complete slide outline for a high-converting evergreen webinar.

Webinar Title: ${data.webinarTitle}
Target Audience: ${data.targetAudience}

Divide the structure into:
1. Introduction / Hook
2. Connection & Credibility
3. Big Promise (Transformation Statement)
4. Content Framework / Value Section
5. Case Studies or Proof
6. Transition to Offer
7. Offer Presentation
8. Scarcity & Bonuses
9. Call-to-Action (CTA)
10. Closing / Final Push

Include the purpose of each section and what emotion it should evoke.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            }
        ]
    },
    3: {
        title: "Phase 3: Slide Content Creation",
        prompts: [
            {
                id: 4,
                title: "Introduction & Hook Slides",
                description: "Create the 'Introduction and Hook' slides that immediately grab attention",
                inputs: [
                    { id: "webinarTitle", label: "Webinar Title", type: "text", placeholder: "Enter your chosen webinar title" },
                    { id: "coreTopic", label: "Core Topic", type: "text", placeholder: "e.g., Client acquisition strategies" }
                ],
                template: (data) => `Act as a persuasive storyteller. Using my chosen webinar title and topic, create the 'Introduction and Hook' slides that immediately grab attention.

Webinar Title: ${data.webinarTitle}
Core Topic: ${data.coreTopic}

Include:
- A powerful opening statement
- An emotional story or question that resonates
- A promise of transformation
- A teaser of what attendees will discover.

Keep the content slide-based (short bullets, not long paragraphs).

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 5,
                title: "Connection & Credibility Slides",
                description: "Write the 'Connection & Credibility' section of the webinar slides",
                inputs: [
                    { id: "personalStory", label: "Personal Story", type: "textarea", placeholder: "Briefly describe your personal journey related to this topic" },
                    { id: "whyCreated", label: "Why You Created This Webinar", type: "textarea", placeholder: "Explain why you created this webinar" },
                    { id: "struggles", label: "Struggles Overcome", type: "textarea", placeholder: "Describe struggles you overcame (relatable pain points)" },
                    { id: "results", label: "Results Achieved", type: "textarea", placeholder: "Share results achieved (proof of expertise)" }
                ],
                template: (data) => `Act as a personal branding strategist. Write the 'Connection & Credibility' section of the webinar slides.

My short personal story: ${data.personalStory}
Why I created this webinar: ${data.whyCreated}
Struggles I overcame: ${data.struggles}
Results achieved: ${data.results}

Also create a matching teacher note that explains how to narrate each slide naturally during presentation.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 6,
                title: "Big Promise Section",
                description: "Write the 'Big Promise' slides that make attendees believe transformation is possible",
                inputs: [
                    { id: "transformation", label: "Transformation Promise", type: "textarea", placeholder: "Describe the transformation attendees will experience" },
                    { id: "system", label: "System/Process", type: "textarea", placeholder: "Explain why your system/process is simple and achievable" }
                ],
                template: (data) => `As a webinar persuasion expert, write the 'Big Promise' slides.

The promise should make attendees believe:
- Transformation is possible for them: ${data.transformation}
- The system or process is simple and achievable: ${data.system}
- They will discover something new and valuable.

Include 2–3 slides + teacher notes for delivery.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 7,
                title: "Value / Content Section",
                description: "Write the core training section that delivers high value but strategically leads to the offer",
                inputs: [
                    { id: "keyLessons", label: "3 Key Lessons/Pillars", type: "textarea", placeholder: "List the 3 key lessons or pillars of your content" },
                    { id: "examples", label: "Examples/Stories", type: "textarea", placeholder: "Provide examples or short stories for each lesson" }
                ],
                template: (data) => `Act as a professional educator. Write the core training section of the webinar that delivers high value but strategically leads to the offer.

Break it into 3 key lessons or pillars (teach, inspire, pre-frame): ${data.keyLessons}

For each lesson:
- Create slide headlines and bullet points
- Add examples or short stories: ${data.examples}
- Add teacher notes to guide how to explain it during presentation.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 8,
                title: "Case Studies or Proof Slides",
                description: "Write the Proof & Case Study section with success stories",
                inputs: [
                    { id: "successStories", label: "Success Stories", type: "textarea", placeholder: "Describe 2-3 success stories (real or hypothetical)" },
                    { id: "testimonials", label: "Testimonials/Data", type: "textarea", placeholder: "Include any testimonials or data" }
                ],
                template: (data) => `As a social proof storyteller, write the Proof & Case Study section of the webinar.

Include:
- 2–3 real or hypothetical success stories: ${data.successStories}
- Data or testimonials: ${data.testimonials}
- Emotional storytelling structure: Struggle → Solution → Success.

Add teacher notes explaining tone and pacing.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 9,
                title: "Transition to Offer",
                description: "Write the smooth transition slides from teaching to pitching",
                inputs: [
                    { id: "contentSummary", label: "Content Summary", type: "textarea", placeholder: "Briefly summarize what was taught in the value section" }
                ],
                template: (data) => `Act as a master webinar closer. Write the smooth transition slides from teaching to pitching.

Content Summary: ${data.contentSummary}

Use curiosity and emotional bridging, for example:
'Now that you've seen how this works... let me show you how to get it even faster and easier.'

Include both slide content and teacher notes.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            }
        ]
    },
    4: {
        title: "Phase 4: Offer & Close",
        prompts: [
            {
                id: 10,
                title: "Offer Presentation Slides",
                description: "Write the Offer Presentation slides for the webinar",
                inputs: [
                    { id: "offerName", label: "Offer Name", type: "text", placeholder: "Enter the name of your offer" },
                    { id: "offerDescription", label: "Offer Description", type: "textarea", placeholder: "Describe what the offer includes" },
                    { id: "valueStacking", label: "Value Stacking", type: "textarea", placeholder: "Show real value vs. today's price" },
                    { id: "paymentOptions", label: "Payment Options & Guarantee", type: "textarea", placeholder: "Describe payment options and any guarantees" }
                ],
                template: (data) => `Act as a sales copy expert. Write the Offer Presentation slides for the webinar.

Include:
- Offer name and description: ${data.offerName} - ${data.offerDescription}
- What's included (modules, bonuses, tools, etc.)
- Value stacking: ${data.valueStacking}
- Payment options and guarantee: ${data.paymentOptions}

Add detailed teacher notes to explain the offer confidently.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 11,
                title: "Scarcity, Urgency & Bonuses",
                description: "Write the Scarcity and Bonuses slides that push people to act now",
                inputs: [
                    { id: "bonuses", label: "Limited-time Bonuses", type: "textarea", placeholder: "Describe the limited-time bonuses" },
                    { id: "discounts", label: "Fast-action Discounts", type: "textarea", placeholder: "Describe any fast-action discounts" }
                ],
                template: (data) => `As a conversion expert, write the Scarcity and Bonuses slides that push people to act now.

Include:
- Limited-time bonuses: ${data.bonuses}
- Fast-action discounts: ${data.discounts}
- Social proof reminders

Add teacher notes explaining how to deliver this part naturally and avoid sounding pushy.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 12,
                title: "Call-to-Action & Closing",
                description: "Write the Final Call-to-Action slides",
                inputs: [
                    { id: "ctaSteps", label: "Clear Steps", type: "textarea", placeholder: "Describe the clear steps attendees should take" },
                    { id: "motivationalMessage", label: "Motivational Message", type: "textarea", placeholder: "Provide a motivational closing quote or message" }
                ],
                template: (data) => `Act as a professional webinar closer. Write the Final Call-to-Action slides.

Include:
- Clear steps: ${data.ctaSteps}
- Encouragement and confidence reinforcement
- A motivational closing quote or message: ${data.motivationalMessage}

Add teacher notes on delivery style (tone, energy, and pacing).

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            }
        ]
    },
    5: {
        title: "Phase 5: Design & Finalization",
        prompts: [
            {
                id: 13,
                title: "Slide Design Direction",
                description: "Suggest the visual theme for the webinar slides",
                inputs: [
                    { id: "brandColors", label: "Brand Colors (if any)", type: "text", placeholder: "Enter your brand colors (optional)" },
                    { id: "targetAudience", label: "Target Audience", type: "text", placeholder: "e.g., Corporate professionals, Creative entrepreneurs" }
                ],
                template: (data) => `Act as a webinar presentation designer. Suggest the visual theme for the webinar slides, including:

Target Audience: ${data.targetAudience}
Brand Colors: ${data.brandColors || "Not specified"}

- Font pairings
- Color scheme (psychology behind each color)
- Image and icon suggestions
- Layout tips for readability and engagement.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 14,
                title: "Teacher Notes Compilation",
                description: "Compile all teacher notes into a Presenter's Guide",
                inputs: [
                    { id: "webinarTitle", label: "Webinar Title", type: "text", placeholder: "Enter your webinar title" },
                    { id: "totalSlides", label: "Estimated Number of Slides", type: "text", placeholder: "e.g., 45 slides" }
                ],
                template: (data) => `Now compile all teacher notes from every section into a Presenter's Guide (Teacher Note Document).

Webinar Title: ${data.webinarTitle}
Estimated Number of Slides: ${data.totalSlides}

Format it as a script outline matching the slide numbers.
Include:
- Timing estimates
- Emotional tone guidance
- Transitions between sections
- Tips for maintaining engagement.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            },
            {
                id: 15,
                title: "Evergreen Automation Optimization",
                description: "Show how to optimize this webinar for automation",
                inputs: [
                    { id: "webinarFormat", label: "Webinar Format", type: "text", placeholder: "e.g., Live, Pre-recorded, Hybrid" },
                    { id: "followUpPlan", label: "Follow-up Plan", type: "textarea", placeholder: "Describe your current follow-up plan (if any)" }
                ],
                template: (data) => `As an evergreen funnel expert, show me how to optimize this webinar for automation.

Webinar Format: ${data.webinarFormat}
Current Follow-up Plan: ${data.followUpPlan || "None specified"}

Include:
- Recommended video length
- How to handle live chat simulation
- Automated follow-up emails or SMS
- Best days/times to schedule replays
- CTA reminders post-webinar.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
            }
        ]
    }
};

// BONUS PROMPT (not included in the main flow)
const bonusPrompt = {
    id: 16,
    title: "Webinar Replay Funnel Script",
    description: "Write a 3-part email or SMS sequence for people who attended but didn't buy",
    inputs: [
        { id: "webinarTopic", label: "Webinar Topic", type: "text", placeholder: "Enter your webinar topic" },
        { id: "mainOffer", label: "Main Offer", type: "text", placeholder: "Describe your main offer" },
        { id: "objections", label: "Common Objections", type: "textarea", placeholder: "List common objections you encounter" }
    ],
    template: (data) => `Write a 3-part email or SMS sequence for people who attended the webinar but didn't buy.

Webinar Topic: ${data.webinarTopic}
Main Offer: ${data.mainOffer}
Common Objections: ${data.objections}

Sequence:
1. Replay reminder
2. Objection handling email
3. Final call with scarcity reminder.

Each message should sound personal, friendly, and persuasive.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
};

// Global state
let currentPhase = null;
let currentPromptIndex = 0;
let currentPrompts = [];

// DOM elements
const phaseButtons = document.querySelectorAll('.phase-btn');
const promptTitle = document.getElementById('prompt-title');
const currentPromptElement = document.getElementById('current-prompt');
const totalPromptsElement = document.getElementById('total-prompts');
const inputFieldsContainer = document.getElementById('input-fields');
const generateBtn = document.getElementById('generate-btn');
const resultContent = document.getElementById('result-content');
const copyBtn = document.getElementById('copy-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Initialize the app
function init() {
    // Add event listeners to phase buttons
    phaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const phase = button.getAttribute('data-phase');
            selectPhase(phase);
        });
    });
    
    // Add event listeners to action buttons
    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyResult);
    prevBtn.addEventListener('click', goToPreviousPrompt);
    nextBtn.addEventListener('click', goToNextPhase);
    
    // Initialize with first phase selected
    selectPhase('1');
}

// Select a phase and load its prompts
function selectPhase(phase) {
    // Update active phase button
    phaseButtons.forEach(button => {
        if (button.getAttribute('data-phase') === phase) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Set current phase and prompts
    currentPhase = phase;
    currentPrompts = webinarPrompts[phase].prompts;
    currentPromptIndex = 0;
    
    // Update UI
    promptTitle.textContent = webinarPrompts[phase].title;
    updateProgressIndicator();
    renderCurrentPrompt();
    updateNavigationButtons();
}

// Render the current prompt
function renderCurrentPrompt() {
    if (currentPrompts.length === 0) return;
    
    const prompt = currentPrompts[currentPromptIndex];
    
    // Clear input fields
    inputFieldsContainer.innerHTML = '';
    
    // Create input fields based on prompt definition
    prompt.inputs.forEach(input => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const label = document.createElement('label');
        label.textContent = input.label;
        label.setAttribute('for', input.id);
        
        let inputElement;
        if (input.type === 'textarea') {
            inputElement = document.createElement('textarea');
            inputElement.rows = 4;
        } else {
            inputElement = document.createElement('input');
            inputElement.type = input.type;
        }
        
        inputElement.id = input.id;
        inputElement.name = input.id;
        inputElement.placeholder = input.placeholder;
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(inputElement);
        inputFieldsContainer.appendChild(inputGroup);
    });
    
    // Update progress indicator
    updateProgressIndicator();
}

// Update progress indicator
function updateProgressIndicator() {
    currentPromptElement.textContent = currentPromptIndex + 1;
    totalPromptsElement.textContent = currentPrompts.length;
}

// Update navigation buttons state
function updateNavigationButtons() {
    prevBtn.disabled = currentPromptIndex === 0;
    
    // Enable next button if we're not on the last prompt of the last phase
    const isLastPhase = currentPhase === '5';
    const isLastPrompt = currentPromptIndex === currentPrompts.length - 1;
    nextBtn.disabled = isLastPhase && isLastPrompt;
    
    // Update next button text based on context
    if (isLastPrompt && !isLastPhase) {
        nextBtn.textContent = 'Next Phase';
    } else if (isLastPrompt && isLastPhase) {
        nextBtn.textContent = 'Final Phase';
    } else {
        nextBtn.textContent = 'Next Prompt';
    }
}

// Generate prompt based on user input
function generatePrompt() {
    if (currentPrompts.length === 0) return;
    
    const prompt = currentPrompts[currentPromptIndex];
    
    // Collect input values
    const inputData = {};
    prompt.inputs.forEach(input => {
        const inputElement = document.getElementById(input.id);
        inputData[input.id] = inputElement.value.trim();
    });
    
    // Validate required fields (simple validation)
    let hasEmptyFields = false;
    for (const key in inputData) {
        if (!inputData[key]) {
            hasEmptyFields = true;
            const inputElement = document.getElementById(key);
            inputElement.style.borderColor = 'var(--accent-color)';
            
            // Reset border color after 2 seconds
            setTimeout(() => {
                inputElement.style.borderColor = '';
            }, 2000);
        }
    }
    
    if (hasEmptyFields) {
        resultContent.innerHTML = '<p class="placeholder-text" style="color: var(--accent-color);">Please fill in all fields before generating the prompt.</p>';
        return;
    }
    
    // Show loading state
    generateBtn.classList.add('loading');
    generateBtn.textContent = 'Generating...';
    
    // Simulate processing delay (in a real app, this would be an API call)
    setTimeout(() => {
        // Generate the prompt using the template
        const generatedPrompt = prompt.template(inputData);
        
        // Display the result
        resultContent.textContent = generatedPrompt;
        
        // Reset button state
        generateBtn.classList.remove('loading');
        generateBtn.textContent = 'Generate Prompt';
        
        // Add pulse animation to copy button
        copyBtn.classList.add('pulse');
        setTimeout(() => {
            copyBtn.classList.remove('pulse');
        }, 1500);
    }, 1000);
}

// Copy result to clipboard
function copyResult() {
    const text = resultContent.textContent;
    
    // Check if the result is the placeholder text
    if (text.includes('Your generated prompt will appear here') || 
        text.includes('Please fill in all fields')) {
        return;
    }
    
    // Use the Clipboard API
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text to clipboard. Please select and copy manually.');
    });
}

// Navigate to previous prompt
function goToPreviousPrompt() {
    if (currentPromptIndex > 0) {
        currentPromptIndex--;
        renderCurrentPrompt();
        updateNavigationButtons();
        
        // Clear result when navigating
        resultContent.innerHTML = '<p class="placeholder-text">Your generated prompt will appear here</p>';
    }
}

// Navigate to next prompt or phase
function goToNextPhase() {
    const isLastPrompt = currentPromptIndex === currentPrompts.length - 1;
    const isLastPhase = currentPhase === '5';
    
    if (!isLastPrompt) {
        // Go to next prompt in current phase
        currentPromptIndex++;
        renderCurrentPrompt();
        updateNavigationButtons();
    } else if (!isLastPhase) {
        // Go to next phase
        const nextPhase = parseInt(currentPhase) + 1;
        selectPhase(nextPhase.toString());
    }
    
    // Clear result when navigating
    resultContent.innerHTML = '<p class="placeholder-text">Your generated prompt will appear here</p>';
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
