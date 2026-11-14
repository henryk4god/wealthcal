/**
 * script.js — Attribution Bridge + Fix #16b Auto-Approve (TIER 3)
 * ===============================================================
 *
 * Drop this into ANY landing page with a single <script> tag.
 *
 * DEPENDS ON: config.js must load FIRST (before this file).
 *
 * WHAT IT DOES:
 *   1. Reads email + fullname from URL (Selar redirect)
 *   2. Captures fbclid, _fbp, _fbc cookies
 *   3. Hashes email + first name (SHA-256)
 *   4. POSTs save_attribution → creates AttributionBridge row
 *   5. Polls check_attribution to confirm save
 *   6. Fix #16b: POSTs save_purchase → creates PurchaseRedirects row
 *   7. Fix #16b: optionally fires browser Lead / Purchase pixel events
 *   8. Rewrites ALL Telegram links with ?start=facebook_guide_<token>
 *
 * EVENT FIRING RULES (Fix #16b):
 *
 *   Free product + Selar CAPI:     fireLeadEvent=false, firePurchaseEvent=false
 *   Free product + no CAPI:        fireLeadEvent=true,  firePurchaseEvent=false
 *   Paid product + Selar CAPI:     fireLeadEvent=false, firePurchaseEvent=false
 *   Paid product + no CAPI:        fireLeadEvent=false, firePurchaseEvent=true
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────
  // CONFIG
  // ─────────────────────────────────────────
  var CFG = window.CLASSROOM_CONFIG || {};
  var ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  var TELEGRAM_BOT_HANDLE = String(CFG.telegramBotHandle || "").trim().replace(/^@/, "");
  var TELEGRAM_BASE = TELEGRAM_BOT_HANDLE ? "https://t.me/" + TELEGRAM_BOT_HANDLE + "?start=facebook_guide_" : "";
  var META_PIXEL_ID = String(CFG.metaPixelId || "").trim();

  // Fix #16b product config
  var PRODUCT_TIER        = String(CFG.productTier || "").trim().toLowerCase();
  var PRODUCT_AMOUNT      = Number(CFG.productAmount) || 0;
  var PRODUCT_CURRENCY    = String(CFG.productCurrency || "USD").trim().toUpperCase();
  var PRODUCT_SOURCE      = String(CFG.productSource || "Landing").trim();
  var IS_FREE_PRODUCT     = Boolean(CFG.isFreeProduct);
  var FIRE_LEAD_EVENT     = Boolean(CFG.fireLeadEvent);
  var FIRE_PURCHASE_EVENT = Boolean(CFG.firePurchaseEvent);

  // ─────────────────────────────────────────
  // 1. CAPTURE URL PARAMS (before cleaning)
  // ─────────────────────────────────────────
  var landingParams = new URLSearchParams(window.location.search);
  var selarFullName  = landingParams.get('fullname') || landingParams.get('name') || '';
  var selarEmail     = landingParams.get('email') || '';
  var landingFbclid  = landingParams.get('fbclid') || '';
  var landingOrderId = landingParams.get('order_id') || landingParams.get('orderId') || '';

  // Preserve existing _fbc cookie
  var existingFbc = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('_fbc=');
  });

  if (landingFbclid && !existingFbc) {
    var fbcValue = 'fb.1.' + Date.now() + '.' + landingFbclid;
    document.cookie = '_fbc=' + encodeURIComponent(fbcValue) + '; Path=/; Max-Age=7776000; SameSite=Lax; Secure';
  }

  // Clean URL (so refresh doesn't re-fire)
  if (landingParams.has('fullname') || landingParams.has('email') ||
      landingParams.has('fbclid') || landingParams.has('name') ||
      landingParams.has('order_id') || landingParams.has('orderId')) {
    var cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('fullname');
    cleanUrl.searchParams.delete('name');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('fbclid');
    cleanUrl.searchParams.delete('order_id');
    cleanUrl.searchParams.delete('orderId');
    window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  // ─────────────────────────────────────────
  // 2. META PIXEL BOOT (only if configured)
  // ─────────────────────────────────────────
  if (META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // ─────────────────────────────────────────
  // 3. GUARD
  // ─────────────────────────────────────────
  if (!ATTRIBUTION_ENDPOINT || !TELEGRAM_BASE) {
    console.warn('Attribution bridge disabled: missing attributionEndpoint or telegramBotHandle in CLASSROOM_CONFIG.');
    return;
  }

  // ─────────────────────────────────────────
  // 4. FIND TELEGRAM LINKS
  // ─────────────────────────────────────────
  var telegramLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href*="t.me/"], a[href*="telegram.me/"]')
  );

  if (telegramLinks.length === 0) {
    console.warn('No Telegram links found on page.');
    return;
  }

  var originalHrefs = telegramLinks.map(function (link) { return link.href; });
  var attributionReady = false;

  telegramLinks.forEach(function (link) {
    link.setAttribute('data-original-text', link.textContent);
    link.addEventListener('click', function (event) {
      if (!attributionReady) {
        event.preventDefault();
        link.textContent = 'Preparing your secure Telegram link...';
      }
    });
  });

  // ─────────────────────────────────────────
  // 5. HELPERS
  // ─────────────────────────────────────────
  function getCookie(name) {
    var prefix = name + '=';
    var item = document.cookie.split(';')
      .map(function (part) { return part.trim(); })
      .find(function (part) { return part.indexOf(prefix) === 0; });
    if (!item) return '';
    try { return decodeURIComponent(item.substring(prefix.length)); }
    catch (err) { return item.substring(prefix.length); }
  }

  async function sha256Hex(value) {
    var normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    var encoded = new TextEncoder().encode(normalized);
    var digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map(function (byte) { return ('0' + byte.toString(16)).slice(-2); })
      .join('');
  }

  function generateAttributionToken() {
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map(function (byte) { return ('0' + byte.toString(16)).slice(-2); })
      .join('');
  }

  // ─────────────────────────────────────────
  // 6. POLL CONFIRMATION
  // ─────────────────────────────────────────
  function confirmAttributionRecord(token) {
    var startTime = Date.now();
    var maxWaitMs = 15000;
    var pollIntervalMs = 1000;

    function pollOnce() {
      return new Promise(function (resolve, reject) {
        var callbackName = "aiofAttributionCallback_" + token;
        var script = document.createElement("script");
        var finished = false;
        var timeout = null;

        function cleanup() {
          if (finished) return;
          finished = true;
          if (timeout) clearTimeout(timeout);
          delete window[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
        }

        window[callbackName] = function (result) {
          cleanup();
          resolve(result && result.ok === true);
        };

        script.onerror = function () {
          cleanup();
          reject(new Error("Network error contacting attribution endpoint."));
        };

        var endpoint = ATTRIBUTION_ENDPOINT + "?action=check_attribution&token=" +
                       encodeURIComponent(token) + "&callback=" + encodeURIComponent(callbackName);
        script.src = endpoint;
        timeout = setTimeout(function () {
          cleanup();
          reject(new Error("Single poll timed out."));
        }, 5000);
        document.head.appendChild(script);
      });
    }

    return new Promise(async function (resolve, reject) {
      while (Date.now() - startTime < maxWaitMs) {
        try {
          var saved = await pollOnce();
          if (saved) {
            console.log('[attribution] Confirmed after ' + (Date.now() - startTime) + 'ms');
            resolve(true);
            return;
          }
        } catch (err) {
          console.warn('[attribution] Poll attempt failed: ' + err.message);
        }
        await new Promise(function (r) { setTimeout(r, pollIntervalMs); });
      }
      reject(new Error("Attribution confirmation timed out after 15 seconds."));
    });
  }

  // ─────────────────────────────────────────
  // 7. FIX #16b: SAVE PURCHASE (paid only)
  // ─────────────────────────────────────────
  async function savePurchaseRecord(token, emailHash) {
    if (IS_FREE_PRODUCT || !PRODUCT_TIER || PRODUCT_TIER === 'free') {
      return;
    }

    try {
      var formData = new URLSearchParams();
      formData.set('action', 'save_purchase');
      formData.set('token', token);
      formData.set('emailHash', emailHash);
      formData.set('productTier', PRODUCT_TIER);
      formData.set('amount', String(PRODUCT_AMOUNT));
      formData.set('currency', PRODUCT_CURRENCY);
      formData.set('source', PRODUCT_SOURCE);
      if (landingOrderId) formData.set('orderId', landingOrderId);

      var sharedSecret = String(CFG.attributionSharedSecret || '').trim();
      if (sharedSecret) formData.set('secret', sharedSecret);

      console.log('[purchase] Saving purchase record for ' + PRODUCT_TIER + '...');
      var resp = await fetch(ATTRIBUTION_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        cache: 'no-store'
      });
      console.log('[purchase] POST sent (no-cors, response unreadable).');
    } catch (err) {
      console.error('[purchase] Save failed:', err);
    }
  }

  // ─────────────────────────────────────────
  // 8. MAIN
  // ─────────────────────────────────────────
  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Browser encryption unavailable.');
    }

    var normalizedEmail = selarEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('No email found in URL. Add ?email=xxx@example.com to the redirect.');
    }

    var firstName = selarFullName.trim().split(/\s+/)[0] || '';
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    if (!fbc && landingFbclid) {
      fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;
    }

    var emailHash = await sha256Hex(normalizedEmail);
    var firstNameHash = firstName ? await sha256Hex(firstName) : '';
    var token = generateAttributionToken();

    // 8a. Save attribution (always)
    var formData = new URLSearchParams();
    formData.set('action', 'save_attribution');
    formData.set('token', token);
    formData.set('emailHash', emailHash);
    formData.set('firstNameHash', firstNameHash);
    formData.set('fbp', fbp);
    formData.set('fbc', fbc);
    formData.set('userAgent', navigator.userAgent);

    var sharedSecret = String(CFG.attributionSharedSecret || '').trim();
    if (sharedSecret) formData.set('secret', sharedSecret);

    console.log('[attribution] Sending save_attribution POST...');
    await fetch(ATTRIBUTION_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
      cache: 'no-store'
    });
    console.log('[attribution] Waiting for confirmation...');
    await confirmAttributionRecord(token);

    // 8b. Fix #16b: save purchase record (paid only)
    await savePurchaseRecord(token, emailHash);

    // 8c. Optional: browser Lead event
    if (FIRE_LEAD_EVENT && window.fbq) {
      try {
        window.fbq('track', 'Lead', {}, { eventID: token });
        console.log('[pixel] Lead fired');
      } catch (err) {
        console.warn('[pixel] Lead fire failed:', err);
      }
    }

    // 8d. Optional: browser Purchase event
    if (FIRE_PURCHASE_EVENT && window.fbq && !IS_FREE_PRODUCT) {
      try {
        window.fbq('track', 'Purchase', {
          value: PRODUCT_AMOUNT,
          currency: PRODUCT_CURRENCY,
          content_name: PRODUCT_TIER,
          content_type: 'product'
        }, { eventID: 'PURCHASE_' + token });
        console.log('[pixel] Purchase fired');
      } catch (err) {
        console.warn('[pixel] Purchase fire failed:', err);
      }
    }

    // 8e. Rewrite Telegram links
    telegramLinks.forEach(function (link) {
      link.href = TELEGRAM_BASE + token;
      var originalText = link.getAttribute('data-original-text');
      if (originalText) link.textContent = originalText;
    });

    attributionReady = true;
    console.log('[attribution] Ready. Token: ' + token.slice(0, 8) + '...');
  }

  // ─── RUN ───
  prepareAttribution().catch(function (err) {
    console.error('[attribution] Preparation failed:', err);
    telegramLinks.forEach(function (link, i) {
      link.href = originalHrefs[i];
      var originalText = link.getAttribute('data-original-text');
      if (originalText) link.textContent = originalText;
    });
    attributionReady = true;
  });

})();
