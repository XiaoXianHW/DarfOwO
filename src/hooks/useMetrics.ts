import { useMemo } from 'react';
import {
  Activity,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Moon,
  Scale,
  Timer,
} from 'lucide-react';
import { useHealthData } from './useHealthData';
import type { MetricDescriptor } from '../components/status/types';
import type { TrendPoint } from '../components/status/TrendChart';
import { formatDuration, formatNumber, shortDate, weekday } from '../utils/format';

interface Dated {
  at: string;
}

function toTrend<T extends Dated>(rows: T[], value: (row: T) => number | null): TrendPoint[] {
  return [...rows]
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .map((row) => ({ label: `${weekday(row.at)} ${shortDate(row.at)}`, value: value(row) }));
}

// Most recent non-null reading, used as a fallback for the headline value when
// today's daily summary hasn't been synced yet (otherwise the card shows '—').
function latest<T extends Dated>(rows: T[], value: (row: T) => number | null): number | null {
  let best: { at: number; v: number } | null = null;
  for (const row of rows) {
    const v = value(row);
    if (v == null) continue;
    const at = new Date(row.at).getTime();
    if (!best || at > best.at) best = { at, v };
  }
  return best?.v ?? null;
}

export interface UseMetricsResult {
  metrics: MetricDescriptor[];
  loading: boolean;
  error: string | null;
  updatedAt: string | null;
  latestDataAt: string | null;
  reload: () => void;
}

