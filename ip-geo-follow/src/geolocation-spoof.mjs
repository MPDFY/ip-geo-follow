export function installGeolocationSpoof(location, navigatorObject = navigator) {
  if (!navigatorObject) {
    return;
  }

  if (!navigatorObject.geolocation) {
    navigatorObject.geolocation = {};
  }

  const target = navigatorObject.geolocation;
  const makePosition = () => ({
    coords: {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: Number.isFinite(location.accuracy) ? location.accuracy : 25,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Number.isFinite(location.timestamp) ? location.timestamp : Date.now(),
  });

  const getCurrentPosition = (successCallback, errorCallback, options) => {
    if (typeof successCallback === 'function') {
      successCallback(makePosition());
    }
  };

  const watchPosition = (successCallback, errorCallback, options) => {
    getCurrentPosition(successCallback, errorCallback, options);
    return Math.floor(Math.random() * 100000) + 1;
  };

  const clearWatch = () => {};

  Object.defineProperty(target, 'getCurrentPosition', {
    configurable: true,
    writable: true,
    value: getCurrentPosition,
  });

  Object.defineProperty(target, 'watchPosition', {
    configurable: true,
    writable: true,
    value: watchPosition,
  });

  Object.defineProperty(target, 'clearWatch', {
    configurable: true,
    writable: true,
    value: clearWatch,
  });
}
