/**
 * config.js — Landing Page Configuration (TIER 3 + SaaS)
 * ========================================================
 *
 * BUYER: EDIT ONLY THIS FILE.
 * Do NOT edit script.js or index.html / index-paid.html.
 */

window.CLASSROOM_CONFIG = {

  // ─────────────────────────────────────────────
  // 1. ATTRIBUTION ENDPOINT (Required)
  // ─────────────────────────────────────────────
  attributionEndpoint: "https://script.google.com/macros/s/AKfycbwkQwGH_7TRVJ3XOwnV6e-byIinQLlSp1ZmL4WliID0AWMHg4v7uK9YJL7PxS4QmIcHTA/exec",

  // ─────────────────────────────────────────────
  // 2. TELEGRAM BOT HANDLE (Required)
  // ─────────────────────────────────────────────
  telegramBotHandle: "CRTtiers3bot",

  // ─────────────────────────────────────────────
  // 3. META PIXEL ID (Required for CAPI)
  // ─────────────────────────────────────────────
  metaPixelId: "1517538563417489",

  // ─────────────────────────────────────────────
  // 4. SHARED SECRET (must match Apps Script)
  // ─────────────────────────────────────────────
  attributionSharedSecret: "VVoR^A,6Q#UGZ2>TO|$cxq9P.)+fV?jy",

  // ─────────────────────────────────────────────
  // 5. WHATSAPP SUPPORT
  // ─────────────────────────────────────────────
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // ─────────────────────────────────────────────
  // 6. BRAND NAME
  // ─────────────────────────────────────────────
  brandName: "Classroom Funnel Pro",

  // ─────────────────────────────────────────────
  // 7. PRODUCT CONFIG (Fix #16b — required for auto-approve)
  // ─────────────────────────────────────────────
  productTier: "tier3",         // tier1 / tier2 / tier3 (or buyer's custom)
  productAmount: 0,             // ⚠️ SET TO REAL PRICE
  productCurrency: "NGN",       // ⚠️ SET TO REAL CURRENCY
  isFreeProduct: false,
  fireLeadEvent: false,
  firePurchaseEvent: false,

  // ─────────────────────────────────────────────
  // 8. PAYMENT PROCESSOR (Fix #18.4)
  // ─────────────────────────────────────────────
  // Which processor do you use to sell this product?
  //
  // - "selar"          → passes ?email=&fullname=&order_id= in redirect ✅
  // - "gumroad"        → passes ?email=&sale_id= ✅
  // - "lemonsqueezy"   → passes ?email=&order_id= ✅
  // - "payhip"         → passes ?email=&sale_id= ✅
  // - "paystack"       → passes only ?reference= ⚠️ (Phase 1.5 will add email form)
  // - "flutterwave"    → passes ?tx_ref= ⚠️ (Phase 1.5)
  // - "stripe"         → passes ?session_id= ⚠️ (Phase 1.5)
  // - "manual"         → no params, will need email form (Phase 1.5)
  // - "auto"           → Phase 1: assumes email is in URL (like Selar/Gumroad)
  //                      Phase 1.5: will auto-detect and fall back to email form
  //
  // PHASE 1 STATUS:
  //   ✅ Supported today: selar, gumroad, lemonsqueezy, payhip, auto
  //   ⚠️ Coming in Phase 1.5: paystack, flutterwave, stripe, manual
  //      (these processors don't pass email in redirect — Phase 1.5 adds
  //       a buyer-entered email form to work around this)
  //
  paymentProcessor: "selar",

  // Legacy alias for backwards compatibility
  // (Phase 1 code reads this as a fallback if paymentProcessor is not set)
  productSource: "Selar",

  // ─────────────────────────────────────────────
  // 9. TIER DISPLAY NAMES (Optional)
  // ─────────────────────────────────────────────
  tierDisplayNames: {
    // "tier1": "Starter",
    // "tier2": "Pro",
    // "tier3": "Premium",
    // "basic": "Basic",
    // "pro": "Pro Plan",
    // "default": "Full Access"
  },

  // ─────────────────────────────────────────────
  // 10. PAID THANK-YOU PAGE (Fix #18.4)
  // ─────────────────────────────────────────────
  // All fields optional. Defaults shown below.
  // Supported placeholders: {{tierName}}, {{brandName}}
  // ─────────────────────────────────────────────
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
  }
};
