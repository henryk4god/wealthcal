🎉 Phase 2 Message 2 Confirmed — Tier Filtering Works

You ran the tests, confirmed the tier filtering, and now Message 3 ships.

---

📦 Phase 2 — Message 3: Config Template + Buyer Docs

What this message delivers:

· Complete config.js template with tier config documentation
· Complete buyer setup guide (markdown) covering tier configuration
· Migration checklist for existing buyers
· Release notes update

What this message does NOT touch:

· Zero code changes to Apps Script
· Zero changes to script.js, index.html, index-paid.html
· No regression changes (still 30/30)
· No new tests

This is a pure documentation drop. Ship it alongside the code — no deployment or testing needed.

---

📄 Deliverable 1 — Updated config.js template

Replace your config.js with this final version. It includes everything from previous phases plus detailed tier config documentation. The actual functional keys are identical to what you already have — this version just adds explanatory comments so buyers can understand how to set up tiers.

```javascript
/**
 * config.js — Landing Page Configuration (TIER 3 + SaaS)
 * ========================================================
 *
 * BUYER: EDIT ONLY THIS FILE.
 * Do NOT edit script.js or index.html / index-paid.html.
 *
 * QUICK START:
 *   1. Fill in Sections 1-7 (required for auto-approve)
 *   2. Section 8-10 are optional (payment processor, tier names, thank-you page)
 *   3. Tier config (Section 11) is OPTIONAL — skip if single-product
 */

window.CLASSROOM_CONFIG = {

  // ═════════════════════════════════════════════
  // 1. ATTRIBUTION ENDPOINT (Required)
  // ═════════════════════════════════════════════
  // Get from: Apps Script → Deploy → Manage deployments → /exec URL
  attributionEndpoint: "https://script.google.com/macros/s/AKfycbwkQwGH_7TRVJ3XOwnV6e-byIinQLlSp1ZmL4WliID0AWMHg4v7uK9YJL7PxS4QmIcHTA/exec",

  // ═════════════════════════════════════════════
  // 2. TELEGRAM BOT HANDLE (Required)
  // ═════════════════════════════════════════════
  // Bot username from @BotFather, WITHOUT the @ symbol
  telegramBotHandle: "CRTtiers3bot",

  // ═════════════════════════════════════════════
  // 3. META PIXEL ID (Required for Meta ads)
  // ═════════════════════════════════════════════
  // From Meta Events Manager. Leave "" if not running Meta ads.
  metaPixelId: "1517538563417489",

  // ═════════════════════════════════════════════
  // 4. SHARED SECRET (Required — must match Apps Script)
  // ═════════════════════════════════════════════
  // Must EXACTLY match ATTRIBUTION_SHARED_SECRET in Apps Script
  // Project Settings → Script Properties
  attributionSharedSecret: "VVoR^A,6Q#UGZ2>TO|$cxq9P.)+fV?jy",

  // ═════════════════════════════════════════════
  // 5. WHATSAPP SUPPORT (Optional)
  // ═════════════════════════════════════════════
  // International format, no + or spaces. Leave "" to hide.
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // ═════════════════════════════════════════════
  // 6. BRAND NAME
  // ═════════════════════════════════════════════
  brandName: "Classroom Funnel Pro",

  // ═════════════════════════════════════════════
  // 7. PRODUCT CONFIG (Required for auto-approve)
  // ═════════════════════════════════════════════
  productTier: "tier3",         // tier1 / tier2 / tier3 (or your custom ID)
  productAmount: 0,             // ⚠️ SET TO REAL PRICE (e.g. 1090)
  productCurrency: "NGN",       // ⚠️ SET TO REAL CURRENCY (NGN / USD / EUR / GBP)
  isFreeProduct: false,         // true for free products, false for paid
  fireLeadEvent: false,         // See matrix below
  firePurchaseEvent: false,     // See matrix below

  // EVENT-FIRING MATRIX:
  //   Free product + Selar CAPI:  fireLeadEvent=false, firePurchaseEvent=false
  //   Free product + no CAPI:     fireLeadEvent=true,  firePurchaseEvent=false
  //   Paid product + Selar CAPI:  fireLeadEvent=false, firePurchaseEvent=false
  //   Paid product + no CAPI:     fireLeadEvent=false, firePurchaseEvent=true

  // ═════════════════════════════════════════════
  // 8. PAYMENT PROCESSOR (Phase 1)
  // ═════════════════════════════════════════════
  // Which processor sells this product?
  //
  //   ✅ Supported today: selar, gumroad, lemonsqueezy, payhip, auto
  //   ⚠️ Coming Phase 1.5: paystack, flutterwave, stripe, manual
  //      (these don't pass email in redirect — Phase 1.5 adds email form)
  //
  paymentProcessor: "selar",

  // Legacy alias (kept for backward compatibility)
  productSource: "Selar",

  // ═════════════════════════════════════════════
  // 9. TIER DISPLAY NAMES (Optional)
  // ═════════════════════════════════════════════
  // Maps tier IDs to friendly display names.
  // If not set, "tier1" → "Tier 1".
  tierDisplayNames: {
    // "tier1": "Starter",
    // "tier2": "Pro",
    // "tier3": "Premium"
  },

  // ═════════════════════════════════════════════
  // 10. PAID THANK-YOU PAGE (Phase 1)
  // ═════════════════════════════════════════════
  // All fields optional. Defaults shown below.
  // Supported placeholders: {{tierName}}, {{brandName}}
  thankYouPage: {
    headline: "Thank You For Your Purchase!",
    subheadline: "You now have access to {{tierName}}.",
    bodyCopy: "Open Telegram to start learning immediately.",
    ctaText: "👉 Open Your Classroom",
    showWhatsapp: true,
    showCrossSell: false,
    crossSellCopy: "Explore our other plans.",
    crossSellCta: "See All Plans",
    crossSellUrl: ""
  },

  // ═════════════════════════════════════════════
  // 11. TIER CONFIGURATION (Phase 2 — Optional)
  // ═════════════════════════════════════════════
  // ⚠️ IMPORTANT: This block is DOCUMENTATION ONLY.
  // The actual tier config lives in Apps Script Script Properties,
  // NOT in this file (the bot reads it server-side).
  //
  // To configure tiers:
  //   1. Open Apps Script → Project Settings → Script Properties
  //   2. Add new property:
  //        Key:   TIER_CONFIG_JSON
  //        Value: <JSON string from below>
  //
  // EXISTING CONFIG (for reference, don't edit here):
  //   See TIER_CONFIG_JSON in Apps Script Script Properties
  //
  // For single-product buyers: leave TIER_CONFIG_JSON unset.
  // The default single-tier config kicks in automatically.
  //
  // For multi-tier buyers, see the buyer setup guide for examples.
};

// ═════════════════════════════════════════════
// REFERENCE: TIER_CONFIG_JSON EXAMPLES
// ═════════════════════════════════════════════
//
// Copy one of these JSON strings into Script Properties:
//
// EXAMPLE 1 — 3-tier cumulative (recommended for most buyers):
// {"accessModel":"cumulative","tiers":[
//   {"id":"tier1","name":"Starter","rank":1,"description":"Entry level","color":"#64748b"},
//   {"id":"tier2","name":"Pro","rank":2,"description":"Intermediate","color":"#3b82f6"},
//   {"id":"tier3","name":"Premium","rank":3,"description":"Everything unlocked","color":"#8b5cf6"}
// ]}
//
// EXAMPLE 2 — 3-tier siloed:
// {"accessModel":"siloed","tiers":[
//   {"id":"starter","name":"Starter","rank":1},
//   {"id":"pro","name":"Pro","rank":2},
//   {"id":"premium","name":"Premium","rank":3}
// ]}
//
// EXAMPLE 3 — Single tier (equivalent to leaving unset):
// {"accessModel":"cumulative","tiers":[
//   {"id":"default","name":"Full Access","rank":1}
// ]}
//
// EXAMPLE 4 — 2-tier basic/pro:
// {"accessModel":"cumulative","tiers":[
//   {"id":"basic","name":"Basic","rank":1},
//   {"id":"pro","name":"Pro","rank":2}
// ]}
```

