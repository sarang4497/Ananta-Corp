'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type {ReactNode} from 'react';

// All values here are ILLUSTRATIVE examples, not real per-client figures.
const PATIENTS = [
  {label: 'Before', v: 3},
  {label: 'After', v: 15}
];
const REVENUE = [
  {month: 'M1', range: [8, 18]},
  {month: 'M2', range: [11, 24]},
  {month: 'M3', range: [14, 30]},
  {month: 'M4', range: [15, 33]},
  {month: 'M5', range: [15, 35]},
  {month: 'M6', range: [16, 35]}
];

const TICK = {fill: '#5b6385', fontSize: 12};
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(79,70,229,0.18)',
  boxShadow: '0 12px 32px -16px rgba(79,70,229,0.4)',
  fontSize: 13,
  color: '#15183b'
};

function ChartCard({title, caption, children}: {title: string; caption: string; children: ReactNode}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-bg p-5 shadow-card">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{caption}</p>
    </div>
  );
}

export default function DentalCharts({
  chart1Title,
  chart1Caption,
  chart2Title,
  chart2Caption
}: {
  chart1Title: string;
  chart1Caption: string;
  chart2Title: string;
  chart2Caption: string;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title={chart1Title} caption={chart1Caption}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={PATIENTS} margin={{top: 8, right: 8, left: -18, bottom: 0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,70,229,0.12)" vertical={false} />
            <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{fill: 'rgba(79,70,229,0.06)'}}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [`${value as number} patients`, '']}
            />
            <Bar
              dataKey="v"
              radius={[8, 8, 0, 0]}
              maxBarSize={96}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              <Cell fill="#9aa3c7" />
              <Cell fill="#1877f2" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title={chart2Title} caption={chart2Caption}>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={REVENUE} margin={{top: 8, right: 8, left: -8, bottom: 0}}>
            <defs>
              <linearGradient id="revBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#1877f2" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,70,229,0.12)" vertical={false} />
            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis
              tick={TICK}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `€${v}k`}
            />
            <Tooltip
              cursor={{stroke: 'rgba(79,70,229,0.2)'}}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => {
                const r = value as number[];
                return [`€${r[0]}k – €${r[1]}k / month`, 'Range'];
              }}
            />
            <Area
              type="monotone"
              dataKey="range"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#revBand)"
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