export const useMetrics = (): UseMetricsResult => {
  const { overview, histories, loading, error, updatedAt, latestDataAt, reload } = useHealthData();

  const metrics = useMemo<MetricDescriptor[]>(() => {
    if (!overview || !histories) return [];

    const summary = overview.latestDailySummary;
    const hr = summary?.heartRate;
    const stepsToday = summary?.steps;
    const sleepToday = summary?.sleep;
    const stepsGoal = overview.goal?.stepsGoal;
    const calGoal = overview.goal?.caloriesGoal;

    const hrLatest = latest(histories.heartRate, (r) => r.avgHr ?? null);
    const stepsLatest = latest(histories.steps, (r) => r.steps ?? null);
    const sleepLatest = latest(histories.sleep, (r) => r.totalDuration ?? null);

    const list: MetricDescriptor[] = [];

    // Heart rate (hero)
    list.push({
      id: 'heart-rate',
      label: '心率',
      sublabel: 'Heart Rate',
      icon: HeartPulse,
      color: '#ef4444',
      value: hr?.latestHr?.bpm ? String(hr.latestHr.bpm) : hr?.avgHr ? String(hr.avgHr) : hrLatest != null ? String(hrLatest) : '—',
      unit: 'bpm',
      hint: hr?.avgRhr ? `静息 ${hr.avgRhr} bpm · 30 日均值趋势` : '30 日均值趋势',
      chartType: 'area',
      data: toTrend(histories.heartRate, (r) => r.avgHr ?? null),
      stats: hr
        ? [
            { label: '平均', value: `${hr.avgHr ?? '—'} bpm` },
            { label: '静息', value: `${hr.avgRhr ?? '—'} bpm` },
            { label: '最高', value: `${hr.maxHr ?? '—'} bpm` },
            { label: '最低', value: `${hr.minHr ?? '—'} bpm` },
          ]
        : undefined,
      hero: true,
    });

    // Steps
    list.push({
      id: 'steps',
      label: '步数',
      sublabel: 'Steps',
      icon: Footprints,
      color: '#f97316',
      value: stepsToday ? formatNumber(stepsToday.steps) : stepsLatest != null ? formatNumber(stepsLatest) : '—',
      unit: '步',
      hint: stepsGoal
        ? `目标 ${formatNumber(stepsGoal.targetValue)} · ${stepsToday ? ((stepsToday.distance ?? 0) / 1000).toFixed(2) : '0'} km`
        : undefined,
      progress: stepsGoal ? stepsGoal.achievedValue / stepsGoal.targetValue : undefined,
      chartType: 'bar',
      data: toTrend(histories.steps, (r) => r.steps ?? null),
      stats: stepsToday
        ? [
            { label: '今日步数', value: formatNumber(stepsToday.steps) },
            { label: '距离', value: `${((stepsToday.distance ?? 0) / 1000).toFixed(2)} km` },
            { label: '消耗', value: `${stepsToday.calories ?? 0} kcal` },
          ]
        : undefined,
    });

    // Calories
    list.push({
      id: 'calories',
      label: '卡路里',
      sublabel: 'Calories',
      icon: Flame,
      color: '#fb7185',
      value: overview.calories ? formatNumber(overview.calories.calories) : '—',
      unit: 'kcal',
      hint: calGoal ? `目标 ${formatNumber(calGoal.targetValue)} kcal` : undefined,
      progress: calGoal ? calGoal.achievedValue / calGoal.targetValue : undefined,
      chartType: 'bar',
      data: toTrend(histories.calories, (r) => r.calories ?? null),
    });

    // Sleep
    list.push({
      id: 'sleep',
      label: '睡眠',
      sublabel: 'Sleep',
      icon: Moon,
      color: '#818cf8',
      value: sleepToday ? formatDuration(sleepToday.totalDuration) : sleepLatest != null ? formatDuration(sleepLatest) : '—',
      hint: sleepToday?.sleepScore ? `睡眠评分 ${sleepToday.sleepScore}` : undefined,
      chartType: 'bar',
      data: toTrend(histories.sleep, (r) =>
        r.totalDuration ? Math.round((r.totalDuration / 60) * 10) / 10 : null,
      ),
      stats: sleepToday
        ? [
            { label: '总时长', value: formatDuration(sleepToday.totalDuration) },
            { label: '评分', value: `${sleepToday.sleepScore ?? '—'}` },
            { label: '深睡', value: formatDuration(sleepToday.sleepDeepDuration ?? 0) },
            { label: '浅睡', value: formatDuration(sleepToday.sleepLightDuration ?? 0) },
            { label: 'REM', value: formatDuration(sleepToday.sleepRemDuration ?? 0) },
            { label: '血氧', value: sleepToday.avgSpo2 ? `${sleepToday.avgSpo2}%` : '—' },
          ]
        : undefined,
      hero: true,
    });

    // Blood oxygen
    list.push({
      id: 'spo2',
      label: '血氧',
      sublabel: 'SpO₂',
      icon: Droplets,
      color: '#22d3ee',
      value: overview.spo2 ? String(overview.spo2.spo2) : '—',
      unit: '%',
      hint: '30 日平均血氧',
      chartType: 'area',
      data: toTrend(histories.spo2, (r) => r.avgSpo2 ?? null),
      stats: histories.spo2.length
        ? [
            { label: '最高', value: `${Math.max(...histories.spo2.map((s) => s.maxSpo2))}%` },
            { label: '最低', value: `${Math.min(...histories.spo2.map((s) => s.minSpo2))}%` },
          ]
        : undefined,
    });

    // Intensity
    list.push({
      id: 'intensity',
      label: '运动强度',
      sublabel: 'Intensity',
      icon: Activity,
      color: '#a78bfa',
      value: overview.intensity ? String(overview.intensity.duration) : '—',
      unit: 'min',
      hint: '中高强度活动时长',
      chartType: 'bar',
      data: toTrend(histories.intensity, (r) => r.duration ?? null),
    });

    // Valid stand
    list.push({
      id: 'valid-stand',
      label: '站立',
      sublabel: 'Stand',
      icon: Timer,
      color: '#34d399',
      value: overview.validStand ? String(overview.validStand.count) : '—',
      unit: '次',
      hint: '有效站立次数',
      chartType: 'bar',
      data: toTrend(histories.validStand, (r) => r.count ?? null),
    });

    // Weight
    list.push({
      id: 'weight',
      label: '体重',
      sublabel: 'Weight',
      icon: Scale,
      color: '#facc15',
      value: overview.weight ? String(overview.weight.weight) : '—',
      unit: 'kg',
      hint: overview.weight?.bmi ? `BMI ${overview.weight.bmi.toFixed(1)}` : undefined,
      chartType: 'area',
      data: toTrend(histories.weight, (r) => r.weight ?? null),
      rangeLabel: '近半年',
    });

    return list;
  }, [overview, histories]);

  return { metrics, loading, error, updatedAt, latestDataAt, reload };
};
