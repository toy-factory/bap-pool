import {
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';

const useGeolocation = (): GeolocationPosition | undefined => {
  const [geoPosition, setGeoPosition] = useState<GeolocationPosition>();

  const onSuccess = useCallback((position) => {
    setGeoPosition({
      ...position,
      coords: {
        ...position.coords,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
  }, []);

  const onError = useCallback((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, []);

  const options = useMemo(() => ({
    enableHighAccuracy: true,
  }), []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      options,
    );
  }, [onSuccess, onError, options]);

  return geoPosition;
};

export default useGeolocation;
