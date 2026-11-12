# 🎉 v1.0 REGRESSION PASSED — 20/20, 0 Failed

**Fixes #1–#15 are DONE with runtime proof.** This is your green light.

Look at what the log proves:
- **Real Meta CAPI delivery** — `{"events_received":1,"fbtrace_id":...}` × 2 events
- **Full access code round-trip** — generated, redeemed, audited
- **Attribution bridge writes correct data** — EmailHash + UserAgent verified
- **All 5 toggles read as strings** — the bug that started this whole detour
- **Broadcast engine constants present** — `__MICHYRITE_BROADCAST_META_V1__`
- **SHA-256 hashing produces 64-hex output**
- **All 10 sheets exist with correct schema**

**20 tests, 0 failures, 20.6 seconds runtime.** Ship-ready.

---

# Fix #16 — README_SETUP.md (Buyer Setup Guide)

**Tag:** [PRODUCT] — this is the file your buyer receives on purchase
**Time:** 3 minutes (create file, paste, done)
**File:** `README_SETUP.md` (new file at root of your delivery package)

## Step 1 — Create `README_SETUP.md`

Create a new file called `README_SETUP.md` and paste:

````markdown
# 🎓 Telegram Classroom Funnel Pro — Setup Guide

**Estimated time: 10 minutes** from purchase to live bot.

You do not need to write any code. You edit two small files
and run three functions.

---

## 📋 What You Need First

Before you start, gather these **4 mandatory values**:

