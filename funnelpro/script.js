(function () {
  'use strict';

  var CFG = window.CLASSROOM_CONFIG || {};
  var ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  var TELEGRAM_BOT_HANDLE = String(CFG.telegramBotHandle || "").trim().replace(/^@/, "");
  var TELEGRAM_BASE = TELEGRAM_BOT_HANDLE ? "https://t.me/" + TELEGRAM_BOT_HANDLE + "?start=facebook_guide_" : "";
  var META_PIXEL_ID = String(CFG.metaPixelId || "").trim();

  var PRODUCT_TIER        = String(CFG.productTier || "").trim().toLowerCase();
  var PRODUCT_AMOUNT      = Number(CFG.productAmount) || 0;
  var PRODUCT_CURRENCY    = String(CFG.productCurrency || "USD").trim().toUpperCase();
  var PRODUCT_SOURCE      = String(CFG.productSource || "Landing").trim();
  var IS_FREE_PRODUCT     = Boolean(CFG.isFreeProduct);
  var FIRE_LEAD_EVENT     = Boolean(CFG.fireLeadEvent);
  var FIRE_PURCHASE_EVENT = Boolean(CFG.firePurchaseEvent);

  var landingParams = new URLSearchParams(window.location.search);
  var selarFullName  = landingParams.get('fullname') || landingParams.get('name') || '';
  var selarEmail     = landingParams.get('email') || '';
  var landingFbclid  = landingParams.get('fbclid') || '';
  var landingOrderId = landingParams.get('order_id') || landingParams.get('orderId') || '';

  var existingFbc = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('_fbc=');
  });

  if (landingFbclid && !existingFbc) {
    var fbcValue = 'fb.1.' + Date.now() + '.' + landingFbclid;
    document.cookie = '_fbc=' + encodeURIComponent(fbcValue) + '; Path=/; Max-Age=7776000; SameSite=Lax; Secure';
  }

  // Clean URL
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

  if (!ATTRIBUTION_ENDPOINT || !TELEGRAM_BASE) {
    console.warn('Attribution bridge disabled: missing config.');
    return;
  }

  var telegramLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href*="t.me/"], a[href*="telegram.me/"]')
  );

  if (telegramLinks.length === 0) {
    return;
  }

  var originalHrefs = telegramLinks.map(function (link) { return link.href; });
  var attributionReady = false;

  telegramLinks.forEach(function (link) {
    link.setAttribute('data-original-text', link.textContent);
    link.textContent = '⏳ Preparing secure link... Please wait';
    
    link.addEventListener('click', function (event) {
      if (!attributionReady) {
        event.preventDefault();
        alert('Please wait a moment while we secure your access link.');
      }
    });
  });

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
          reject(new Error("Network error."));
        };

        var endpoint = ATTRIBUTION_ENDPOINT + "?action=check_attribution&token=" +
                       encodeURIComponent(token) + "&callback=" + encodeURIComponent(callbackName);
        script.src = endpoint;
        timeout = setTimeout(function () {
          cleanup();
          reject(new Error("Timeout."));
        }, 5000);
        document.head.appendChild(script);
      });
    }

    return new Promise(async function (resolve, reject) {
      while (Date.now() - startTime < maxWaitMs) {
        try {
          var saved = await pollOnce();
          if (saved) {
            resolve(true);
            return;
          }
        } catch (err) {
          console.warn('Poll failed: ' + err.message);
        }
        await new Promise(function (r) { setTimeout(r, pollIntervalMs); });
      }
      reject(new Error("Timed out."));
    });
  }

  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle) throw new Error('Encryption unavailable.');
    
    var normalizedEmail = selarEmail.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('No email found in URL.');

    var firstName = selarFullName.trim().split(/\s+/)[0] || '';
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    if (!fbc && landingFbclid) fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;

    var emailHash = await sha256Hex(normalizedEmail);
    var firstNameHash = firstName ? await sha256Hex(firstName) : '';
    var token = generateAttributionToken();
    var sharedSecret = String(CFG.attributionSharedSecret || '').trim();

    var formData = new URLSearchParams();
    formData.set('action', 'save_attribution_and_purchase');
    formData.set('token', token);
    formData.set('emailHash', emailHash);
    formData.set('firstNameHash', firstNameHash);
    formData.set('fbp', fbp);
    formData.set('fbc', fbc);
    formData.set('userAgent', navigator.userAgent);
    if (sharedSecret) formData.set('secret', sharedSecret);
    
    if (!IS_FREE_PRODUCT && PRODUCT_TIER && PRODUCT_TIER !== 'free') {
      formData.set('productTier', PRODUCT_TIER);
      formData.set('amount', String(PRODUCT_AMOUNT));
      formData.set('currency', PRODUCT_CURRENCY);
      formData.set('source', PRODUCT_SOURCE);
      if (landingOrderId) formData.set('orderId', landingOrderId);
    }

    await fetch(ATTRIBUTION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      keepalive: true
    });

    await confirmAttributionRecord(token);

    if (FIRE_LEAD_EVENT && window.fbq) {
      try { window.fbq('track', 'Lead', {}, { eventID: token }); } catch (err) {}
    }
    if (FIRE_PURCHASE_EVENT && window.fbq && !IS_FREE_PRODUCT) {
      try {
        window.fbq('track', 'Purchase', {
          value: PRODUCT_AMOUNT, currency: PRODUCT_CURRENCY,
          content_name: PRODUCT_TIER, content_type: 'product'
        }, { eventID: 'PURCHASE_' + token });
      } catch (err) {}
    }

    telegramLinks.forEach(function (link) {
      link.href = TELEGRAM_BASE + token;
      
      // 3-second lock
      setTimeout(function() {
        var originalText = link.getAttribute('data-original-text');
        if (originalText) link.textContent = originalText;
        attributionReady = true;
      }, 3000);
    });
  }

  prepareAttribution().catch(function (err) {
    console.error('[attribution] Failed:', err);
    telegramLinks.forEach(function (link, i) {
      link.href = originalHrefs[i];
      var originalText = link.getAttribute('data-original-text');
      if (originalText) link.textContent = originalText;
    });
    attributionReady = true;
  });

})();
