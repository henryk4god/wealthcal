# 🎓 Telegram Classroom — [TIER NAME]

Welcome! You now own a serverless Telegram course platform.
No servers. No monthly hosting. Runs on Google's free infrastructure.

---

## What's Included

[TIER 1 — STARTER]
- Telegram bot that delivers protected video lessons
- Single-use access codes (sellable student access)
- Student database with approval workflow
- **Files:** 4 Google Apps Script files

[TIER 2 — PROFESSIONAL]
- Everything in Starter
- Progress tracking per student + class-wide report
- Bonuses library (PDFs, videos, external links)
- Broadcast engine (safe for 500+ students, rate-limit protected)
- **Files:** 5 Google Apps Script files

[TIER 3 — FUNNEL PRO]
- Everything in Professional
- Meta CAPI attribution (Facebook ads → Telegram conversion tracking)
- Attribution bridge (website → Telegram lead capture)
- Landing page template with config.js
- **Files:** 6 Google Apps Script files + 4 landing page files

---

## ⏱️ Setup Time: ~10 Minutes

### Step 1: Create your Google Sheet (1 min)

1. Go to [sheets.new](https://sheets.new)
2. Name it "My Classroom Database"
3. Copy the **Spreadsheet ID** from the URL (the long random string between `/d/` and `/edit`)

### Step 2: Create your Apps Script project (2 min)

1. Go to [script.new](https://script.new)
2. Delete the default `Code.gs` contents
3. Create these files (one at a time) and paste the matching code:
   - `codeupdatedworking3.gs`
   - `Config.gs`
   - `Setup.gs`
   - `AccessCodeGenerator.gs`
   - `BroadcastEngine.gs` (Tier 2 and 3 only)
   - `MetaAttribution.gs` (Tier 3 only)
4. Save (Ctrl+S)

### Step 3: Set 4 mandatory properties (1 min)

In Apps Script: **Project Settings** (gear icon) → **Script Properties** → Add:

| Key | Value |
|-----|-------|
| `BOT_TOKEN` | your token from @BotFather |
| `SPREADSHEET_ID` | from Step 1 |
| `ADMIN_ID` | your Telegram numeric ID (from @userinfobot) |
| `WEB_APP_URL` | leave blank for now (Step 4) |

### Step 4: Deploy the Web App (2 min)

1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Description: "Classroom v1.0"
4. **Execute as:** Me
5. **Who has access:** Anyone
6. Click **Deploy**, authorize permissions
7. **Copy the `/exec` URL**
8. Go back to **Script Properties** → paste URL into `WEB_APP_URL`

### Step 5: Run the Boot URL (2 min)

Open your browser to:

https://your-github-page?fullname={name}&email={email}


Facebook will automatically append `&fbclid=` when the click comes from an ad.

That's it. **The full funnel now works:**
Ad → Landing Page → Apps Script → Telegram → Meta CAPI Lead event

---

## 🆘 Troubleshooting

### Bot doesn't respond to `/start`
1. Open `[YOUR_URL]?action=boot` in a browser
2. Check that "Webhook registered" appears
3. If not, run `setWebhook()` from the Apps Script editor manually

### "Bad Request: chat not found"
- The student's Telegram ID is wrong in the sheet
- Or the student hasn't started the bot yet

### Broadcasts get stuck
- Telegram rate limit kicked in (normal for 30+/minute)
- The system pauses automatically
- Click **Continue Broadcast** after 60 seconds

### Meta CAPI shows errors
- Verify `META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN` in Script Properties
- Check that `META_TEST_EVENT_CODE` is empty (it's only for testing)
- Look at the diagnostic message the bot sends you after each Lead

---

## 📞 2348033867642 Support

For setup help, contact [henryk4god@gmail.com].

---

## 📜 License

[Your license terms]



