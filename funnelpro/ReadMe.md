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

Example for 2 siloed tiers:

json
{"accessModel":"siloed","tiers":[{"id":"basic","name":"Basic","rank":1},{"id":"pro","name":"Pro","rank":2}]}


Buyers with no tiers: Leave TIER_CONFIG_JSON unset — single-tier default kicks in.

Step 2.3 — Tag your lessons
Open Lessons sheet. Fill in the Tier column for every lesson:

LessonID	LessonTitle	...	Tier
L001	Welcome Video	...	all
L002	Starter Lesson 1	...	tier1
L003	Pro Lesson 1	...	tier2
L004	Premium Lesson 1	...	tier3
L005	Bonus Content	...	tier2,tier3
Rules:

all (or leave blank) → visible to everyone

tier1 → only tier1 buyers

tier2,tier3 → only tier2 and tier3 buyers (comma-separated)

Step 2.4 — Tag your bonuses
Same as lessons. Fill in Tier column in Bonuses sheet.

Step 2.5 — Test tier filtering
In Students sheet, find your own Telegram ID

Set CurrentTier to tier1

In Telegram bot, send My Lessons → you should see only all + tier1 lessons

Change CurrentTier to tier3 → you should now see everything (cumulative) or only tier3 (siloed)

🎁 Phase 3 — Optional: Customize the Thank-You Page
Edit config.js → thankYouPage block to change headlines, body copy, and CTAs.

Example:

javascript
thankYouPage: {
  headline: "🎉 Welcome to Premium!",
  subheadline: "You've unlocked:",
  bodyCopy: "✅ All lessons\n✅ All bonuses\n✅ Lifetime access",
  ctaText: "👉 Start Learning Now",
  showWhatsapp: true,
  showCrossSell: false
}
Supports {{tierName}} and {{brandName}} placeholders.

✅ Pre-Launch Checklist
Before you announce to customers, verify:

Basic flow
□ Free guide page loads (/index.html)
□ Paid page loads (/index-paid.html)
□ Console shows [attribution] Ready. Token: XXXXXXXX...
□ PurchaseRedirects gets rows on test purchase
□ Telegram link has ?start=facebook_guide_<32hex>
□ Bot auto-approves in <5 seconds
□ Students sheet shows Approved / Approved
□ CurrentTier column populated (if tiers configured)
Tier filtering (if configured)
□ All test lessons have Tier values
□ All test bonuses have Tier values
□ TIER_CONFIG_JSON is valid JSON (no trailing commas)
□ Bot menu shows correct tier groups for each buyer tier
□ Admin menu shows [T1], [T2], etc. labels
Meta Pixel (if running ads)
□ metaPixelId matches your Meta Events Manager
□ fireLeadEvent / firePurchaseEvent set correctly per matrix
□ Test purchase fires exactly ONE Purchase event (no duplicates)
□ Meta Events Manager shows the test events
🆘 Common Issues
"Attribution bridge disabled" in console
Cause: config.js doesn't have attributionEndpoint or telegramBotHandle set.
Fix: Check config.js — both keys must be non-empty strings.

Buyer pays but isn't auto-approved
Possible causes:

attributionSharedSecret doesn't match Script Property → fix both

Payment processor doesn't pass ?email= in redirect → check payment processor list

Bot auto-approve log shows error → check Apps Script Executions tab

Tier filtering doesn't work
Check:

TIER_CONFIG_JSON is valid JSON (paste into jsonlint.com to verify)

Lessons.Tier and Bonuses.Tier columns are filled

Students.CurrentTier is set for test user

Run runFullRegression() — should be 30/30 or higher

Auto-approve works but students see "not approved"
Cause: CurrentTier column not populated after approval.
Fix: Run approveStudentForTier_ manually or check that the patched version of the function is deployed (it writes to column F).

📊 Sheet Reference
Sheet	Purpose	Columns
Students	One row per Telegram user	ID, Name, Payment Status, Access Status, Notes, CurrentTier
Lessons	Your course content	LessonID, Module, LessonTitle, TelegramFileID, PlaybackURL, Status, Tier
Bonuses	Your bonus content	BonusID, Category, Title, Description, DeliveryType, TelegramFileID, ExternalURL, Status, Protection, SortOrder, Tier
Progress	Lesson completion tracking	Telegram ID, Lesson ID, Lesson Title, Status, Completed At
AccessCodes	Manual access codes	Code, Status, Used By, Used At, Created At, Batch ID
AccessCodeAudit	Audit log for codes	Timestamp, Action, Code, Telegram ID, Details
FunnelTracking	Meta Lead events	EventID, TelegramUserID, FirstName, Username, EventType, Source, Campaign, EventDate, Status, Response
AttributionBridge	Attribution tokens	Token, CreatedAt, ExpiresAt, EmailHash, FirstNameHash, FBP, FBC, UserAgent, Source, Campaign, Status, TelegramUserID, EventID
PurchaseTracking	Purchase audit log	Timestamp, TelegramUserID, AccessCode, Value, Currency, MetaStatus, MetaResponse, EventID
PurchaseRedirects	Auto-approve queue	Token, CreatedAt, EmailHash, ProductTier, Amount, Currency, Source, OrderID, Status, TelegramUserID
🎓 Full Flow (What Happens on a Purchase)
Buyer pays on Selar/Gumroad/your processor

