(function () {
  'use strict';

  var CFG = window.CLASSROOM_CONFIG || {};
  var ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  var META_PIXEL_ID = String(CFG.metaPixelId || "").trim();

  var landingParams = new URLSearchParams(window.location.search);
  var urlEmail = landingParams.get('email') || '';
  var urlName = landingParams.get('fullname') || landingParams.get('name') || '';
  var landingFbclid = landingParams.get('fbclid') || '';

  // Meta Pixel Boot
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

  function getCookie(name) {
    var prefix = name + '=';
    var item = document.cookie.split(';').map(p => p.trim()).find(p => p.indexOf(prefix) === 0);
    if (!item) return '';
    try { return decodeURIComponent(item.substring(prefix.length)); } catch (err) { return item.substring(prefix.length); }
  }

  async function sha256Hex(value) {
    var normalized = String(value || '').trim().toLowerCase();
    if (!normalized) return '';
    var encoded = new TextEncoder().encode(normalized);
    var digest = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest)).map(b => ('0' + b.toString(16)).slice(-2)).join('');
  }

  function generateToken() {
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes).map(b => ('0' + b.toString(16)).slice(-2)).join('');
  }

  async function saveAttribution(email) {
    if (!email || !ATTRIBUTION_ENDPOINT) return;
    
    try {
      var emailHash = await sha256Hex(email);
      var token = generateToken();
      var sharedSecret = String(CFG.attributionSharedSecret || '').trim();
      var fbp = getCookie('_fbp');
      var fbc = getCookie('_fbc');
      if (!fbc && landingFbclid) fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;

      var formData = new URLSearchParams();
      formData.set('action', 'save_attribution');
      formData.set('token', token);
      formData.set('emailHash', emailHash);
      formData.set('firstNameHash', '');
      formData.set('fbp', fbp);
      formData.set('fbc', fbc);
      formData.set('userAgent', navigator.userAgent);
      if (sharedSecret) formData.set('secret', sharedSecret);

      await fetch(ATTRIBUTION_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        keepalive: true
      });
    } catch (err) {
      console.warn("Attribution save failed:", err);
    }
  }

  function setupWhatsAppButton(email) {
    var waNumber = String(CFG.supportWhatsappNumber || "").trim();
    var defaultMsg = String(CFG.supportWhatsappMessage || "Hello, I just purchased.").trim();
    
    // If we have an email, add it to the message so the admin can copy it
    var finalMsg = defaultMsg;
    if (email) {
      finalMsg += "\n\nMy email: " + email;
    }

    var waBtn = document.getElementById("whatsapp-redirect-btn");
    if (waNumber && waBtn) {
      waBtn.href = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(finalMsg);
    }
  }

  async function init() {
    var emailInputContainer = document.getElementById("email-fallback-container");
    var emailInputField = document.getElementById("buyer-email");
    var waBtn = document.getElementById("whatsapp-redirect-btn");

    if (urlEmail) {
      // SCENARIO A: Processor passed email in URL (Selar/Gumroad)
      await saveAttribution(urlEmail);
      setupWhatsAppButton(urlEmail);
    } else {
      // SCENARIO B: No email in URL (Paystack/Stripe)
      // Show the email input field
      if (emailInputContainer) emailInputContainer.style.display = "block";
      
      // Change the button to handle the click
      if (waBtn) {
        waBtn.addEventListener("click", async function(event) {
          var typedEmail = emailInputField ? emailInputField.value.trim() : "";
          
          if (!typedEmail || typedEmail.indexOf("@") === -1) {
            event.preventDefault(); // Stop the link
            alert("Please enter a valid email address before continuing.");
            return;
          }

          // Temporarily change button text to show it's saving
          var originalText = waBtn.innerHTML;
          waBtn.innerHTML = "⏳ Preparing WhatsApp link...";

          await saveAttribution(typedEmail);
          setupWhatsAppButton(typedEmail);
          
          // Restore text and let the click proceed
          waBtn.innerHTML = originalText;
        });
      }
    }
  }

  // Wait for page to load, then run
  window.addEventListener("load", init);

})();
