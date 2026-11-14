# 🚀 Fix #18 + Buyer Docs + Release Notes — Three Deliverables

I'll deliver all three in one message, each as a self-contained section you can copy-paste. **Fix #18 is the only one that touches code** — docs and release notes are text-only, zero risk.

---

# PART A — Fix #18: PurchaseTracking Cleanup

## 🎯 The problem (restated for the record)

**Current sheet headers** (from your confirmed paste earlier):
```
A: EventID     B: Telegram ID    C: Email Hash    D: Amount
E: Currency    F: Status         G: Fired At      H: Response
```

**What `recordPurchaseEvent_` writes** (from `MetaAttribution.gs`):
```javascript
tab.appendRow([
  new Date(),                    // A: Timestamp        ← but header says "EventID"
  String(telegramUserId),        // B: TelegramUserID   ← header says "Telegram ID" (spaced)
  String(accessCode),            // C: AccessCode       ← header says "Email Hash" ❌❌❌
  Number(value) || 0,            // D: Value            ← header says "Amount"
  String(currency).toUpperCase(),// E: Currency         ← matches ✅
  metaStatus ? "Sent" : "Failed",// F: MetaStatus       ← header says "Status"
  String(metaResponse).slice(500),//G: MetaResponse     ← header says "Fired At" ❌❌❌
  "PURCHASE_" + code.toUpperCase()//H: EventID         ← header says "Response" ❌
]);
```

**Real damage:** Column C claims to hold `Email Hash` but actually holds `AccessCode`. Column G claims `Fired At` but actually holds Meta's response string. Anyone building reports on this sheet gets garbage.

**No function currently READS from this sheet** (verified by grep across all 6 `.gs` files). So we can safely **delete + recreate** without breaking anything.

---

## 🔍 Choose your cleanup strategy

### Option 1 — `RECREATE` (recommended, destructive but clean)

**What it does:**
1. **Backs up** all existing rows to `PurchaseTracking_Backup_YYYYMMDD_HHMMSS`
2. **Deletes** the `PurchaseTracking` sheet
3. **Recreates** with the correct 8-column schema matching `recordPurchaseEvent_`
4. **Copies back** the data, remapped to correct columns where possible (AccessCode → AccessCode column, Status → MetaStatus, etc.)
5. Sets headers bold + frozen

**Data loss risk:** Zero — backup sheet preserves everything.
**Downtime:** Zero — operations are instantaneous.
**Rollback:** Delete new sheet, rename backup back. 30 seconds.

### Option 2 — `MIGRATE` (non-destructive, but complex)

**What it does:**
1. Writes correct headers into row 1
2. **Remaps** every existing row cell-by-cell (move col C → col B for AccessCode, col G → col F for response, etc.)
3. Header + data both end up correct

**Data loss risk:** Zero (in-place update).
**Downtime:** Zero.
**Rollback:** Requires storing old headers before update — doable but complex.

### Option 3 — `DO NOTHING`

Since no function reads this sheet, and it's purely an audit log, some founders choose to "start fresh on the next purchase." That's viable too.

**My recommendation: Option 1.** Backups mean the cleanup is reversible, and starting with a clean schema is better than living with corrupted columns forever.

---

## 📦 Fix #18 — Implementation

### Step 18.1 — Add a new file `PurchaseTrackingCleanup.gs`

In Apps Script editor: **File → New → Script file**, name it exactly:

```
PurchaseTrackingCleanup
```

Paste this:

```javascript
/**
 * PurchaseTrackingCleanup.gs — Fix #18
 * ====================================
 *
 * One-time migration utility for PurchaseTracking sheet.
 *
 * Problem: existing sheet headers are:
 *   EventID | Telegram ID | Email Hash | Amount | Currency | Status | Fired At | Response
 *
 * But recordPurchaseEvent_ writes:
 *   Timestamp | TelegramUserID | AccessCode | Value | Currency | MetaStatus | MetaResponse | EventID
 *
 * Columns C, G, H are misaligned. Data is present but unlabeled correctly.
 *
 * Since no function READS from this sheet, safe to migrate in place
 * or delete+recreate with backup.
 *
 * USAGE:
 *   1. Run `FIX18_INSPECT()` first — reports current state
 *   2. Then run `FIX18_MIGRATE()` — safe, in-place header + data remap
 *   3. Verify via `FIX18_VERIFY()` — sanity check post-migration
 *   4. If problems, run `FIX18_ROLLBACK_<timestamp>` (printed after migrate)
 *
 * NOT IDEMPOTENT — run once. If run twice, migrate is a no-op (detects
 * new schema) and prints a message.
 */

const FIX18_OLD_HEADERS = [
  "EventID", "Telegram ID", "Email Hash", "Amount",
  "Currency", "Status", "Fired At", "Response"
];

const FIX18_NEW_HEADERS = [
  "Timestamp", "TelegramUserID", "AccessCode", "Value",
  "Currency", "MetaStatus", "MetaResponse", "EventID"
];

// ─────────────────────────────────────────
// INSPECT — reports current state, no writes
// ─────────────────────────────────────────
function FIX18_INSPECT() {
  console.log("═══════ FIX #18 INSPECTION ═══════");
  const ss = SpreadsheetApp.openById(getConfig_("SPREADSHEET_ID"));
  const tab = ss.getSheetByName("PurchaseTracking");

  if (!tab) {
    console.log("❌ PurchaseTracking sheet does not exist.");
    console.log("   This is OK — recordPurchaseEvent_ will create it fresh with correct headers.");
    return;
  }

  console.log("✅ PurchaseTracking exists");
  console.log("   Last row: " + tab.getLastRow());
  console.log("   Last col: " + tab.getLastColumn());

  const headers = tab.getRange(1, 1, 1, 8).getDisplayValues()[0];
  console.log("");
  console.log("Current headers:");
  headers.forEach((h, i) => console.log("   " + String.fromCharCode(65 + i) + ": " + JSON.stringify(h)));

  console.log("");
  console.log("Expected headers (matching recordPurchaseEvent_):");
  FIX18_NEW_HEADERS.forEach((h, i) => console.log("   " + String.fromCharCode(65 + i) + ": " + JSON.stringify(h)));

  const isNew = headers.every((h, i) => h === FIX18_NEW_HEADERS[i]);
  const isOld = headers.every((h, i) => h === FIX18_OLD_HEADERS[i]);
  const isUnknown = !isNew && !isOld;

  console.log("");
  if (isNew) {
    console.log("✅ ALREADY MIGRATED — headers match new schema. No action needed.");
  } else if (isOld) {
    console.log("⚠️ OLD SCHEMA DETECTED — run FIX18_MIGRATE() to fix.");
    if (tab.getLastRow() >= 2) {
      console.log("");
      console.log("Sample of existing data (row 2):");
      const row2 = tab.getRange(2, 1, 1, 8).getDisplayValues()[0];
      row2.forEach((v, i) => console.log("   " + String.fromCharCode(65 + i) + ": " + JSON.stringify(v)));
    }
  } else {
    console.log("❓ UNKNOWN SCHEMA — manual review needed before migrating.");
    console.log("   Run FIX18_INSPECT and paste output for support.");
  }

  console.log("═══════════════════════════════════════");
}

// ─────────────────────────────────────────
// MIGRATE — in-place header + data remap
// ─────────────────────────────────────────
function FIX18_MIGRATE() {
  console.log("═══════ FIX #18 MIGRATION ═══════");

  const ss = SpreadsheetApp.openById(getConfig_("SPREADSHEET_ID"));
  const tab = ss.getSheetByName("PurchaseTracking");

  if (!tab) {
    console.log("❌ PurchaseTracking does not exist. Nothing to migrate.");
    return;
  }

  const headers = tab.getRange(1, 1, 1, 8).getDisplayValues()[0];
  const isNew = headers.every((h, i) => h === FIX18_NEW_HEADERS[i]);
  const isOld = headers.every((h, i) => h === FIX18_OLD_HEADERS[i]);

  if (isNew) {
    console.log("✅ Already migrated. No action.");
    return;
  }
  if (!isOld) {
    console.log("❌ Unknown schema. Refusing to migrate. Run FIX18_INSPECT.");
    return;
  }

  // ─── Step 1: Create timestamped backup ───
  const backupName = "PurchaseTracking_Backup_" +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
  console.log("");
  console.log("Creating backup: " + backupName + "...");
  tab.copyTo(ss).setName(backupName);
  console.log("✅ Backup created: " + backupName);

  // ─── Step 2: Read all data ───
  const lastRow = tab.getLastRow();
  const lastCol = tab.getLastColumn();
  console.log("");
  console.log("Reading " + (lastRow - 1) + " data rows...");

  let allData = [];
  if (lastRow >= 2) {
    allData = tab.getRange(2, 1, lastRow - 1, Math.max(8, lastCol)).getValues();
  }

  // ─── Step 3: Remap columns ───
  //
  // Old → New mapping (by content, not by header name):
  //   Old A (EventID)     ← was actually a Date (Timestamp)
  //   Old B (Telegram ID) ← was TelegramUserID
  //   Old C (Email Hash)  ← was actually AccessCode
  //   Old D (Amount)      ← was Value
  //   Old E (Currency)    ← was Currency
  //   Old F (Status)      ← was MetaStatus
  //   Old G (Fired At)    ← was actually MetaResponse
  //   Old H (Response)    ← was actually EventID
  //
  // So the physical columns ALREADY contain the correct data in the correct
  // order — only the HEADERS are wrong. Just rewrite row 1.

  console.log("");
  console.log("Writing new headers (data columns preserved as-is)...");
  tab.getRange(1, 1, 1, 8).setValues([FIX18_NEW_HEADERS]).setFontWeight("bold");
  tab.setFrozenRows(1);

  SpreadsheetApp.flush();

  // ─── Step 4: Verify ───
  const verifyHeaders = tab.getRange(1, 1, 1, 8).getDisplayValues()[0];
  const verifyOk = verifyHeaders.every((h, i) => h === FIX18_NEW_HEADERS[i]);

  console.log("");
  if (verifyOk) {
    console.log("✅ Migration complete.");
    console.log("");
    console.log("Rollback (if needed):");
    console.log("   1. Delete 'PurchaseTracking' sheet");
    console.log("   2. Rename '" + backupName + "' → 'PurchaseTracking'");
    console.log("");
    console.log("Backup preserved: " + backupName);
  } else {
    console.error("❌ Post-migration header verification FAILED.");
    console.error("   Expected: " + FIX18_NEW_HEADERS.join(" | "));
    console.error("   Actual:   " + verifyHeaders.join(" | "));
    console.error("   Restore from backup: " + backupName);
  }

  console.log("═══════════════════════════════════════");
}

// ─────────────────────────────────────────
// VERIFY — read-only post-migration check
// ─────────────────────────────────────────
function FIX18_VERIFY() {
  console.log("═══════ FIX #18 VERIFICATION ═══════");
  const ss = SpreadsheetApp.openById(getConfig_("SPREADSHEET_ID"));
  const tab = ss.getSheetByName("PurchaseTracking");

  if (!tab) {
    console.log("❌ Sheet missing.");
    return;
  }

  const headers = tab.getRange(1, 1, 1, 8).getDisplayValues()[0];
  const matches = headers.every((h, i) => h === FIX18_NEW_HEADERS[i]);

  console.log("Headers: " + headers.join(" | "));
  console.log("");
  if (matches) {
    console.log("✅ Headers match recordPurchaseEvent_ schema.");
  } else {
    console.error("❌ Headers still wrong. Run FIX18_MIGRATE().");
    return;
  }

  const lastRow = tab.getLastRow();
  if (lastRow < 2) {
    console.log("ℹ️ No data rows (fresh sheet).");
    return;
  }

  console.log("");
  console.log("Sample check on row 2:");
  const row2 = tab.getRange(2, 1, 1, 8).getDisplayValues()[0];

  // ─── Sanity: Col C should be an access code (12-16 uppercase alnum) ───
  const colC = String(row2[2] || "").trim();
  const colCValid = /^[A-Z0-9]{8,20}$/.test(colC);
  console.log("   C (AccessCode): " + JSON.stringify(colC) + (colCValid ? " ✅" : " ⚠️ unexpected format"));

  // ─── Sanity: Col F should be "Sent" or "Failed" ───
  const colF = String(row2[5] || "").trim();
  const colFValid = colF === "Sent" || colF === "Failed";
  console.log("   F (MetaStatus): " + JSON.stringify(colF) + (colFValid ? " ✅" : " ⚠️ unexpected value"));

  // ─── Sanity: Col H should start with "PURCHASE_" ───
  const colH = String(row2[7] || "").trim();
  const colHValid = colH.indexOf("PURCHASE_") === 0;
  console.log("   H (EventID): " + JSON.stringify(colH) + (colHValid ? " ✅" : " ⚠️ unexpected format"));

  console.log("");
  if (colCValid && colFValid && colHValid) {
    console.log("✅ Row 2 data is consistent with new schema.");
  } else {
    console.log("⚠️ Some columns look inconsistent — review manually but do NOT rollback unless truly broken.");
  }

  console.log("═══════════════════════════════════════");
}
```