---

📄 Deliverable 2 — Buyer Setup Guide (markdown)

Save as SETUP_GUIDE.md in your buyer documentation (or add to your docs site / Notion / PDF).

```markdown
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
```

Example for 2 siloed tiers:

```json
{"accessModel":"siloed","tiers":[{"id":"basic","name":"Basic","rank":1},{"id":"pro","name":"Pro","rank":2}]}
```

Buyers with no tiers: Leave TIER_CONFIG_JSON unset — single-tier default kicks in.

Step 2.3 — Tag your lessons

Open Lessons sheet. Fill in the Tier column for every lesson:

LessonID LessonTitle ... Tier
L001 Welcome Video ... all
L002 Starter Lesson 1 ... tier1
L003 Pro Lesson 1 ... tier2
L004 Premium Lesson 1 ... tier3
L005 Bonus Content ... tier2,tier3

Rules:

· all (or leave blank) → visible to everyone
· tier1 → only tier1 buyers
· tier2,tier3 → only tier2 and tier3 buyers (comma-separated)

Step 2.4 — Tag your bonuses

Same as lessons. Fill in Tier column in Bonuses sheet.

Step 2.5 — Test tier filtering

1. In Students sheet, find your own Telegram ID
2. Set CurrentTier to tier1
3. In Telegram bot, send My Lessons → you should see only all + tier1 lessons
4. Change CurrentTier to tier3 → you should now see everything (cumulative) or only tier3 (siloed)

