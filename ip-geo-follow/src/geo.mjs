export const DEFAULT_SETTINGS = Object.freeze({
  enabled: true,
  refreshMinutes: 1,
  privacyFallbackForCN: true,
  fallbackLocation: Object.freeze({
    latitude: 0,
    longitude: 0,
    country: 'Privacy fallback',
    countryCode: 'CN',
    label: 'Privacy fallback',
  }),
});

export function normalizeIpwhoResponse(data, settings = DEFAULT_SETTINGS) {
  if (!data || data.success === false) {
    return {
      ok: false,
      error: data?.message || 'ipwho.is request failed',
    };
  }

  const countryCode = String(data.country_code || '').toUpperCase();
  if (countryCode === 'CN' && settings.privacyFallbackForCN) {
    return {
      ok: true,
      location: {
        ...settings.fallbackLocation,
        ip: data.ip || '',
        countryCode,
        privacyFallback: true,
        source: 'ipwho.is',
      },
    };
  }

  if (!Number.isFinite(data.latitude) || !Number.isFinite(data.longitude)) {
    return {
      ok: false,
      error: 'ipwho.is response did not include numeric coordinates',
    };
  }

  return {
    ok: true,
    location: {
      ip: data.ip || '',
      latitude: data.latitude,
      longitude: data.longitude,
      country: data.country || '',
      countryCode,
      region: data.region || '',
      city: data.city || '',
      label: formatLocationLabel(data),
      privacyFallback: false,
      source: 'ipwho.is',
    },
  };
}

export function formatLocationLabel(data) {
  const parts = [data.city, data.region, data.country]
    .map((part) => String(part || '').trim())
    .filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Unknown location';
}

export function withUpdateMetadata(location, now = new Date()) {
  return {
    ...location,
    accuracy: Number.isFinite(location.accuracy) ? location.accuracy : 25,
    updatedAt: now.toISOString(),
    updatedAtText: now.toLocaleString(),
  };
}

export function sameCoordinates(a, b) {
  return Boolean(
    a
    && b
    && a.latitude === b.latitude
    && a.longitude === b.longitude
  );
}