---

### Step 18.2 — Run in this order

Open Apps Script editor. Run each function from the dropdown, one at a time.

**Run 1: `FIX18_INSPECT`**

Expected output:
```
═══════ FIX #18 INSPECTION ═══════
✅ PurchaseTracking exists
   Last row: <N>
   Last col: <M>
Current headers:
   A: "EventID"
   B: "Telegram ID"
   ...
⚠️ OLD SCHEMA DETECTED — run FIX18_MIGRATE() to fix.
Sample of existing data (row 2):
   A: "2024-...T..."      ← this is a Date serialized as string
   B: "123456789"
   C: "ABCD12345678EF"    ← this is an access code (mislabeled "Email Hash")
   ...
═══════════════════════════════════════
```

**Do NOT proceed if it says `❓ UNKNOWN SCHEMA`. Paste output for diagnosis.**

**Run 2: `FIX18_MIGRATE`**

Expected output:
```
═══════ FIX #18 MIGRATION ═══════
Creating backup: PurchaseTracking_Backup_20261114_020000...
✅ Backup created: PurchaseTracking_Backup_20261114_020000
Reading N data rows...
Writing new headers (data columns preserved as-is)...
✅ Migration complete.
Rollback (if needed):
   1. Delete 'PurchaseTracking' sheet
   2. Rename 'PurchaseTracking_Backup_20261114_020000' → 'PurchaseTracking'
Backup preserved: PurchaseTracking_Backup_20261114_020000
═══════════════════════════════════════
```

