/**
 * config.js — Landing Page Configuration (TIER 3)
 * Fix #16b Part 3 + Part 5
 * ================================================
 *
 * BUYER: EDIT ONLY THIS FILE.
 * Do NOT edit script.js or index.html.
 */

window.CLASSROOM_CONFIG = {

  // ─────────────────────────────────────────────
  // 1. ATTRIBUTION ENDPOINT (Required)
  // ⚠️ KEY NAME IS EXACTLY 'attributionEndpoint' — case-sensitive
  // Apps Script → Deploy → Manage Deployments → /exec URL
  // ─────────────────────────────────────────────
  attributionEndpoint: "https://script.google.com/macros/s/AKfycbwkQwGH_7TRVJ3XOwnV6e-byIinQLlSp1ZmL4WliID0AWMHg4v7uK9YJL7PxS4QmIcHTA/exec",

  // ─────────────────────────────────────────────
  // 2. TELEGRAM BOT HANDLE (Required)
  // Bot username from @BotFather, WITHOUT the @ symbol
  // ─────────────────────────────────────────────
  telegramBotHandle: "CRTtiers3bot",

  // ─────────────────────────────────────────────
  // 3. META PIXEL ID (Required for CAPI)
  // ─────────────────────────────────────────────
  metaPixelId: "1517538563417489",

  // ─────────────────────────────────────────────
  // 4. SHARED SECRET (Required — must match Script Properties)
  // ⚠️ Your value below MUST equal ATTRIBUTION_SHARED_SECRET in Apps Script
  // ─────────────────────────────────────────────
  attributionSharedSecret: "VVoR^A,6Q#UGZ2>TO|$cxq9P.)+fV?jy",

  // ─────────────────────────────────────────────
  // 5. WHATSAPP SUPPORT (Optional)
  // ─────────────────────────────────────────────
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // ─────────────────────────────────────────────
  // 6. BRAND NAME
  // ─────────────────────────────────────────────
  brandName: "Classroom Funnel Pro",

  // ─────────────────────────────────────────────
  // 7. FIX #16b — PRODUCT CONFIG
  // ⚠️ BUYERS: These defaults are for YOUR TESTING.
  // Each buyer's config.js must be edited with their real tier + price.
  // ─────────────────────────────────────────────
  productTier: "tier3",         // tier1 / tier2 / tier3
  productAmount: 0,             // ⚠️ SET TO REAL PRICE (e.g. 1090)
  productCurrency: "NGN",       // ⚠️ SET TO REAL CURRENCY (NGN / USD / etc)
  productSource: "Selar",
  isFreeProduct: false,
  fireLeadEvent: false,         // Selar fires Lead — leave false
  firePurchaseEvent: false      // Selar fires Purchase — leave false
};
