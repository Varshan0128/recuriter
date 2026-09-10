import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDays, ExternalLink, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { GlassPanel } from "./shared";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { useApplications, useInterviews } from "../../lib/queries";

export default function InterviewsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: interviews = [], isLoading, error } = useInterviews();
  const { data: applications = [] } = useApplications();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [interviewerId, setInterviewerId] = useState(user.id);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [interviewType, setInterviewType] = useState("video");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const resetForm = () => { setOpen(false); setEditingId(null); setApplicationId(""); setScheduledAt(""); setInterviewerId(user.id); setMeetingUrl(""); setInterviewType("video"); setNotes(""); };
  const saveInterview = async () => {
    if (!applicationId || !scheduledAt) { setFeedback({ type: "error", text: "Candidate and date/time are required." }); return; }
    setSaving(true);
    try {
      const body = { application_id: applicationId, scheduled_at: new Date(scheduledAt).toISOString(), interviewer_id: interviewerId || null, meeting_url: meetingUrl || null, interview_type: interviewType, notes: notes || null, status: "scheduled" };
      await apiRequest(`/api/interviews${editingId ? `?id=${editingId}` : ""}`, { method: editingId ? "PATCH" : "POST", body: JSON.stringify(editingId ? { ...body, id: editingId } : body) });
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["interviews", user.company_id] }), queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] })]);
      setFeedback({ type: "success", text: editingId ? "Interview rescheduled." : "Interview scheduled." }); resetForm();
    } catch (actionError) { setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to save interview." }); } finally { setSaving(false); }
  };
  const updateInterview = async (id: string, status: "cancelled" | "completed") => {
    setSaving(true);
    try { await apiRequest(`/api/interviews?id=${id}`, { method: "PATCH", body: JSON.stringify({ id, status }) }); await queryClient.invalidateQueries({ queryKey: ["interviews", user.company_id] }); setFeedback({ type: "success", text: `Interview marked ${status}.` }); } catch (actionError) { setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to update interview." }); } finally { setSaving(false); }
  };
  const editInterview = (item: typeof interviews[number]) => { setEditingId(item.id); setApplicationId(item.application_id); setScheduledAt(new Date(item.scheduled_at).toISOString().slice(0, 16)); setInterviewerId(item.interviewer_id ?? ""); setMeetingUrl(item.meeting_url ?? ""); setInterviewType(item.interview_type ?? "video"); setNotes(item.notes ?? ""); setOpen(true); };

  return <div className="space-y-5"><GlassPanel title="Interviews" subtitle="Schedule and manage real candidate interviews." action={<button type="button" onClick={() => { resetForm(); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={16} /> Schedule interview</button>}>
    {feedback ? <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{feedback.text}</div> : null}
    {isLoading ? <p className="p-6 text-sm text-slate-500">Loading interviews...</p> : null}
    {error ? <p className="p-6 text-sm text-red-600">{error.message}</p> : null}
    {!isLoading && !error && interviews.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">No interviews scheduled yet.</div> : null}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{interviews.map((item, index) => <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="rounded-2xl border border-slate-100 bg-white/80 p-5"><div className="flex items-start justify-between gap-3"><div><div className="text-lg font-bold text-slate-950">{item.candidate_name}</div><div className="text-sm text-slate-500">{item.job_title}</div></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold capitalize text-violet-700">{item.status}</span></div><div className="mt-4 flex items-center gap-2 text-sm text-slate-600"><CalendarDays size={15} className="text-violet-600" />{new Date(item.scheduled_at).toLocaleString()}</div><div className="mt-2 text-xs text-slate-500">{item.interview_type ?? "Interview"}</div><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">{item.meeting_url ? <button type="button" onClick={() => window.open(item.meeting_url!, "_blank", "noopener,noreferrer")} className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white"><ExternalLink size={13} /> Join Meeting</button> : <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500">No meeting URL</span>}<button type="button" disabled={saving} onClick={() => editInterview(item)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">Reschedule</button>{item.status !== "cancelled" ? <button type="button" disabled={saving} onClick={() => void updateInterview(item.id, "cancelled")} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"><X size={13} /> Cancel</button> : null}</div></motion.div>)}</div>
+  </GlassPanel>
+  {open ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4" onMouseDown={resetForm}><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-slate-950">{editingId ? "Reschedule interview" : "Schedule interview"}</h2><button type="button" onClick={resetForm} aria-label="Close scheduling dialog"><X size={18} /></button></div><div className="mt-5 grid gap-4"><label className="text-sm font-semibold text-slate-700">Candidate<select value={applicationId} onChange={(event) => setApplicationId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"><option value="">Select candidate</option>{applications.map((application) => <option key={application.id} value={application.id}>{application.candidate_name} · {application.job_title}</option>)}</select></label><label className="text-sm font-semibold text-slate-700">Date and time<input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" /></label><label className="text-sm font-semibold text-slate-700">Interviewer<input value={interviewerId} onChange={(event) => setInterviewerId(event.target.value)} placeholder="Interviewer user ID" className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" /></label><label className="text-sm font-semibold text-slate-700">Interview type<select value={interviewType} onChange={(event) => setInterviewType(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"><option value="video">Video</option><option value="phone">Phone</option><option value="onsite">On-site</option></select></label><label className="text-sm font-semibold text-slate-700">Meeting URL<input value={meetingUrl} onChange={(event) => setMeetingUrl(event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3" /></label><label className="text-sm font-semibold text-slate-700">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 bg-white p-3" /></label><button type="button" disabled={saving} onClick={() => void saveInterview()} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : editingId ? "Save reschedule" : "Schedule interview"}</button></div></div></div> : null}</div>;
}