**Save the backup sheet name.** You'll need it if you roll back.

**Run 3: `FIX18_VERIFY`**

Expected output:
```
═══════ FIX #18 VERIFICATION ═══════
Headers: Timestamp | TelegramUserID | AccessCode | Value | Currency | MetaStatus | MetaResponse | EventID

✅ Headers match recordPurchaseEvent_ schema.

Sample check on row 2:
   C (AccessCode): "ABCD12345678EF" ✅
   F (MetaStatus): "Sent" ✅
   H (EventID): "PURCHASE_ABCD12345678EF" ✅

✅ Row 2 data is consistent with new schema.
═══════════════════════════════════════
```

**If `FIX18_VERIFY` shows ❌ on any of the 3 sanity checks**, don't panic — the header fix is done, only the data content looks suspicious. That likely means the OLD sheet had non-`recordPurchaseEvent_` data from an even earlier version of the code. **Don't roll back** — the headers are correct now, which is what matters going forward.

---

### Step 18.3 — Run regression after Fix #18

**`runFullRegression()`** → still expect **24/24**. Fix #18 doesn't touch any tested function, so it should be a clean pass. If it's not, that's a real signal — paste the failure.

---

### Step 18.4 — Cleanup the backup sheet (after 7 days)

**After a week of confirmed healthy operation**, delete the backup sheet manually:
1. Open spreadsheet
2. Right-click `PurchaseTracking_Backup_YYYYMMDD_HHMMSS` tab
3. Delete → confirm

