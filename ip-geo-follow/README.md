# IP Geo Follow

Chrome/Edge browser extension that makes webpage GPS geolocation follow the current public IP geolocation.

## Install

1. Open Chrome `chrome://extensions/` or Edge `edge://extensions/`.
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select this `ip-geo-follow` folder.

## Use

- Click the extension icon to view the current spoofed location.
- Click "立即刷新" to refresh the location immediately.
- Keep the toggle enabled to inject the spoofed GPS location into pages.
- Reload a target page after enabling the extension if that page already requested location before injection.

## Notes

- This changes the browser Geolocation API result only. It does not change your real IP address.
- Location data comes from `https://ipwho.is/`.
- If the detected country code is `CN`, the extension uses `(0, 0)` as a privacy fallback by default.
