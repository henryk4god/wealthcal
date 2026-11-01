// Meta Pixel: browser-side PageView and Lead tracking.
// This is the same tracking logic as the original standalone HTML.

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1517538563417489');
fbq('track', 'PageView');

// Fire Lead once per browser tab session to reduce duplicate events on refresh.
// This is browser-side tracking only; it does not send a Conversions API event.
try {
  if (!sessionStorage.getItem('aiof_lead_tracked_v1')) {
    fbq('track', 'Lead');
    sessionStorage.setItem('aiof_lead_tracked_v1', '1');
  }
} catch (e) {
  // If sessionStorage is unavailable, still send the Lead event.
  fbq('track', 'Lead');
}
