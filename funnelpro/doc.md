# 🚀 Buyer Docs + Release Notes — Three Deliverables

# Buyer Onboarding Docs

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
| Free product on Selar (CAPI enabled) | `false` Or NO | `false` Or NO |
| Free product on Paystack/Stripe/custom | `true` Or YES | `false` Or NO |
| Paid product on Selar (CAPI enabled) | `false` Or NO | `false` Or NO |
| Paid product on Paystack/Flutterwave/manual | `false` Or NO | `true` Or YES |

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
| Free product on Selar (CAPI enabled) | `false`or No | `false` or No |
| Free product on Paystack/Stripe/custom | `true`or Yes | `false` No |
| Paid product on Selar (CAPI enabled) | `false` No | `false` No |
| Paid product on Paystack/Flutterwave/manual | `false` No | `true` Yes |

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

## ✅ Payment Processor Compatibility

Not all payment processors are equal. Some pass the buyer's email in the redirect URL (which the bot needs to auto-approve them), some don't.

### Supported today (auto-approve works)

| Processor | Auto-approve | Redirect URL to configure |
|---|---|---|
| **Selar** | ✅ | `https://your-domain.com/index-paid.html` |
| **Gumroad** | ✅ | `https://your-domain.com/index-paid.html` |
| **Lemon Squeezy** | ✅ | `https://your-domain.com/index-paid.html` |
| **Payhip** | ✅ | `https://your-domain.com/index-paid.html` |
| **Any processor that passes `?email=` in redirect** | ✅ | `https://your-domain.com/index-paid.html` |

### Coming soon (Phase 1.5 — email entry form)

| Processor | Auto-approve | Workaround |
|---|---|---|
| **Paystack** | ⚠️ | Use manual access code flow until Phase 1.5 |
| **Stripe** | ⚠️ | Use manual access code flow until Phase 1.5 |
| **Flutterwave** | ⚠️ | Use manual access code flow until Phase 1.5 |
| **Manual / bank transfer** | ⚠️ | Use manual access code flow until Phase 1.5 |

**Why?** These processors don't pass the buyer's email in the redirect URL. Phase 1 can't auto-approve without it. Phase 1.5 adds a page where buyers enter their email manually — then auto-approve works.

**If you're using one of these processors**, set `paymentProcessor: "paystack"` (or `"stripe"` / `"flutterwave"` / `"manual"`) in `config.js` so you get notified when Phase 1.5 ships.

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
**Once Fix #18's 4 outputs are pasted and green, we close out all remaining work.**

**Go run FIX18_INSPECT first — paste output.**
