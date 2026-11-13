/**
 * attribution-snippet.js — Universal Attribution Bridge (TIER 3)
 * Fix #16b Part 3
 * ==============================================================
 *
 * Drop this into ANY landing page with a single <script> tag.
 * Works on WordPress, Webflow, Framer, custom HTML, Shopify,
 * Systeme.io, GitHub Pages, or anywhere else.
 *
 * SETUP (2 steps):
 *
 * 1. Add this BEFORE the closing </body> tag:
 *
 *    <script>
 *      window.CLASSROOM_CONFIG = {
 *        // ───  (required) ───
 *        attributionEndpoint: "https://script.google.com/macros/s/AKfycbwkQwGH_7TRVJ3XOwnV6e-byIinQLlSp1ZmL4WliID0AWMHg4v7uK9YJL7PxS4QmIcHTA/exec",
 *        telegramBotHandle: "CRTtiers3bot",
 *        metaPixelId: "1517538563417489",
 *        attributionSharedSecret: "VVoR^A,6Q#UGZ2>TO|$cxq9P.)+fV?jy",
 *        brandName: "Your Classroom",
 *        supportWhatsappNumber: "",
 *        supportWhatsappMessage: "Hello, I need help.",
 *
 *        // ─── Fix #16b: Product config ───
 *        productTier: "tier3",           // tier1 / tier2 / tier3 / free
 *        productAmount: 4999,
 *        productCurrency: "NGN",
 *        productSource: "Selar",         // Selar / Paystack / Manual / Landing
 *        isFreeProduct: false,           // true → Lead only, no Purchase
 *        fireLeadEvent: false,           // true → browser Lead pixel
 *        firePurchaseEvent: false        // true → browser Purchase pixel
 *      };
 *    </script>
 *    <script src="attribution-snippet.js"></script>
 *
 * 2. Any link to your Telegram bot should have:
 *    - class="btn-tg" (or auto-detected if href contains t.me/)
 *    - href="https://t.me/CRTtiers3bot" (will be rewritten with token)
 *
 * EVENT FIRING RULES (Fix #16b):
 *
 *   Free product + Selar CAPI (your setup):
 *     isFreeProduct=true, fireLeadEvent=false → fire NOTHING
 *     (Selar fires Lead server-side)
 *
 *   Free product + no CAPI:
 *     isFreeProduct=true, fireLeadEvent=true → fire Lead (browser)
 *
 *   Paid product + Selar CAPI:
 *     isFreeProduct=false, firePurchaseEvent=false → fire NOTHING
 *     (Selar fires Purchase; we POST save_purchase for auto-approve)
 *
 *   Paid product + no CAPI (Paystack, manual, etc.):
 *     isFreeProduct=false, firePurchaseEvent=true → fire Purchase (browser)
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
  // 3. GUARD: endpoint + bot handle required
  // ─────────────────────────────────────────
  if (!ATTRIBUTION_ENDPOINT || !TELEGRAM_BASE) {
    console.warn('[attribution-snippet] Missing attributionEndpoint or telegramBotHandle in CLASSROOM_CONFIG.');
    return;
  }

  // ─────────────────────────────────────────
  // 4. FIND TELEGRAM LINKS
  // ─────────────────────────────────────────
  var telegramLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href*="t.me/"], a[href*="telegram.me/"]')
  );

  if (telegramLinks.length === 0) {
    console.warn('[attribution-snippet] No Telegram links found on page. Attribution will still run, but links will not be rewritten.');
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
  // 6. POLL CONFIRMATION (JSONP)
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
            console.log('[attribution-snippet] Attribution confirmed after ' + (Date.now() - startTime) + 'ms');
            resolve(true);
            return;
          }
        } catch (err) {
          console.warn('[attribution-snippet] Poll attempt failed: ' + err.message);
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
      return; // free products don't hit the purchase endpoint
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

      var resp = await fetch(ATTRIBUTION_ENDPOINT, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        cache: 'no-store'
      });

      if (resp.ok) {
        console.log('[attribution-snippet] Purchase record saved for tier ' + PRODUCT_TIER);
      } else {
        console.warn('[attribution-snippet] Purchase save HTTP ' + resp.status);
      }
    } catch (err) {
      console.error('[attribution-snippet] Purchase save failed:', err);
    }
  }

  // ─────────────────────────────────────────
  // 8. MAIN: PREPARE + SEND
  // ─────────────────────────────────────────
  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Browser encryption unavailable.');
    }

    var normalizedEmail = selarEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('No email found in URL. Configure your checkout to pass ?email=xxx@example.com.');
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

    // ─── 8a. Save attribution (always) ───
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

    console.log('[attribution-snippet] Sending attribution POST...');
    await fetch(ATTRIBUTION_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      cache: 'no-store'
    });

    console.log('[attribution-snippet] Waiting for confirmation...');
    await confirmAttributionRecord(token);

    // ─── 8b. Fix #16b: save purchase record (paid only) ───
    await savePurchaseRecord(token, emailHash);

    // ─── 8c. Fix #16b: browser Lead event (if configured) ───
    if (FIRE_LEAD_EVENT && window.fbq) {
      try {
        window.fbq('track', 'Lead', {}, { eventID: token });
        console.log('[attribution-snippet] Lead event fired (browser)');
      } catch (err) {
        console.warn('[attribution-snippet] Lead fire failed:', err);
      }
    }

    // ─── 8d. Fix #16b: browser Purchase event (if configured) ───
    if (FIRE_PURCHASE_EVENT && window.fbq && !IS_FREE_PRODUCT) {
      try {
        window.fbq('track', 'Purchase', {
          value: PRODUCT_AMOUNT,
          currency: PRODUCT_CURRENCY,
          content_name: PRODUCT_TIER,
          content_type: 'product'
        }, { eventID: 'PURCHASE_' + token });
        console.log('[attribution-snippet] Purchase event fired (browser)');
      } catch (err) {
        console.warn('[attribution-snippet] Purchase fire failed:', err);
      }
    }

    // ─── 8e. Rewrite Telegram links with token ───
    telegramLinks.forEach(function (link) {
      link.href = TELEGRAM_BASE + token;
      var originalText = link.getAttribute('data-original-text');
      if (originalText) link.textContent = originalText;
    });

    attributionReady = true;
    console.log('[attribution-snippet] Attribution ready. Telegram links updated.');
  }

  // ─── RUN ───
  prepareAttribution().catch(function (err) {
    console.error('[attribution-snippet] Attribution preparation failed:', err);
    telegramLinks.forEach(function (link, i) {
      link.href = originalHrefs[i];
      var originalText = link.getAttribute('data-original-text');
      if (originalText) link.textContent = originalText;
    });
    attributionReady = true;
  });

})();
