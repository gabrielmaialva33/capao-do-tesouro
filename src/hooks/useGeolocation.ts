import { useState, useEffect, useCallback } from 'react';
import { GEOLOCATION_OPTIONS, getGeolocationErrorMessage } from '../lib/geolocation';

/**
 * Geolocation state
 */
export interface GeolocationState {
  position: GeolocationPosition | null;
  error: string | null;
  loading: boolean;
}

/**
 * Geolocation hook options
 */
export interface UseGeolocationOptions {
  /**
   * Enable real-time position tracking
   */
  watch?: boolean;
  /**
   * Custom geolocation options
   */
  options?: PositionOptions;
}

/**
 * Custom hook for accessing user's geolocation
 *
 * @param options Configuration options
 * @returns Geolocation state and control functions
 *
 * @example
 * ```tsx
 * const { position, error, loading, refetch } = useGeolocation({ watch: true });
 *
 * if (loading) return <div>Getting location...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (position) {
 *   return <div>Lat: {position.coords.latitude}, Lng: {position.coords.longitude}</div>;
 * }
 * ```
 */
export function useGeolocation(options: UseGeolocationOptions = {}) {
  const { watch = false, options: geolocationOptions = GEOLOCATION_OPTIONS } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      position,
      error: null,
      loading: false,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setState({
      position: null,
      error: getGeolocationErrorMessage(error),
      loading: false,
    });
  }, []);

  const startWatch = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: 'Geolocalização não é suportada pelo seu navegador.',
        loading: false,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    if (watch) {
      const id = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        geolocationOptions
      );
      setWatchId(id);
    } else {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError,
        geolocationOptions
      );
    }
  }, [watch, geolocationOptions, handleSuccess, handleError]);

  const stopWatch = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  const refetch = useCallback(() => {
    if (watchId !== null) {
      stopWatch();
    }
    startWatch();
  }, [startWatch, stopWatch, watchId]);

  useEffect(() => {
    startWatch();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch, geolocationOptions]); // Note: excluding startWatch to avoid re-triggering

  return {
    ...state,
    refetch,
    isWatching: watchId !== null,
  };
}
