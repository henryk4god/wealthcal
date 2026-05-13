// script.js
class BlogPromptSystem {
    constructor() {
        this.prompts = this.initializePrompts();
        this.initEventListeners();
        this.initSmoothScrolling();
    }

    initializePrompts() {
        return {
            1: (niche) => `You are an expert blogger and content strategist.
Generate a list of 10 trending blog post ideas in the ${niche} niche that have high search potential and emotional appeal.
Each idea should include:

- Title idea
- Target audience
- Pain point solved
- Main keyword

Format the response in a clear, structured way with each idea separated.

No explanations, no introductions, no additional text.`,

            2: (blogTitle) => `Act as an SEO professional. For this blog title: "${blogTitle}", list:

- Primary keyword
- 5 long-tail keywords
- 5 LSI keywords
- Meta description (under 160 characters)
- Search intent type (Informational, Transactional, Navigational)

Provide specific, actionable recommendations.

No explanations, no introductions, no additional text.`,

            3: (blogTitle) => `As a professional blogger, create a detailed outline for a blog titled "${blogTitle}".
The outline should include:

- Engaging introduction idea
- H2 & H3 headings
- Key discussion points under each heading
- A logical flow that keeps the reader engaged

Structure the outline professionally with clear hierarchy.

No explanations, no introductions, no additional text.`,

            4: (blogTitle) => `You are a viral content writer.
Write 3 possible intro hooks for the blog "${blogTitle}" that grab attention in the first 3 sentences.
Each should include a statistic, story, or question to spark curiosity.

Make each hook unique and compelling.

No explanations, no introductions, no additional text.`,

            5: (sectionTitle, outline) => `Write the full content for the section titled "${sectionTitle}" from the outline below:
${outline}

Use an engaging tone, include examples, and write in simple, conversational style.
Use short paragraphs and bullet points where needed.
Aim for 300-500 words for this section.

No explanations, no introductions, no additional text.`,

            6: (sectionTitle) => `Rewrite the section "${sectionTitle}" to include a short relatable story or case study that supports the point.
Keep the story concise, emotional, and relevant to the reader.

Make sure the story enhances the main point without distracting from it.

No explanations, no introductions, no additional text.`,

            7: (paragraph) => `Add expert insights, data, or quotes to strengthen this paragraph:
"${paragraph}"

Make the content more authoritative and credible while staying natural.
Include 2-3 expert elements that add value.

No explanations, no introductions, no additional text.`,

            8: (primaryKeyword) => `Optimize this blog post for the keyword "${primaryKeyword}".
Include keyword variations naturally in:

- Title
- Subheadings
- Meta description
- Image alt texts (suggested)

Maintain a human-friendly tone while optimizing for SEO.
Provide specific examples.

No explanations, no introductions, no additional text.`,

            9: (relatedTopics) => `Suggest 3 internal link ideas (related blog topics) and 3 external high-authority sources that should be linked in this post to improve SEO credibility.

Related topics: ${relatedTopics}

For each suggestion, explain why it's relevant and valuable.

Top 3 recommendations:
1. [Most valuable internal link]
2. [Most authoritative external source] 
3. [Best contextual link opportunity]

No explanations, no introductions, no additional text.`,

            10: () => `Write 3 versions of a Call-to-Action (CTA) that fits naturally at the end of this blog post.
Each version should focus on a different goal:

1. Getting comments/shares
2. Driving traffic to another article
3. Promoting a product, ebook, or course

Make each CTA compelling and action-oriented.

Top 3 recommendations:
1. [Most engaging CTA for comments]
2. [Best CTA for traffic generation]
3. [Most effective product promotion CTA]

No explanations, no introductions, no additional text.`,

            11: (blogTitle) => `Write a powerful conclusion for "${blogTitle}" that:

- Summarizes key points
- Ends with an emotional or motivational line
- Encourages reader engagement

Make it memorable and share-worthy (150-200 words).

Top 3 recommendations:
1. [Most emotional closing line]
2. [Best engagement-driving ending]
3. [Most memorable summary approach]

No explanations, no introductions, no additional text.`,

            12: (blogContent) => `Rewrite the full blog below for readability and flow:
"${blogContent}"

Use active voice, short paragraphs, and smooth transitions.
Keep tone friendly, expert, and conversational.
Improve the overall reading experience.

Top 3 recommendations:
1. [Best readability improvement]
2. [Most effective transition technique]
3. [Top tone adjustment suggestion]

No explanations, no introductions, no additional text.`,

            13: (blogContent) => `Format this blog content for web readability:
"${blogContent}"

Use proper spacing, bullet lists, bold subpoints, and italic emphasis where suitable.
Suggest 3 featured image ideas and 5 tags.

Make it visually appealing and scannable.

Top 3 recommendations:
1. [Best formatting improvement]
2. [Most engaging visual element]
3. [Top scannability enhancement]

No explanations, no introductions, no additional text.`,

            14: (blogTitle) => `Write 5 different social media captions (for Facebook, Twitter/X, LinkedIn, Pinterest, and Instagram) to promote this blog titled "${blogTitle}".
Each should be platform-appropriate and have a hook + call to action.

Tailor each caption to the specific platform's audience and style.

Top 3 recommendations:
1. [Best performing platform for this content]
2. [Most engaging caption style]
3. [Optimal posting time suggestion]

No explanations, no introductions, no additional text.`,

            15: () => `Write a short email teaser (under 100 words) promoting this blog post.
Use curiosity and urgency to make readers click the link.

Make it compelling and click-worthy.

Top 3 recommendations:
1. [Most effective subject line approach]
2. [Best curiosity-building technique]
3. [Top urgency-creating element]

No explanations, no introductions, no additional text.`,

            16: (keyword) => `You are an expert blogger and SEO writer.
Using the keyword "${keyword}", generate a complete, SEO-optimized blog post (1000–1500 words) that includes:

- A catchy title
- Meta description
- Engaging introduction
- H2/H3 subheadings
- Data, examples, and story
- Strong conclusion with CTA

Make it human-like, emotional, educational, and shareable.

Top 3 recommendations:
1. [Best keyword placement strategy]
2. [Most engaging content structure]
3. [Top shareability element]

No explanations, no introductions, no additional text.`,

            17: () => `Convert this blog post into a 2-minute YouTube video script with visual and voiceover cues.

Include:
- Opening hook
- Main points with timestamps
- Visual descriptions
- Call to action
- Suggested background music style

Top 3 recommendations:
1. [Best visual storytelling technique]
2. [Most engaging hook approach]
3. [Optimal video length adjustment]

No explanations, no introductions, no additional text.`,

            18: () => `Summarize this blog into 7 Instagram carousel slides with bold headlines and short text per slide.

Include:
- Eye-catching headlines
- Key takeaways
- Visual suggestions
- Hashtag recommendations
- Call to action on final slide

Top 3 recommendations:
1. [Best carousel structure]
2. [Most engaging slide design]
3. [Top hashtag strategy]

No explanations, no introductions, no additional text.`
        };
    }

