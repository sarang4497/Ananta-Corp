'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import type {ReactNode} from 'react';

// All values rendered here are ILLUSTRATIVE examples passed in per page.
export type Unit = 'eur' | 'pct' | 'eurk' | 'usd' | 'plain';

export type ChartSpec =
  | {kind: 'bar'; title: string; caption: string; unit: Unit; data: {label: string; v: number}[]}
  | {kind: 'area'; title: string; caption: string; unit: Unit; seriesLabel: string; data: {x: string; v: number}[]}
  | {
      kind: 'stack';
      title: string;
      caption: string;
      unit: Unit;
      labels: [string, string, string];
      data: {x: string; a: number; b: number; c: number}[];
    };

const TICK = {fill: '#5b6385', fontSize: 12};
const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: '1px solid rgba(79,70,229,0.18)',
  boxShadow: '0 12px 32px -16px rgba(79,70,229,0.4)',
  fontSize: 13,
  color: '#15183b'
};
const STACK_COLORS = ['#1877f2', '#4f46e5', '#b06a9e'];

function fmt(v: number, unit: Unit): string {
  switch (unit) {
    case 'eur':
      return `€${v.toLocaleString('en-US')}`;
    case 'eurk':
      return `€${v}k`;
    case 'usd':
      return `$${v}`;
    case 'pct':
      return `${v}%`;
    default:
      return `${v}`;
  }
}

function ChartCard({title, caption, children}: {title: string; caption: string; children: ReactNode}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-bg p-5 shadow-card">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <div className="mt-4">{children}</div>
      <p className="mt-3 text-xs leading-relaxed text-muted">{caption}</p>
    </div>
  );
}

function One({spec}: {spec: ChartSpec}) {
  if (spec.kind === 'bar') {
    return (
      <ChartCard title={spec.title} caption={spec.caption}>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={spec.data} margin={{top: 8, right: 8, left: -8, bottom: 0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,70,229,0.12)" vertical={false} />
            <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, spec.unit)} />
            <Tooltip
              cursor={{fill: 'rgba(79,70,229,0.06)'}}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [fmt(value as number, spec.unit), '']}
            />
            <Bar dataKey="v" radius={[8, 8, 0, 0]} maxBarSize={96} isAnimationActive animationDuration={900} animationEasing="ease-out">
              {spec.data.map((_, i) => (
                <Cell key={i} fill={i === spec.data.length - 1 ? '#4f46e5' : '#9aa3c7'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  }

  if (spec.kind === 'area') {
    return (
      <ChartCard title={spec.title} caption={spec.caption}>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={spec.data} margin={{top: 8, right: 8, left: -4, bottom: 0}}>
            <defs>
              <linearGradient id="indAreaBand" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#1877f2" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,70,229,0.12)" vertical={false} />
            <XAxis dataKey="x" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, spec.unit)} />
            <Tooltip
              cursor={{stroke: 'rgba(79,70,229,0.2)'}}
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [fmt(value as number, spec.unit), spec.seriesLabel]}
            />
            <Area
              type="monotone"
              dataKey="v"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#indAreaBand)"
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    );
  }

  // stack
  return (
    <ChartCard title={spec.title} caption={spec.caption}>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={spec.data} margin={{top: 8, right: 8, left: -4, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(79,70,229,0.12)" vertical={false} />
          <XAxis dataKey="x" tick={TICK} axisLine={false} tickLine={false} />
          <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v: number) => fmt(v, spec.unit)} />
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [fmt(value as number, spec.unit), name as string]} />
          <Legend wrapperStyle={{fontSize: 12, color: '#5b6385'}} iconType="circle" />
          {(['a', 'b', 'c'] as const).map((k, i) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              name={spec.labels[i]}
              stackId="1"
              stroke={STACK_COLORS[i]}
              strokeWidth={2}
              fill={STACK_COLORS[i]}
              fillOpacity={0.22}
              isAnimationActive
              animationDuration={1100}
              animationEasing="ease-out"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export default function IndustryCharts({chart1, chart2}: {chart1: ChartSpec; chart2: ChartSpec}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <One spec={chart1} />
      <One spec={chart2} />
    </div>
  );
}
