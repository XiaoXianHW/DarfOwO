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

const DAYS = 30;
// Weight is measured infrequently, so a 30-day window is too sparse. Pull half a
// year so the trend has enough points.
const WEIGHT_DAYS = 180;

interface HealthSnapshot {
  overview: Overview | null;
  histories: HealthHistories | null;
  updatedAt: string;
}

// Module-level cache so navigating between the status grid and a detail page
// reuses already-fetched data instead of showing the loading spinner again.
let cache: HealthSnapshot | null = null;

// In-flight fetch shared across hook instances. React StrictMode mounts effects
// twice in dev; without this guard each mount fires a duplicate request burst.
let inFlight: Promise<HealthSnapshot> | null = null;

async function fetchAll(): Promise<HealthSnapshot> {
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
      getWeightHistory(WEIGHT_DAYS),
    ]);
  return {
    overview: ov.overview,
    histories: { heartRate, steps, sleep, calories, spo2, intensity, validStand, weight },
    updatedAt: new Date().toISOString(),
  };
}

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
      // Reuse an in-flight request if one is already running (dedupes the
      // StrictMode double-mount burst and rapid refresh clicks).
      inFlight ??= fetchAll().finally(() => {
        inFlight = null;
      });
      const snapshot = await inFlight;
      cache = snapshot;
      setOverview(snapshot.overview);
      setHistories(snapshot.histories);
      setUpdatedAt(snapshot.updatedAt);
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
