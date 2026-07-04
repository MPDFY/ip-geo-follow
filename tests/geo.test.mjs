import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_SETTINGS,
  normalizeIpwhoResponse,
} from '../ip-geo-follow/src/geo.mjs';

test('normalizes a successful non-CN ipwho.is response', () => {
  const location = normalizeIpwhoResponse({
    success: true,
    ip: '203.0.113.42',
    country_code: 'JP',
    country: 'Japan',
    region: 'Tokyo',
    city: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
  }, DEFAULT_SETTINGS);

  assert.equal(location.ok, true);
  assert.equal(location.location.latitude, 35.6762);
  assert.equal(location.location.longitude, 139.6503);
  assert.equal(location.location.countryCode, 'JP');
  assert.equal(location.location.label, 'Tokyo, Tokyo, Japan');
  assert.equal(location.location.source, 'ipwho.is');
});

test('uses the privacy fallback for CN responses by default', () => {
  const location = normalizeIpwhoResponse({
    success: true,
    ip: '198.51.100.8',
    country_code: 'CN',
    country: 'China',
    region: 'Guangdong',
    city: 'Shenzhen',
    latitude: 22.5431,
    longitude: 114.0579,
  }, DEFAULT_SETTINGS);

  assert.equal(location.ok, true);
  assert.equal(location.location.latitude, 0);
  assert.equal(location.location.longitude, 0);
  assert.equal(location.location.countryCode, 'CN');
  assert.equal(location.location.privacyFallback, true);
  assert.equal(location.location.label, 'Privacy fallback');
});

test('rejects responses without numeric coordinates', () => {
  const location = normalizeIpwhoResponse({
    success: true,
    ip: '203.0.113.9',
    country_code: 'US',
    country: 'United States',
    latitude: null,
    longitude: -74.006,
  }, DEFAULT_SETTINGS);

  assert.equal(location.ok, false);
  assert.equal(location.error, 'ipwho.is response did not include numeric coordinates');
});
