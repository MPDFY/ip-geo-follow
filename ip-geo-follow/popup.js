const statusText = document.getElementById('statusText');
const enabledToggle = document.getElementById('enabledToggle');
const ipText = document.getElementById('ipText');
const locationText = document.getElementById('locationText');
const latitudeText = document.getElementById('latitudeText');
const longitudeText = document.getElementById('longitudeText');
const updatedAtText = document.getElementById('updatedAtText');
const refreshButton = document.getElementById('refreshButton');

refreshButton.addEventListener('click', async () => {
  refreshButton.disabled = true;
  refreshButton.textContent = '刷新中...';
  const state = await sendMessage({ type: 'refreshNow' });
  renderState(state);
  refreshButton.disabled = false;
  refreshButton.textContent = '立即刷新';
});

enabledToggle.addEventListener('change', async () => {
  const state = await sendMessage({
    type: 'setEnabled',
    enabled: enabledToggle.checked,
  });
  renderState(state);
});

document.addEventListener('DOMContentLoaded', async () => {
  renderState(await sendMessage({ type: 'getState' }));
});

function renderState(state) {
  const location = state?.lastLocation;
  enabledToggle.checked = Boolean(state?.enabled);
  statusText.textContent = state?.status?.text || '等待刷新';

  ipText.textContent = location?.ip || '-';
  locationText.textContent = location?.label || '-';
  latitudeText.textContent = formatNumber(location?.latitude);
  longitudeText.textContent = formatNumber(location?.longitude);
  updatedAtText.textContent = location?.updatedAtText || state?.status?.updatedAtText || '-';
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(6) : '-';
}

function sendMessage(message) {
  return chrome.runtime.sendMessage(message);
}
