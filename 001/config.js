/**
 * config.js — Landing Page Configuration
 * 
 * 🛑 EDIT THIS FILE TO SET UP YOUR LANDING PAGE 🛑
 * 
 * Do not edit script.js or index.html. All the buyer-customizable
 * values are right here.
 */

window.CLASSROOM_CONFIG = {

  // 1. ATTRIBUTION ENDPOINT (Required for Meta CAPI)
  // Get this from Apps Script → Deploy → Manage Deployments → Copy the /exec URL
  attributionEndpoint: "https://script.google.com/macros/s/AKfycbynVX4I8qKxsC_hj9Irb8I9izbcnq4yAHjg3taj3PmXJ8ECFkT3XYq8uo3GmyW5Qt7P/exec",

  // 2. TELEGRAM BOT HANDLE (Required)
  // Your bot username from @BotFather, WITHOUT the @ symbol (e.g. "MyCourseBot").
  telegramBotHandle: "AIA_CSbot",

  // 3. META PIXEL ID (Optional)
  // From Meta Events Manager. Leave as "" if you aren't running Facebook ads.
  metaPixelId: "1517538563417489",

  // 4. WHATSAPP SUPPORT (Optional)
  // International format, no spaces or plus signs (e.g. "15551234567").
  // Leave as "" to hide the WhatsApp section entirely.
  supportWhatsappNumber: "2348033867642",
  supportWhatsappMessage: "Hello, I need help with my course.",

  // 5. BRAND NAME
  // Your business name, appears in the page title and text.
  brandName: "The AI Opportunity Finder"
};
