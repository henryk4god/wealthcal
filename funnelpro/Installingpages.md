
## 📦 Installing on Custom Landing Pages (Scenario 2 & 5)

If you're using your own landing page (WordPress, Webflow, Framer, Shopify, custom HTML), install `attribution-snippet.js` in 2 steps.

### Step 1: Add the config + snippet to your page

Paste this **just before the closing `</body>` tag**:

```html
<script>
  window.CLASSROOM_CONFIG = {
    attributionEndpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
    telegramBotHandle: "YourBotUsername",
    metaPixelId: "YOUR_PIXEL_ID",
    attributionSharedSecret: "",
    brandName: "Your Classroom",
    supportWhatsappNumber: "+1234567890",
    supportWhatsappMessage: "Hello, I need help."
  };
</script>
<script src="https://your-cdn.com/attribution-snippet.js"></script>
```

Or upload attribution-snippet.js to your site and use:

```html
<script src="/attribution-snippet.js"></script>
```

Step 2: Ensure your Telegram link uses a tag

Any of these formats will be auto-detected:

```html
<a href="https://t.me/YourBotUsername">Open Telegram</a>
<a href="https://t.me/YourBotUsername?start=facebook_guide" class="btn">Join Now</a>
<a href="https://telegram.me/YourBotUsername">Get Free Guide</a>
```

You don't need to add ?start= — the snippet handles it.

Step 3: Ensure your checkout passes email and fullname in the URL

If the user is coming from Selar, Selar will auto-append these to the redirect URL. Verify your Selar redirect is:

```
https://your-page.com?fullname={fullname}&email={email}
```

If the user is NOT from Selar (e.g., direct from ad), they won't have an email. The snippet requires an email to run. For direct-from-ad flows, either:

· Use Scenario 3 (GitHub page with email capture form), OR
· Use Scenario 4 (direct to bot — no email needed but no attribution)

Verify it works

Open DevTools Console. You should see:

```
[attribution-snippet] Found 1 Telegram link(s) to enhance.
[attribution-snippet] 📤 Sending attribution POST...
[attribution-snippet] 📤 POST sent, waiting for confirmation...
[attribution-snippet] ✅ Attribution confirmed after 2341ms
[attribution-snippet] ✅ Attribution ready. Telegram links updated.
```

Common issues

Issue Fix
No console logs appear Check the <script> path is correct
"No email found in URL" Add ?email=test@example.com to test URL
"No Telegram links found" Add <a href="https://t.me/YourBot"> to page
Attribution never confirms Check attributionEndpoint URL is /exec (not /dev)





## 🎯 What This Solves

| Scenario | Before Part 2 | After Part 2 |
|---|---|---|
| 1 (Selar → bot) | ⚠️ Weak attribution | ⚠️ Same (needs HTML page for attribution) |
| **2 (Custom HTML → bot)** | ❌ Broken | ✅ **Works — 1-line install** |
| 3 (GitHub → bot) | ✅ Works | ✅ Works (unchanged) |
| 4 (Direct → bot) | ⚠️ Poor matching | ⚠️ Same (no email available) |
| **5 (Selar → Custom HTML → bot)** | ❌ Broken | ✅ **Works — 1-line install** |

**Buyers can now use WordPress, Webflow, Framer



/**
 * attribution-snippet.js — Universal Attribution Bridge (TIER 3)
 * ==============================================================
 * 
 * Drop this into ANY landing page with a single <script> tag.
 * Works on WordPress, Webflow, Framer, custom HTML, Shopify, etc.
 * 
 * SETUP (2 steps):
 * 
 * 1. Add this BEFORE the closing </body> tag:
 * 
 *    <script>
 *      window.CLASSROOM_CONFIG = {
 *        attributionEndpoint: "YOUR_APPS_SCRIPT_EXEC_URL",
 *        telegramBotHandle: "YOUR_BOT_USERNAME",
 *        metaPixelId: "YOUR_PIXEL_ID",
 *        attributionSharedSecret: "",
 *        brandName: "Your Classroom",
 *        supportWhatsappNumber: "",
 *        supportWhatsappMessage: "Hello, I need help."
 *      };
 *    </script>
 *    <script src="attribution-snippet.js"></script>
 * 
 * 2. Any link to your Telegram bot should have:
 *    - class="btn-tg" (or the attribution will auto-detect t.me links)
 *    - href="https://t.me/YOUR_BOT" (or with ?start= — it will be rewritten)
 * 
 * WHAT IT DOES:
 * 
 * 1. Reads email + fullname from URL params (Selar passes these)
 * 2. Captures fbclid from URL (Facebook ad click)
 * 3. Hashes email + first name with SHA-256
 * 4. POSTs to Apps Script with a unique token
 * 5. Polls Apps Script to confirm the save
 * 6. Rewrites ALL Telegram links on the page to include the token
 * 
 * Works with or without Meta Pixel. Does NOT require your page
 * to have a specific structure.
 */

