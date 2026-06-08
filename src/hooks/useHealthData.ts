import { useCallback, useEffect, useState } from 'react';
import {
  getCaloriesHistory,
  getHeartRateHistory,
  getIntensityHistory,
  getOverview,
  getSleepHistory,
  getSpo2History,
  getStepsHistory,
  getValidStandHistory,
  getWeightHistory,
  type CaloriesEntry,
  type HeartRateEntry,
  type IntensityEntry,
  type Overview,
  type SleepEntry,
  type Spo2Entry,
  type StepsEntry,
  type ValidStandEntry,
  type WeightEntry,
} from '../services/miFitness';

export interface HealthHistories {
  heartRate: HeartRateEntry[];
  steps: StepsEntry[];
  sleep: SleepEntry[];
  calories: CaloriesEntry[];
  spo2: Spo2Entry[];
  intensity: IntensityEntry[];
  validStand: ValidStandEntry[];
  weight: WeightEntry[];
}

export interface HealthData {
  overview: Overview | null;
  histories: HealthHistories | null;
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  reload: () => void;
}

const DAYS = 7;

// Module-level cache so navigating between the status grid and a detail page
// reuses already-fetched data instead of showing the loading spinner again.
let cache: { overview: Overview | null; histories: HealthHistories | null; updatedAt: string } | null =
  null;

export function useHealthData(): HealthData {
  const [overview, setOverview] = useState<Overview | null>(() => cache?.overview ?? null);
  const [histories, setHistories] = useState<HealthHistories | null>(() => cache?.histories ?? null);
  const [loading, setLoading] = useState(() => !cache);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(() => cache?.updatedAt ?? null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, heartRate, steps, sleep, calories, spo2, intensity, validStand, weight] =
        await Promise.all([
          getOverview(),
          getHeartRateHistory(DAYS),
          getStepsHistory(DAYS),
          getSleepHistory(DAYS),
          getCaloriesHistory(DAYS),
          getSpo2History(DAYS),
          getIntensityHistory(DAYS),
          getValidStandHistory(DAYS),
          getWeightHistory(DAYS),
        ]);
      const nextHistories = { heartRate, steps, sleep, calories, spo2, intensity, validStand, weight };
      const ts = new Date().toISOString();
      cache = { overview: ov.overview, histories: nextHistories, updatedAt: ts };
      setOverview(ov.overview);
      setHistories(nextHistories);
      setUpdatedAt(ts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load health data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch on first mount; subsequent mounts reuse the cache.
    if (!cache) load();
  }, [load]);

  return { overview, histories, loading, error, updatedAt, reload: load };
}