Processor redirects buyer to /index-paid.html?email=xxx&fullname=yyy&order_id=zzz

script.js runs:

Reads email + fullname from URL

Hashes email (SHA-256)

Generates 32-hex token

POSTs save_attribution → row in AttributionBridge

POSTs save_purchase → row in PurchaseRedirects (Status: Pending)

Rewrites Telegram button → ?start=facebook_guide_<token>

Buyer taps Telegram button

Bot /start handler:

Registers buyer in Students (if new)

Parses token from start param

Looks up PurchaseRedirects by token

If found + Pending:

Updates PurchaseRedirects.Status → Linked

Updates PurchaseRedirects.TelegramUserID → buyer's ID

Calls approveStudentForTier_(buyerID, tier):

Students.Payment Status → Approved

Students.Access Status → Approved

Students.Notes → "Tier: tierX"

Students.CurrentTier → tierX

Sends "🎉 WELCOME! YOUR PURCHASE IS CONFIRMED" message

Buyer taps "Open My Lessons":

Bot reads CurrentTier

Calls getLessonsForStudent_(buyerID)

Filters lessons by tier

Renders menu grouped by tier

Buyer taps a lesson:

Bot verifies tier access

Sends video/content

(Optional) fires Meta CAPI events

Total elapsed time from payment to approved buyer: ~4 seconds.

🔒 Security Model
Shared secret — CSRF gate for attribution endpoints (visible in browser, by design)

Tokens — single-use (Status → Linked after first use)

Tier IDs — server-enforced, not trusted from browser

Webhook — Telegram-signed, bot token required

Sheet access — restricted to your Google account only

Known limitations:

attributionSharedSecret is visible in browser DevTools (inherent to client-side config)

Worst case if secret leaks: spam rows in PurchaseRedirects (no data breach, no access breach)

Rate limiting not implemented — spam cleanup is manual

📞 Support
Email: [your support email]
Docs: [your docs URL]
Community: [your Telegram support group]

You're ready to launch! 🚀

text

---

## 📄 Deliverable 3 — Migration Checklist (for existing buyers)

Save this as `UPGRADE_CHECKLIST.md` if you have existing customers on a previous version.