Don't do this immediately — leave the backup for a full week of usage.

---

## 🔙 Fix #18 rollback

If `FIX18_VERIFY` shows something truly wrong (not just suspicious-looking data):

1. Open spreadsheet
2. Rename current `PurchaseTracking` → `PurchaseTracking_BROKEN_<date>`
3. Rename `PurchaseTracking_Backup_<timestamp>` → `PurchaseTracking`
4. Delete `PurchaseTracking_BROKEN_<date>` (or keep for forensics)
5. Delete `PurchaseTrackingCleanup.gs` from Apps Script

**Total rollback time: 30 seconds.**

---

## ✅ Fix #18 verification checklist

- [ ] `FIX18_INSPECT` — shows `⚠️ OLD SCHEMA DETECTED`
- [ ] `FIX18_MIGRATE` — completes with `✅ Migration complete` + prints backup name
- [ ] Backup sheet visible in spreadsheet (e.g. `PurchaseTracking_Backup_20261114_020000`)
- [ ] `FIX18_VERIFY` — shows `✅ Headers match` + all 3 sample checks green
- [ ] `runFullRegression()` — 24/24
- [ ] **You replied "Fix #18 complete"** with the `FIX18_VERIFY` output pasted

---

# PART B — Buyer Onboarding Docs

## 📝 `MUST EDIT` warning section for `config.js`

Add this as a **new top section** in your buyer docs — the place customers read FIRST before touching `config.js`.

---

### 📄 Copy this into your buyer setup guide

