"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = [
  "hsl(239 84% 67%)",
  "hsl(188 91% 42%)",
  "hsl(160 84% 39%)",
  "hsl(222 47% 45%)",
  "hsl(12 76% 61%)",
];

type BaseDatum = {
  label: string;
  value: number;
};

export function DashboardAreaAnalyticsChart({
  data,
  categories,
}: {
  data: Array<Record<string, string | number>>;
  categories: Array<{
    key: string;
    label: string;
    color: string;
  }>;
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
          <defs>
            {categories.map((category) => (
              <linearGradient
                key={category.key}
                id={`gradient-${category.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={category.color} stopOpacity={0.32} />
                <stop offset="95%" stopColor={category.color} stopOpacity={0.03} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              background: "rgba(15, 23, 42, 0.92)",
              color: "#fff",
            }}
          />
          <Legend />
          {categories.map((category) => (
            <Area
              key={category.key}
              type="monotone"
              dataKey={category.key}
              name={category.label}
              stroke={category.color}
              strokeWidth={2.5}
              fill={`url(#gradient-${category.key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DashboardBarAnalyticsChart({
  data,
  bars,
}: {
  data: Array<Record<string, string | number>>;
  bars: Array<{
    key: string;
    label: string;
    color: string;
  }>;
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgb(100 116 139)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              background: "rgba(15, 23, 42, 0.92)",
              color: "#fff",
            }}
          />
          <Legend />
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.label}
              fill={bar.color}
              radius={[14, 14, 4, 4]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DashboardDonutAnalyticsChart({
  data,
}: {
  data: BaseDatum[];
}) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={72}
            outerRadius={108}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell
                key={`${entry.label}-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "1rem",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              background: "rgba(15, 23, 42, 0.92)",
              color: "#fff",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export { chartColors };
