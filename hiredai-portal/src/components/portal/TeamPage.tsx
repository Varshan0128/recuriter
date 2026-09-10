import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Trash2 } from "lucide-react";
import { GlassPanel } from "./shared";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../lib/api";

type TeamMember = { id: string; name: string | null; email: string; role: string; status: string; created_at: string };

export default function TeamPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: members = [], isLoading, error } = useQuery({ queryKey: ["team", user.company_id], queryFn: () => apiRequest<TeamMember[]>(`/api/team?company_id=${user.company_id}`) });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("recruiter");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const invite = async () => { if (!email.trim()) return; setSaving(true); try { await apiRequest("/api/team", { method: "POST", body: JSON.stringify({ company_id: user.company_id, email, name, role, invited_by: user.id }) }); setEmail(""); setName(""); setFeedback("Invitation saved."); await queryClient.invalidateQueries({ queryKey: ["team", user.company_id] }); } catch (actionError) { setFeedback(actionError instanceof Error ? actionError.message : "Unable to save team member."); } finally { setSaving(false); } };
  const remove = async (id: string) => { setSaving(true); try { await apiRequest(`/api/team?company_id=${user.company_id}&id=${id}`, { method: "DELETE" }); await queryClient.invalidateQueries({ queryKey: ["team", user.company_id] }); } catch (actionError) { setFeedback(actionError instanceof Error ? actionError.message : "Unable to remove member."); } finally { setSaving(false); } };
  return <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><GlassPanel title="Team members" subtitle="Manage recruiter roles and invitation records.">{isLoading ? <p className="text-sm text-slate-500">Loading team...</p> : error ? <p className="text-sm text-red-600">{error.message}</p> : members.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No team members yet.</p> : <div className="space-y-3">{members.map((member) => <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-4"><div><div className="font-semibold text-slate-950">{member.name || member.email}</div><div className="text-xs text-slate-500">{member.email} · {member.role} · {member.status}</div></div>{member.status !== "member" ? <button type="button" disabled={saving} onClick={() => void remove(member.id)} aria-label={`Remove ${member.email}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button> : null}</div>)}</div>}</GlassPanel><GlassPanel title="Invite member" subtitle="This records an invitation; no email is sent by this application."><div className="grid gap-3"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" className="rounded-xl border border-slate-200 p-3 text-sm" /><input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" type="email" className="rounded-xl border border-slate-200 p-3 text-sm" /><select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-slate-200 p-3 text-sm"><option value="recruiter">Recruiter</option><option value="hiring manager">Hiring Manager</option><option value="admin">Admin</option></select><button type="button" disabled={saving || !email.trim()} onClick={() => void invite()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"><UserPlus size={16} /> {saving ? "Saving..." : "Save invitation"}</button>{feedback ? <p className="text-sm text-slate-600">{feedback}</p> : null}</div></GlassPanel></div>;
}
