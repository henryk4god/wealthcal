/*
 * Customer-specific funnel settings.
 * Keep this file in the same folder as index.html and script.js.
 * Do not place Meta CAPI access tokens or other secrets in this file.
 */
window.AIOPFINDER_CONFIG = Object.freeze({
  pixelId: 'REPLACE_WITH_META_PIXEL_ID',
  attributionEndpoint: 'REPLACE_WITH_GOOGLE_APPS_SCRIPT_WEB_APP_URL',
  telegramBotUrl: '',
  telegramStartPrefix: 'facebook_guide_',
  telegramFallbackStart: 'facebook_guide',
  whatsappNumber: '',
  whatsappMessage: 'Hello, I requested The AI Opportunity Finder free guide and need help accessing it.',
  tenantId: 'default',
  productId: 'ai_opportunity_finder',
  campaignId: 'guide'
});