---

🎁 Phase 3 — Optional: Customize the Thank-You Page

Edit config.js → thankYouPage block to change headlines, body copy, and CTAs.

Example:

```javascript
thankYouPage: {
  headline: "🎉 Welcome to Premium!",
  subheadline: "You've unlocked:",
  bodyCopy: "✅ All lessons\n✅ All bonuses\n✅ Lifetime access",
  ctaText: "👉 Start Learning Now",
  showWhatsapp: true,
  showCrossSell: false
}
```

Supports {{tierName}} and {{brandName}} placeholders.

---

✅ Pre-Launch Checklist

Before you announce to customers, verify:

Basic flow

☐ Free guide page loads (/index.html)
☐ Paid page loads (/index-paid.html)
☐ Console shows [attribution] Ready. Token: XXXXXXXX...
☐ PurchaseRedirects gets rows on test purchase
☐ Telegram link has ?start=facebook_guide_<32hex>
☐ Bot auto-approves in <5 seconds
☐ Students sheet shows Approved / Approved
☐ CurrentTier column populated (if tiers configured)

Tier filtering (if configured)

☐ All test lessons have Tier values
☐ All test bonuses have Tier values
☐ TIER_CONFIG_JSON is valid JSON (no trailing commas)
☐ Bot menu shows correct tier groups for each buyer tier
☐ Admin menu shows [T1], [T2], etc. labels

Meta Pixel (if running ads)

☐ metaPixelId matches your Meta Events Manager
☐ fireLeadEvent / firePurchaseEvent set correctly per matrix
☐ Test purchase fires exactly ONE Purchase event (no duplicates)
☐ Meta Events Manager shows the test events

---

🆘 Common Issues

"Attribution bridge disabled" in console

Cause: config.js doesn't have attributionEndpoint or telegramBotHandle set.
Fix: Check config.js — both keys must be non-empty strings.

Buyer pays but isn't auto-approved

Possible causes:

1. attributionSharedSecret doesn't match Script Property → fix both
2. Payment processor doesn't pass ?email= in redirect → check payment processor list
3. Bot auto-approve log shows error → check Apps Script Executions tab

Tier filtering doesn't work

Check:

1. TIER_CONFIG_JSON is valid JSON (paste into jsonlint.com to verify)
2. Lessons.Tier and Bonuses.Tier columns are filled
3. Students.CurrentTier is set for test user
4. Run runFullRegression() — should be 30/30 or higher

Auto-approve works but students see "not approved"

Cause: CurrentTier column not populated after approval.
Fix: Run approveStudentForTier_ manually or check that the patched version of the function is deployed (it writes to column F).

---

📊 Sheet Reference

Sheet Purpose Columns
Students One row per Telegram user ID, Name, Payment Status, Access Status, Notes, CurrentTier
Lessons Your course content LessonID, Module, LessonTitle, TelegramFileID, PlaybackURL, Status, Tier
Bonuses Your bonus content BonusID, Category, Title, Description, DeliveryType, TelegramFileID, ExternalURL, Status, Protection, SortOrder, Tier
Progress Lesson completion tracking Telegram ID, Lesson ID, Lesson Title, Status, Completed At
AccessCodes Manual access codes Code, Status, Used By, Used At, Created At, Batch ID
AccessCodeAudit Audit log for codes Timestamp, Action, Code, Telegram ID, Details
FunnelTracking Meta Lead events EventID, TelegramUserID, FirstName, Username, EventType, Source, Campaign, EventDate, Status, Response
AttributionBridge Attribution tokens Token, CreatedAt, ExpiresAt, EmailHash, FirstNameHash, FBP, FBC, UserAgent, Source, Campaign, Status, TelegramUserID, EventID
PurchaseTracking Purchase audit log Timestamp, TelegramUserID, AccessCode, Value, Currency, MetaStatus, MetaResponse, EventID
PurchaseRedirects Auto-approve queue Token, CreatedAt, EmailHash, ProductTier, Amount, Currency, Source, OrderID, Status, TelegramUserID

