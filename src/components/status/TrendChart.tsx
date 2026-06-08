import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface TrendPoint {
  label: string;
  value: number | null;
}

interface TrendChartProps {
  data: TrendPoint[];
  type?: 'area' | 'bar';
  color: string;
  height?: number;
  /** When true, the chart fills its parent's height instead of using a fixed pixel height. */
  fill?: boolean;
  detailed?: boolean;
  unit?: string;
}

export const TrendChart = ({
  data,
  type = 'area',
  color,
  height = 56,
  fill = false,
  detailed = false,
  unit = '',
}: TrendChartProps) => {
  const gradientId = `grad-${color.replace('#', '')}`;
  const axisTick = { fill: 'rgba(255,255,255,0.4)', fontSize: 12 };
  const compact = (v: number) =>
    Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : String(v);
  const tooltip = detailed ? (
    <Tooltip
      cursor={{ fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.1)' }}
      contentStyle={{
        backgroundColor: '#111',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        fontSize: '12px',
      }}
      labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
      formatter={(v: number) => [`${v}${unit}`, '']}
    />
  ) : undefined;

  return (
    <ResponsiveContainer width="100%" height={fill ? '100%' : height}>
      {type === 'bar' ? (
        <BarChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: detailed ? 0 : -34 }}>
          {detailed && <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />}
          <XAxis
            dataKey="label"
            hide={!detailed}
            axisLine={false}
            tickLine={false}
            tick={axisTick}
            dy={8}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            hide={!detailed}
            axisLine={false}
            tickLine={false}
            tick={axisTick}
            width={40}
            tickFormatter={compact}
          />
          {tooltip}
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={detailed ? 44 : 18} />
        </BarChart>
      ) : (
        <AreaChart data={data} margin={{ top: 6, right: 4, bottom: 0, left: detailed ? 0 : -34 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {detailed && <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />}
          <XAxis
            dataKey="label"
            hide={!detailed}
            axisLine={false}
            tickLine={false}
            tick={axisTick}
            dy={8}
            interval="preserveStartEnd"
            minTickGap={28}
          />
          <YAxis
            hide={!detailed}
            axisLine={false}
            tickLine={false}
            tick={axisTick}
            width={40}
            domain={['dataMin - 4', 'dataMax + 4']}
            tickFormatter={compact}
          />
          {tooltip}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            connectNulls
            dot={detailed ? { r: 2, fill: color } : false}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
};
