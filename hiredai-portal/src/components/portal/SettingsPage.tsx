import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheckBig } from "lucide-react";
import { GlassPanel, ToggleSwitch } from "./shared";
import { apiRequest } from "../../lib/api";
import { useAuth } from "../../auth/AuthContext";
import { usePreferences } from "../../lib/queries";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: savedPreferences } = usePreferences();
  const queryClient = useQueryClient();
  const [notifPrefs, setNotifPrefs] = useState({
    "New applications": true,
    "Interview reminders": true,
    "Job expiry": true,
    "Hiring completed": true,
    "Application updates": true,
  });
  const [saved, setSaved] = useState(false);
  const [workspace, setWorkspace] = useState({ stage: "shortlisted", sort: "highest", columns: "candidate,score,skills,status" });

  useEffect(() => {
    if (!savedPreferences) return;
    const notifications = savedPreferences.notifications as Record<string, boolean> | undefined;
    const savedWorkspace = savedPreferences.workspace as Partial<typeof workspace> | undefined;
    if (notifications) setNotifPrefs((previous) => ({ ...previous, ...notifications }));
    if (savedWorkspace) setWorkspace((previous) => ({ ...previous, ...savedWorkspace }));
  }, [savedPreferences]);

  const toggle = (key: string) => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const handleSave = async () => {
    if (!user?.id) return;
    try {
      await apiRequest(`/api/settings?user_id=${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ notifications: notifPrefs, workspace }),
      });
      await queryClient.invalidateQueries({ queryKey: ["preferences", user.id] });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {
      setSaved(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="Notifications" subtitle="Fine-tune which recruiter alerts stay visible.">
          <div className="space-y-3">
            {Object.keys(notifPrefs).map((label, i) => (
              <motion.label
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 transition hover:border-violet-200"
              >
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <ToggleSwitch checked={notifPrefs[label as keyof typeof notifPrefs]} onChange={() => toggle(label)} />
              </motion.label>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
        <GlassPanel title="Workspace preferences" subtitle="Default filters and column choices for hiring decisions.">
          <div className="space-y-4 text-sm text-slate-600">
            <label className="block rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">Default hiring stage
              <select value={workspace.stage} onChange={(event) => setWorkspace((previous) => ({ ...previous, stage: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                <option value="shortlisted">Shortlisted</option><option value="applied">Applied</option><option value="interview">Interview</option><option value="hired">Hired</option>
              </select>
            </label>
            <label className="block rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">ATS sorting
              <select value={workspace.sort} onChange={(event) => setWorkspace((previous) => ({ ...previous, sort: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                <option value="highest">Highest score first</option><option value="newest">Newest first</option>
              </select>
            </label>
            <label className="block rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">Visible columns
              <input value={workspace.columns} onChange={(event) => setWorkspace((previous) => ({ ...previous, columns: event.target.value }))} className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900" />
            </label>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(124,58,237,0.24)]"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={saved ? "saved" : "save"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <CircleCheckBig size={16} /> Saved
                    </>
                  ) : (
                    "Save settings"
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
