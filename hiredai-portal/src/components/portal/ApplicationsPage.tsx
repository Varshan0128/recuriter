import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { BrainCircuit, CalendarClock, Download, FileText, Search } from "lucide-react";
import { GlassPanel } from "./shared";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { type Application, useActivity, useApplicationEvaluation, useApplications, useInterviewScorecards, useNotes } from "../../lib/queries";

function applicationTone(status: string) {
  switch (status) {
    case "applied":
      return "bg-slate-100 text-slate-700";
    case "reviewed":
      return "bg-cyan-50 text-cyan-700";
    case "shortlisted":
      return "bg-violet-50 text-violet-700";
    case "interview":
      return "bg-amber-50 text-amber-700";
    case "rejected":
      return "bg-red-50 text-red-700";
    case "hired":
      return "bg-emerald-50 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

const EVALUATION_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
  manual_review: "Manual review",
};

function getEvaluationStatusTone(status: string | null | undefined) {
  switch (status) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "processing":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "failed":
      return "border-red-200 bg-red-50 text-red-700";
    case "manual_review":
      return "border-violet-200 bg-violet-50 text-violet-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

const statuses = ["applied", "reviewed", "shortlisted", "interview", "rejected", "hired"] as const;
type SortKey = "candidate" | "applied_at" | "status";
type ScorecardDraft = {
  overall_rating: string;
  technical_skills: string;
  communication: string;
  problem_solving: string;
  role_fit: string;
  strengths: string;
  concerns: string;
  recommendation: string;
};

const emptyScorecard: ScorecardDraft = {
  overall_rating: "",
  technical_skills: "",
  communication: "",
  problem_solving: "",
  role_fit: "",
  strengths: "",
  concerns: "",
  recommendation: "Maybe",
};

function getEventLabel(eventType: string) {
  switch (eventType) {
    case "applied": return "Application received";
    case "reviewed": return "Candidate reviewed";
    case "shortlisted": return "Candidate shortlisted";
    case "interview": return "Interview stage updated";
    case "rejected": return "Application rejected";
    case "hired": return "Candidate hired";
    case "note_added": return "Recruiter note added";
    case "interview_scheduled": return "Interview scheduled";
    case "interview_rescheduled": return "Interview rescheduled";
    case "interview_cancelled": return "Interview cancelled";
    case "interview_completed": return "Interview completed";
    default: return eventType.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}

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
  const [scorecardForm, setScorecardForm] = useState<ScorecardDraft>(emptyScorecard);
  const [evaluationForm, setEvaluationForm] = useState({
    recruiter_decision: "",
    override_score: "",
    reviewer: "",
    reason: "",
  });

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
  const { data: activity = [] } = useActivity(selected?.id ?? null);
  const { data: scorecards = [] } = useInterviewScorecards(selected?.id ?? null);
  const { data: evaluations = [] } = useApplicationEvaluation(selected?.id ?? null);
  const selectedScorecard = scorecards[0] ?? null;
  const latestEvaluation = evaluations[0] ?? null;
  const screeningAnswers = Array.isArray(selected?.screening_answers) ? selected.screening_answers as Array<{ question?: string; answer?: string; question_text?: string; response?: string }> : [];

  useEffect(() => {
    if (!selectedId && applications[0]) setSelectedId(applications[0].id);
  }, [applications, selectedId]);

  useEffect(() => {
    if (selectedScorecard) {
      setScorecardForm({
        overall_rating: selectedScorecard.overall_rating?.toString() ?? "",
        technical_skills: selectedScorecard.technical_skills?.toString() ?? "",
        communication: selectedScorecard.communication?.toString() ?? "",
        problem_solving: selectedScorecard.problem_solving?.toString() ?? "",
        role_fit: selectedScorecard.role_fit?.toString() ?? "",
        strengths: selectedScorecard.strengths ?? "",
        concerns: selectedScorecard.concerns ?? "",
        recommendation: selectedScorecard.recommendation ?? "Maybe",
      });
    } else {
      setScorecardForm(emptyScorecard);
    }
  }, [selectedScorecard, selected?.id]);

  useEffect(() => {
    if (latestEvaluation) {
      setEvaluationForm({
        recruiter_decision: latestEvaluation.recruiter_decision ?? "",
        override_score: latestEvaluation.override_score !== null && latestEvaluation.override_score !== undefined ? String(latestEvaluation.override_score) : "",
        reviewer: latestEvaluation.reviewer ?? "",
        reason: latestEvaluation.reason ?? "",
      });
      return;
    }

    setEvaluationForm({
      recruiter_decision: "",
      override_score: "",
      reviewer: "",
      reason: "",
    });
  }, [latestEvaluation, selected?.id]);

  const refreshApplicationQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["applications", user.company_id] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] }),
      queryClient.invalidateQueries({ queryKey: ["notes", selected?.id] }),
      queryClient.invalidateQueries({ queryKey: ["activity", selected?.id] }),
      queryClient.invalidateQueries({ queryKey: ["scorecards", selected?.id] }),
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

  const saveScorecard = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const payload = {
        application_id: selected.id,
        overall_rating: scorecardForm.overall_rating ? Number(scorecardForm.overall_rating) : null,
        technical_skills: scorecardForm.technical_skills ? Number(scorecardForm.technical_skills) : null,
        communication: scorecardForm.communication ? Number(scorecardForm.communication) : null,
        problem_solving: scorecardForm.problem_solving ? Number(scorecardForm.problem_solving) : null,
        role_fit: scorecardForm.role_fit ? Number(scorecardForm.role_fit) : null,
        strengths: scorecardForm.strengths.trim() || null,
        concerns: scorecardForm.concerns.trim() || null,
        recommendation: scorecardForm.recommendation || null,
      };
      await apiRequest("/api/scorecards", {
        method: selectedScorecard ? "PATCH" : "POST",
        body: JSON.stringify(selectedScorecard ? { ...payload, id: selectedScorecard.id } : payload),
      });
      await queryClient.invalidateQueries({ queryKey: ["scorecards", selected.id] });
      setFeedback({ type: "success", text: selectedScorecard ? "Scorecard updated." : "Scorecard saved." });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to save scorecard." });
    } finally {
      setIsSaving(false);
    }
  };

  const saveEvaluation = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const payload = {
        application_id: selected.id,
        recruiter_decision: evaluationForm.recruiter_decision || null,
        override_score: evaluationForm.override_score ? Number(evaluationForm.override_score) : null,
        reviewer: evaluationForm.reviewer.trim() || null,
        reason: evaluationForm.reason.trim() || null,
      };

      await apiRequest("/api/evaluations", {
        method: latestEvaluation ? "PATCH" : "POST",
        body: JSON.stringify(latestEvaluation ? { ...payload, id: latestEvaluation.id } : payload),
      });

      await queryClient.invalidateQueries({ queryKey: ["evaluations", selected.id] });
      setFeedback({ type: "success", text: latestEvaluation ? "Evaluation override saved." : "Evaluation created." });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to save evaluation." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="Applications" subtitle="Review candidates and move them through the hiring workflow." action={<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate" className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>}>
          <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option className="bg-white text-slate-900" value="all">All jobs</option>{Array.from(new Map(applications.map((app) => [app.job_id, app.job_title]))).map(([id, title]) => <option className="bg-white text-slate-900" key={id} value={id}>{title}</option>)}</select><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option className="bg-white text-slate-900" value="all">All stages</option>{statuses.map((status) => <option className="bg-white text-slate-900" key={status} value={status}>{status}</option>)}</select><select value={`${sortKey}:${sortDirection}`} onChange={(event) => { const [nextKey, nextDirection] = event.target.value.split(":") as [SortKey, "asc" | "desc"]; setSortKey(nextKey); setSortDirection(nextDirection); }} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option className="bg-white text-slate-900" value="applied_at:desc">Newest applied</option><option className="bg-white text-slate-900" value="applied_at:asc">Oldest applied</option><option className="bg-white text-slate-900" value="candidate:asc">Candidate A-Z</option><option className="bg-white text-slate-900" value="candidate:desc">Candidate Z-A</option><option className="bg-white text-slate-900" value="status:asc">Stage A-Z</option></select><div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500">{filtered.length} result{filtered.length === 1 ? "" : "s"}</div></div>
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
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><label className="block text-sm font-semibold text-slate-700">Stage<select value={selected.status} disabled={isSaving} onChange={(event) => void updateStatus(selected, event.target.value as Application["status"])} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"><option className="bg-white text-slate-900" value="applied">Applied</option><option className="bg-white text-slate-900" value="reviewed">Reviewed</option><option className="bg-white text-slate-900" value="shortlisted">Shortlisted</option><option className="bg-white text-slate-900" value="interview">Interview</option><option className="bg-white text-slate-900" value="rejected">Rejected</option><option className="bg-white text-slate-900" value="hired">Hired</option></select></label><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" disabled={isSaving || selected.status === "shortlisted"} onClick={() => void updateStatus(selected, "shortlisted")} className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{isSaving ? "Saving..." : "Shortlist"}</button><button type="button" disabled={isSaving} onClick={() => { if (window.confirm(`Reject ${selected.candidate_name}?`)) void updateStatus(selected, "rejected"); }} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 disabled:opacity-50">Reject</button></div><button type="button" disabled={isSaving || selected.status === "hired"} onClick={() => void updateStatus(selected, "hired")} className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-50">Hire</button></div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><div className="text-sm font-semibold text-slate-700">Notes</div>{notesLoading ? <p className="mt-3 text-sm text-slate-500">Loading notes...</p> : notes.length === 0 ? <p className="mt-3 text-sm text-slate-500">No notes yet.</p> : <div className="mt-3 space-y-2">{notes.map((note) => <div key={note.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700"><div>{note.content}</div><div className="mt-1 text-xs text-slate-400">{new Date(note.created_at).toLocaleString()}</div></div>)}</div>}<textarea value={newNote} onChange={(event) => setNewNote(event.target.value)} placeholder="Add a recruiter note" className="mt-3 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-violet-400" /><button type="button" disabled={isSaving || !newNote.trim()} onClick={() => void saveNote()} className="mt-2 w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Save Note</button></div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><CalendarClock size={15} className="text-violet-600" />Application activity</div>{activity.length === 0 ? <p className="mt-3 text-sm text-slate-500">No workflow events yet.</p> : <div className="mt-3 space-y-3">{activity.map((item) => (<div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><div className="text-sm font-semibold text-slate-800">{getEventLabel(item.event_type)}</div><div className="text-[11px] text-slate-400">{new Date(item.created_at).toLocaleString()}</div></div>{item.actor_name ? <div className="mt-1 text-xs text-slate-500">Actor: {item.actor_name}</div> : null}{item.details && typeof item.details === "object" && Object.keys(item.details).length > 0 ? <div className="mt-2 text-xs text-slate-600">{Object.entries(item.details).map(([key, value]) => <div key={key} className="mt-1"><span className="font-medium capitalize text-slate-700">{key.replace(/_/g, " ")}:</span> {typeof value === "object" ? JSON.stringify(value) : String(value)}</div>)}</div> : null}</div>))}</div>}</div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><BrainCircuit size={15} className="text-violet-600" />AI review</div>{latestEvaluation ? <div className="mt-3 space-y-3"><div className={`rounded-xl border p-3 text-sm ${getEvaluationStatusTone(latestEvaluation.evaluate_status)}`}><div className="font-semibold">Status: {EVALUATION_STATUS_LABELS[latestEvaluation.evaluate_status] ?? latestEvaluation.evaluate_status}</div>{latestEvaluation.ai_score !== null ? <div className="mt-1">AI score: {latestEvaluation.ai_score}/100</div> : <div className="mt-1">AI score unavailable. No evaluator has produced a score.</div>}{latestEvaluation.fit_summary ? <p className="mt-2 text-xs">{latestEvaluation.fit_summary}</p> : null}</div>{latestEvaluation.recruiter_decision ? <div className="text-xs text-slate-600">Recruiter decision: {latestEvaluation.recruiter_decision}</div> : null}{latestEvaluation.reason ? <div className="text-xs text-slate-600">Reason: {latestEvaluation.reason}</div> : null}<div className="text-xs text-slate-500">Last updated: {latestEvaluation.updated_at ? new Date(latestEvaluation.updated_at).toLocaleString() : latestEvaluation.created_at ? new Date(latestEvaluation.created_at).toLocaleString() : "Not available"}</div></div> : <div className="mt-3 rounded-xl border border-dashed border-violet-200 bg-violet-50 p-3 text-sm text-violet-700">AI evaluation pending. No external evaluator is connected in this build, so the record remains honest and unfilled until a real scoring service is available.</div>}
        <div className="mt-4 rounded-xl border border-violet-100 bg-violet-50/50 p-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">Recruiter override</div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-700">Decision<select value={evaluationForm.recruiter_decision} onChange={(event) => setEvaluationForm((prev) => ({ ...prev, recruiter_decision: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"><option value="">Select</option><option value="agree">Agree</option><option value="disagree">Disagree</option></select></label>
            <label className="block text-sm font-semibold text-slate-700">Override score<input type="number" value={evaluationForm.override_score} onChange={(event) => setEvaluationForm((prev) => ({ ...prev, override_score: event.target.value }))} min="0" max="100" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
            <label className="block text-sm font-semibold text-slate-700 md:col-span-2">Reviewer<input value={evaluationForm.reviewer} onChange={(event) => setEvaluationForm((prev) => ({ ...prev, reviewer: event.target.value }))} placeholder="Recruiter name" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
            <label className="block text-sm font-semibold text-slate-700 md:col-span-2">Reason<textarea value={evaluationForm.reason} onChange={(event) => setEvaluationForm((prev) => ({ ...prev, reason: event.target.value }))} rows={3} placeholder="Add the reasoning behind the override" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900" /></label>
          </div>
          <button type="button" onClick={() => void saveEvaluation()} disabled={isSaving || !selected} className="mt-3 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{latestEvaluation ? "Save override" : "Create evaluation"}</button>
        </div>
        {screeningAnswers.length > 0 ? <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Screening answers</div><div className="mt-3 space-y-2">{screeningAnswers.map((entry, index) => <div key={`${entry.question ?? entry.question_text ?? "question"}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm"><div className="font-semibold text-slate-800">{entry.question ?? entry.question_text ?? `Question ${index + 1}`}</div><div className="mt-1 text-slate-600">{entry.answer ?? entry.response ?? "No response recorded."}</div></div>)}</div></div> : <div className="mt-4 text-xs text-slate-500">No screening answers recorded yet.</div>}</div>
        <div className="rounded-2xl border border-slate-100 bg-white/80 p-4"><div className="text-sm font-semibold text-slate-700">Interview scorecard</div>{selectedScorecard ? <div className="mt-3 space-y-3"><div className="grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-slate-50 p-2"><span className="text-slate-500">Overall:</span> <span className="font-semibold text-slate-900">{selectedScorecard.overall_rating ?? "-"}/5</span></div><div className="rounded-xl bg-slate-50 p-2"><span className="text-slate-500">Recommendation:</span> <span className="font-semibold text-slate-900">{selectedScorecard.recommendation ?? "-"}</span></div></div>{selectedScorecard.strengths ? <p className="text-sm text-slate-600">Strengths: {selectedScorecard.strengths}</p> : null}{selectedScorecard.concerns ? <p className="text-sm text-slate-600">Concerns: {selectedScorecard.concerns}</p> : null}</div> : <p className="mt-3 text-sm text-slate-500">No scorecard has been saved yet.</p>}<div className="mt-4 grid gap-3 md:grid-cols-2">{([['overall_rating','Overall rating'],['technical_skills','Technical skills'],['communication','Communication'],['problem_solving','Problem solving'],['role_fit','Role fit']]).map(([field, label]) => <label key={field} className="block text-sm font-semibold text-slate-700">{label}<select value={scorecardForm[field as keyof ScorecardDraft]} onChange={(event) => setScorecardForm((prev) => ({ ...prev, [field]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"><option value="">Select</option>{[1,2,3,4,5].map((value) => <option key={value} value={value.toString()}>{value}</option>)}</select></label>)}</div><label className="mt-3 block text-sm font-semibold text-slate-700">Recommendation<select value={scorecardForm.recommendation} onChange={(event) => setScorecardForm((prev) => ({ ...prev, recommendation: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"><option value="Maybe">Maybe</option><option value="Hire">Hire</option><option value="Strong Hire">Strong Hire</option><option value="No Hire">No Hire</option><option value="Strong No Hire">Strong No Hire</option></select></label><label className="mt-3 block text-sm font-semibold text-slate-700">Strengths<textarea value={scorecardForm.strengths} onChange={(event) => setScorecardForm((prev) => ({ ...prev, strengths: event.target.value }))} className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-violet-400" /></label><label className="mt-3 block text-sm font-semibold text-slate-700">Concerns<textarea value={scorecardForm.concerns} onChange={(event) => setScorecardForm((prev) => ({ ...prev, concerns: event.target.value }))} className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-violet-400" /></label><button type="button" disabled={isSaving} onClick={() => void saveScorecard()} className="mt-4 w-full rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{selectedScorecard ? "Update scorecard" : "Save scorecard"}</button></div>
      </> : <p className="py-8 text-center text-sm text-slate-500">Select an application to review it.</p>}</motion.div></AnimatePresence></GlassPanel></div>
    </div>
  );
}
