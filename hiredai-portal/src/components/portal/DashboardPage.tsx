import { motion } from "motion/react";
import { Briefcase, CalendarDays, ChevronRight, CircleCheckBig, FileText, MoreHorizontal, Plus, Sparkles, TrendingUp, Video } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { GlassPanel } from "./shared";
import {
  DASHBOARD_INTERVIEWS,
  DASHBOARD_STAT_SPARKS,
  DASHBOARD_TREND_DATA,
  HIRING_FUNNEL,
  applicationTone,
  currency,
} from "./data";
import { useApplications, useDashboardStats } from "../../lib/queries";

const DASHBOARD_STAT_CONFIG = [
  { label: "Active Jobs", key: "active_jobs", icon: Briefcase, tone: "from-violet-500 to-fuchsia-500", spark: "#7c3aed", delta: "Live count" },
  { label: "Applications", key: "applications", icon: FileText, tone: "from-sky-500 to-blue-500", spark: "#0ea5e9", delta: "Live count" },
  { label: "Interviews", key: "interviews", icon: CalendarDays, tone: "from-orange-500 to-amber-500", spark: "#f97316", delta: "Live count" },
  { label: "Hired", key: "hired", icon: CircleCheckBig, tone: "from-emerald-500 to-green-500", spark: "#10b981", delta: "Live count" },
] as const;

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((value, i) => ({ i, value }));
  return (
    <div className="h-10 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DashboardHeroBanner({ onPostJob, onViewApplications }: { onPostJob: () => void; onViewApplications: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(135deg,#f5f3ff_0%,#faf9ff_55%,#ffffff_100%)] px-6 py-10 shadow-[0_20px_60px_rgba(124,58,237,0.10)] md:px-10 md:py-12"
    >
      <motion.div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-700 shadow-sm"
          >
            <Sparkles size={14} />
            AI-Powered Recruitment Platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-5xl"
          >
            Hire Smarter.
            <br />
            <span className="bg-[linear-gradient(135deg,#7c3aed,#a855f7)] bg-clip-text text-transparent">
              Build Stronger Teams.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-md text-sm leading-6 text-slate-500 md:text-base"
          >
            HiredAI helps recruiters find the right talent faster with AI-driven screening,
            intelligent matching, and automated workflows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onPostJob}
              className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition hover:opacity-90"
            >
              <Plus size={16} />
              Post New Job
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onViewApplications}
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
            >
              <FileText size={16} />
              View Applications
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 },
            scale: { duration: 0.6, delay: 0.3 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
          }}
          className="relative mx-auto hidden h-56 w-full max-w-sm rounded-3xl bg-white p-5 shadow-[0_24px_60px_rgba(124,58,237,0.16)] ring-1 ring-violet-100 md:block"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 text-violet-600">
              <FileText size={18} />
            </div>
            <div className="space-y-2">
              <div className="h-2 w-28 rounded-full bg-violet-100" />
              <div className="h-2 w-20 rounded-full bg-violet-100" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-2 w-full rounded-full bg-slate-100" />
            <div className="h-2 w-5/6 rounded-full bg-slate-100" />
            <div className="h-2 w-4/6 rounded-full bg-slate-100" />
          </div>
          <div className="absolute -bottom-4 -right-4 grid h-11 w-11 place-items-center rounded-full bg-violet-600 text-white shadow-lg">
            <Sparkles size={18} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  const { data: applications = [] } = useApplications();
  const maxFunnel = 478;

  return (
    <div className="space-y-5">
      <DashboardHeroBanner
        onPostJob={() => navigate("/hr/post-job")}
        onViewApplications={() => navigate("/hr/applications")}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {DASHBOARD_STAT_CONFIG.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_48px_rgba(124,58,237,0.10)] backdrop-blur-2xl transition-shadow hover:shadow-[0_24px_60px_rgba(124,58,237,0.18)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 + 0.1, type: "spring", stiffness: 220 }}
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${stat.tone} text-white shadow-[0_10px_24px_rgba(124,58,237,0.2)]`}
                  >
                    <Icon size={18} />
                  </motion.div>
                  <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                </div>
                <Sparkline data={DASHBOARD_STAT_SPARKS[stat.label] ?? []} color={stat.spark} />
              </div>
              <div className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">{stats?.[stat.key] ?? 0}</div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp size={13} />
                {stat.delta}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassPanel
            title="Applications Over Time"
            action={
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Last 7 days
                <ChevronRight size={13} className="rotate-90" />
              </span>
            }
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={DASHBOARD_TREND_DATA} margin={{ top: 10, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="dashboardApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#ede9fe" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} domain={[0, 400]} ticks={[0, 100, 200, 300, 400]} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#6d28d9"
                    strokeWidth={2.5}
                    fill="url(#dashboardApps)"
                    dot={{ r: 5, strokeWidth: 2, stroke: "#6d28d9", fill: "#ffffff" }}
                    activeDot={{ r: 7 }}
                    isAnimationActive
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
        >
          <GlassPanel title="Hiring Pipeline">
            <div className="space-y-4">
              {HIRING_FUNNEL.map((stage, i) => {
                const Icon = stage.icon;
                return (
                  <motion.div
                    key={stage.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`grid h-9 w-9 place-items-center rounded-2xl ${stage.tone}`}>
                          <Icon size={16} />
                        </div>
                        <div className="text-sm font-semibold text-slate-950">{stage.label}</div>
                      </div>
                      <div className="text-sm font-semibold text-slate-700">{currency(stage.value)}</div>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max((stage.value / maxFunnel) * 100, 3)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: stage.bar }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.14 }}
        >
          <GlassPanel
            title="Upcoming Interviews"
            action={
              <button type="button" onClick={() => navigate("/hr/interviews")} className="text-sm font-semibold text-violet-700 transition hover:text-violet-900">
                View all
              </button>
            }
          >
            <div className="space-y-3">
              {DASHBOARD_INTERVIEWS.map((item, i) => (
                <motion.div
                  key={item.candidate}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -3 }}
                  className="rounded-[20px] border border-slate-100 bg-white/90 p-3.5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.10))] text-xs font-bold text-violet-700">
                        {item.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-950">{item.candidate}</div>
                        <div className="text-xs text-slate-500">{item.role}</div>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-semibold text-slate-700">{item.day}</div>
                      <div className="text-slate-400">{item.time}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Video size={13} className="text-violet-500" />
                      {item.type}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full border border-violet-200 px-3 py-1 text-xs font-semibold text-violet-700"
                    >
                      Join
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr_1fr]">
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassPanel
            title="Recent Applications"
            subtitle="Fast review table with score badges, skill tags, and actions."
            action={
              <button type="button" onClick={() => navigate("/hr/applications")} className="text-sm font-semibold text-violet-700 transition hover:text-violet-900">
                View all
              </button>
            }
          >
            <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white">
              <table className="w-full text-left">
                <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Candidate</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">ATS Score</th>
                    <th className="px-4 py-3 font-semibold">Experience</th>
                    <th className="px-4 py-3 font-semibold">Applied</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app, i) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                      className="border-t border-slate-100 transition hover:bg-violet-50/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.10))] text-sm font-bold text-violet-700">
                            {app.candidate_name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-950">{app.candidate_name}</div>
                            <div className="text-xs text-slate-500">{app.job_title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">{app.job_title}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">-</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">-</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationTone(app.status)}`}>{app.status}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button type="button" className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-violet-100 bg-[linear-gradient(150deg,#7c3aed_0%,#6d28d9_100%)] p-6 text-white shadow-[0_24px_60px_rgba(124,58,237,0.25)]"
        >
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <Sparkles size={18} />
          </div>
          <div className="mt-4 text-base font-bold">AI Recommendation</div>
          <p className="mt-2 text-sm leading-6 text-violet-100">
            Backend Engineer role has 12 high-quality candidates ready for shortlisting.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => navigate("/hr/applications")}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm"
          >
            Review Candidates <ChevronRight size={15} />
          </motion.button>
          <CalendarDays className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-white/10" />
        </motion.div>
      </div>
    </div>
  );
}
