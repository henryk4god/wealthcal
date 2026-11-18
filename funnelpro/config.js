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
  brandName: "AI Agent Creator System",

  // ═════════════════════════════════════════════
  // 7. PRODUCT CONFIG (Required for auto-approve)
  // ═════════════════════════════════════════════
  productTier: "tier2",         // tier1 / tier2 / tier3 (or your custom ID)
  productAmount: 1090,             // ⚠️ SET TO REAL PRICE (e.g. 1090)
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
    subheadline: "Your payment is confirmed.",
    bodyCopy: "To get your private classroom link and access code, send us a message on WhatsApp. We will reply within minutes.",
    ctaText: "👉 Message Admin on WhatsApp",
    showWhatsapp: false, // Hidden because the main button is now WhatsApp
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




