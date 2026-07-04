# IP Geo Follow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an unpacked Chrome/Edge extension that makes browser GPS geolocation follow the current public IP geolocation.

**Architecture:** The extension uses a Manifest V3 service worker to fetch `ipwho.is`, store the last location, and inject a self-contained geolocation spoofing function into all tabs. Pure modules under `src/` handle location normalization and the injected function so behavior can be covered by Node tests.

**Tech Stack:** Manifest V3, Chrome extension APIs, plain HTML/CSS/JavaScript, Node built-in `node:test`.

---

### Task 1: Tests

**Files:**
- Create: `tests/geo.test.mjs`
- Create: `tests/geolocation-spoof.test.mjs`

- [ ] Write tests for normal `ipwho.is` responses, CN privacy fallback, and invalid responses.
- [ ] Write tests for `getCurrentPosition` and `watchPosition` behavior.
- [ ] Run `node --test tests/*.test.mjs` and confirm the tests fail because implementation modules do not exist.

### Task 2: Core Modules

**Files:**
- Create: `ip-geo-follow/src/geo.mjs`
- Create: `ip-geo-follow/src/geolocation-spoof.mjs`

- [ ] Implement location normalization and default settings.
- [ ] Implement the injected geolocation override function.
- [ ] Run `node --test tests/*.test.mjs` and confirm tests pass.

### Task 3: Extension Shell

**Files:**
- Create: `ip-geo-follow/manifest.json`
- Create: `ip-geo-follow/background.js`
- Create: `ip-geo-follow/popup.html`
- Create: `ip-geo-follow/popup.css`
- Create: `ip-geo-follow/popup.js`
- Create: `ip-geo-follow/README.md`

- [ ] Implement background alarm, startup refresh, tab injection, storage, and popup messages.
- [ ] Implement popup status display, enabled toggle, and manual refresh button.
- [ ] Document Chrome and Edge developer-mode loading.

### Task 4: Verification

**Files:**
- Test: `tests/*.test.mjs`
- Inspect: `ip-geo-follow/manifest.json`

- [ ] Run `node --test tests/*.test.mjs`.
- [ ] Parse `manifest.json` as JSON.
- [ ] Inspect the final file tree.
