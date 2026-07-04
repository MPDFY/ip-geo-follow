import test from 'node:test';
import assert from 'node:assert/strict';

import { installGeolocationSpoof } from '../ip-geo-follow/src/geolocation-spoof.mjs';

test('getCurrentPosition returns the spoofed coordinates', async () => {
  const navigatorLike = { geolocation: {} };

  installGeolocationSpoof({
    latitude: 51.5072,
    longitude: -0.1276,
    accuracy: 25,
    timestamp: 123456,
  }, navigatorLike);

  const position = await new Promise((resolve) => {
    navigatorLike.geolocation.getCurrentPosition(resolve);
  });

  assert.equal(position.coords.latitude, 51.5072);
  assert.equal(position.coords.longitude, -0.1276);
  assert.equal(position.coords.accuracy, 25);
  assert.equal(position.timestamp, 123456);
});

test('watchPosition immediately emits the spoofed position and returns a watch id', async () => {
  const navigatorLike = { geolocation: {} };

  installGeolocationSpoof({
    latitude: 40.7128,
    longitude: -74.006,
    accuracy: 18,
    timestamp: 987654,
  }, navigatorLike);

  let watchId = 0;
  const position = await new Promise((resolve) => {
    watchId = navigatorLike.geolocation.watchPosition(resolve);
  });

  assert.equal(Number.isInteger(watchId), true);
  assert.equal(position.coords.latitude, 40.7128);
  assert.equal(position.coords.longitude, -74.006);
});