---

🎓 Full Flow (What Happens on a Purchase)

1. Buyer pays on Selar/Gumroad/your processor
2. Processor redirects buyer to /index-paid.html?email=xxx&fullname=yyy&order_id=zzz
3. script.js runs:
   · Reads email + fullname from URL
   · Hashes email (SHA-256)
   · Generates 32-hex token
   · POSTs save_attribution → row in AttributionBridge
   · POSTs save_purchase → row in PurchaseRedirects (Status: Pending)
   · Rewrites Telegram button → ?start=facebook_guide_<token>
4. Buyer taps Telegram button
5. Bot /start handler:
   · Registers buyer in Students (if new)
   · Parses token from start param
   · Looks up PurchaseRedirects by token
   · If found + Pending:
     · Updates PurchaseRedirects.Status → Linked
     · Updates PurchaseRedirects.TelegramUserID → buyer's ID
     · Calls approveStudentForTier_(buyerID, tier):
       · Students.Payment Status → Approved
       · Students.Access Status → Approved
       · Students.Notes → "Tier: tierX"
       · Students.CurrentTier → tierX
     · Sends "🎉 WELCOME! YOUR PURCHASE IS CONFIRMED" message
6. Buyer taps "Open My Lessons":
   · Bot reads CurrentTier
   · Calls getLessonsForStudent_(buyerID)
   · Filters lessons by tier
   · Renders menu grouped by tier
7. Buyer taps a lesson:
   · Bot verifies tier access
   · Sends video/content
   · (Optional) fires Meta CAPI events

Total elapsed time from payment to approved buyer: ~4 seconds.

---

🔒 Security Model

· Shared secret — CSRF gate for attribution endpoints (visible in browser, by design)
· Tokens — single-use (Status → Linked after first use)
· Tier IDs — server-enforced, not trusted from browser
· Webhook — Telegram-signed, bot token required
· Sheet access — restricted to your Google account only

Known limitations:

· attributionSharedSecret is visible in browser DevTools (inherent to client-side config)
· Worst case if secret leaks: spam rows in PurchaseRedirects (no data breach, no access breach)
· Rate limiting not implemented — spam cleanup is manual

---

📞 Support

Email: [your support email]
Docs: [your docs URL]
Community: [your Telegram support group]

---

You're ready to launch! 🚀

```

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
```

---

📄 Deliverable 4 — Updated release notes for existing customers

Append to your previous Fix #16b release notes:

```markdown
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
```

---

🎁 What Phase 2 Message 3 delivers

Deliverable Purpose
config.js — final template with all sections documented Complete buyer reference, no ambiguity
SETUP_GUIDE.md End-to-end buyer onboarding (~2 hours of their time)
UPGRADE_CHECKLIST.md Migration guide for existing customers
Release notes update Customer communication about Phase 2

Zero code changes. Zero regression impact. Pure docs — but these docs are what make your SaaS sellable. Buyers can now self-onboard without you answering 100 questions.

---

📊 Phase 2 — Complete

Message Deliverable Status
Message 1 Schema + migration + tests 26-31 ✅ 30/30
Message 2 Tier filtering, menus, admin labels ✅ Confirmed working
Message 3 Config template + buyer docs ✅ This message

Phase 2 fully shipped. Your SaaS now supports:

· ✅ Single-product buyers (no config needed)
· ✅ Multi-tier buyers (config-driven)
· ✅ Both cumulative and siloed access models
· ✅ Comma-separated multi-tier lessons
· ✅ Admin QA view with tier labels
· ✅ Self-service buyer onboarding

---

🚦 Project status — all phases

Phase Item Status
Fix #16b Auto-approve paid buyers ✅ Shipped
Fix #18 PurchaseTracking cleanup ✅ Shipped
Phase 1 Paid thank-you page ✅ Shipped
Phase 2 Tier system ✅ Shipped
Phase 3 Fix #19 (upgrade tracking) ⏸️ Deferred — no customer request yet
Phase 4 Fix #20 (rate limiting) ⏸️ Deferred — low priority

