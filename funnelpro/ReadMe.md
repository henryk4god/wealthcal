# Classroom Funnel Pro — Buyer Setup Guide

Complete setup walkthrough from zero to live classroom.

---

## 📋 Prerequisites

Before you start, you'll need:

- [ ] A **Google account** (for Apps Script + Google Sheets)
- [ ] A **Telegram bot** (create via [@BotFather](https://t.me/BotFather))
- [ ] A **landing page** (GitHub Pages, WordPress, Webflow, or any HTML host)
- [ ] A **payment processor** (Selar, Gumroad, Lemon Squeezy, Payhip, Paystack, Stripe, etc.)
- [ ] (Optional) A **Meta Pixel** for Facebook/Instagram ads

---

## 🚀 Phase 1 — Initial Setup (30 minutes)

### Step 1.1 — Deploy Apps Script

1. Go to [script.google.com](https://script.google.com) → New Project
2. Copy all `.gs` files from your purchase into the project
3. **Set Script Properties** (Project Settings → Script Properties):

| Key | Value |
|---|---|
| `BOT_TOKEN` | From @BotFather |
| `SPREADSHEET_ID` | From your Google Sheet URL |
| `ADMIN_ID` | Your Telegram user ID (get from @userinfobot) |
| `WEB_APP_URL` | Leave blank for now — will set after deploy |
| `ATTRIBUTION_SHARED_SECRET` | Random 32+ character string (e.g. from [random.org](https://www.random.org/strings/)) |

4. **Deploy as web app:** Deploy → New deployment → Web app → Execute as "Me" → Access "Anyone" → Deploy
5. Copy the `/exec` URL → paste into `WEB_APP_URL` Script Property
6. Run `setupAll()` once → creates all sheets
7. Run `boot` function (or open your `/exec?action=boot` URL) to register the webhook

### Step 1.2 — Configure Your Landing Page

1. Upload these files to your landing page host:
   - `index.html` — free guide page (or skip if no free product)
   - `index-paid.html` — paid thank-you page
   - `config.js` — configuration
   - `script.js` — attribution + auto-approve logic
   - `style.css` — your styling

2. **Edit `config.js`** — see the `config.js` file itself for inline docs. Minimum required:
   - `attributionEndpoint` → your Apps Script `/exec` URL
   - `telegramBotHandle` → your bot's username (no @)
   - `attributionSharedSecret` → matches Script Property
   - `productTier`, `productAmount`, `productCurrency` → your product details
   - `paymentProcessor` → the processor you use

3. **Configure your payment processor's redirect URL:**
   - Free product → `https://your-domain.com/index.html`
   - Paid product → `https://your-domain.com/index-paid.html`

4. **Test the flow** — visit `/index-paid.html?email=test@example.com&fullname=Test` and confirm:
   - Console shows `[attribution] Ready. Token: XXXXXXXX...`
   - Check `PurchaseRedirects` sheet for the test row
   - Tap Telegram link → bot auto-approves

---

## 🎯 Phase 2 — Optional: Configure Tiers

**Skip this section if you sell a single product.**

### When to configure tiers

Configure tiers if you:
- Sell **multiple products** at different price points
- Want different lessons/bonuses for different buyers
- Want automatic access control (tier3 buyers see more than tier1 buyers)

### Step 2.1 — Decide your access model

**Cumulative** (recommended):
- A tier2 buyer sees tier1 + tier2 content
- A tier3 buyer sees tier1 + tier2 + tier3 content
- Natural upgrade path — buyers unlock more as they pay more

**Siloed:**
- A tier2 buyer sees ONLY tier2 content
- A tier3 buyer sees ONLY tier3 content
- Use when each tier is a distinct, independent product

### Step 2.2 — Add `TIER_CONFIG_JSON` Script Property

1. Apps Script → Project Settings → Script Properties → Add property
2. Key: `TIER_CONFIG_JSON`
3. Value: your JSON config (one line, no formatting)

**Example for 3 cumulative tiers:**
```json
{"accessModel":"cumulative","tiers":[{"id":"tier1","name":"Starter","rank":1},{"id":"tier2","name":"Pro","rank":2},{"id":"tier3","name":"Premium","rank":3}]}