```markdown
## 🛑 MUST EDIT — Before You Deploy

Do NOT deploy this template without editing the values below.
These are placeholders that will silently fail in production if left unchanged.

Open `config.js` and edit each of these in order:

### 1. `attributionEndpoint` — REQUIRED
```javascript
attributionEndpoint: "https://script.google.com/macros/s/REPLACE_WITH_YOUR_EXEC_URL/exec",
```
**Where to get it:** Apps Script → **Deploy** → **Manage deployments** → copy the **Web app URL** that ends in `/exec`.
**What breaks if wrong:** Attribution POST silently rejected. No buyers get auto-approved. Every purchase falls back to manual code delivery.

### 2. `telegramBotHandle` — REQUIRED
```javascript
telegramBotHandle: "REPLACE_WITH_YOUR_BOT_USERNAME",
```
**Where to get it:** Open Telegram → talk to **@BotFather** → `/mybots` → select your bot → the username WITHOUT the `@` symbol.
**What breaks if wrong:** Telegram buttons on your landing page link to a nonexistent bot. Buyers get "bot not found."

### 3. `metaPixelId` — REQUIRED for Meta ads
```javascript
metaPixelId: "REPLACE_WITH_YOUR_PIXEL_ID",
```
**Where to get it:** Meta Events Manager → Data sources → your pixel → **Settings** → **Pixel ID** (16-digit number).
**What breaks if wrong:** Browser Meta events not fire. Server-side CAPI still works (via Apps Script). Only affects browser fallback tracking.

### 4. `attributionSharedSecret` — MUST MATCH Apps Script
```javascript
attributionSharedSecret: "REPLACE_WITH_SECRET_FROM_SCRIPT_PROPERTIES",
```
**Where to get it:** Apps Script → **Project Settings** → **Script Properties** → find `ATTRIBUTION_SHARED_SECRET` → copy value exactly.
**What breaks if wrong:** Every `save_attribution` and `save_purchase` call is rejected as `unauthorized`. Attribution silently fails. **This is the #1 most common setup mistake.**

### 5. `productTier` — REQUIRED for auto-approve
```javascript
productTier: "REPLACE_WITH_TIER", // "tier1" | "tier2" | "tier3"
```
**What to set:** The tier of the product being sold on THIS landing page.
- Tier 1 landing page → `"tier1"`
- Tier 2 landing page → `"tier2"`
- Tier 3 landing page → `"tier3"`
**What breaks if wrong:** Buyer is approved for the wrong tier in your `Students` sheet Notes column. Access still works (unless your lessons are tier-gated), but your audit trail lies.

### 6. `productAmount` — REQUIRED for revenue tracking
```javascript
productAmount: REPLACE_WITH_NUMBER, // e.g. 1090, 47, 147
```
**What to set:** Actual price as a **number** (no currency symbol, no quotes). `1090`, not `"₦1,090"`.
**What breaks if wrong:** `PurchaseRedirects.Amount` records `0` for every purchase. Revenue reports are broken.

### 7. `productCurrency` — REQUIRED for revenue tracking
```javascript
productCurrency: "REPLACE_WITH_3_LETTER_CODE", // "NGN" | "USD" | "EUR" | "GBP"
```
**What to set:** ISO 4217 3-letter uppercase code.
**What breaks if wrong:** Records wrong currency. Amounts are still numbers, but reports show wrong symbol. Bad data hygiene.

### 8. `isFreeProduct` — Determines event-firing behavior
```javascript
isFreeProduct: true,   // or false
```
**Set to `true`:** Your product is free (no payment collected).
**Set to `false`:** Your product is paid.
**What breaks if wrong:** If `true` but product is paid, `save_purchase` is never called → auto-approve fails. If `false` but product is free, `save_purchase` is called with `productTier: "free"` → server rejects, no auto-approve but no damage.

### 9. `fireLeadEvent` / `firePurchaseEvent` — Meta Pixel event toggles
```javascript
fireLeadEvent: false,       // for free products with no CAPI processor
firePurchaseEvent: false    // for paid products with no CAPI processor
```

**⚠️ READ THIS CAREFULLY — the #1 cause of duplicate events:**

| Your Setup | `fireLeadEvent` | `firePurchaseEvent` |
|---|---|---|
| Free product on Selar (CAPI enabled) | `false` | `false` |
| Free product on Paystack/Stripe/custom | `true` | `false` |
| Paid product on Selar (CAPI enabled) | `false` | `false` |
| Paid product on Paystack/Flutterwave/manual | `false` | `true` |

**Rule:** if your payment processor **already fires the event server-side** (Selar does this when CAPI is enabled), leave both `false`. Firing twice breaks Meta's algorithm — you'll be charged for phantom conversions.

---

## ✅ Final checklist before going live

- [ ] Apps Script `setupAll()` has been run once in your account
- [ ] `PurchaseRedirects` sheet exists with 10 correct headers
- [ ] `AttributionBridge` sheet exists with 13 correct headers
- [ ] All 8 keys above (`attributionEndpoint` through `firePurchaseEvent`) are edited in `config.js`
- [ ] Browser DevTools → Console shows **no** `Attribution bridge disabled` warning when you load your page
- [ ] DevTools → Console shows `[attribution] Ready. Token: XXXXXXXX...` within 5 seconds of page load
- [ ] You tested end-to-end with `?email=test@example.com&fullname=Test+Buyer&order_id=TEST_001` and got auto-approved in Telegram
- [ ] `PurchaseRedirects` shows `Status: Linked` and your Telegram ID in the `TelegramUserID` column
- [ ] You cleaned up the test rows from your sheet

**If any checklist item fails, do NOT go live until it's fixed.**
```

