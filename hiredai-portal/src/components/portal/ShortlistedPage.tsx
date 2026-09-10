import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Search } from "lucide-react";
import { motion } from "motion/react";
import { GlassPanel } from "./shared";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";
import { type Application, useApplications } from "../../lib/queries";

export default function ShortlistedPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: applications = [], isLoading, error } = useApplications();
  const shortlisted = applications.filter((application) => application.status === "shortlisted");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const filtered = shortlisted.filter((application) => `${application.candidate_name} ${application.job_title} ${application.candidate_email}`.toLowerCase().includes(search.trim().toLowerCase()));

  const updateStatus = async (application: Application, status: Application["status"]) => {
    setIsSaving(true);
    try {
      await apiRequest(`/api/applications?id=${application.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["applications", user.company_id] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard", user.company_id] }),
      ]);
      setSelected(null);
      setFeedback({ type: "success", text: `${application.candidate_name} moved to ${status}.` });
    } catch (actionError) {
      setFeedback({ type: "error", text: actionError instanceof Error ? actionError.message : "Unable to update candidate stage." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="Shortlisted Candidates" subtitle="Candidates currently at the shortlisted stage." action={<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2"><Search size={15} className="text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shortlisted" className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400" /></div>}>
          {feedback ? <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{feedback.text}</div> : null}
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading shortlisted candidates...</p> : null}
          {error ? <p className="p-6 text-sm text-red-600">{error.message}</p> : null}
          {!isLoading && !error ? <div className="overflow-x-auto rounded-[26px] border border-slate-100 bg-white/80"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500"><tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Resume</th><th className="px-4 py-3">Actions</th></tr></thead><tbody>{filtered.map((application) => <tr key={application.id} className="border-t border-slate-100 hover:bg-violet-50/30"><td className="px-4 py-4"><div className="font-semibold text-slate-950">{application.candidate_name}</div><div className="text-xs text-slate-500">{application.candidate_email}</div></td><td className="px-4 py-4 text-sm text-slate-700">{application.job_title}</td><td className="px-4 py-4 text-sm text-slate-700">{new Date(application.applied_at).toLocaleDateString()}</td><td className="px-4 py-4">{application.resume_url ? <a href={application.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700"><FileText size={15} />Open</a> : <span className="text-sm text-slate-400">Unavailable</span>}</td><td className="px-4 py-4"><button type="button" onClick={() => setSelected(application)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">Review</button></td></tr>)}</tbody></table>{filtered.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No shortlisted candidates match your search.</p> : null}</div> : null}
        </GlassPanel>
      </motion.div>
      {selected ? <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4" onMouseDown={() => setSelected(null)}><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}><h2 className="text-xl font-bold text-slate-950">{selected.candidate_name}</h2><p className="mt-1 text-sm text-slate-500">{selected.job_title}</p><div className="mt-5 grid gap-3"><button type="button" disabled={isSaving} onClick={() => void updateStatus(selected, "interview")} className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">Move to Interview</button><button type="button" disabled={isSaving} onClick={() => void updateStatus(selected, "rejected")} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 disabled:opacity-50">Reject</button><button type="button" onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">Close</button></div></div></div> : null}
    </div>
  );
}
