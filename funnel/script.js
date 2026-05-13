// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const promptItems = document.querySelectorAll('.prompt-item');
const promptForm = document.getElementById('promptForm');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');
const copyBtn = document.getElementById('copyBtn');
const promptTitle = document.querySelector('.prompt-title');
const promptNumber = document.querySelector('.prompt-number');
const promptDescription = document.querySelector('.prompt-description');

// Current prompt state
let currentPrompt = 1;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 
        '<span class="theme-icon">☀️</span>' : 
        '<span class="theme-icon">🌙</span>';
});

// Prompt selection functionality
promptItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        promptItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Update current prompt
        currentPrompt = parseInt(item.getAttribute('data-prompt'));
        
        // Update prompt display
        updatePromptDisplay(currentPrompt);
        
        // Reset form and results
        promptForm.reset();
        resultContainer.style.display = 'none';
    });
});

// Update prompt display based on selection
function updatePromptDisplay(promptId) {
    const prompts = {
        1: {
            title: "Niche & Audience Discovery",
            description: "You are a professional market researcher and sales strategist. Analyze and identify the most profitable niche and target audience for your product or service.",
            inputs: [
                { id: "productType", label: "Type of Product or Service", placeholder: "e.g., Online course, SaaS tool, Coaching program", type: "text" }
            ]
        },
        2: {
            title: "Offer Creation & Value Ladder",
            description: "You are a professional sales strategist. Create a powerful, irresistible offer for your product or service.",
            inputs: [
                { id: "productService", label: "Describe Product/Service", placeholder: "e.g., Digital marketing course for small businesses", type: "text" }
            ]
        },
        3: {
            title: "Funnel Blueprint Mapping",
            description: "You are a professional funnel architect. Design a complete funnel blueprint for selling your product or service.",
            inputs: [
                { id: "productService", label: "Product/Service", placeholder: "e.g., Productivity app for remote teams", type: "text" }
            ]
        },
        4: {
            title: "Landing Page Copy (Lead Magnet)",
            description: "You are a professional copywriter skilled in conversion optimization. Write a powerful, high-converting landing page copy for a lead magnet.",
            inputs: [
                { id: "leadMagnetTitle", label: "Lead Magnet Title", placeholder: "e.g., Free 5-Day Email Marketing Course", type: "text" },
                { id: "targetAudience", label: "Target Audience", placeholder: "e.g., Small business owners, Marketers", type: "text" }
            ]
        },
        5: {
            title: "Sales Page Copy (Main Offer)",
            description: "You are a professional direct-response copywriter. Write a full sales page for your product targeting your audience.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Ultimate SEO Mastery Course", type: "text" },
                { id: "targetAudience", label: "Target Audience", placeholder: "e.g., Bloggers, Content creators", type: "text" }
            ]
        },
        6: {
            title: "Upsell/Downsell Page Copy",
            description: "You are a sales funnel optimizer. Create persuasive copy for an upsell page offering your additional product.",
            inputs: [
                { id: "upsellProduct", label: "Upsell Product", placeholder: "e.g., Advanced training module, Premium support", type: "text" }
            ]
        },
        7: {
            title: "Lead Nurture Email Sequence",
            description: "You are an expert email marketer. Write a 5-day lead nurture sequence for new subscribers who downloaded your lead magnet.",
            inputs: [
                { id: "leadMagnet", label: "Lead Magnet", placeholder: "e.g., Free Ebook on Social Media Marketing", type: "text" }
            ]
        },
        8: {
            title: "Sales Conversion Email Sequence",
            description: "You are a conversion email copywriter. Write a 5-email sequence to sell your product to leads who have shown interest but haven't purchased.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Productivity Mastery Course", type: "text" }
            ]
        },
        9: {
            title: "Post-Purchase & Upsell Email Sequence",
            description: "You are a customer retention strategist. Write 3 follow-up emails for customers who purchased your product.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Digital Marketing Toolkit", type: "text" }
            ]
        },
        10: {
            title: "Social Media Ad Copy",
            description: "You are a professional digital advertiser. Write 3 versions of ad copy to promote your product on social media platforms.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Fitness App for Busy Professionals", type: "text" },
                { id: "platform", label: "Platform", placeholder: "e.g., Facebook, Instagram, YouTube", type: "text" }
            ]
        },
        11: {
            title: "Video Sales Script",
            description: "You are a professional video scriptwriter. Write a 3-minute video sales script to promote your product.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Time Management Masterclass", type: "text" }
            ]
        },
        12: {
            title: "Retargeting Ad Script",
            description: "You are a retargeting ad specialist. Write a retargeting ad script for people who visited the sales page but didn't buy.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Personal Finance Course", type: "text" }
            ]
        },
        13: {
            title: "Funnel Optimization Audit",
            description: "You are a funnel optimization expert. Analyze funnel performance metrics and provide recommendations.",
            inputs: [
                { id: "metrics", label: "Performance Metrics", placeholder: "e.g., Landing page conversion rate: 2%, Cart abandonment: 70%", type: "textarea" }
            ]
        },
        14: {
            title: "Customer Feedback Analysis",
            description: "You are a customer experience analyst. Review customer feedback and identify improvements.",
            inputs: [
                { id: "feedback", label: "Customer Feedback", placeholder: "Paste customer feedback, reviews, or survey responses here", type: "textarea" }
            ]
        },
        15: {
            title: "Funnel Scaling Plan",
            description: "You are a growth marketing strategist. Design a scaling strategy for your sales funnel.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., E-commerce Mastery Program", type: "text" }
            ]
        },
        16: {
            title: "Evergreen Funnel Conversion",
            description: "You are an automation funnel expert. Convert the live sales funnel into an evergreen funnel.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Online Coaching Program", type: "text" }
            ]
        },
        17: {
            title: "Build the Entire Funnel System",
            description: "You are a professional funnel strategist, copywriter, and automation expert. Build a complete high-converting sales funnel from scratch.",
            inputs: [
                { id: "productName", label: "Product Name", placeholder: "e.g., Digital Product, Service, or Course", type: "text" },
                { id: "targetAudience", label: "Target Audience", placeholder: "e.g., Entrepreneurs, Students, Professionals", type: "text" }
            ]
        }
    };

    const prompt = prompts[promptId];
    
    if (prompt) {
        promptTitle.textContent = prompt.title;
        promptNumber.textContent = promptId;
        promptDescription.textContent = prompt.description;
        
        // Clear existing form inputs
        promptForm.innerHTML = '';
        
        // Add new inputs based on prompt
        prompt.inputs.forEach(input => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            const label = document.createElement('label');
            label.setAttribute('for', input.id);
            label.textContent = input.label;
            
            let inputElement;
            if (input.type === 'textarea') {
                inputElement = document.createElement('textarea');
                inputElement.id = input.id;
                inputElement.placeholder = input.placeholder;
                inputElement.required = true;
            } else {
                inputElement = document.createElement('input');
                inputElement.type = input.type;
                inputElement.id = input.id;
                inputElement.placeholder = input.placeholder;
                inputElement.required = true;
            }
            
            inputGroup.appendChild(label);
            inputGroup.appendChild(inputElement);
            promptForm.appendChild(inputGroup);
        });
        
        // Add submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-full pulse';
        submitButton.innerHTML = '<span class="btn-icon">🚀</span> Generate Prompt';
        promptForm.appendChild(submitButton);
    }
}

