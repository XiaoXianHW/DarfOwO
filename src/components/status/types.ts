import type { LucideIcon } from 'lucide-react';
import type { TrendPoint } from './TrendChart';

export interface MetricStat {
  label: string;
  value: string;
}

export interface MetricDescriptor {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  color: string;
  value: string;
  unit?: string;
  hint?: string;
  chartType: 'area' | 'bar';
  data: TrendPoint[];
  progress?: number;
  stats?: MetricStat[];
  hero?: boolean;
}
