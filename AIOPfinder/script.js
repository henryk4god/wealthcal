
(function () {

  // ==========================================
  // 1. EXISTING META PIXEL: PRESERVE PAGEVIEW
  // ==========================================

  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
  s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', '1517538563417489');
  window.fbq('track', 'PageView');


  // ==========================================
  // 2. ATTRIBUTION BRIDGE CONTROL
  // ==========================================

  // KEEP FALSE UNTIL THE TELEGRAM BOT IS UPDATED.
  const ATTRIBUTION_BRIDGE_ENABLED = false;

  if (!ATTRIBUTION_BRIDGE_ENABLED) {
    return;
  }


  // ==========================================
  // 3. CONFIGURATION
  // ==========================================

  const ATTRIBUTION_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbynVX4I8qKxsC_hj9Irb8I9izbcnq4yAHjg3taj3PmXJ8ECFkT3XYq8uo3GmyW5Qt7P/exec';

  const TELEGRAM_BASE =
    'https://t.me/AIA_CSbot?start=facebook_guide_';


  // ==========================================
  // 4. FIND THE TELEGRAM BUTTON
  // ==========================================

  const telegramButton = document.querySelector(
    'a.btn-tg[href*="t.me/AIA_CSbot"]'
  );

  if (!telegramButton) {
    console.error('AIOPfinder Telegram button not found.');
    return;
  }

  const originalHref = telegramButton.href;
  const originalText = telegramButton.textContent;

  let attributionReady = false;

  telegramButton.addEventListener('click', function (event) {

    if (!attributionReady) {
      event.preventDefault();

      telegramButton.textContent =
        'Preparing your secure Telegram link...';

      console.log('Please wait for attribution preparation.');
    }

  });


  // ==========================================
  // 5. READ FACEBOOK COOKIES
  // ==========================================

  function getCookie(name) {

    const prefix = name + '=';

    const item = document.cookie
      .split(';')
      .map(function (part) {
        return part.trim();
      })
      .find(function (part) {
        return part.indexOf(prefix) === 0;
      });

    if (!item) return '';

    try {
      return decodeURIComponent(
        item.substring(prefix.length)
      );
    } catch (err) {
      return item.substring(prefix.length);
    }
  }


  // ==========================================
  // 6. GENERATE SHA-256 HASH
  // ==========================================

  async function sha256Hex(value) {

    const normalized = String(value || '')
      .trim()
      .toLowerCase();

    if (!normalized) return '';

    const encoded = new TextEncoder().encode(normalized);

    const digest = await window.crypto.subtle.digest(
      'SHA-256',
      encoded
    );

    return Array.from(new Uint8Array(digest))
      .map(function (byte) {
        return ('0' + byte.toString(16)).slice(-2);
      })
      .join('');
  }


  // ==========================================
  // 7. GENERATE SECURE RANDOM TOKEN
  // ==========================================

  function generateAttributionToken() {

    const bytes = new Uint8Array(16);

    window.crypto.getRandomValues(bytes);

    return Array.from(bytes)
      .map(function (byte) {
        return ('0' + byte.toString(16)).slice(-2);
      })
      .join('');
  }


  // ==========================================
  // 8. PREPARE ATTRIBUTION RECORD
  // ==========================================

  async function prepareAttribution() {

    if (
      !window.crypto ||
      !window.crypto.subtle ||
      !window.crypto.getRandomValues
    ) {
      throw new Error('Secure browser encryption is unavailable.');
    }

    const params = new URLSearchParams(
      window.location.search
    );

    // Read Selar customer information.
    const fullName = params.get('fullname') || '';
    const email = params.get('email') || '';

    const normalizedEmail = email.trim().toLowerCase();

    const firstName = fullName.trim()
      .split(/\s+/)[0] || '';

    // Customer email is required by the current sheet function.
    if (!normalizedEmail) {
      throw new Error('Selar customer email is missing.');
    }

    // Read Facebook browser identifier.
    const fbp = getCookie('_fbp');

    // Read genuine Facebook click information.
    let fbc = getCookie('_fbc');

    const fbclid = params.get('fbclid');

    // Build fbc only when a genuine fbclid is present.
    if (!fbc && fbclid) {
      fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    }

    // Hash customer information before transmission.
    const emailHash = await sha256Hex(normalizedEmail);

    const firstNameHash = firstName
      ? await sha256Hex(firstName)
      : '';

    // Create a random attribution reference.
    const token = generateAttributionToken();

    // Remove personal customer information from the address bar.
    // Preserve unrelated campaign parameters.
    const cleanUrl = new URL(window.location.href);

    cleanUrl.searchParams.delete('fullname');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('fbclid');

    window.history.replaceState(
      {},
      document.title,
      cleanUrl.pathname +
      cleanUrl.search +
      cleanUrl.hash
    );


    // ==========================================
    // 9. SUBMIT ATTRIBUTION TO GOOGLE APPS SCRIPT
    // ==========================================

    const formData = new URLSearchParams();

    formData.set('action', 'save_attribution');
    formData.set('token', token);
    formData.set('emailHash', emailHash);
    formData.set('firstNameHash', firstNameHash);
    formData.set('fbp', fbp);
    formData.set('fbc', fbc);
    formData.set('userAgent', navigator.userAgent);


    // Form-encoded POST avoids a CORS preflight.
    // The opaque response cannot confirm that the sheet
    // was updated. We will verify the record separately.
    await fetch(ATTRIBUTION_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
      cache: 'no-store'
    });


    // ==========================================
    // 10. PREPARE TELEGRAM DEEP LINK
    // ==========================================

    const startParameter =
      'facebook_guide_' + token;

    if (startParameter.length > 64) {
      throw new Error('Telegram attribution parameter is too long.');
    }

    telegramButton.href = TELEGRAM_BASE + token;

    telegramButton.textContent = originalText;

    attributionReady = true;

    console.log(
      'Attribution submission completed. ' +
      'Verify the AttributionBridge sheet before activation.'
    );
  }


  // ==========================================
  // 11. RUN ATTRIBUTION PREPARATION
  // ==========================================

  prepareAttribution().catch(function (err) {

    console.error('Attribution preparation failed:', err);

    // Preserve the original working Telegram route
    // if attribution preparation fails.
    telegramButton.href = originalHref;

    telegramButton.textContent = originalText;

    attributionReady = true;

  });

})();
