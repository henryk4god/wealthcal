/* ══════════════════════════════════════════
   MichyHub Dashboard — script.js
   ══════════════════════════════════════════ */

const sections = {
  marketing: [
    { url: "https://michyhub.com.ng/product/",    icon: "🛍️", ic: "ic-amber", title: "Product",      desc: "Showcase & manage your products" },
    { url: "https://michyhub.com.ng/facebookad/", icon: "📣", ic: "ic-rose",  title: "Facebook Ads", desc: "Create high-converting ad copy" },
    { url: "https://michyhub.com.ng/sales/",      icon: "💰", ic: "ic-gold",  title: "Sales",        desc: "Boost your sales strategy" },
    { url: "https://michyhub.com.ng/funnel/",     icon: "🌀", ic: "ic-plum",  title: "Funnel",       desc: "Build powerful sales funnels" },
    { url: "https://michyhub.com.ng/viralpost/",  icon: "🔥", ic: "ic-amber", title: "Viral Post",   desc: "Craft posts that spread fast" },
    { url: "https://michyhub.com.ng/treading/",   icon: "📈", ic: "ic-sage",  title: "Trending",     desc: "Catch what's hot right now" },
  ],
  content: [
    { url: "https://michyhub.com.ng/blog/",       icon: "✍️", ic: "ic-brown", title: "Blog",         desc: "Write & publish great articles" },
    { url: "https://michyhub.com.ng/youtube/",    icon: "▶️", ic: "ic-rose",  title: "YouTube",      desc: "Create winning video content" },
    { url: "https://michyhub.com.ng/podcast/",    icon: "🎙️", ic: "ic-plum",  title: "Podcast",      desc: "Plan & script your podcast" },
    { url: "https://michyhub.com.ng/video/",      icon: "🎬", ic: "ic-amber", title: "Video",        desc: "Professional video creation" },
    { url: "https://michyhub.com.ng/animation/",  icon: "🎥", ic: "ic-teal",  title: "Animation",    desc: "Bring ideas to life visually" },
    { url: "https://michyhub.com.ng/webinar/",    icon: "🖥️", ic: "ic-slate", title: "Webinar",      desc: "Host engaging online sessions" },
    { url: "https://michyhub.com.ng/whiteboard/", icon: "📋", ic: "ic-sage",  title: "Whiteboard",   desc: "Brainstorm & map your ideas" },
    { url: "https://michyhub.com.ng/amazon/",     icon: "📦", ic: "ic-gold",  title: "Amazon",       desc: "Optimise your Amazon listings" },
  ],
  tools: [
    { url: "https://michyhub.com.ng/command/",    icon: "⚡", ic: "ic-amber", title: "Command",      desc: "Quick-access command centre" },
    { url: "https://michyhub.com.ng/cluncher/",   icon: "🔧", ic: "ic-slate", title: "Cluncher",     desc: "Fix & refine your content" },
    { url: "https://michyhub.com.ng/ideas/",      icon: "💡", ic: "ic-gold",  title: "Ideas",        desc: "Spark fresh creative concepts" },
    { url: "https://michyhub.com.ng/calculator/", icon: "🧮", ic: "ic-teal",  title: "Calculator",   desc: "Numbers & quick calculations" },
    { url: "https://michyhub.com.ng/maq/",        icon: "❓", ic: "ic-rose",  title: "MAQ",          desc: "Your question & answer hub" },
  ],
};

/* SVG icons */
const arrowRight = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
const arrowLeft  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

/* DOM refs */
const dashboardView  = document.getElementById('dashboard-view');
const viewerView     = document.getElementById('viewer-view');
const toolFrame      = document.getElementById('tool-frame');
const backBtn        = document.getElementById('back-btn');
const backBarTitle   = document.getElementById('back-bar-title');

/* Inject back-btn SVG */
backBtn.innerHTML = `${arrowLeft} Back to Dashboard`;

/* ── Open a tool in the iframe viewer ── */
function openTool(url, title) {
  toolFrame.src = url;
  backBarTitle.textContent = title;

  dashboardView.classList.add('hidden');
  viewerView.classList.add('active');

  /* scroll viewer to top */
  window.scrollTo(0, 0);
}

/* ── Return to dashboard ── */
backBtn.addEventListener('click', () => {
  viewerView.classList.remove('active');
  dashboardView.classList.remove('hidden');

  /* clear iframe so it stops loading */
  toolFrame.src = 'about:blank';
});

/* ── Build a card grid ── */
function buildGrid(data, containerId) {
  const container = document.getElementById(containerId);
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <div class="card-icon ${item.ic}">${item.icon}</div>
      <div class="card-body">
        <div class="card-title">${item.title}</div>
        <div class="card-desc">${item.desc}</div>
        <div class="card-cta">Open tool ${arrowRight}</div>
      </div>`;

    /* click & keyboard */
    card.addEventListener('click', () => openTool(item.url, item.title));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openTool(item.url, item.title);
    });

    container.appendChild(card);
  });
}

/* ── Init ── */
buildGrid(sections.marketing, 'marketing-grid');
buildGrid(sections.content,   'content-grid');
buildGrid(sections.tools,     'tools-grid');
