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
  productSource: "Selar",
  isFreeProduct: false,
  fireLeadEvent: false,
  firePurchaseEvent: false,

  // ─────────────────────────────────────────────
  // 8. TIER DISPLAY NAMES (Optional — Fix #18.5)
  // ─────────────────────────────────────────────
  // Buyers with non-standard tier names can map them to
  // friendly display names. If not set, "tier1" → "Tier 1".
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
  // 9. PAID THANK-YOU PAGE (Fix #18.4)
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