```markdown
# Upgrading from Pre-Phase-2 to Phase 2

If you launched BEFORE Phase 2 (tier system) shipped, follow this checklist.

---

## 🛡️ Before You Start

**Backup your spreadsheet!**
- Open your Google Sheet
- File → Make a copy → name it "Backup_Before_Phase2_<date>"
- If anything goes wrong, restore from this backup

---

## Step 1 — Update Apps Script code

1. Add **`TierAccess.gs`** (new file)
2. Update **`PurchaseAutoApprove.gs`** (`approveStudentForTier_` writes `CurrentTier`)
3. Update **`codeupdatedworking3.gs`** (`showMenu`, `showBonusMenu_`, `handleCallback`, `handleMessage` callers)
4. Update **`Setup.gs`** (add Tier to Lessons/Bonuses schemas, CurrentTier to Students)
5. Update **`Regression.gs`** (add tests 26-31)

Or: replace all `.gs` files with the latest versions from your purchase.

---

## Step 2 — Run migration

1. Apps Script editor → select `PHASE2_INSPECT` → Run
   - Expect: `❌ needs migration` for Lessons/Bonuses/Students
2. Select `PHASE2_MIGRATE` → Run
   - Expect: `✅ MIGRATION COMPLETE`
   - Save the backup spreadsheet name (printed in log)
3. Select `PHASE2_VERIFY` → Run
   - Expect: `✅ PHASE 2 SCHEMA OK`

---

## Step 3 — Update Config

### 3a. `config.js` (browser side)
No changes needed if you already have `thankYouPage` from Phase 1. The `config.js` template gained Section 11 (documentation only, no functional change).

### 3b. Apps Script Script Properties

**Only if you want tier filtering:**
1. Apps Script → Project Settings → Script Properties
2. Add `TIER_CONFIG_JSON` with your tier config (see examples in config.js template)

**If you don't want tiers:** Skip this. Default single-tier kicks in automatically.

---

## Step 4 — Tag your content

### 4a. Lessons

Open `Lessons` sheet → fill in the new `Tier` column for every row:

- `all` → universal (visible to everyone)
- `tier1` → only tier1 buyers
- `tier2,tier3` → tier2 and tier3 buyers
- Blank → treated as `all`

### 4b. Bonuses

Same — fill in `Bonuses.Tier` column.

### 4c. Existing Students

If you have existing customers in `Students` sheet:
- Their `CurrentTier` column is empty after migration
- They fall back to `legacyStudentTier` config (default: `"all"` → full access)
- To restrict them later: manually set `CurrentTier` to the appropriate tier

---

## Step 5 — Run regression

1. Apps Script editor → `runFullRegression` → Run
2. Expect: `SUMMARY: 30 passed, 0 failed` (or higher if you added tests)

If <30/30 → paste the failing test output to support before proceeding.

---

## Step 6 — Test the flow

1. On your landing page, visit `/index-paid.html?email=test@example.com&fullname=Test&order_id=MIGRATION_TEST_001`
2. Check console → `[attribution] Ready. Token: XXXXXXXX...`
3. Check `PurchaseRedirects` sheet → new row with `OrderID = MIGRATION_TEST_001`
4. Tap Telegram link → bot auto-approves
5. Check `Students` sheet → `Approved / Approved`, `CurrentTier = <your tier>`
6. Send `My Lessons` → tier groups render correctly
7. **Clean up** the test rows

---

## Step 7 — Deploy

1. **Bump cache-busters** in `index.html` and `index-paid.html`:
   - `?v=2` → `?v=3` for `config.js`
   - `?v=8` → `?v=9` for `script.js`
2. Upload updated files to landing page host
3. **No Selar/payment processor changes needed** — redirect URLs unchanged

---

## 🆘 Rollback

If something goes wrong:

1. Restore from the backup spreadsheet (rename backup to live name, or restore tabs individually)
2. Delete `TierAccess.gs` from Apps Script
3. Revert `PurchaseAutoApprove.gs` → previous `approveStudentForTier_`
4. Revert `codeupdatedworking3.gs` → previous `showMenu`, `showBonusMenu_`, `handleCallback`
5. Delete `TIER_CONFIG_JSON` Script Property
6. Run regression → should be back to 24/24

**Rollback time: ~10 minutes.**

---

## ✅ Post-Upgrade Checklist

- [ ] Spreadsheet backed up
- [ ] `PHASE2_MIGRATE` completed
- [ ] `PHASE2_VERIFY` shows all green
- [ ] Regression 30/30
- [ ] Test purchase auto-approves
- [ ] Tier filtering works (if configured)
- [ ] Cache busters bumped
- [ ] Landing page redeployed

**Done! Your classroom now supports tiered access.**
📄 Deliverable 4 — Updated release notes for existing customers
Append to your previous Fix #16b release notes:

markdown
## Update — Phase 2 (Tier System)

**Release date:** [date of deploy]
**Migration required:** Yes — run `PHASE2_MIGRATE()`
**Downtime:** ~2 minutes

### What's new

**Multi-tier support** — sell multiple products at different price points, each with its own lessons and bonuses.

- Define tiers: Starter / Pro / Premium (or any custom structure)
- Tag lessons: `tier1`, `tier2,tier3`, or `all`
- Bot auto-filters content by buyer's tier
- Two access models: cumulative (higher includes lower) or siloed (each tier independent)

**Buyer experience:**
- Tier2 buyer sees Starter + Pro lessons (cumulative) or just Pro (siloed)
- Menu is grouped by tier with clear headers
- Tier access is enforced server-side — buyers can't bypass by crafting callbacks

**Admin experience:**
- Admin sees all lessons from all tiers
- Each item is labeled `[T1]`, `[T2]`, `[ALL]` for quick QA
- No accidental tier leaks

### What you need to do

1. **Backup spreadsheet** (File → Make a copy)
2. **Run `PHASE2_MIGRATE()`** in Apps Script
3. **Add `TIER_CONFIG_JSON`** to Script Properties (only if you want multiple tiers)
4. **Tag lessons and bonuses** with `Tier` values
5. **Run `runFullRegression()`** → expect 30/30
6. **Test** end-to-end with a fake purchase

**Existing students:** No action needed — they default to full access (`legacyStudentTier: "all"`). Restrict them manually if desired.

**Rollback:** Restore from backup spreadsheet + delete `TierAccess.gs` + revert function changes. 10 minutes.

### What didn't change

- ✅ All existing lessons/bonuses visible until you tag them
- ✅ Auto-approve flow unchanged (Fix #16b still works)
- ✅ Manual code redemption unchanged
- ✅ Meta CAPI attribution unchanged
- ✅ Single-product buyers see zero change

### Known limitations

- **AccessCodes have no tier** — manual code redemption → `CurrentTier = ""` → falls back to `legacyStudentTier`
- **No upgrade tracking yet** — Fix #19 (planned) adds CurrentTier history
- **No admin tier filter UI** — admin sees all labels, can't toggle "show only tier2"

All of these can be added in future updates without breaking changes.