// Form submission
promptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show loading
    loading.style.display = 'block';
    resultContainer.style.display = 'none';
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Generate prompt based on current selection and form data
        const formData = new FormData(promptForm);
        const promptText = generatePrompt(currentPrompt, formData);
        
        // Display result
        resultContent.textContent = promptText;
        loading.style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.classList.add('fade-in');
        
        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1500);
});

// Copy button functionality
copyBtn.addEventListener('click', () => {
    const textToCopy = resultContent.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtn.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = '<span class="copy-icon">📋</span> Copy Prompt';
            copyBtn.classList.remove('copied');
        }, 2000);
    });
});

// Generate prompt based on type and form data
function generatePrompt(promptId, formData) {
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const promptTemplates = {
        1: `You are a professional market researcher and sales strategist.  
Analyze and identify the most profitable niche and target audience for a ${data.productType}.  

Include:
1. The main audience demographic (age, gender, interests, location)
2. Their pain points, fears, and desires
3. The emotional triggers that influence their buying decisions
4. Top competitors in the niche and what makes them successful
5. A clear positioning statement for standing out in the market

Output as:
✅ Niche Summary  
✅ Target Audience Profile  
✅ Competitive Edge  
✅ Positioning Statement

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        2: `You are a professional sales strategist.  
Create a powerful, irresistible offer for ${data.productService}.  

Include:
1. Core Offer (Main product/service)
2. Bonuses that increase perceived value
3. Guarantee or risk-reversal strategy
4. Pricing strategy and justification
5. Value ladder structure (Free → Low-Ticket → Core → High-Ticket)

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        3: `You are a professional funnel architect.  
Design a complete funnel blueprint for selling ${data.productService}.  

Include:
1. Funnel stages (Lead magnet, Tripwire, Core offer, Upsell, Thank-you)
2. Goal of each stage
3. Conversion mechanism (email, webinar, video sales letter, checkout page, etc.)
4. Traffic source plan (organic + paid)
5. Key performance metrics to track success

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        4: `You are a professional copywriter skilled in conversion optimization.  
Write a powerful, high-converting landing page copy for a lead magnet called "${data.leadMagnetTitle}" that attracts ${data.targetAudience}.  

Include:
1. Headline (Hook)
2. Subheadline
3. Short benefit-driven description
4. 3 bullet-point benefits
5. CTA section (call-to-action)
6. Social proof or credibility booster

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        5: `You are a professional direct-response copywriter.  
Write a full sales page for "${data.productName}" targeting ${data.targetAudience}.  

Include:
1. Hero Section (Headline, Subheadline, CTA)
2. Problem Section (pain points)
3. Solution Introduction (introduce the product)
4. Benefits section (emotional & logical benefits)
5. Features section
6. Testimonials/social proof
7. Offer Stack (bonuses + guarantee)
8. Price & CTA
9. FAQ section
10. Final CTA with urgency

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        6: `You are a sales funnel optimizer.  
Create persuasive copy for an upsell page offering ${data.upsellProduct}.  

Include:
1. Headline emphasizing added value
2. Short reminder of main purchase
3. Benefits and reasons to upgrade
4. Scarcity or limited-time offer
5. CTA to accept or decline offer

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        7: `You are an expert email marketer.  
Write a 5-day lead nurture sequence for new subscribers who downloaded ${data.leadMagnet}.  

Each email should:
- Have a captivating subject line
- Build trust and relationship
- Share value or story
- Subtly transition toward the main offer

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        8: `You are a conversion email copywriter.  
Write a 5-email sequence to sell "${data.productName}" to leads who have shown interest but haven't purchased.  

Structure:
1. Problem agitation
2. Solution presentation
3. Story-based persuasion
4. Objection handling
5. Final urgency email

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        9: `You are a customer retention strategist.  
Write 3 follow-up emails for customers who purchased "${data.productName}".  

Goals:
- Deliver gratitude and onboarding info
- Introduce upsell or affiliate offer
- Encourage testimonials or referrals

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        10: `You are a professional digital advertiser.  
Write 3 versions of ad copy to promote "${data.productName}" on ${data.platform}.  

Each version should include:
- Hook (scroll-stopping first line)
- Emotional connection
- Clear benefit
- CTA to click link or learn more

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        11: `You are a professional video scriptwriter.  
Write a 3-minute video sales script to promote "${data.productName}".  

Structure:
1. Hook (first 5 seconds)
2. Pain story
3. Solution intro
4. Benefits and proof
5. Call to action

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        12: `You are a retargeting ad specialist.  
Write a retargeting ad script for people who visited the sales page but didn't buy "${data.productName}".  

Include:
1. Reminder of what they missed
2. Emotional trigger
3. Limited-time incentive
4. Strong CTA

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        13: `You are a funnel optimization expert.  
Analyze the following funnel performance metrics:
${data.metrics}

Provide:
1. Key insights on weak areas
2. Specific recommendations for A/B tests
3. Strategies to improve conversions and average order value

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        14: `You are a customer experience analyst.  
Review the following customer feedback:
${data.feedback}

Identify:
- Common objections or frustrations
- Suggested improvements
- Emotional language customers use
Summarize how to refine messaging or offers to match customer psychology.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        15: `You are a growth marketing strategist.  
Design a scaling strategy for a sales funnel selling "${data.productName}".  

Include:
1. Paid traffic scaling plan
2. Automation setup (email + retargeting)
3. Referral/affiliate system
4. KPIs to measure scaling success

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        16: `You are an automation funnel expert.  
Convert the live sales funnel for "${data.productName}" into an evergreen funnel.  

Include:
1. Automated lead generation system
2. Evergreen email sequence (with scarcity simulation)
3. Autopilot sales mechanism
4. Recommended tools or platforms to manage automation

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`,

        17: `You are a professional funnel strategist, copywriter, and automation expert.  
Build a complete high-converting sales funnel for "${data.productName}" targeting "${data.targetAudience}".  

Deliver:
1. Funnel structure and flow
2. Offer and pricing plan
3. Landing page copy
4. Sales page copy
5. Email sequences (lead nurture + sales + post-purchase)
6. Ad copy & video script
7. Scaling & automation recommendations

Present results section by section.

1. No explanations, no introductions, no additional text.
2. Always give your top 3 recommendations where necessary.`
    };
    
    return promptTemplates[promptId] || "Prompt template not found.";
}