    // ... rest of the class methods remain the same
    initEventListeners() {
        document.querySelectorAll('.generate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGenerateClick(e);
            });
        });

        document.getElementById('copy-btn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const btn = input.closest('.prompt-card').querySelector('.generate-btn');
                    btn.click();
                }
            });
        });
    }

    initSmoothScrolling() {
        const resultsSection = document.getElementById('results');
        if (resultsSection) {
            this.resultsSection = resultsSection;
        }
    }

    handleGenerateClick(e) {
        const promptId = e.target.getAttribute('data-prompt');
        const promptCard = e.target.closest('.prompt-card');
        
        this.showLoadingState(e.target);
        
        setTimeout(() => {
            const generatedPrompt = this.generatePrompt(promptId, promptCard);
            this.displayResult(generatedPrompt);
            this.hideLoadingState(e.target);
            this.scrollToResults();
        }, 800);
    }

    getInputValue(promptCard, inputId) {
        const input = promptCard.querySelector(`#${inputId}`);
        return input ? input.value.trim() : '';
    }

    generatePrompt(promptId, promptCard) {
        const promptFunction = this.prompts[promptId];
        if (!promptFunction) return 'Prompt not found.';

        let generatedPrompt = '';

        switch (parseInt(promptId)) {
            case 1:
                const niche = this.getInputValue(promptCard, 'niche');
                if (!niche) return 'Please enter your niche.';
                generatedPrompt = promptFunction(niche);
                break;

            case 2:
                const blogTitle1 = this.getInputValue(promptCard, 'blog-title-1');
                if (!blogTitle1) return 'Please enter your blog title.';
                generatedPrompt = promptFunction(blogTitle1);
                break;

            case 3:
                const blogTitle2 = this.getInputValue(promptCard, 'blog-title-2');
                if (!blogTitle2) return 'Please enter your blog title.';
                generatedPrompt = promptFunction(blogTitle2);
                break;

            case 4:
                const blogTitle3 = this.getInputValue(promptCard, 'blog-title-3');
                if (!blogTitle3) return 'Please enter your blog title.';
                generatedPrompt = promptFunction(blogTitle3);
                break;

            case 5:
                const sectionTitle1 = this.getInputValue(promptCard, 'section-title-1');
                const outline = this.getInputValue(promptCard, 'outline');
                if (!sectionTitle1 || !outline) return 'Please enter both section title and outline.';
                generatedPrompt = promptFunction(sectionTitle1, outline);
                break;

            case 6:
                const sectionTitle2 = this.getInputValue(promptCard, 'section-title-2');
                if (!sectionTitle2) return 'Please enter section title.';
                generatedPrompt = promptFunction(sectionTitle2);
                break;

            case 7:
                const paragraph = this.getInputValue(promptCard, 'paragraph');
                if (!paragraph) return 'Please paste your paragraph.';
                generatedPrompt = promptFunction(paragraph);
                break;

            case 8:
                const primaryKeyword = this.getInputValue(promptCard, 'primary-keyword');
                if (!primaryKeyword) return 'Please enter primary keyword.';
                generatedPrompt = promptFunction(primaryKeyword);
                break;

            case 9:
                const relatedTopics = this.getInputValue(promptCard, 'related-topics');
                if (!relatedTopics) return 'Please enter related blog topics.';
                generatedPrompt = promptFunction(relatedTopics);
                break;

            case 10:
                generatedPrompt = promptFunction();
                break;

            case 11:
                const blogTitle4 = this.getInputValue(promptCard, 'blog-title-4');
                if (!blogTitle4) return 'Please enter your blog title.';
                generatedPrompt = promptFunction(blogTitle4);
                break;

            case 12:
                const blogContent = this.getInputValue(promptCard, 'blog-content');
                if (!blogContent) return 'Please paste your full blog content.';
                generatedPrompt = promptFunction(blogContent);
                break;

            case 13:
                const blogContent2 = this.getInputValue(promptCard, 'blog-content-2');
                if (!blogContent2) return 'Please paste your blog content.';
                generatedPrompt = promptFunction(blogContent2);
                break;

            case 14:
                const blogTitle5 = this.getInputValue(promptCard, 'blog-title-5');
                if (!blogTitle5) return 'Please enter your blog title.';
                generatedPrompt = promptFunction(blogTitle5);
                break;

            case 15:
                generatedPrompt = promptFunction();
                break;

            case 16:
                const yourKeyword = this.getInputValue(promptCard, 'your-keyword');
                if (!yourKeyword) return 'Please enter your keyword.';
                generatedPrompt = promptFunction(yourKeyword);
                break;

            case 17:
                generatedPrompt = promptFunction();
                break;

            case 18:
                generatedPrompt = promptFunction();
                break;

            default:
                generatedPrompt = 'Prompt not available.';
        }

        return generatedPrompt;
    }

    displayResult(prompt) {
        const resultContent = document.getElementById('result-content');
        
        if (prompt.startsWith('Please')) {
            resultContent.innerHTML = `
                <div class="error-message" style="color: #dc3545; text-align: center; padding: 2rem;">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">⚠️</p>
                    <p>${prompt}</p>
                </div>
            `;
            return;
        }

        resultContent.innerHTML = `
            <div class="generated-prompt fade-in">
                ${this.formatPrompt(prompt)}
            </div>
        `;
    }

    formatPrompt(prompt) {
        return prompt
            .split('\n')
            .map(line => {
                if (line.trim() === '') return '<br>';
                if (line.startsWith('- ') || line.startsWith('• ')) {
                    return `<div style="margin-left: 1rem; margin-bottom: 0.5rem;">${line}</div>`;
                }
                if (line.includes(':')) {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        return `<strong>${parts[0]}:</strong> ${parts.slice(1).join(':')}`;
                    }
                }
                return line;
            })
            .join('\n')
            .replace(/\n/g, '<br>');
    }

    showLoadingState(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loading"></span> Generating...';
        button.disabled = true;
        button.setAttribute('data-original-text', originalText);
    }

    hideLoadingState(button) {
        const originalText = button.getAttribute('data-original-text');
        button.innerHTML = originalText;
        button.disabled = false;
    }

    scrollToResults() {
        if (this.resultsSection) {
            this.resultsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    async copyToClipboard() {
        const resultContent = document.getElementById('result-content');
        const promptText = resultContent.textContent || resultContent.innerText;
        const copyBtn = document.getElementById('copy-btn');
        
        if (!promptText || promptText.includes('Your generated prompt will appear here')) {
            this.showCopyFeedback(copyBtn, false);
            return;
        }

        try {
            await navigator.clipboard.writeText(promptText);
            this.showCopyFeedback(copyBtn, true);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = promptText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopyFeedback(copyBtn, true);
        }
    }

    showCopyFeedback(button, success) {
        if (success) {
            button.classList.add('copied');
            setTimeout(() => {
                button.classList.remove('copied');
            }, 2000);
        } else {
            button.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 600);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPromptSystem();
    
    const stageSections = document.querySelectorAll('.stage-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    stageSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.querySelector('input')?.focus();
        }
    });

    console.log('🚀 Blog Creation Prompt System initialized!');
});
