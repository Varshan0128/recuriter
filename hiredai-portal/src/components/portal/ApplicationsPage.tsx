import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { Download, FileText, Search } from "lucide-react";
import { GlassPanel } from "./shared";
import { applicationTone } from "./data";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { type Application, useApplications, useNotes } from "../../lib/queries";

const statuses = ["applied", "reviewed", "shortlisted", "interview", "rejected", "hired"] as const;
type SortKey = "candidate" | "applied_at" | "status";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading, error } = useApplications();
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("applied_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [newNote, setNewNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = useMemo(() => applications.filter((app) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || `${app.candidate_name} ${app.job_title} ${app.candidate_email}`.toLowerCase().includes(term);
    return matchesSearch && (jobFilter === "all" || app.job_id === jobFilter) && (statusFilter === "all" || app.status === statusFilter);
  }).sort((left, right) => {
    const leftValue = sortKey === "candidate" ? left.candidate_name.toLowerCase() : sortKey === "status" ? left.status : left.applied_at;
    const rightValue = sortKey === "candidate" ? right.candidate_name.toLowerCase() : sortKey === "status" ? right.status : right.applied_at;
    const comparison = leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
    return sortDirection === "asc" ? comparison : -comparison;
  }), [applications, jobFilter, search, sortDirection, sortKey, statusFilter]);

  const selected = applications.find((item) => item.id === selectedId) ?? applications[0] ?? null;
  const { data: notes = [], isLoading: notesLoading } = useNotes(selected?.id ?? null);

  useEffect(() => {
    if (!selectedId && applications[0]) setSelectedId(applications[0].id);
  }, [applications, selectedId]);

  const refreshApplicationQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["applications", user.company_id] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] }),
      queryClient.invalidateQueries({ queryKey: ["notes", selected?.id] }),
    ]);
  };

  const updateStatus = async (application: Application, status: Application["status"]) => {
    setIsSaving(true);
    try {
      await apiRequest(`/api/applications?id=${application.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await refreshApplicationQueries();
      setFeedback({ type: "success", text: `${application.candidate_name} moved to ${status}.` });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to update candidate stage." });
    } finally {
      setIsSaving(false);
    }
  };

  const openResume = (application: Application) => {
    if (!application.resume_url) {
      setFeedback({ type: "error", text: "No resume is available for this candidate." });
      return;
    }
    window.open(application.resume_url, "_blank", "noopener,noreferrer");
  };

  const downloadResume = (application: Application) => {
    if (!application.resume_url) {
      setFeedback({ type: "error", text: "No resume is available for this candidate." });
      return;
    }
    const link = document.createElement("a");
    link.href = application.resume_url;
    link.download = `${application.candidate_name.replace(/\s+/g, "-")}-resume`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const saveNote = async () => {
    if (!selected || !newNote.trim()) return;
    setIsSaving(true);
    try {
      await apiRequest("/api/notes", { method: "POST", body: JSON.stringify({ application_id: selected.id, author_id: user.id, content: newNote.trim() }) });
      setNewNote("");
      await queryClient.invalidateQueries({ queryKey: ["notes", selected.id] });
      setFeedback({ type: "success", text: "Note saved." });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to save note." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="Applications" subtitle="Review candidates and move them through the hiring workflow." action={<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate" className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>}>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All jobs</option>{Array.from(new Map(applications.map((app) => [app.job_id, app.job_title]))).map(([id, title]) => <option key={id} value={id}>{title}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All stages</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select><select value={`${sortKey}:${sortDirection}`} onChange={(event) => { const [nextKey, nextDirection] = event.target.value.split(":") as [SortKey, "asc" | "desc"]; setSortKey(nextKey); setSortDirection(nextDirection); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="applied_at:desc">Newest applied</option><option value="applied_at:asc">Oldest applied</option><option value="candidate:asc">Candidate A-Z</option><option value="candidate:desc">Candidate Z-A</option><option value="status:asc">Stage A-Z</option></select><div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div></div>
          {feedback ? <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{feedback.text}</div> : null}
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading applications...</p> : null}
          {error ? <p className="p-6 text-sm text-red-600">{error.message}</p> : null}
          {!isLoading && !error ? <div className="overflow-x-auto rounded-[26px] border border-slate-100 bg-white/80"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th></tr></thead><tbody><AnimatePresence mode="popLayout">{filtered.map((app) => <motion.tr key={app.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedId(app.id)} className={`cursor-pointer border-t border-slate-100 hover:bg-violet-50/40 ${selected?.id === app.id ? "bg-violet-50/70" : ""}`}><td className="px-4 py-4"><button type="button" onClick={() => setSelectedId(app.id)} className="text-left"><div className="font-semibold text-slate-950">{app.candidate_name}</div><div className="text-xs text-slate-500">{app.candidate_email}</div></button></td><td className="px-4 py-4 text-sm text-slate-700">{app.job_title}</td><td className="px-4 py-4 text-sm text-slate-700">{new Date(app.applied_at).toLocaleDateString()}</td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationTone(app.status)}`}>{app.status}</span></td></motion.tr>)}</AnimatePresence></tbody></table>{filtered.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No applications match your filters.</p> : null}</div> : null}
        </GlassPanel>
      </motion.div>

      <div className="space-y-5"><GlassPanel title="Candidate detail" subtitle="Review stored candidate information and workflow activity."><AnimatePresence mode="wait"><motion.div key={selected?.id ?? "empty"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">{applications.length > 0 ? <>
        <div className="rounded-[26px] bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] p-5 text-white"><div className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">Candidate</div><div className="mt-2 text-2xl font-extrabold">{selected.candidate_name}</div><div className="mt-1 text-sm text-violet-100">{selected.job_title}</div></div>
        <div className="rounded-[26px] border border-slate-100 bg-white/80 p-5"><div className="grid gap-3 text-sm"><div><span className="font-semibold text-slate-800">Email:</span> {selected.candidate_email}</div><div><span className="font-semibold text-slate-800">Phone:</span> {selected.candidate_phone ?? "-"}</div><div><span className="font-semibold text-slate-800">Applied:</span> {new Date(selected.applied_at).toLocaleDateString()}</div></div></div>
        <div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => openResume(selected)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><FileText size={16} />Resume</button><button type="button" onClick={() => downloadResume(selected)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"><Download size={16} />Download</button></div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><label className="block text-sm font-semibold text-slate-700">Stage<select value={selected.status} disabled={isSaving} onChange={(event) => void updateStatus(selected, event.target.value as Application["status"])} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><option value="applied">Applied</option><option value="reviewed">Reviewed</option><option value="shortlisted">Shortlisted</option><option value="interview">Interview</option><option value="rejected">Rejected</option><option value="hired">Hired</option></select></label><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" disabled={isSaving || selected.status === "shortlisted"} onClick={() => void updateStatus(selected, "shortlisted")} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Shortlist"}</button><button type="button" disabled={isSaving} onClick={() => { if (window.confirm(`Reject ${selected.candidate_name}?`)) void updateStatus(selected, "rejected"); }} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">Reject</button></div><button type="button" disabled={isSaving || selected.status === "hired"} onClick={() => void updateStatus(selected, "hired")} className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50">Hire</button></div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><div className="text-sm font-semibold text-slate-700">Notes</div>{notesLoading ? <p className="mt-3 text-sm text-slate-500">Loading notes...</p> : notes.length === 0 ? <p className="mt-3 text-sm text-slate-500">No notes yet.</p> : <div className="mt-3 space-y-2">{notes.map((note) => <div key={note.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><div>{note.content}</div><div className="mt-1 text-xs text-slate-400">{new Date(note.created_at).toLocaleString()}</div></div>)}</div>}<textarea value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="Add a recruiter note" className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-violet-400" /><button type="button" disabled={isSaving || !newNote.trim()} onClick={() => void saveNote()} className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Save Note</button></div>
      </> : <p className="py-8 text-center text-sm text-slate-500">Select an application to review it.</p>}</motion.div></AnimatePresence></GlassPanel></div>
    </div>
  );
}
