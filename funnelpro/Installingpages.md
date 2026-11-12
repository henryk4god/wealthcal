
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


