/**
 * config.js — Landing Page Configuration (TIER 3)
 * Fix #16b Part 3
 * ================================================
 *
 * BUYER: EDIT ONLY THIS FILE.
 * Do NOT edit attribution-snippet.js or index.html.
 */

window.CLASSROOM_CONFIG = {

  // ─────────────────────────────────────────────
  // 1. ATTRIBUTION ENDPOINT (Required)
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
  // From Meta Events Manager. Leave "" to skip.
  // ─────────────────────────────────────────────
  metaPixelId: "1517538563417489",

  // ─────────────────────────────────────────────
  // 4. SHARED SECRET (Optional, recommended)
  // Must match ATTRIBUTION_SHARED_SECRET in Script Properties.
  // Leave "" to skip the gate (only for local testing).
  // ─────────────────────────────────────────────
  attributionSharedSecret: "",

  // ─────────────────────────────────────────────
  // 5. WHATSAPP SUPPORT (Optional)
  // International format, no + or spaces. Leave "" to hide.
  // ─────────────────────────────────────────────
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // ─────────────────────────────────────────────
  // 6. BRAND NAME
  // ─────────────────────────────────────────────
  brandName: "Classroom Funnel Pro",

  // ─────────────────────────────────────────────
  // 7. FIX #16b — PRODUCT CONFIG (NEW, required for auto-approve)
  // ─────────────────────────────────────────────
  //
  // ⚠️ Read these rules before setting:
  //
  //   Tier 1 / 2 / 3 (paid):
  //     isFreeProduct:     false
  //     fireLeadEvent:     false
  //     firePurchaseEvent: false  ← Selar already fires Purchase
  //     productTier:       "tier1" | "tier2" | "tier3"
  //     productAmount:     actual price as a number
  //     productCurrency:   "NGN" | "USD" | etc.
  //     productSource:     "Selar"
  //
  //   Free product on Selar:
  //     isFreeProduct:     true
  //     fireLeadEvent:     false  ← Selar fires Lead server-side
  //     firePurchaseEvent: false
  //     productTier:       "free"
  //
  //   Paid product on Paystack/Flutterwave/manual:
  //     isFreeProduct:     false
  //     fireLeadEvent:     false
  //     firePurchaseEvent: true  ← browser pixel is sole source
  //     productTier:       "tier1" | "tier2" | "tier3"
  //     productAmount:     actual price
  //     productCurrency:   "NGN" | "USD" | etc.
  //     productSource:     "Paystack"
  //
  productTier: "tier3",         // current product tier
  productAmount: 0,             // ⚠️ UPDATE to actual price
  productCurrency: "NGN",       // ⚠️ UPDATE if not NGN
  productSource: "Selar",
  isFreeProduct: false,
  fireLeadEvent: false,
  firePurchaseEvent: false      // Selar fires Purchase — leave false
};
