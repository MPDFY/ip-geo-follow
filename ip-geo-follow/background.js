import {
  DEFAULT_SETTINGS,
  normalizeIpwhoResponse,
  sameCoordinates,
  withUpdateMetadata,
} from './src/geo.mjs';
import { installGeolocationSpoof } from './src/geolocation-spoof.mjs';

const API_URL = 'https://ipwho.is/';
const ALARM_NAME = 'ipGeoFollowRefresh';

chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await chrome.alarms.create(ALARM_NAME, { periodInMinutes: DEFAULT_SETTINGS.refreshMinutes });
  await refreshLocation({ force: true });
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await refreshLocation({ force: true });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    refreshLocation({ force: false });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    injectIntoTab(tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'getState') {
    getPublicState().then(sendResponse);
    return true;
  }

  if (message?.type === 'refreshNow') {
    refreshLocation({ force: true }).then(getPublicState).then(sendResponse);
    return true;
  }

  if (message?.type === 'setEnabled') {
    setEnabled(Boolean(message.enabled)).then(getPublicState).then(sendResponse);
    return true;
  }

  return false;
});

async function ensureDefaults() {
  const stored = await chrome.storage.local.get(['settings', 'enabled']);
  const settings = {
    ...DEFAULT_SETTINGS,
    ...(stored.settings || {}),
    fallbackLocation: {
      ...DEFAULT_SETTINGS.fallbackLocation,
      ...(stored.settings?.fallbackLocation || {}),
    },
  };

  const enabled = typeof stored.enabled === 'boolean' ? stored.enabled : DEFAULT_SETTINGS.enabled;
  await chrome.storage.local.set({ settings, enabled });
}

async function setEnabled(enabled) {
  await ensureDefaults();
  await chrome.storage.local.set({ enabled });
  if (enabled) {
    await refreshLocation({ force: true });
  }
}

async function refreshLocation({ force }) {
  await ensureDefaults();
  const { enabled, settings, lastLocation } = await chrome.storage.local.get([
    'enabled',
    'settings',
    'lastLocation',
  ]);

  if (!enabled) {
    await chrome.storage.local.set({
      status: {
        ok: true,
        text: 'Paused',
        updatedAtText: new Date().toLocaleString(),
      },
    });
    return;
  }

  try {
    const response = await fetch(API_URL, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`ipwho.is returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const normalized = normalizeIpwhoResponse(data, settings);
    if (!normalized.ok) {
      throw new Error(normalized.error);
    }

    const nextLocation = withUpdateMetadata(normalized.location);
    if (!force && sameCoordinates(lastLocation, nextLocation)) {
      await chrome.storage.local.set({
        status: {
          ok: true,
          text: 'Location unchanged',
          updatedAtText: new Date().toLocaleString(),
        },
      });
      return;
    }

    await chrome.storage.local.set({
      lastLocation: nextLocation,
      status: {
        ok: true,
        text: 'Location updated',
        updatedAtText: nextLocation.updatedAtText,
      },
    });
    await injectIntoAllTabs();
  } catch (error) {
    await chrome.storage.local.set({
      status: {
        ok: false,
        text: error instanceof Error ? error.message : String(error),
        updatedAtText: new Date().toLocaleString(),
      },
    });
  }
}

async function injectIntoAllTabs() {
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs.map((tab) => (tab.id ? injectIntoTab(tab.id) : Promise.resolve())));
}

async function injectIntoTab(tabId) {
  const { enabled, lastLocation } = await chrome.storage.local.get(['enabled', 'lastLocation']);
  if (!enabled || !lastLocation) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      world: 'MAIN',
      injectImmediately: true,
      func: installGeolocationSpoof,
      args: [lastLocation],
    });
  } catch (error) {
    // Browser internal pages and restricted extension pages cannot be injected.
  }
}

async function getPublicState() {
  await ensureDefaults();
  const { enabled, lastLocation, status } = await chrome.storage.local.get([
    'enabled',
    'lastLocation',
    'status',
  ]);

  return {
    enabled,
    lastLocation: lastLocation || null,
    status: status || {
      ok: true,
      text: 'Waiting for first refresh',
      updatedAtText: '',
    },
  };
}
