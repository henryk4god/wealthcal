(function () {
  'use strict';

  const CFG = window.CLASSROOM_CONFIG || {};

  const ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  const TELEGRAM_BOT_HANDLE = String(CFG.telegramBotHandle || "").trim().replace(/^@/, "");
  const TELEGRAM_BASE = TELEGRAM_BOT_HANDLE ? "https://t.me/" + TELEGRAM_BOT_HANDLE + "?start=facebook_guide_" : "";
  const META_PIXEL_ID = String(CFG.metaPixelId || "").trim();

  // Save Selar params before cleaning URL
  const landingParams = new URLSearchParams(window.location.search);
  const selarFullName = landingParams.get('fullname') || '';
  const selarEmail    = landingParams.get('email')    || '';
  const landingFbclid = landingParams.get('fbclid')   || '';

  const existingFbc = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('_fbc=');
  });

  if (landingFbclid && !existingFbc) {
    const fbcValue = 'fb.1.' + Date.now() + '.' + landingFbclid;
    document.cookie = '_fbc=' + encodeURIComponent(fbcValue) + '; Path=/; Max-Age=7776000; SameSite=Lax; Secure';
  }

  if (landingParams.has('fullname') || landingParams.has('email') || landingParams.has('fbclid')) {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('fullname');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('fbclid');
    window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  // Meta Pixel
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

  const ATTRIBUTION_BRIDGE_ENABLED = Boolean(ATTRIBUTION_ENDPOINT && TELEGRAM_BASE);
  if (!ATTRIBUTION_BRIDGE_ENABLED) {
    console.warn('Attribution bridge disabled: missing config values.');
    return;
  }

  const telegramButton = document.querySelector('a.btn-tg[href*="t.me/"]');
  if (!telegramButton) {
    console.error('Telegram button not found.');
    return;
  }

  const originalHref = telegramButton.href;
  const originalText = telegramButton.textContent;
  let attributionReady = false;

  telegramButton.addEventListener('click', function (event) {
    if (!attributionReady) {
      event.preventDefault();
      telegramButton.textContent = 'Preparing your secure Telegram link...';
    }
  });

  function getCookie(name) {
    const prefix = name + '=';
    const item = document.cookie.split(';').map(function (part) { return part.trim(); }).find(function (part) { return part.indexOf(prefix) === 0; });
    if (!item) return '';
    try { return decodeURIComponent(item.substring(prefix.length)); } catch (err) { return item.substring(prefix.length); }
  }

  async function sha256Hex(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    const encoded = new TextEncoder().encode(normalized);
    const digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest)).map(function (byte) { return ('0' + byte.toString(16)).slice(-2); }).join('');
  }

  function generateAttributionToken() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(function (byte) { return ('0' + byte.toString(16)).slice(-2); }).join('');
  }

  // ==========================================
  // CONFIRM ATTRIBUTION — WITH POLLING
  // ==========================================
  function confirmAttributionRecord(token) {
    const startTime = Date.now();
    const maxWaitMs = 15000;
    const pollIntervalMs = 1000;

    function pollOnce() {
      return new Promise(function (resolve, reject) {
        const callbackName = "aiofAttributionCallback_" + token;
        const script = document.createElement("script");
        let finished = false;
        let timeout = null;

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

        const endpoint = ATTRIBUTION_ENDPOINT + "?action=check_attribution&token=" + encodeURIComponent(token) + "&callback=" + encodeURIComponent(callbackName);
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
          const saved = await pollOnce();
          if (saved) {
            console.log("✅ Attribution confirmed after " + (Date.now() - startTime) + "ms");
            resolve(true);
            return;
          }
        } catch (err) {
          console.warn("Poll attempt failed: " + err.message);
        }
        await new Promise(r => setTimeout(r, pollIntervalMs));
      }
      reject(new Error("Attribution confirmation timed out after 15 seconds."));
    });
  }

  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle) throw new Error('Browser encryption unavailable.');

    const normalizedEmail = selarEmail.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Selar customer email is missing.');

    const firstName = selarFullName.trim().split(/\s+/)[0] || '';
    const fbp = getCookie('_fbp');
    let fbc = getCookie('_fbc');
    if (!fbc && landingFbclid) {
      fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;
    }

    const emailHash = await sha256Hex(normalizedEmail);
    const firstNameHash = firstName ? await sha256Hex(firstName) : '';
    const token = generateAttributionToken();

    const formData = new URLSearchParams();
    formData.set('action', 'save_attribution');
    formData.set('token', token);
    formData.set('emailHash', emailHash);
    formData.set('firstNameHash', firstNameHash);
    formData.set('fbp', fbp);
    formData.set('fbc', fbc);
    formData.set('userAgent', navigator.userAgent);

    const sharedSecret = String(CFG.attributionSharedSecret || '').trim();
    if (sharedSecret) formData.set('secret', sharedSecret);

    console.log("📤 Sending attribution POST...");
// CRITICAL: Google Apps Script reads e.parameter from
// application/x-www-form-urlencoded POSTs. This requires
// mode: 'cors' (no-cors blocks Content-Type handling).
try {
  const postResponse = await fetch(ATTRIBUTION_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString(),
    cache: 'no-store',
    redirect: 'follow'
  });

  console.log("📤 POST HTTP status:", postResponse.status);

  const postBody = await postResponse.text();
  console.log("📤 POST response body:", postBody);
} catch (postErr) {
  console.error("📤 POST threw:", postErr);
  throw new Error("Attribution POST failed: " + postErr.message);
}

console.log("📤 POST sent, waiting for confirmation...");

    await confirmAttributionRecord(token);

    const startParameter = 'facebook_guide_' + token;
    telegramButton.href = TELEGRAM_BASE + token;
    telegramButton.textContent = originalText;
    attributionReady = true;
    console.log("✅ Attribution ready. Button set to: " + telegramButton.href);
  }

  prepareAttribution().catch(function (err) {
    console.error('Attribution preparation failed:', err);
    telegramButton.href = originalHref;
    telegramButton.textContent = originalText;
    attributionReady = true;
  });

})();
