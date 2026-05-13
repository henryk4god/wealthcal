// Podcast Prompt System - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sectionSelect = document.getElementById('section-select');
    const promptSelect = document.getElementById('prompt-select');
    const inputFields = document.getElementById('input-fields');
    const generateBtn = document.getElementById('generate-btn');
    const resultSection = document.querySelector('.result-section');
    const generatedPrompt = document.getElementById('generated-prompt');
    const copyBtn = document.getElementById('copy-btn');
    const newPromptBtn = document.getElementById('new-prompt-btn');

    // Prompt data structure
    const promptSystem = {
        section1: {
            name: "Podcast Niche Discovery & Concept Development",
            prompts: {
                prompt1: {
                    name: "Niche Finder",
                    inputs: [
                        { id: "interests", label: "Your Interests", type: "textarea", placeholder: "e.g., technology, entrepreneurship, health, personal development" }
                    ],
                    template: (data) => `You are an expert podcast strategist. I want to start a podcast that stands out.
Generate 10 niche podcast ideas that are high-demand, low-competition, and suitable for my interests: ${data.interests}.
Include:

Niche title

Core audience

Why it's unique

Example episode topic

TOP 3 RECOMMENDATIONS:
1. Focus on emerging trends within your interests
2. Combine two seemingly unrelated interests
3. Target underserved demographics in your niche

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt2: {
                    name: "Show Concept",
                    inputs: [
                        { id: "nameIdea", label: "Podcast Name Idea", type: "text", placeholder: "Enter your podcast name idea" }
                    ],
                    template: (data) => `Create a full concept for my podcast titled "${data.nameIdea}".
Include:

Podcast theme/mission

Target audience profile

Format (solo/interview/panel)

Publishing schedule

Tone & style guide

TOP 3 RECOMMENDATIONS:
1. Define clear audience personas
2. Establish consistent publishing rhythm
3. Develop unique tone that matches your brand

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt3: {
                    name: "Unique Hook & Positioning",
                    inputs: [
                        { id: "niche", label: "Your Podcast Niche", type: "text", placeholder: "Enter your podcast niche" }
                    ],
                    template: (data) => `As a branding expert, create 3 positioning statements and hooks that make my podcast stand out from similar ones in the niche "${data.niche}".
Include a 1-line elevator pitch and tagline for each.

TOP 3 RECOMMENDATIONS:
1. Focus on unique value proposition
2. Use emotional triggers in positioning
3. Create memorable, repeatable taglines

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section2: {
            name: "Podcast Name, Branding & Identity",
            prompts: {
                prompt4: {
                    name: "Podcast Name Generator",
                    inputs: [
                        { id: "topic", label: "Podcast Topic/Niche", type: "text", placeholder: "Enter your podcast topic or niche" }
                    ],
                    template: (data) => `Generate 15 catchy, memorable, and brandable podcast names for a show about ${data.topic}.
Include meanings and why each name fits the niche.

TOP 3 RECOMMENDATIONS:
1. Use alliteration and rhythm
2. Consider domain name availability
3. Ensure name reflects content accurately

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt5: {
                    name: "Podcast Brand Identity",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Create a full brand identity guide for the "${data.podcastName}" including:

Color palette

Logo concept description

Font and typography style

Visual tone (cover art, social media)

Brand voice and personality

TOP 3 RECOMMENDATIONS:
1. Choose colors that evoke desired emotions
2. Design for scalability across platforms
3. Maintain consistent brand voice

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section3: {
            name: "Episode Planning & Structure",
            prompts: {
                prompt6: {
                    name: "Episode Framework",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Design a repeatable episode structure for my podcast "${data.podcastName}" (average 25–40 mins).
Include:

Intro format (music, greeting, hook)

Main segment(s)

Storytelling or interview flow

Outro and CTA structure

TOP 3 RECOMMENDATIONS:
1. Create consistent opening hook
2. Balance content with engagement
3. End with clear call-to-action

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt7: {
                    name: "Episode Topic Ideas",
                    inputs: [
                        { id: "topic", label: "Podcast Topic", type: "text", placeholder: "Enter your podcast topic" }
                    ],
                    template: (data) => `Generate 20 trending and evergreen episode ideas for a podcast about ${data.topic}.
Include:

Episode title

Short description

Audience takeaway

Suggested guest (if applicable)

TOP 3 RECOMMENDATIONS:
1. Mix trending and evergreen content
2. Include diverse perspectives
3. Focus on actionable takeaways

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section4: {
            name: "Scriptwriting & Voice Guide",
            prompts: {
                prompt8: {
                    name: "Full Episode Script",
                    inputs: [
                        { id: "episodeTitle", label: "Episode Title", type: "text", placeholder: "Enter episode title" },
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Write a complete 25-minute script for an episode titled "${data.episodeTitle}" of my podcast "${data.podcastName}".
Include host narration, segment transitions, and guest questions.
Make it conversational, engaging, and natural.

TOP 3 RECOMMENDATIONS:
1. Use natural conversation flow
2. Include strategic pauses
3. Balance information with entertainment

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt9: {
                    name: "Voice Tone Training",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `As a podcast voice coach, create a voice style and tone guide for my podcast "${data.podcastName}".
Include examples of tone (energetic, calm, inspiring, etc.), pacing, emphasis techniques, and breathing tips.

TOP 3 RECOMMENDATIONS:
1. Practice consistent pacing
2. Use vocal variety for engagement
3. Master breathing techniques

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section5: {
            name: "Production & Editing Workflow",
            prompts: {
                prompt10: {
                    name: "Production Checklist",
                    inputs: [],
                    template: () => `As a podcast producer, list all the tools and steps needed to record, edit, and publish a professional-quality episode.
Include recommended:

Recording tools (mic, software)

Editing tools (apps, plugins)

Sound design best practices

TOP 3 RECOMMENDATIONS:
1. Invest in quality microphone
2. Master noise reduction techniques
3. Create consistent audio levels

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt11: {
                    name: "Editing Script",
                    inputs: [],
                    template: () => `Create an editing script and flow for a 30-minute podcast episode, detailing:

Music placement cues

Sound effect timing

Silence trimming

Transitions and fade-outs

TOP 3 RECOMMENDATIONS:
1. Use strategic music for emotional impact
2. Remove distracting filler words
3. Create smooth transitions between segments

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section6: {
            name: "Podcast Launch Plan",
            prompts: {
                prompt12: {
                    name: "30-Day Launch Plan",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Build a 30-day podcast launch plan for "${data.podcastName}" including:

Pre-launch tasks (branding, trailer, submission)

Launch week activities

Post-launch follow-up and analytics setup

TOP 3 RECOMMENDATIONS:
1. Build audience before launch
2. Create compelling trailer
3. Plan post-launch engagement strategy

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt13: {
                    name: "Trailer Script",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Write a 90-second podcast trailer script for "${data.podcastName}" that hooks listeners and explains what the show is about.
Include a strong call-to-action to subscribe.

TOP 3 RECOMMENDATIONS:
1. Start with compelling hook
2. Clearly explain value proposition
3. Include strong CTA

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section7: {
            name: "Distribution & Promotion",
            prompts: {
                prompt14: {
                    name: "Distribution Strategy",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `List all the top podcast directories and platforms I should publish "${data.podcastName}" on.
Include submission steps, requirements, and hosting options.

TOP 3 RECOMMENDATIONS:
1. Submit to Apple Podcasts and Spotify first
2. Use reliable podcast hosting service
3. Optimize for podcast SEO

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt15: {
                    name: "Social Media Promotion",
                    inputs: [],
                    template: () => `Create a 7-day content plan to promote each new episode across social media (Instagram, TikTok, YouTube Shorts, X).
Include captions, hashtags, and short clip ideas.

TOP 3 RECOMMENDATIONS:
1. Repurpose content for each platform
2. Use platform-specific best practices
3. Engage with audience comments

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt16: {
                    name: "Email Marketing Plan",
                    inputs: [],
                    template: () => `Write an email marketing sequence (3–5 emails) to promote my new podcast launch to my audience.
Include:

Announcement email

Behind-the-scenes teaser

Launch day email

First episode reminder

TOP 3 RECOMMENDATIONS:
1. Personalize email content
2. Create compelling subject lines
3. Include clear CTAs in each email

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section8: {
            name: "Growth & Monetization",
            prompts: {
                prompt17: {
                    name: "Audience Growth Plan",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Create a 90-day audience growth plan for "${data.podcastName}".
Include methods for:

Organic growth

Guest collaborations

SEO optimization

Listener engagement

TOP 3 RECOMMENDATIONS:
1. Focus on consistent quality content
2. Leverage guest appearances
3. Build community around show

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt18: {
                    name: "Monetization Strategy",
                    inputs: [
                        { id: "podcastName", label: "Podcast Name", type: "text", placeholder: "Enter your podcast name" }
                    ],
                    template: (data) => `Suggest the best monetization strategies for my podcast "${data.podcastName}" (ads, sponsorships, digital products, premium content, etc.).
Include practical steps and potential revenue estimates.

TOP 3 RECOMMENDATIONS:
1. Build audience before monetizing
2. Diversify revenue streams
3. Align sponsors with audience interests

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section9: {
            name: "AI Podcast Automation & Repurposing",
            prompts: {
                prompt19: {
                    name: "AI Automation Setup",
                    inputs: [],
                    template: () => `Recommend AI tools and workflows to automate my podcast production (transcription, show notes, audiograms, social content).

TOP 3 RECOMMENDATIONS:
1. Use AI for transcription and show notes
2. Automate social media content creation
3. Implement workflow automation tools

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt20: {
                    name: "Content Repurposing System",
                    inputs: [],
                    template: () => `Create a content repurposing system for my podcast.
Convert each episode into:

3 blog posts

5 short social clips

1 email newsletter

10 quotes or carousels

TOP 3 RECOMMENDATIONS:
1. Repurpose across multiple formats
2. Optimize content for each platform
3. Create evergreen content library

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        section10: {
            name: "Continuous Improvement & Audience Engagement",
            prompts: {
                prompt21: {
                    name: "Feedback Loop System",
                    inputs: [],
                    template: () => `Design a feedback and survey system for my podcast audience to share their opinions.
Include sample survey questions and feedback analysis methods.

TOP 3 RECOMMENDATIONS:
1. Make feedback collection easy
2. Ask specific, actionable questions
3. Regularly implement audience suggestions

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt22: {
                    name: "KPI Tracker",
                    inputs: [],
                    template: () => `Create a KPI (Key Performance Indicator) dashboard plan for tracking podcast success.
Include:

Downloads per episode

Listener retention rate

Engagement rate

Revenue per episode

TOP 3 RECOMMENDATIONS:
1. Track both quantitative and qualitative metrics
2. Set realistic growth targets
3. Use data to inform content decisions

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        },
        bonus: {
            name: "Podcast-to-Brand Ecosystem",
            prompts: {
                prompt23: {
                    name: "Ecosystem Integration",
                    inputs: [],
                    template: () => `Explain how to integrate my podcast with my brand ecosystem — website, YouTube, newsletter, and products — to increase visibility and conversions.

TOP 3 RECOMMENDATIONS:
1. Create cross-platform content strategy
2. Use podcast to drive traffic to other channels
3. Develop integrated marketing campaigns

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                },
                prompt24: {
                    name: "Community Building",
                    inputs: [],
                    template: () => `Develop a plan to build an online community around my podcast (e.g., Telegram group, Discord, or membership site).
Include engagement strategies and content ideas.

TOP 3 RECOMMENDATIONS:
1. Choose platform that fits your audience
2. Provide exclusive value to community members
3. Foster genuine connections among members

  1, No explanations, no introductions, no additional text.
  2, Always give your top 3 recommendations where necessary`
                }
            }
        }
    };

    // Event Listeners
    sectionSelect.addEventListener('change', handleSectionChange);
    promptSelect.addEventListener('change', handlePromptChange);
    generateBtn.addEventListener('click', generatePrompt);
    copyBtn.addEventListener('click', copyPrompt);
    newPromptBtn.addEventListener('click', resetForm);

    // Functions
    function handleSectionChange() {
        const section = sectionSelect.value;
        promptSelect.innerHTML = '<option value="">-- Choose a prompt --</option>';
        
        if (section && promptSystem[section]) {
            Object.entries(promptSystem[section].prompts).forEach(([key, prompt]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = prompt.name;
                promptSelect.appendChild(option);
            });
        }
        
        inputFields.innerHTML = '';
        resultSection.classList.add('hidden');
    }

    function handlePromptChange() {
        const section = sectionSelect.value;
        const promptKey = promptSelect.value;
        
        if (section && promptKey && promptSystem[section] && promptSystem[section].prompts[promptKey]) {
            const prompt = promptSystem[section].prompts[promptKey];
            renderInputFields(prompt.inputs);
        } else {
            inputFields.innerHTML = '';
        }
        
        resultSection.classList.add('hidden');
    }

    function renderInputFields(inputs) {
        inputFields.innerHTML = '';
        
        if (inputs && inputs.length > 0) {
            inputs.forEach(input => {
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
                    inputElement.type = input.type || 'text';
                }
                
                inputElement.id = input.id;
                inputElement.name = input.id;
                inputElement.placeholder = input.placeholder || '';
                inputElement.className = 'form-input';
                
                inputGroup.appendChild(label);
                inputGroup.appendChild(inputElement);
                inputFields.appendChild(inputGroup);
            });
        } else {
            const message = document.createElement('p');
            message.textContent = 'No inputs required for this prompt. Click "Generate Prompt" to continue.';
            message.style.color = 'var(--text-light)';
            message.style.fontStyle = 'italic';
            inputFields.appendChild(message);
        }
    }

    function generatePrompt() {
        const section = sectionSelect.value;
        const promptKey = promptSelect.value;
        
        if (!section || !promptKey) {
            alert('Please select both a section and a prompt.');
            return;
        }

        const prompt = promptSystem[section].prompts[promptKey];
        const inputData = {};
        
        // Collect input values
        if (prompt.inputs && prompt.inputs.length > 0) {
            let allFilled = true;
            prompt.inputs.forEach(input => {
                const element = document.getElementById(input.id);
                if (element) {
                    const value = element.value.trim();
                    if (!value) {
                        allFilled = false;
                        element.style.borderColor = 'var(--accent-color)';
                    } else {
                        element.style.borderColor = '';
                        inputData[input.id] = value;
                    }
                }
            });
            
            if (!allFilled) {
                alert('Please fill in all required fields.');
                return;
            }
        }

        // Generate prompt
        const generatedText = prompt.template(inputData);
        generatedPrompt.textContent = generatedText;
        
        // Show result section with animation
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
        
        // Add pulse animation
        const resultCard = document.querySelector('.result-card');
        resultCard.classList.add('pulse');
        setTimeout(() => resultCard.classList.remove('pulse'), 500);
    }

    function copyPrompt() {
        const text = generatedPrompt.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Visual feedback
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'var(--accent-color)';
            copyBtn.style.borderColor = 'var(--accent-color)';
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy Prompt';
                copyBtn.style.background = '';
                copyBtn.style.borderColor = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy prompt to clipboard.');
        });
    }

    function resetForm() {
        // Clear inputs
        const inputs = inputFields.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = '';
        });
        
        // Hide result section
        resultSection.classList.add('hidden');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initialize
    handleSectionChange();
});

// Ask for confirmation to proceed
console.log("JavaScript file updated with all prompts including the required instructions:");
console.log("👉1, No explanations, no introductions, no additional text.");
console.log("👉2, Always give your top 3 recommendations where necessary");
console.log("Please confirm to proceed with the next code file.");
