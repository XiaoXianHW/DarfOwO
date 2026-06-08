import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowLeft,
  Droplets,
  Flame,
  Footprints,
  HeartPulse,
  Loader2,
  Moon,
  RefreshCw,
  Scale,
  Timer,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHealthData } from '../hooks/useHealthData';
import { StatusCard } from '../components/status/StatusCard';
import { MetricModal } from '../components/status/MetricModal';
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

export const StatusPage = () => {
  const navigate = useNavigate();
  const { overview, histories, loading, error, reload } = useHealthData();
  const [selected, setSelected] = useState<MetricDescriptor | null>(null);

  const metrics = useMemo<MetricDescriptor[]>(() => {
    if (!overview || !histories) return [];

    const summary = overview.latestDailySummary;
    const hr = summary?.heartRate;
    const stepsToday = summary?.steps;
    const sleepToday = summary?.sleep;
    const stepsGoal = overview.goal?.stepsGoal;
    const calGoal = overview.goal?.caloriesGoal;

    const list: MetricDescriptor[] = [];

    // Heart rate (hero)
    list.push({
      id: 'heart-rate',
      label: '心率',
      sublabel: 'Heart Rate',
      icon: HeartPulse,
      color: '#ef4444',
      value: hr?.latestHr?.bpm ? String(hr.latestHr.bpm) : hr?.avgHr ? String(hr.avgHr) : '—',
      unit: 'bpm',
      hint: hr?.avgRhr ? `静息 ${hr.avgRhr} bpm · 7 日均值趋势` : '7 日均值趋势',
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
      value: stepsToday ? formatNumber(stepsToday.steps) : '—',
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
      value: sleepToday ? formatDuration(sleepToday.totalDuration) : '—',
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
      hint: '7 日平均血氧',
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
      unit: 'h',
      hint: '有效站立小时数',
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
    });

    return list;
  }, [overview, histories]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] font-sans text-white selection:bg-green-500/30">
      {/* Top navigation */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-6 py-4 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="-ml-2 rounded-full p-2 transition-colors hover:bg-white/10"
          aria-label="Back"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-medium">健康状态 · Health Status</h1>
        <button
          onClick={reload}
          disabled={loading}
          className="-mr-2 rounded-full p-2 transition-colors hover:bg-white/10 disabled:opacity-40"
          aria-label="Refresh"
        >
          <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {loading && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-white/50">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">正在拉取真实健康数据…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <p className="text-white/60">数据加载失败：{error}</p>
            <button
              onClick={reload}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm transition-colors hover:bg-white/10"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            initial="hidden"
            animate="show"
          >
            {metrics.map((metric, i) => (
              <StatusCard key={metric.id} metric={metric} index={i} onSelect={setSelected} />
            ))}
          </motion.div>
        )}
      </div>

      <MetricModal metric={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
