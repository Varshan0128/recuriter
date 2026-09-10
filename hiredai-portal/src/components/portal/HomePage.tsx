import { motion } from "motion/react";
import { ArrowRight, BriefcaseBusiness, FileText, Plus, Sparkles, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassPanel } from "./shared";
import { useApplications, useDashboardStats, useJobs } from "../../lib/queries";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: stats } = useDashboardStats();
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: applications = [], isLoading: applicationsLoading } = useApplications();
  const activeJobs = jobs.filter((job) => job.status === "published").slice(0, 3);
  const recentApplications = applications.slice(0, 3);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#f5f3ff_0%,#faf9ff_55%,#ffffff_100%)] px-6 py-12 shadow-[0_24px_64px_rgba(124,58,237,0.10)] md:px-10 md:py-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700 shadow-sm"><Sparkles size={14} /> Recruiter workspace</div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl">Hire smarter.<br /><span className="bg-[linear-gradient(135deg,#7c3aed,#a855f7)] bg-clip-text text-transparent">Build stronger teams.</span></h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg">Welcome back, Varshan. Bring jobs, candidates, interviews, and hiring decisions into one focused workspace.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/hr/dashboard")} className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)]"><ArrowRight size={16} /> Go to Dashboard</button>
            <button type="button" onClick={() => navigate("/hr/post-job")} className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm hover:bg-violet-50"><Plus size={16} /> Post New Job</button>
          </div>
        </div>
        <div className="relative mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[{ label: "Active Jobs", value: stats?.active_jobs ?? 0, icon: BriefcaseBusiness }, { label: "Applications", value: stats?.applications ?? 0, icon: FileText }, { label: "Interviews", value: stats?.interviews ?? 0, icon: Users }, { label: "Hired", value: stats?.hired ?? 0, icon: Sparkles }].map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-white/80 bg-white/70 px-3 py-4 shadow-[0_10px_28px_rgba(124,58,237,0.08)] backdrop-blur-xl"><Icon size={16} className="text-violet-600" /><div className="mt-2 text-2xl font-extrabold text-slate-950">{value}</div><div className="mt-1 text-xs font-medium text-slate-500">{label}</div></div>)}
        </div>
      </motion.section>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassPanel title="Your active hiring" subtitle="Keep an eye on open roles and move into the live jobs workspace.">
          {jobsLoading ? <p className="text-sm text-slate-500">Loading jobs...</p> : activeJobs.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">No published jobs yet.</div> : <div className="space-y-3">{activeJobs.map((job) => <button key={job.id} type="button" onClick={() => navigate("/hr/jobs")} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white/90 p-4 text-left hover:border-violet-200"><span><span className="block font-bold text-slate-950">{job.title}</span><span className="mt-1 block text-xs text-slate-500">{job.work_mode} · {job.employment_type}</span></span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Published</span></button>)}</div>}
        </GlassPanel>
        <GlassPanel title="Recent candidates" subtitle="Continue reviewing the latest applications in your pipeline.">
          {applicationsLoading ? <p className="text-sm text-slate-500">Loading candidates...</p> : recentApplications.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500">No applications yet.</div> : <div className="space-y-3">{recentApplications.map((application) => <button key={application.id} type="button" onClick={() => navigate("/hr/applications")} className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white/90 p-4 text-left hover:border-violet-200"><span><span className="block font-bold text-slate-950">{application.candidate_name}</span><span className="mt-1 block text-xs text-slate-500">{application.job_title}</span></span><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-700">{application.status}</span></button>)}</div>}
        </GlassPanel>
      </div>
    </div>
  );
}
