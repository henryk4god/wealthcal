// DOM Elements
const promptForm = document.getElementById('prompt-form');
const productNameInput = document.getElementById('product-name');
const industryInput = document.getElementById('industry');
const audienceInput = document.getElementById('audience');
const videoStageSelect = document.getElementById('video-stage');
const generateBtn = document.querySelector('.generate-btn');
const btnText = document.querySelector('.btn-text');
const spinner = document.querySelector('.spinner');
const resultSection = document.querySelector('.result-section');
const promptOutput = document.getElementById('prompt-output');
const copyBtn = document.getElementById('copy-btn');
const copyText = document.querySelector('.copy-text');
const copiedText = document.querySelector('.copied-text');
const regenerateBtn = document.getElementById('regenerate-btn');
const nextStageBtn = document.getElementById('next-stage-btn');

// Prompt templates
const promptTemplates = {
    awareness: (product, industry, audience) => `Create a powerful Awareness Funnel Video for ${product} targeting ${audience}.

The video should:
- Start with a shocking hook or relatable pain point
- Show empathy and understanding
- Tease a solution (but don't reveal it fully yet)
- Keep under 60 seconds

Example format:
- Hook (first 5 seconds): Identify the pain or frustration
- Middle: Show emotional consequences of not solving it
- End: Tease that a better solution exists (lead into next video)

Add visual and sound direction for emotional impact.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    interest: (product, industry, audience) => `Create an Interest Video that builds trust and connects emotionally with the viewer for ${product} in the ${industry} niche.

Focus on:
- Explaining the 'why' behind your product
- Sharing relatable stories or mini case studies
- Providing 1–2 valuable tips that position your product as the solution

Include visuals showing transformation or relatable life scenes.
End with a teaser for the next video: 'In the next part, I'll show you exactly how we fixed this.'

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    desire: (product, industry, audience) => `Create a Desire Video that tells the story of how ${product} was created or how it solves the problem powerfully.

Include:
- Origin story or customer journey
- Core benefits (3–5 clear ones)
- Emotional turning point where the problem is solved

Add music and visuals that show transformation (before → after).
End with a strong emotional CTA inviting them to 'See how it works' or 'Join the movement.'

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    action: (product, industry, audience) => `Create a Sales/Conversion Video for ${product}.

Focus on:
- Direct offer presentation (price, bonuses, guarantee)
- Scarcity or urgency (limited time, special deal)
- Testimonials or mini proof clips
- Call to action (buy now, register, order, etc.)

Include clear on-screen CTA animations and upbeat pacing.
Script should sound confident and exciting, ending with a clear purchase direction.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    'follow-up': (product, industry, audience) => `Create a Follow-Up/Nurture Video that rekindles interest in ${product}.

Focus on:
- Reaffirming value and addressing objections
- Showing new results, updates, or bonuses
- Emotional appeal: 'Don't miss this chance'
- CTA to return and take action now.

Tone: Warm, friendly, and supportive — not pushy.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    testimonial: (product, industry, audience) => `Create a Testimonial/Proof Video that showcases real results and social proof for ${product}.

Include:
- 2–3 short client stories (before → after)
- Real metrics or quotes
- Emphasis on emotions: relief, excitement, gratitude

End with a confident CTA reinforcing trust:
'Join hundreds who already achieved [benefit]. Get started today.'

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    storyboard: (product, industry, audience) => `Generate a storyboard combining all 6 funnel videos into a connected journey for ${product} in the ${industry} industry targeting ${audience}.
Include transitions between videos, emotional arcs, and recommended duration for each stage.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    'voice-tone': (product, industry, audience) => `Suggest the best voice type and tone (e.g., motivational, friendly, confident, soothing) for each funnel video for ${product} in the ${industry} industry targeting ${audience}.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    'visual-style': (product, industry, audience) => `Suggest animation or visual styles (e.g., cinematic, whiteboard, 2D motion graphics, realistic) suitable for each funnel stage for ${product} in the ${industry} industry.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    optimization: (product, industry, audience) => `List 5 ways to A/B test and optimize the sales funnel videos for ${product} for higher conversion — including thumbnail design, opening hooks, CTA placement, and timing.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`,

    'full-funnel': (product, industry, audience) => `Now combine all funnel videos (Awareness → Proof) into a full funnel video campaign for ${product}.
Provide:
- Chronological order
- Titles and hooks for each video
- Estimated duration
- CTA for each step
- Visual and sound theme consistency

Goal: Create a seamless emotional journey that leads to confident purchase action.

1, No explanations, no introductions, no additional text.
2, Always give your top 3 recommendations where necessary`
};

// Event Listeners
promptForm.addEventListener('submit', generatePrompt);
copyBtn.addEventListener('click', copyPrompt);
regenerateBtn.addEventListener('click', regeneratePrompt);
nextStageBtn.addEventListener('click', goToNextStage);

// Current stage tracking
let currentStageIndex = 0;
const stageOrder = [
    'awareness', 
    'interest', 
    'desire', 
    'action', 
    'follow-up', 
    'testimonial',
    'storyboard',
    'voice-tone',
    'visual-style',
    'optimization',
    'full-funnel'
];

// Functions
function generatePrompt(e) {
    e.preventDefault();
    
    const product = productNameInput.value.trim();
    const industry = industryInput.value.trim();
    const audience = audienceInput.value.trim();
    const stage = videoStageSelect.value;
    
    if (!product || !industry || !audience || !stage) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show loading state
    btnText.textContent = 'Generating...';
    spinner.classList.remove('hidden');
    generateBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        const prompt = promptTemplates[stage](product, industry, audience);
        displayPrompt(prompt);
        
        // Reset button state
        btnText.textContent = 'Generate Prompt';
        spinner.classList.add('hidden');
        generateBtn.disabled = false;
        
        // Set current stage index
        currentStageIndex = stageOrder.indexOf(stage);
    }, 1000);
}

function displayPrompt(prompt) {
    promptOutput.textContent = prompt;
    resultSection.classList.remove('hidden');
    
    // Scroll to result section
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reset copy button state
    copyText.classList.remove('hidden');
    copiedText.classList.add('hidden');
}

function copyPrompt() {
    const text = promptOutput.textContent;
    
    // Use the Clipboard API
    navigator.clipboard.writeText(text).then(() => {
        // Show copied state
        copyText.classList.add('hidden');
        copiedText.classList.remove('hidden');
        
        // Add pulse animation
        copyBtn.classList.add('pulse');
        setTimeout(() => {
            copyBtn.classList.remove('pulse');
        }, 500);
        
        // Reset after 2 seconds
        setTimeout(() => {
            copyText.classList.remove('hidden');
            copiedText.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy prompt to clipboard');
    });
}

function regeneratePrompt() {
    const product = productNameInput.value.trim();
    const industry = industryInput.value.trim();
    const audience = audienceInput.value.trim();
    const currentStage = stageOrder[currentStageIndex];
    
    if (!product || !industry || !audience) {
        alert('Please fill in all fields');
        return;
    }
    
    const prompt = promptTemplates[currentStage](product, industry, audience);
    displayPrompt(prompt);
}

function goToNextStage() {
    // Move to next stage if available
    if (currentStageIndex < stageOrder.length - 1) {
        currentStageIndex++;
        const nextStage = stageOrder[currentStageIndex];
        videoStageSelect.value = nextStage;
        
        // Regenerate with new stage
        regeneratePrompt();
    } else {
        alert('You have completed all funnel stages!');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('.main-content');
    mainContent.style.opacity = '0';
    mainContent.style.animation = 'fadeIn 1s ease forwards';
    mainContent.style.animationDelay = '0.2s';
});
