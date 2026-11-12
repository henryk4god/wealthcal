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
