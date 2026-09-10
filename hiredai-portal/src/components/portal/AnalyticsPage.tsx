import { useMemo } from "react";
import { BarChart3, Briefcase, CalendarDays, CheckCircle2, CircleX, Filter, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAnalytics, useApplications, useJobs } from "../../lib/queries";
import { GlassPanel } from "./shared";

const STAGE_COLORS: Record<string, string> = {
  applied: "#8b5cf6",
  reviewed: "#06b6d4",
  shortlisted: "#a855f7",
  interview: "#f59e0b",
  rejected: "#ef4444",
  hired: "#10b981",
};

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

function MetricCard({ label, value, tone, icon: Icon }: { label: string; value: number; tone: string; icon: typeof Briefcase }) {
  return (
    <div className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_48px_rgba(124,58,237,0.10)] backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{value}</div>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: applications = [], isLoading: appsLoading } = useApplications();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();

  const metrics = useMemo(() => {
    const fallback = analytics?.metrics ?? {
      total_jobs: jobs.length,
      active_jobs: jobs.filter((job) => job.status === "published").length,
      closed_jobs: jobs.filter((job) => job.status === "closed").length,
      total_applications: applications.length,
      reviewed: applications.filter((application) => application.status === "reviewed").length,
      shortlisted: applications.filter((application) => application.status === "shortlisted").length,
      interviews: applications.filter((application) => application.status === "interview").length,
      rejected: applications.filter((application) => application.status === "rejected").length,
      hired: applications.filter((application) => application.status === "hired").length,
    };

    return {
      totalJobs: fallback.total_jobs,
      activeJobs: fallback.active_jobs,
      closedJobs: fallback.closed_jobs,
      totalApplications: fallback.total_applications,
      reviewed: fallback.reviewed,
      shortlisted: fallback.shortlisted,
      interviews: fallback.interviews,
      rejected: fallback.rejected,
      hired: fallback.hired,
    };
  }, [analytics, jobs, applications]);

  const funnel = useMemo(() => {
    const stageValues = analytics?.by_stage ?? [
      { stage: "applied", value: applications.filter((app) => app.status === "applied").length },
      { stage: "reviewed", value: applications.filter((app) => app.status === "reviewed").length },
      { stage: "shortlisted", value: applications.filter((app) => app.status === "shortlisted").length },
      { stage: "interview", value: applications.filter((app) => app.status === "interview").length },
      { stage: "rejected", value: applications.filter((app) => app.status === "rejected").length },
      { stage: "hired", value: applications.filter((app) => app.status === "hired").length },
    ];

    return stageValues.map((entry) => ({
      label: entry.stage.charAt(0).toUpperCase() + entry.stage.slice(1),
      value: entry.value,
      fill: STAGE_COLORS[entry.stage] ?? '#94a3b8',
    }));
  }, [analytics, applications]);

  const byJob = useMemo(() => analytics?.by_job ?? jobs.map((job) => ({
    name: job.title,
    applications: applications.filter((application) => application.job_id === job.id).length,
  })), [analytics, jobs, applications]);

  const byStage = useMemo(() => (analytics?.by_stage ?? [
    { stage: "applied", value: applications.filter((app) => app.status === "applied").length, color: STAGE_COLORS.applied },
    { stage: "reviewed", value: applications.filter((app) => app.status === "reviewed").length, color: STAGE_COLORS.reviewed },
    { stage: "shortlisted", value: applications.filter((app) => app.status === "shortlisted").length, color: STAGE_COLORS.shortlisted },
    { stage: "interview", value: applications.filter((app) => app.status === "interview").length, color: STAGE_COLORS.interview },
    { stage: "rejected", value: applications.filter((app) => app.status === "rejected").length, color: STAGE_COLORS.rejected },
    { stage: "hired", value: applications.filter((app) => app.status === "hired").length, color: STAGE_COLORS.hired },
  ]).map((entry) => ({ name: entry.stage.charAt(0).toUpperCase() + entry.stage.slice(1), value: entry.value, color: entry.color ?? STAGE_COLORS[entry.stage] ?? '#94a3b8' })), [analytics, applications]);

  const conversion = useMemo(() => {
    const applied = Math.max(metrics.totalApplications, 1);
    const hired = metrics.hired;
    return [
      { name: "Applied", value: applied },
      { name: "Reviewed", value: metrics.reviewed },
      { name: "Shortlisted", value: metrics.shortlisted },
      { name: "Interview", value: metrics.interviews },
      { name: "Hired", value: hired },
    ];
  }, [metrics]);

  const trends = useMemo(() => analytics?.trends ?? Array.from(new Map(
    applications.map((application) => [formatDate(application.applied_at), { label: formatDate(application.applied_at), applications: 0, interviews: 0, hired: 0 }])
  ).values()).map((entry) => {
    const day = applications.filter((application) => formatDate(application.applied_at) === entry.label);
    return {
      label: entry.label,
      applications: day.length,
      interviews: day.filter((application) => application.status === "interview").length,
      hired: day.filter((application) => application.status === "hired").length,
    };
  }).slice(-7), [analytics, applications]);

  const isLoading = jobsLoading || appsLoading || analyticsLoading;

  return (
    <div className="space-y-6">
      <GlassPanel title="Analytics" subtitle="Real hiring performance across jobs, candidates, and outcomes.">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <Filter size={14} /> All Jobs
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <CalendarDays size={14} /> Date range
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <TrendingUp size={14} /> Live metrics
          </span>
        </div>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total Jobs" value={metrics.totalJobs} tone="from-violet-500 to-fuchsia-500" icon={Briefcase} />
        <MetricCard label="Active Jobs" value={metrics.activeJobs} tone="from-sky-500 to-blue-500" icon={BarChart3} />
        <MetricCard label="Closed Jobs" value={metrics.closedJobs} tone="from-slate-500 to-slate-700" icon={CheckCircle2} />
        <MetricCard label="Total Applications" value={metrics.totalApplications} tone="from-indigo-500 to-violet-500" icon={TrendingUp} />
        <MetricCard label="Reviewed" value={metrics.reviewed} tone="from-cyan-500 to-sky-500" icon={BarChart3} />
        <MetricCard label="Shortlisted" value={metrics.shortlisted} tone="from-purple-500 to-violet-500" icon={CheckCircle2} />
        <MetricCard label="Interviews" value={metrics.interviews} tone="from-orange-500 to-amber-500" icon={CalendarDays} />
        <MetricCard label="Rejected" value={metrics.rejected} tone="from-red-500 to-rose-500" icon={CircleX} />
        <MetricCard label="Hired" value={metrics.hired} tone="from-emerald-500 to-green-500" icon={CheckCircle2} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel title="Hiring funnel" subtitle="Application volume by stage.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnel}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {funnel.map((entry) => (
                    <Cell key={entry.label} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Applications by stage" subtitle="Current distribution across the pipeline.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byStage} dataKey="value" nameKey="name" innerRadius={52} outerRadius={90} paddingAngle={4}>
                  {byStage.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel title="Applications by job" subtitle="Current application counts per role.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byJob} layout="vertical" margin={{ left: 18 }}>
                <CartesianGrid horizontal={false} strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" width={120} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#475569" }} />
                <Tooltip />
                <Bar dataKey="applications" radius={[0, 8, 8, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Hiring conversion" subtitle="Conversion efficiency across pipeline stages.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversion}>
                <defs>
                  <linearGradient id="conversionFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} fill="url(#conversionFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel title="Application trends over time" subtitle="Daily application count from the live dataset.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="applications" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel title="Interview trends" subtitle="Live interview counts over time.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip />
                <Bar dataKey="interviews" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Hiring trends" subtitle="Hires created from current applications.">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="hired" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassPanel>

      {isLoading ? <p className="text-sm text-slate-500">Loading analytics...</p> : null}
    </div>
  );
}
