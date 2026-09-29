import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export function useHealthCheck(pollIntervalMs = 15000) {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    const result = await apiService.getHealthStatus();
    if (result.success) {
      setHealthData(result.data);
      setError(null);
    } else {
      setHealthData(result.fallbackData);
      setError(result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, pollIntervalMs);
    return () => clearInterval(interval);
  }, [fetchHealth, pollIntervalMs]);

  return { healthData, loading, error, refresh: fetchHealth };
}
