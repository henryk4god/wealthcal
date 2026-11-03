(function () {
  'use strict';

  const config = window.AIOPFINDER_CONFIG;
  if (!config) {
    console.error('AIOPFINDER_CONFIG is missing. Load funnel-config.js before script.js.');
    return;
  }

  const landingParams = new URLSearchParams(window.location.search);
  const selarFullName = landingParams.get('fullname') || '';
  const selarEmail = landingParams.get('email') || '';
  const landingFbclid = landingParams.get('fbclid') || '';

  // Preserve or create _fbc only when a real fbclid was supplied.
  const existingFbc = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('_fbc=');
  });
  if (landingFbclid && !existingFbc) {
    const fbcValue = 'fb.1.' + Date.now() + '.' + landingFbclid;
    document.cookie = '_fbc=' + encodeURIComponent(fbcValue) +
      '; Path=/; Max-Age=7776000; SameSite=Lax; Secure';
  }

  // Remove Selar PII and fbclid from the visible URL before Pixel PageView.
  if (landingParams.has('fullname') || landingParams.has('email') || landingParams.has('fbclid')) {
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('fullname');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('fbclid');
    window.history.replaceState({}, document.title,
      cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  function validHttpsUrl(value, label) {
    try {
      const parsed = new URL(String(value || ''));
      if (parsed.protocol !== 'https:') throw new Error('HTTPS required');
      return parsed.href;
    } catch (err) {
      throw new Error(label + ' is missing or is not a valid HTTPS URL.');
    }
  }

  function buildTelegramUrl(startPayload) {
    const base = validHttpsUrl(config.telegramBotUrl, 'Telegram bot URL');
    const url = new URL(base);
    const botName = url.pathname.replace(/^\/+/, '').split('/')[0];
    if (!botName || /^REPLACE_/i.test(botName) || !/^[A-Za-z0-9_]{5,}$/.test(botName)) {
      throw new Error('Telegram bot URL must point to a bot username.');
    }
    return 'https://t.me/' + botName + '?start=' + encodeURIComponent(startPayload);
  }

  // Pixel ID is customer-configurable; no fixed customer ID remains in the page.
  if (config.pixelId && !/^REPLACE_/.test(config.pixelId)) {
    !function(f,b,e,v,n,t,s) {
      if (f.fbq) return;
      n = f.fbq = function() { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', String(config.pixelId));
    window.fbq('track', 'PageView');
  } else {
    console.warn('Meta Pixel is not configured. PageView was not sent.');
  }

  const telegramButton = document.querySelector('[data-funnel-telegram]');
  const whatsappButton = document.querySelector('[data-funnel-whatsapp]');
  if (whatsappButton) {
    const number = String(config.whatsappNumber || '').replace(/\D/g, '');
    if (number) {
      whatsappButton.href = 'https://wa.me/' + number +
        '?text=' + encodeURIComponent(String(config.whatsappMessage || 'Hello, I need help.'));
    } else {
      whatsappButton.hidden = true;
    }
  }

  if (!telegramButton) {
    console.error('Telegram button with data-funnel-telegram was not found.');
    return;
  }

  const endpoint = String(config.attributionEndpoint || '').trim();
  const fallbackPayload = String(config.telegramFallbackStart || '');
  let attributionReady = false;
  telegramButton.setAttribute('aria-disabled', 'true');
  telegramButton.addEventListener('click', function (event) {
    if (!attributionReady) {
      event.preventDefault();
      telegramButton.textContent = 'Preparing your secure Telegram link…';
    }
  });

  function getCookie(name) {
    const prefix = name + '=';
    const item = document.cookie.split(';').map(function (part) { return part.trim(); })
      .find(function (part) { return part.indexOf(prefix) === 0; });
    if (!item) return '';
    try { return decodeURIComponent(item.substring(prefix.length)); }
    catch (err) { return item.substring(prefix.length); }
  }

  async function sha256Hex(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    return Array.from(new Uint8Array(digest)).map(function (byte) {
      return ('0' + byte.toString(16)).slice(-2);
    }).join('');
  }

  function generateToken() {
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(function (byte) {
      return ('0' + byte.toString(16)).slice(-2);
    }).join('');
  }

  function confirmAttributionRecord(token) {
    return new Promise(function (resolve, reject) {
      const callbackName = 'aiofAttributionCallback_' + token;
      const script = document.createElement('script');
      let finished = false;
      let timeoutId;
      function cleanup() {
        if (finished) return;
        finished = true;
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[callbackName] = function (result) {
        cleanup();
        if (result && result.ok === true) resolve(true);
        else reject(new Error('Apps Script did not confirm the saved attribution record.'));
      };
      script.onerror = function () {
        cleanup();
        reject(new Error('Could not contact the attribution confirmation endpoint.'));
      };
      script.src = endpoint + '?action=check_attribution&token=' + encodeURIComponent(token) +
        '&callback=' + encodeURIComponent(callbackName);
      timeoutId = setTimeout(function () {
        cleanup();
        reject(new Error('Attribution confirmation timed out.'));
      }, 15000);
      document.head.appendChild(script);
    });
  }

  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle || !window.crypto.getRandomValues) {
      throw new Error('Secure browser encryption is unavailable.');
    }
    validHttpsUrl(endpoint, 'Apps Script attribution endpoint');
    const email = String(selarEmail).trim().toLowerCase();
    const firstName = String(selarFullName).trim().split(/\s+/)[0] || '';
    if (!email) throw new Error('Selar customer email is missing from the success-page URL.');

    const token = generateToken();
    const formData = new URLSearchParams();
    formData.set('action', 'save_attribution');
    formData.set('token', token);
    formData.set('emailHash', await sha256Hex(email));
    formData.set('firstNameHash', firstName ? await sha256Hex(firstName) : '');
    formData.set('fbp', getCookie('_fbp'));
    let fbc = getCookie('_fbc');
    if (!fbc && landingFbclid) fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;
    formData.set('fbc', fbc);
    formData.set('userAgent', navigator.userAgent);
    formData.set('tenantId', String(config.tenantId || 'default'));
    formData.set('productId', String(config.productId || 'ai_opportunity_finder'));
    formData.set('campaignId', String(config.campaignId || 'facebook_guide'));

    // no-cors POST is intentionally followed by a JSONP read-back confirmation.
    await fetch(endpoint, { method: 'POST', mode: 'no-cors', body: formData, cache: 'no-store' });
    await confirmAttributionRecord(token);

    const prefix = String(config.telegramStartPrefix || 'facebook_guide_');
    const payload = prefix + token;
    if (payload.length > 64) throw new Error('Telegram attribution parameter exceeds Telegram’s limit.');
    telegramButton.href = buildTelegramUrl(payload);
    telegramButton.textContent = telegramButton.getAttribute('data-ready-label') || '👉 Click here to open the Telegram bot';
    telegramButton.removeAttribute('aria-disabled');
    attributionReady = true;
  }

  prepareAttribution().catch(function (err) {
    console.error('Attribution preparation failed:', err);
    // Fail safely: permit guide access, but the bot will not count a tokenless click as a Lead.
    try {
      telegramButton.href = buildTelegramUrl(fallbackPayload);
      telegramButton.textContent = '👉 Continue to Telegram (without attribution)';
      telegramButton.removeAttribute('aria-disabled');
      attributionReady = true;
    } catch (linkError) {
      telegramButton.textContent = 'Telegram link is temporarily unavailable. Please use WhatsApp support.';
      telegramButton.setAttribute('aria-disabled', 'true');
    }
  });
})();
