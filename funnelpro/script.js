/**
 * script.js — Universal Attribution Bridge (Free & Paid Flow)
 * ===========================================================
 */

(function () {
  'use strict';

  var CFG = window.CLASSROOM_CONFIG || {};
  var ATTRIBUTION_ENDPOINT = String(CFG.attributionEndpoint || "").trim();
  var META_PIXEL_ID = String(CFG.metaPixelId || "").trim();
  
  // Check if we are on the free guide page or the paid page
  var IS_FREE_PRODUCT = window.location.pathname.indexOf("index-paid") === -1;

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

  async function saveAttribution(email, name) {
    if (!email || !ATTRIBUTION_ENDPOINT) return null;
    
    try {
      var emailHash = await sha256Hex(email);
      var firstNameHash = name ? await sha256Hex(name.split(' ')[0]) : "";
      var token = generateToken();
      var sharedSecret = String(CFG.attributionSharedSecret || '').trim();
      var fbp = getCookie('_fbp');
      var fbc = getCookie('_fbc');
      if (!fbc && landingFbclid) fbc = 'fb.1.' + Date.now() + '.' + landingFbclid;

      var formData = new URLSearchParams();
      formData.set('action', 'save_attribution');
      formData.set('token', token);
      formData.set('emailHash', emailHash);
      formData.set('firstNameHash', firstNameHash);
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
      return token;
    } catch (err) {
      console.warn("Attribution save failed:", err);
      return null;
    }
  }

  function setupWhatsAppButton(email) {
    var waNumber = String(CFG.supportWhatsappNumber || "").trim();
    var defaultMsg = String(CFG.supportWhatsappMessage || "Hello, I just purchased.").trim();
    var finalMsg = defaultMsg + (email ? "\n\nMy email: " + email : "");

    var waBtn = document.getElementById("whatsapp-redirect-btn");
    if (waNumber && waBtn) {
      waBtn.href = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(finalMsg);
    }
  }

  async function init() {
    var botHandle = String(CFG.telegramBotHandle || "").trim().replace(/^@/, "");

    // ============================================
    // SCENARIO 1: FREE GUIDE PAGE (index.html)
    // ============================================
    if (IS_FREE_PRODUCT) {
      var freeBtn = document.getElementById("free-guide-btn");
      var fgForm = document.getElementById("free-guide-form");
      var fgName = document.getElementById("fg-name");
      var fgEmail = document.getElementById("fg-email");

      if (freeBtn && botHandle) {
        if (urlEmail) {
          // URL has email -> Hide form, save in background, update link
          if (fgForm) fgForm.style.display = "none";
          
          var token = await saveAttribution(urlEmail, urlName);
          if (token) {
            freeBtn.href = "https://t.me/" + botHandle + "?start=facebook_guide_" + token;
          }
        } else {
          // No email -> Show form, wait for click
          if (fgForm) fgForm.style.display = "block";
          
          freeBtn.addEventListener("click", async function(event) {
            event.preventDefault(); // Stop link temporarily
            
            var typedEmail = fgEmail ? fgEmail.value.trim() : "";
            var typedName = fgName ? fgName.value.trim() : "";
            
            if (!typedEmail || typedEmail.indexOf("@") === -1) {
              alert("Please enter a valid email address to get your free guide.");
              return;
            }
            if (!typedName) {
              alert("Please enter your first name.");
              return;
            }

            var originalText = freeBtn.innerHTML;
            freeBtn.innerHTML = "⏳ Preparing link...";

            var token = await saveAttribution(typedEmail, typedName);
            
            if (token) {
              window.location.href = "https://t.me/" + botHandle + "?start=facebook_guide_" + token;
            } else {
              window.location.href = "https://t.me/" + botHandle + "?start=facebook_guide";
            }
          });
        }
      }
    } 
    // ============================================
    // SCENARIO 2: PAID PAGE (index-paid.html)
    // ============================================
    else {
      var emailInputContainer = document.getElementById("email-fallback-container");
      var emailInputField = document.getElementById("buyer-email");
      var nameInputField = document.getElementById("buyer-name");
      var waBtn = document.getElementById("whatsapp-redirect-btn");

      if (urlEmail) {
        await saveAttribution(urlEmail, urlName);
        setupWhatsAppButton(urlEmail);
      } else {
        if (emailInputContainer) emailInputContainer.style.display = "block";
        
        if (waBtn) {
          waBtn.addEventListener("click", async function(event) {
            var typedEmail = emailInputField ? emailInputField.value.trim() : "";
            var typedName = nameInputField ? nameInputField.value.trim() : "";
            
            if (!typedEmail || typedEmail.indexOf("@") === -1) {
              event.preventDefault(); 
              alert("Please enter a valid email address before continuing.");
              return;
            }
            if (!typedName) {
              event.preventDefault(); 
              alert("Please enter your first name before continuing.");
              return;
            }
            setupWhatsAppButton(typedEmail);
            saveAttribution(typedEmail, typedName);
          });
        }
      }
    }
  }

  window.addEventListener("load", init);

})();
