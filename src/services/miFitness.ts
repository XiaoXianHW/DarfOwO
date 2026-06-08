// Mi Fitness (DarfAPI) health API client.
//
// Requests go to the same-origin path `/api/mifitness/*`, which the Vite
// dev/preview proxy (see vite.config.ts) forwards to
// https://api.xiaoxian.org/api/v1/mi-fitness/* with the secret bearer token
// injected server-side. The key is therefore never bundled into the client.
// In production, a reverse proxy must provide the same `/api/mifitness/*` path.

const BASE =
  (import.meta.env.VITE_MIFITNESS_BASE as string | undefined)?.replace(/\/$/, '') ||
  '/api/mifitness';

export const MIFITNESS_UID =
  (import.meta.env.VITE_MIFITNESS_UID as string | undefined) || '2767148408';

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const search = new URLSearchParams({ uid: MIFITNESS_UID, ...mapValues(params) });
  const res = await fetch(`${BASE}${path}?${search.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  const body = (await res.json()) as ApiEnvelope<T>;
  if (!body.success) {
    throw new Error(body.message || 'API returned an error');
  }
  return body.data;
}

function mapValues(params: Record<string, string | number>): Record<string, string> {
  return Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]));
}

// ---- Response types -------------------------------------------------------

export interface HeartRateEntry {
  time: number;
  at: string;
  avgHr: number;
  avgRhr?: number;
  maxHr: number;
  minHr: number;
  latestHr?: { bpm: number; time: number; at: string };
}

export interface StepsEntry {
  time: number;
  at: string;
  steps: number;
  distance: number;
  calories: number;
}

export interface SleepEntry {
  time: number;
  at: string;
  totalDuration: number; // minutes
  sleepScore: number;
  sleepDeepDuration?: number;
  sleepLightDuration?: number;
  sleepRemDuration?: number;
  sleepAwakeDuration?: number;
  avgHr?: number;
  avgSpo2?: number;
}

export interface CaloriesEntry {
  time: number;
  at: string;
  calories: number;
}

export interface Spo2Entry {
  time: number;
  at: string;
  avgSpo2: number;
  maxSpo2: number;
  minSpo2: number;
  latestSpo2?: { spo2: number; time: number; at: string };
}

// Current-snapshot SpO2 reading (overview.spo2) carries a single `spo2` value.
export interface Spo2Reading {
  time: number;
  at: string;
  spo2: number;
}

export interface IntensityEntry {
  time: number;
  at: string;
  duration: number; // minutes
}

export interface ValidStandEntry {
  time: number;
  at: string;
  count: number;
}

export interface WeightEntry {
  time: number;
  at: string;
  weight: number;
  bmi?: number;
}

export interface GoalItem {
  field: number;
  targetValue: number;
  achievedValue: number;
  metricKey: string;
  metricLabel: string;
}

export interface Goal {
  time: number;
  at: string;
  goalItems: GoalItem[];
  stepsGoal?: GoalItem;
  caloriesGoal?: GoalItem;
}

export interface LatestDailySummary {
  date: string;
  relativeUid: number;
  heartRate?: HeartRateEntry;
  sleep?: SleepEntry;
  steps?: StepsEntry;
}

export interface Overview {
  bloodPressure: unknown | null;
  calories?: CaloriesEntry;
  goal?: Goal;
  intensity?: IntensityEntry;
  latestDailySummary?: LatestDailySummary;
  spo2?: Spo2Reading;
  validStand?: ValidStandEntry;
  weight?: WeightEntry;
}

export interface OverviewResponse {
  queryDate: string;
  days: number;
  relative: { relativeUid: number; relativeNote: string; relativeIcon: string };
  overview: Overview;
}

// ---- Endpoints ------------------------------------------------------------

export const getOverview = () => request<OverviewResponse>('/data/overview');

export const getHeartRateHistory = (days = 7) =>
  request<HeartRateEntry[]>('/data/heart-rate', { days });

export const getStepsHistory = (days = 7) =>
  request<StepsEntry[]>('/data/steps', { days });

export const getSleepHistory = (days = 7) =>
  request<SleepEntry[]>('/data/sleep', { days });

export const getCaloriesHistory = (days = 7) =>
  request<CaloriesEntry[]>('/data/calories/history', { days });

export const getSpo2History = (days = 7) =>
  request<Spo2Entry[]>('/data/spo2/history', { days });

export const getIntensityHistory = (days = 7) =>
  request<IntensityEntry[]>('/data/intensity/history', { days });

export const getValidStandHistory = (days = 7) =>
  request<ValidStandEntry[]>('/data/valid-stand/history', { days });

export const getWeightHistory = (days = 7) =>
  request<WeightEntry[]>('/data/weight/history', { days });
