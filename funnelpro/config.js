/**
 * config.js — Landing Page Configuration (TIER 3)
 * ================================================
 * 
 * 🛑 BUYER: EDIT ONLY THIS FILE 🛑
 * 
 * Do NOT edit script.js or index.html. All your customizable
 * values live right here.
 */

window.CLASSROOM_CONFIG = {

  // 1. ATTRIBUTION ENDPOINT (Required for Meta CAPI)
  // Get this from Apps Script → Deploy → Manage Deployments → /exec URL
  attributionEndpoint: "https://script.google.com/macros/s/AKfycbwkQwGH_7TRVJ3XOwnV6e-byIinQLlSp1ZmL4WliID0AWMHg4v7uK9YJL7PxS4QmIcHTA/exec",

  // 2. TELEGRAM BOT HANDLE (Required)
  // Your bot username from @BotFather, WITHOUT the @ symbol
  telegramBotHandle: "CRTtiers3bot",

  // 3. META PIXEL ID (Required for CAPI)
  // From Meta Events Manager. Leave as "" if you aren't running ads.
  metaPixelId: "1517538563417489",

  // 4. SHARED SECRET (Optional, but recommended)
  // Must match the ATTRIBUTION_SHARED_SECRET in Script Properties
  // Leave "" to skip the gate (only for local testing)
  attributionSharedSecret: "",

  // 5. WHATSAPP SUPPORT (Optional)
  // International format, no + or spaces. Leave "" to hide.
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // 6. BRAND NAME
  brandName: "Classroom Funnel Pro"
};
