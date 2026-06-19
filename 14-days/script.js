// ---------- Facebook Pixel CTA Tracking ----------
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('ctaButton');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // Track the lead event
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'View Complete Guide Click',
                    content_category: 'Health & Wellness'
                });
            }
            // The link will still navigate to href
        });
    }
});

// ---------- FAQ Toggle ----------
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('.toggle-icon');

    if (answer.classList.contains('open')) {
        answer.classList.remove('open');
        if (icon) icon.classList.remove('open');
    } else {
        answer.classList.add('open');
        if (icon) icon.classList.add('open');
    }
}

// ---------- Open first FAQ by default for better UX ----------
document.addEventListener('DOMContentLoaded', function() {
    const firstFaq = document.querySelector('.faq-item .answer');
    const firstIcon = document.querySelector('.faq-item .toggle-icon');
    if (firstFaq) {
        firstFaq.classList.add('open');
        if (firstIcon) firstIcon.classList.add('open');
    }
});
