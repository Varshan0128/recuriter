import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassPanel } from "./shared";
import {
  ANALYTICS_CHANNEL_BAR,
  ANALYTICS_CHANNEL_DONUT,
  ANALYTICS_CHANNEL_KEYS,
  ANALYTICS_FUNNEL,
  ANALYTICS_RANGE,
  ANALYTICS_STATS,
  ANALYTICS_TREND,
} from "./data";

function FilterPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
      {label}
      <ChevronDown size={12} className="text-slate-400" />
    </span>
  );
}

export default function ShortlistedPage() {
  const [barMode, setBarMode] = useState<"amount" | "percentage">("amount");

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">Recruiting Analytics</h1>
        <p className="mt-1 text-sm text-slate-500">A quick pulse on how candidates move through your funnel.</p>
      </motion.div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_48px_rgba(124,58,237,0.10)] backdrop-blur-2xl md:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{ANALYTICS_RANGE.days}</div>
              <FilterPill label={ANALYTICS_RANGE.label} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              {ANALYTICS_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                >
                  <div className="text-2xl font-extrabold text-slate-950">{stat.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{stat.label}</div>
                  <div className={`mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold ${stat.up ? "text-emerald-600" : "text-red-500"}`}>
                    {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.delta}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          >
            <GlassPanel title="Candidate Conversions">
              <div className="mb-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Page Views</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-600" /> Applications</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300" /> Previous performance</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ANALYTICS_TREND} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={900} />
                    <Line type="monotone" dataKey="applications" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive animationDuration={900} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <FilterPill label="All jobs" />
                <FilterPill label="All Channels" />
                <FilterPill label="Last 2 weeks" />
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <GlassPanel title="General Recruiting Process">
            <div className="h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart margin={{ top: 10, right: 90, bottom: 10, left: 10 }}>
                  <Funnel dataKey="value" data={ANALYTICS_FUNNEL} isAnimationActive animationDuration={900}>
                    <LabelList
                      position="right"
                      fill="#334155"
                      stroke="none"
                      fontSize={13}
                      fontWeight={700}
                      offset={12}
                      dataKey={(entry: any) => `${entry.label} · ${entry.value}`}
                    />
                    {ANALYTICS_FUNNEL.map((entry) => (
                      <Cell key={entry.label} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="All jobs" />
              <FilterPill label="All Channels" />
              <FilterPill label="Last 2 weeks" />
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <GlassPanel
            title="How did users APPLY to your position?"
            action={
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
                {(["amount", "percentage"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setBarMode(mode)}
                    className={`rounded-full px-3 py-1.5 capitalize transition ${
                      barMode === mode ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            }
          >
            <div className="mb-3 flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500">
              {ANALYTICS_CHANNEL_KEYS.map((c) => (
                <span key={c.key} className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ANALYTICS_CHANNEL_BAR} stackOffset={barMode === "percentage" ? "expand" : undefined} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip />
                  {ANALYTICS_CHANNEL_KEYS.map((c) => (
                    <Bar key={c.key} dataKey={c.key} stackId="channels" fill={c.color} radius={c.key === "corporate" ? [4, 4, 0, 0] : undefined} isAnimationActive animationDuration={900} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterPill label="All jobs" />
              <FilterPill label="All Channels" />
              <FilterPill label="Last 2 weeks" />
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          <GlassPanel title="Channel Performance">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, fontWeight: 600, color: "#475569" }}
                  />
                  <Pie
                    data={ANALYTICS_CHANNEL_DONUT}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    isAnimationActive
                    animationDuration={900}
                  >
                    {ANALYTICS_CHANNEL_DONUT.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <FilterPill label="All jobs" />
              <FilterPill label="All Channels" />
              <FilterPill label="Last 2 weeks" />
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}