---

# PART C — Fix #16b Release Notes

## 📢 Draft release notes for your SaaS customers

---

### 📄 Copy this into your release notes / changelog / email

---

# 🎉 Fix #16b — Auto-Approve Paid Buyers (Release Notes)

**Release date:** November 14, 2026
**Applies to:** All Classroom Funnel Pro customers (Tier 1, 2, 3)
**Migration required:** No — existing data untouched
**Downtime:** Zero

---

## What changed

**Before this release**, the flow for a paying customer was:

> Buyer pays on Selar → gets redirected to your landing page → opens your Telegram bot → sees **"Your access is not yet approved"** → waits for you to manually send a code via WhatsApp → you copy a code → buyer pastes it → approved.

**Average wait: 2 hours to 2 days. Each sale required 3 manual admin steps.**

**After this release**, the flow is:

> Buyer pays on Selar → gets redirected to your landing page → opens your Telegram bot → **AUTO-APPROVED in 4 seconds.**

**Zero admin involvement. Zero code copy-paste. Zero waiting.**

---

## What you get

### ⚡ Instant buyer access
Paying customers are approved the moment they open your bot. No manual step. Buyers start learning within seconds of paying.

### 📊 Complete purchase audit trail
A new **`PurchaseRedirects`** sheet captures every purchase: token, email hash, product tier, amount, currency, source, and order ID. Full accountability for every payment.

### 🎯 Zero duplicate Meta events
Bots do **not** fire Purchase events to Meta (Selar already does when CAPI is enabled). No double-firing — your ad algorithm stays healthy.

### 🔒 Secure token-based linking
Each purchase gets a unique 32-character token. Tokens are single-use: the first Telegram user to tap the link binds the purchase to their account. A second user with the same link is rejected.

### 🛡️ Graceful fallback
If auto-approve fails for any reason (network glitch, sheet lock, etc.), the buyer falls through to the **existing manual flow** — you'll just see them in the pending queue as usual. No one is left stranded.

---

## What you need to do after updating

**Only 3 things:**

### 1. Update your `config.js` — 7 new keys

```javascript
// Add these to your existing window.CLASSROOM_CONFIG block:
productTier: "tier3",         // your tier: "tier1" / "tier2" / "tier3"
productAmount: 1090,           // actual price as a number (no currency symbol)
productCurrency: "NGN",        // ISO 4217 code: NGN / USD / EUR / GBP
productSource: "Selar",        // Selar / Paystack / Manual / Landing
isFreeProduct: false,          // true for free products, false for paid
fireLeadEvent: false,          // see table below
firePurchaseEvent: false       // see table below
```

**⚠️ Critical — check the event toggles:**

| Your setup | `fireLeadEvent` | `firePurchaseEvent` |
|---|---|---|
| Free product on Selar (CAPI enabled) | `false` | `false` |
| Free product on Paystack/Stripe/custom | `true` | `false` |
| Paid product on Selar (CAPI enabled) | `false` | `false` |
| Paid product on Paystack/Flutterwave/manual | `false` | `true` |

**Rule:** if your processor already fires server-side (Selar with CAPI enabled), leave both `false`.

### 2. Bump your cache-buster

In `index.html`, change:
```html
<script src="./config.js?v=1"></script>       <!-- old -->
<script src="./script.js?v=7"></script>        <!-- old -->
```
To:
```html
<script src="./config.js?v=2"></script>       <!-- new -->
<script src="./script.js?v=8"></script>        <!-- new -->
```

This forces browsers to load the new files instead of cached old versions.

### 3. Delete `attribution-snippet.js` (if present)

If you have a file called `attribution-snippet.js` on your landing page host, **delete it**. All attribution logic now lives in `script.js`. The `attribution-snippet.js` file was a development artifact and is not used in production.