(function () {
  'use strict';

  var CFG = window.CLASSROOM_CONFIG || {};
  var ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  var TELEGRAM_BOT_HANDLE = String(CFG.telegramBotHandle || "").trim().replace(/^@/, "");
  var TELEGRAM_BASE = TELEGRAM_BOT_HANDLE ? "https://t.me/" + TELEGRAM_BOT_HANDLE + "?start=facebook_guide_" : "";
  var META_PIXEL_ID = String(CFG.metaPixelId || "").trim();

  // ---- 1. Save Selar params before cleaning URL ----
  var landingParams = new URLSearchParams(window.location.search);
  var selarFullName = landingParams.get('fullname') || landingParams.get('name') || '';
  var selarEmail = landingParams.get('email') || '';
  var landingFbclid = landingParams.get('fbclid') || '';

  // Preserve existing _fbc cookie
  var existingFbc = document.cookie.split(';').some(function (cookie) {
    return cookie.trim().startsWith('_fbc=');
  });

  if (landingFbclid && !existingFbc) {
    var fbcValue = 'fb.1.' + Date.now() + '.' + landingFbclid;
    document.cookie = '_fbc=' + encodeURIComponent(fbcValue) + '; Path=/; Max-Age=7776000; SameSite=Lax; Secure';
  }

  // Clean URL
  if (landingParams.has('fullname') || landingParams.has('email') || landingParams.has('fbclid') || landingParams.has('name')) {
    var cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('fullname');
    cleanUrl.searchParams.delete('name');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('fbclid');
    window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
  }

  // ---- 2. Meta Pixel (only if configured) ----
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

  // ---- 3. Guard: attribution requires endpoint + bot handle ----
  if (!ATTRIBUTION_ENDPOINT || !TELEGRAM_BASE) {
    console.warn('[attribution-snippet] Missing attributionEndpoint or telegramBotHandle in CLASSROOM_CONFIG.');
    return;
  }

  // ---- 4. Find ALL Telegram links on the page ----
  var telegramLinks = Array.prototype.slice.call(
    document.querySelectorAll('a[href*="t.me/"], a[href*="telegram.me/"]')
  );

  if (telegramLinks.length === 0) {
    console.warn('[attribution-snippet] No Telegram links found on page. Attribution will still run, but links won\'t be rewritten.');
  } else {
    console.log('[attribution-snippet] Found ' + telegramLinks.length + ' Telegram link(s) to enhance.');
  }

  // Store original hrefs so we can fall back if attribution fails
  var originalHrefs = telegramLinks.map(function (link) {
    return link.href;
  });

  var attributionReady = false;

  telegramLinks.forEach(function (link, index) {
    link.addEventListener('click', function (event) {
      if (!attributionReady) {
        event.preventDefault();
        link.textContent = 'Preparing your secure Telegram link...';
      }
    });
  });

  // ---- 5. Cookie + hash helpers ----
  function getCookie(name) {
    var prefix = name + '=';
    var item = document.cookie.split(';').map(function (part) { return part.trim(); }).find(function (part) { return part.indexOf(prefix) === 0; });
    if (!item) return '';
    try { return decodeURIComponent(item.substring(prefix.length)); } catch (err) { return item.substring(prefix.length); }
  }

  async function sha256Hex(value) {
    var normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    var encoded = new TextEncoder().encode(normalized);
    var digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest)).map(function (byte) { return ('0' + byte.toString(16)).slice(-2); }).join('');
  }

  function generateAttributionToken() {
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(function (byte) { return ('0' + byte.toString(16)).slice(-2); }).join('');
  }

  // ---- 6. Poll confirmation ----
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

        var endpoint = ATTRIBUTION_ENDPOINT + "?action=check_attribution&token=" + encodeURIComponent(token) + "&callback=" + encodeURIComponent(callbackName);
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
            console.log('[attribution-snippet] ✅ Attribution confirmed after ' + (Date.now() - startTime) + 'ms');
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

  // ---- 7. Prepare and send ----
  async function prepareAttribution() {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Browser encryption unavailable.');
    }

    var normalizedEmail = selarEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('No email found in URL. Add ?email=xxx@example.com or configure your checkout to pass it.');
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

    console.log('[attribution-snippet] 📤 Sending attribution POST...');
    await fetch(ATTRIBUTION_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      cache: 'no-store'
    });

    console.log('[attribution-snippet] 📤 POST sent, waiting for confirmation...');
    await confirmAttributionRecord(token);

    // Rewrite all Telegram links with token
    telegramLinks.forEach(function (link, i) {
      link.href = TELEGRAM_BASE + token;
      var originalText = link.getAttribute('data-original-text');
      if (originalText) {
        link.textContent = originalText;
      }
    });

    attributionReady = true;
    console.log('[attribution-snippet] ✅ Attribution ready. Telegram links updated.');
  }

  // Save original link text so we can restore it
  telegramLinks.forEach(function (link) {
    link.setAttribute('data-original-text', link.textContent);
  });

  prepareAttribution().catch(function (err) {
    console.error('[attribution-snippet] Attribution preparation failed:', err);
    // Restore original links
    telegramLinks.forEach(function (link, i) {
      link.href = originalHrefs[i];
      var originalText = link.getAttribute('data-original-text');
      if (originalText) {
        link.textContent = originalText;
      }
    });
    attributionReady = true;
  });

})();



