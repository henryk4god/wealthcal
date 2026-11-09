/**
 * config.js — Landing Page Configuration
 * =======================================
 *
 * PART OF:  Telegram Classroom Product v1.0
 * FIX #:    11
 * CREATED:  Day 5 of product refactor
 *
 * ─────────────────────────────────────────────────────────────
 * BUYER SETUP — EDIT ONLY THIS FILE
 * ─────────────────────────────────────────────────────────────
 *
 * 1. Copy this file to your GitHub repo alongside index.html
 * 2. Replace the 6 values below with your own
 * 3. Save and deploy
 *
 * Do NOT edit script.js or index.html — they read from here.
 *
 * ─────────────────────────────────────────────────────────────
 * HOW TO GET EACH VALUE
 * ─────────────────────────────────────────────────────────────
 *
 * attributionEndpoint:
 *   Your Google Apps Script Web App URL. Get it from:
 *   Apps Script → Deploy → Manage deployments → copy the
 *   /exec URL (not /dev). Example:
 *   "https://script.google.com/macros/s/AKfycbyUGsu0yGlotqr0DgvXgl9knsKrPney34ia9ZBGjdQmvTyx1ZGyuL6bVfxjQ-1lrg_T/exec"
 *
 * telegramBotHandle:
 *   Your bot's username from @BotFather, WITHOUT the @ symbol.
 *   Example: if your bot is @MyCourseBot, use "psfvol1bot".
 *
 * metaPixelId:
 *   From Meta Events Manager → Data Sources → your Pixel →
 *   Settings → Pixel ID. Example: "1517538563417489".
 *   Leave as "" to skip Meta Pixel tracking entirely.
 *
 * supportWhatsappNumber:
 *   WhatsApp number in international format WITHOUT "+" or spaces.
 *   Example: for +1 (555) 123-4567, use "2348033867642".
 *   Leave as "" to hide the WhatsApp button.
 *
 * supportWhatsappMessage:
 *   The pre-filled message that appears when someone taps
 *   the WhatsApp button. Plain text — the page will URL-encode it.
 *
 * brandName:
 *   Your business or course name. Appears in the H1 and footer.
 */

window.CLASSROOM_CONFIG = {

  // ─── REQUIRED ──────────────────────────────────────
  // The four required values for attribution to work.
  // If any is missing, attribution still falls through to
  // the plain bot link (no Meta tracking).

  attributionEndpoint: "https://script.google.com/macros/s/AKfycbyUGsu0yGlotqr0DgvXgl9knsKrPney34ia9ZBGjdQmvTyx1ZGyuL6bVfxjQ-1lrg_T/exec",

  telegramBotHandle: "psfvol1bot",

  metaPixelId: "1517538563417489",

  // ─── OPTIONAL ──────────────────────────────────────
  // Leave "" to hide the corresponding button.

  supportWhatsappNumber: "2348033867642",

  supportWhatsappMessage: "Hello, I need help accessing my course.",

  brandName: "Michyrite Academy"
};