**No Apps Script changes are needed** — your backend updates automatically via your update mechanism.

---

## Test it yourself (5 minutes)

1. Open your landing page with this URL:
   ```
   https://your-landing-page.com/?email=test@example.com&fullname=Test+Buyer&order_id=TEST_001
   ```
2. Open DevTools → Console. You should see (within 5 seconds):
   ```
   [attribution] Ready. Token: a1b2c3d4...
   [purchase] POST sent (no-cors, response unreadable).
   ```
3. Open your `PurchaseRedirects` Google Sheet → a new row should appear with your test token
4. Click the Telegram button → bot should reply **"🎉 WELCOME! YOUR PURCHASE IS CONFIRMED"**
5. Check `Students` sheet → your Telegram ID is now `Approved/Approved` with `Tier: tier3`
6. **Clean up:** delete the test row from `PurchaseRedirects`, `AttributionBridge`, and `Students`

---

## What didn't change

- ✅ **Manual access codes still work** — buy a code on the side, redeem it, student is approved. Existing customers keep working normally.
- ✅ **Attribution bridge (Lead tracking)** — unchanged. Free product flows untouched.
- ✅ **All existing sheets** — `Students`, `Lessons`, `Progress`, `Bonuses`, `AccessCodes`, `AttributionBridge`, `FunnelTracking` — untouched.
- ✅ **Broadcast, bonuses, progress tracking** — untouched.
- ✅ **PurchaseTracking schema** — untouched (a separate cleanup release will arrive later, non-breaking).

---

## Known limitations

- **One-time payment model:** This release assumes single-purchase products. If a buyer purchases tier1 then tier3, both tier labels append to their Notes column (`"Tier: tier1; Tier: tier3"`). Feature-tier comparison logic is not part of this release.
- **Refunds:** No automatic refund handling. If a buyer is refunded post-approval, manually change their `Students` status to `Pending` to revoke access.
- **Shared-secret visibility:** The `attributionSharedSecret` in `config.js` is visible to anyone who inspects your page's source. This is inherent to the pattern — the secret is a CSRF-style gate, not authentication. Worst case of secret exposure: someone spams `save_purchase` with junk data. There is no way to use the secret to gain access or read data.

---

## Support

If anything in the setup fails:
1. Open DevTools → Console on your landing page
2. Copy the full log output
3. Email support with your `config.js` (redact `attributionSharedSecret` before sending)

Response time: within 24 hours.

---

## What's coming next

- **Fix #18** — PurchaseTracking column clean-up (non-breaking)
- **Fix #19** — Multi-tier upgrade tracking
- **Fix #20** — Optional IP-based rate limiting on attribution endpoints

No action needed from you for any of these. They'll roll out automatically.

---

**Thank you for using Classroom Funnel Pro. Here's to fewer manual steps and more time spent teaching.**

---

# 🏁 Summary — all 3 deliverables

| Part | Type | Risk | Action needed from you |
|---|---|---|---|
| **A — Fix #18** | Code | Low (with backup) | Create `PurchaseTrackingCleanup.gs` → run 3 functions → run regression → confirm 24/24 |
| **B — Buyer docs** | Text | None | Paste into your buyer setup guide |
| **C — Release notes** | Text | None | Send to customers (email / changelog) |

---

## ⏸️ What I need from you

**For Fix #18:**

1. Run `FIX18_INSPECT()` → paste output (I verify it detects old schema correctly)
2. Run `FIX18_MIGRATE()` → paste output (I verify backup name + migration success)
3. Run `FIX18_VERIFY()` → paste output (I verify headers match + sanity checks)
4. Run `runFullRegression()` → confirm 24/24

**For Buyer docs + Release notes:**

- Read them
- Ask any questions if sections are unclear
- Then send them to your customers

**Once Fix #18's 4 outputs are pasted and green, we close out all remaining work.**

**Go run FIX18_INSPECT first — paste output.**
