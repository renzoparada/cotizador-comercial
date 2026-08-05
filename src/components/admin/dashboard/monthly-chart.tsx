"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function MonthlyChart({ data }: { data: { month: string; total: number; aceptadas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--muted)", fontSize: 12 }}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "var(--border)", opacity: 0.3 }}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 13,
          }}
        />
        <Bar dataKey="total" name="Cotizaciones" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={28} opacity={0.35} />
        <Bar dataKey="aceptadas" name="Aceptadas" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
