import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, PencilLine, Search } from "lucide-react";
import { motion } from "motion/react";
import { GlassPanel } from "./shared";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { type Job, useJobs } from "../../lib/queries";

const statusTone: Record<string, string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-50 text-slate-600",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-red-200 bg-red-50 text-red-700",
};

type SortKey = "title" | "created_at" | "status";

export default function JobsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: jobs = [], isLoading, error } = useJobs();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const pageSize = 5;

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch = !normalizedSearch || `${job.title} ${job.description}`.toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
      const matchesType = typeFilter === "all" || job.employment_type === typeFilter;
      const matchesMode = modeFilter === "all" || job.work_mode === modeFilter;
      const matchesExperience = experienceFilter === "all" || `${job.experience_min}-${job.experience_max}` === experienceFilter;
      return matchesSearch && matchesStatus && matchesType && matchesMode && matchesExperience;
    }).sort((left, right) => {
      const leftValue = sortKey === "title" ? left.title.toLowerCase() : sortKey === "status" ? left.status : left.created_at;
      const rightValue = sortKey === "title" ? right.title.toLowerCase() : sortKey === "status" ? right.status : right.created_at;
      const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [experienceFilter, jobs, modeFilter, search, sortDirection, sortKey, statusFilter, typeFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const visibleJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
  const updateFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(1); };

  const changeStatus = async (job: Job, status: Job["status"]) => {
    setActionId(job.id);
    setOpenMenu(null);
    try {
      await apiRequest(`/api/jobs?id=${job.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs", user.company_id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] }),
      ]);
      setFeedback({ type: "success", text: `"${job.title}" is now ${status}.` });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to update job." });
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="My Jobs" subtitle="Live roles belonging to your company." action={<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => updateFilter(setSearch, event.target.value)} placeholder="Search jobs" className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>}>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <select value={statusFilter} onChange={(event) => updateFilter(setStatusFilter, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option><option value="paused">Paused</option><option value="closed">Closed</option></select>
            <select value={typeFilter} onChange={(event) => updateFilter(setTypeFilter, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All employment types</option><option value="full-time">Full time</option><option value="part-time">Part time</option><option value="contract">Contract</option><option value="internship">Internship</option></select>
            <select value={modeFilter} onChange={(event) => updateFilter(setModeFilter, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All work modes</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option></select>
            <select value={experienceFilter} onChange={(event) => updateFilter(setExperienceFilter, event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All experience</option>{Array.from(new Set(jobs.map((job) => `${job.experience_min}-${job.experience_max}`))).map((value) => <option key={value} value={value}>{value} years</option>)}</select>
            <select value={`${sortKey}:${sortDirection}`} onChange={(event) => { const [nextKey, nextDirection] = event.target.value.split(":") as [SortKey, "asc" | "desc"]; setSortKey(nextKey); setSortDirection(nextDirection); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="created_at:desc">Newest first</option><option value="created_at:asc">Oldest first</option><option value="title:asc">Title A-Z</option><option value="title:desc">Title Z-A</option><option value="status:asc">Status A-Z</option></select>
          </div>
          {feedback ? <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{feedback.text}</div> : null}
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading jobs...</p> : null}
          {error ? <p className="p-6 text-sm text-red-600">{error.message}</p> : null}
          {!isLoading && !error ? <>
            <div className="overflow-x-auto rounded-[26px] border border-slate-100 bg-white/80"><table className="w-full min-w-[820px] text-left"><thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="px-4 py-3">Job</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Experience</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Work mode</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{visibleJobs.map((job, index) => <motion.tr key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }} className="border-t border-slate-100 hover:bg-violet-50/30"><td className="px-4 py-4"><div className="font-semibold text-slate-950">{job.title}</div><div className="text-xs text-slate-500">{job.id}</div></td><td className="px-4 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[job.status]}`}>{job.status}</span></td><td className="px-4 py-4 text-sm text-slate-700">{job.experience_min ?? "-"} - {job.experience_max ?? "-"} years</td><td className="px-4 py-4 text-sm text-slate-700">{job.employment_type}</td><td className="px-4 py-4 text-sm text-slate-700">{job.work_mode}</td><td className="relative px-4 py-4"><div className="flex items-center gap-2"><button type="button" aria-label={`Edit ${job.title}`} onClick={() => navigate(`/hr/post-job?edit=${job.id}`)} disabled={actionId === job.id} className="rounded-xl border border-slate-200 p-2 hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"><PencilLine size={15} /></button><button type="button" aria-label={`More actions for ${job.title}`} onClick={() => setOpenMenu(openMenu === job.id ? null : job.id)} className="rounded-xl border border-slate-200 p-2 hover:border-violet-200 hover:text-violet-700"><MoreHorizontal size={15} /></button></div>{openMenu === job.id ? <div className="absolute right-4 top-14 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-xl"><button type="button" onClick={() => { setViewJob(job); setOpenMenu(null); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">View Job</button><button type="button" onClick={() => navigate(`/hr/post-job?edit=${job.id}`)} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">Edit</button>{job.status === "published" ? <button type="button" onClick={() => void changeStatus(job, "paused")} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">Pause Job</button> : job.status === "paused" ? <button type="button" onClick={() => void changeStatus(job, "published")} className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50">Publish Job</button> : null}{job.status !== "closed" ? <button type="button" onClick={() => void changeStatus(job, "closed")} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Close Job</button> : null}</div> : null}</td></motion.tr>)}</tbody></table>{visibleJobs.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No jobs match your filters.</p> : null}</div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500"><span>{filteredJobs.length} job{filteredJobs.length === 1 ? "" : "s"}</span><div className="flex items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Previous</button><span>Page {page} of {pageCount}</span><button type="button" disabled={page === pageCount} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40">Next</button></div></div>
          </> : null}
        </GlassPanel>
      </motion.div>
      {viewJob ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4" onMouseDown={() => setViewJob(null)}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-slate-950">{viewJob.title}</h2><p className="mt-1 text-sm text-slate-500">{viewJob.status} · {viewJob.work_mode} · {viewJob.employment_type}</p></div><button type="button" onClick={() => setViewJob(null)} className="text-sm font-semibold text-slate-500">Close</button></div><p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{viewJob.description}</p></div></div> : null}
    </div>
  );
}
