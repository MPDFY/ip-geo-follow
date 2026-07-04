# IP Geo Follow Design

## Goal

Build a Chrome and Edge Manifest V3 extension that can be loaded in developer mode and makes browser GPS location follow the current public IP geolocation, matching the usage style of the linux.do reference project.

## Scope

- Provide an unpacked extension folder under `ip-geo-follow/`.
- Fetch public IP geolocation from `https://ipwho.is/`.
- Override webpage `navigator.geolocation.getCurrentPosition` and `navigator.geolocation.watchPosition` in the main world.
- Refresh automatically every minute and support manual refresh from the popup.
- Keep the last successful location if the API request fails.
- Use a privacy fallback location `(0, 0)` when the detected country code is `CN`.
- Avoid build tools so the folder can be loaded directly in Chrome or Edge.

## Architecture

- `background.js` is the extension service worker. It fetches IP geolocation, stores state, injects the spoofing function into tabs, and handles popup messages.
- `src/geo.mjs` contains pure geolocation normalization helpers that can be tested in Node.
- `src/geolocation-spoof.mjs` contains the page-world function used to override `navigator.geolocation`.
- `popup.html`, `popup.css`, and `popup.js` provide a compact status UI and manual refresh control.
- `tests/*.test.mjs` verify the pure behavior with Node's built-in test runner.

## Error Handling

- Invalid API responses produce an explicit failed status and do not overwrite a previous successful location.
- Extension-internal pages and blocked browser pages are skipped when injection is not allowed.
- Disabled state is respected by the background service worker and popup.

## Usage

The user opens `chrome://extensions/` or `edge://extensions/`, enables developer mode, chooses "Load unpacked", and selects the `ip-geo-follow/` folder.