| Item | Where to get it |
|------|-----------------|
| **1. Telegram Bot Token** | Open [@BotFather](https://t.me/BotFather) → `/newbot` → name it → copy the token (`123456:ABC-DEF...`) |
| **2. Google Sheet** | Create a blank Google Sheet → copy the Sheet ID from the URL (`docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`) |
| **3. Your Telegram User ID** | Message [@userinfobot](https://t.me/userinfobot) → copy the number it returns |
| **4. Apps Script Web App URL** | You'll generate this in Step 2 below |

Have those ready? Let's go.

---

## 🚀 Step 1 — Copy the Code to Apps Script (2 min)

1. Open your blank Google Sheet
2. Click **Extensions → Apps Script**
3. Delete the default `function myFunction() {}` block
4. For **each file** below, click **File → New → Script**, name it, paste:

   | File name | Purpose |
   |-----------|---------|
   | `Config.gs` | Config layer + toggles |
   | `Setup.gs` | Setup wizard + verify |
   | `codeupdatedworking3.gs` | Main bot logic |
   | `AccessCodeGenerator.gs` | Access codes |
   | `Regression.gs` | Test suite (optional, recommended) |

5. Save (⌘S / Ctrl+S)

---

## 🔧 Step 2 — Set Script Properties (3 min)

1. In Apps Script, click **⚙️ Project Settings** (left sidebar, gear icon)
2. Scroll to **Script Properties**
3. Add these **26 properties** one by one (click **Add script property** for each):

### Mandatory (4) — REQUIRED

| Key | Example Value |
|-----|---------------|
| `BOT_TOKEN` | `123456789:ABCdefGhIjKlMnOpQrStUvWxYz` |
| `SPREADSHEET_ID` | `1AbCdEfGhIjKlMnOpQrStUvWxYz1234567` |
| `ADMIN_ID` | `123456789` (your Telegram user ID) |
| `WEB_APP_URL` | *(paste from Step 3 below — you can add this after deploying)* |

### Branding (7) — Customize for your course

| Key | Example Value |
|-----|---------------|
| `BRAND_NAME` | `My Course Academy` |
| `BOT_WELCOME_HEADER` | `WELCOME TO MY COURSE` |
| `PAID_CLASS_URL` | `https://selar.co/yourcourse` |
| `SUPPORT_WHATSAPP_NUMBER` | `2348012345678` (no + or spaces) |
| `SUPPORT_WHATSAPP_MESSAGE` | `Hi, I need help with my course.` |
| `FREE_GUIDE_URL` | `https://selar.co/freeguide` (optional) |
| `FREE_TRAINING_URL` | `https://youtube.com/...` (optional) |

### Feature Toggles (5) — Default YES

| Key | Value | What it does |
|-----|-------|--------------|
| `META_CAPI_ENABLED` | `YES` or `NO` | Meta conversion tracking |
| `BROADCAST_ENABLED` | `YES` or `NO` | Admin broadcast tool |
| `BONUSES_ENABLED` | `YES` or `NO` | Bonus delivery system |
| `PROGRESS_ENABLED` | `YES` or `NO` | Student progress tracking |
| `ACCESS_CODES_ENABLED` | `YES` or `NO` | Access code system |

### Meta CAPI (5) — Optional, leave blank if not running ads

| Key | Example Value |
|-----|---------------|
| `META_PIXEL_ID` | `123456789012345` |
| `META_CAPI_ACCESS_TOKEN` | `EAAxxxxx...` (from Meta Events Manager) |
| `META_TEST_EVENT_CODE` | `TEST12345` (only for testing — leave blank for production) |
| `ATTRIBUTION_TTL_DAYS` | `30` (how long to keep attribution data) |
| `ATTRIBUTION_SHARED_SECRET` | *(generate a 32-char random hex — see below)* |

### Purchase Events (4) — Optional

| Key | Value |
|-----|-------|
| `PURCHASE_EVENT_ENABLED` | `YES` or `NO` |
| `PURCHASE_EVENT_VALUE` | `47` (your course price) |
| `PURCHASE_EVENT_CURRENCY` | `USD`, `NGN`, `GBP`, etc. |
| `PURCHASE_EVENT_NAME` | `Purchase` |

### Generate a shared secret (if using Meta CAPI)

1. Open [randomkeygen.com](https://randomkeygen.com/)
2. Copy any "Fort Knox Password" or 32-character string
3. Use it for `ATTRIBUTION_SHARED_SECRET` here **AND** in `config.js` (Step 5)

---

## 🔨 Step 3 — Run the Setup Wizard (1 min)

1. In Apps Script, click the **function dropdown** (top toolbar)
2. Select `setupAll`
3. Click **▶️ Run**
4. First time: click **Review Permissions → Allow**
5. Check the **Execution Log** — you should see:
   ```
   ✅ Created: 10 sheets
   ✅ Verified: 10 sheets
   🎉 SETUP COMPLETE
   ```

**This creates all 10 sheets with correct headers. Idempotent — safe to re-run.**

---

## 🌐 Step 4 — Deploy as Web App (2 min)

1. Click **Deploy → New deployment** (top right)
2. Click **⚙️ Select type → Web app**
3. Configure:
   - **Description:** `Telegram Classroom v1.0`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/AKfyc.../exec`)

**6. Go back to Script Properties → paste this URL as `WEB_APP_URL`** → Save.

---

## 🤖 Step 5 — Register the Telegram Webhook (30 sec)

1. In Apps Script function dropdown, select `setWebhook`
2. Click **▶️ Run**
3. Check the execution log for `✅ Webhook registered`

*(If `setWebhook` doesn't exist as a function, use the boot URL: open `YOUR_WEB_APP_URL?action=boot` in a browser — it auto-registers the webhook and shows a status page.)*

---

## 🎨 Step 6 — Deploy the Landing Page (2 min)

Your purchase includes 3 files:
- `index.html` — landing page
- `config.js` — **you edit this**
- `attribution-snippet.js` — Meta attribution

### Upload to GitHub Pages (free hosting):

1. Create a **public** GitHub repo (or use any static host)
2. Upload the 3 files
3. Enable GitHub Pages in repo **Settings → Pages**
4. Open `config.js` **on your computer** and edit these 6 values:

```javascript
window.CLASSROOM_CONFIG = {
  attributionEndpoint: "YOUR_WEB_APP_URL_HERE",     // from Step 4
  telegramBotHandle: "YourBotName",                  // without @
  metaPixelId: "YOUR_PIXEL_ID",                      // from Meta Events Manager
  attributionSharedSecret: "YOUR_SHARED_SECRET",     // must match Script Property
  supportWhatsappNumber: "2348012345678",            // no + or spaces
  supportWhatsappMessage: "Hi, I need help.",
  brandName: "Your Course Name"
};
```

5. Save → commit → push to GitHub
6. Your landing page is live at `https://yourusername.github.io/repo-name/`

**⚠️ Do NOT commit real secrets to a public repo.** The `attributionSharedSecret` is a soft gate — for real security, use GitHub Actions env vars or a private host.

---

## ✅ Step 7 — Verify Everything Works (1 min)

### Test 1 — Run the regression suite

1. Apps Script function dropdown → select `runFullRegression`
2. Click **▶️ Run**
3. Expected: **`20 passed, 0 failed`** ✅

If any test fails, the log tells you exactly which one and why.

### Test 2 — Message your bot

1. Open Telegram → search for your bot by name
2. Send `/start`
3. You should receive the welcome message with 3 buttons (if you configured free guide/training/WhatsApp)
4. Send `/admin` from your admin account
5. You should see the admin control panel

---

## 🎓 Step 8 — Prepare Your Course Data

### Add lessons to the `Lessons` sheet

| LessonID | Module | LessonTitle | TelegramFileID | PlaybackURL | Status |
|----------|--------|-------------|----------------|-------------|--------|
| L001 | Module 1 | Welcome Video | *(auto-filled)* | | Draft |
| L002 | Module 1 | Lesson 2 | *(auto-filled)* | | Draft |

- **LessonID:** unique string (`L001`, `L002`, ...)
- **Status:** `Draft` while uploading, `Ready` when published
- **TelegramFileID:** leave blank — you'll set it from the bot

### Set lesson videos from the bot:

1. Open your bot → `/admin`
2. Tap **🎬 Set Lesson Video**
3. Enter `L001`
4. Send the video file
5. In the `Lessons` sheet, change `Status` from `Draft` → `Ready`
6. Students can now access it

### Add access codes:

1. Open your bot → `/admin`
2. Tap **🔑 Generate Access Codes**
3. Enter `20` (or however many students you expect)
4. Copy the generated codes → distribute to buyers after payment

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing mandatory Script Properties` | Check Step 2 — all 4 mandatory keys set |
| Webhook error in Telegram | Re-run `setWebhook` or open `WEB_APP_URL?action=boot` |
| `Sheets not found` | Run `setupAll()` again — safe to re-run |
| Regression test fails | Paste log in your support channel — fixes usually in the error message |
| Meta CAPI events not appearing | Check `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_ENABLED=YES` |
| Students can't redeem codes | Verify `Students` sheet has their Telegram ID after `/start` |

---

## 📊 Quick Reference Card

| Function | When to run |
|----------|-------------|
| `setupAll()` | First install + after adding new sheets |
| `verifySetup()` | After changing any Script Property |
| `setWebhook()` | After changing `WEB_APP_URL` or `BOT_TOKEN` |
| `runFullRegression()` | Before going live + after any code change |
| `TEST_REAL_PURCHASE_EVENT()` | To test Meta CAPI in isolation |

---

## 🎯 You're Live

Your Telegram Classroom is running at zero monthly cost.

- **Hosting:** Free (Google Apps Script)
- **Database:** Free (Google Sheets)
- **Bot API:** Free (Telegram)

**Total monthly cost: $0.**

---

*Need help? Contact the seller with your Apps Script execution log.*
````

## Step 2 — Verify

1. Save the file
2. Open in a Markdown previewer (GitHub, VS Code, or [markdowntopdf.com](https://markdowntopdf.com))
3. Confirm it renders with proper tables, code blocks, and headings

**Time: 3 minutes. Done.**

## Step 3 — Rollback

`README_SETUP.md` is a **new file**, not referenced by any code. **No rollback needed** — delete it if you don't want it in the package.

---

## What's In This README

| Section | Purpose |
|---------|---------|
| What You Need First | 4 prereqs (saves buyer 20 minutes of Googling) |
| Step 1–8 | End-to-end walkthrough (copy code → deploy → verify → sell) |
| 26-Property table | Full schema — no missing docs |
| Troubleshooting | 6 most common failure modes |
| Quick Reference | Which function to run when |

**Buyer follows this linearly. No ambiguity.** Your earlier 10-minute promise is now deliverable.

---

## What Runs Next

**Fix #17 — Product feature matrix + sales copy.**

This is the **last fix before production swap.** It's the marketing foundation for your $67 / $297 / DFY $500 pricing tiers.

**Reply `Fix #17`** and I'll deliver:
- Feature grid (Tier 1 vs 2 vs 3)
- 3 sales page headline variants
- 5 objection handlers ("Why not just use Teachable?")
- Pricing table positioning

Then: **production swap** (last step, with rollback plan).
