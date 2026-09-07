import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheckBig } from "lucide-react";
import { GlassPanel, ToggleSwitch } from "./shared";

export default function SettingsPage() {
  const [notifPrefs, setNotifPrefs] = useState({
    "New applications": true,
    "Interview reminders": true,
    "Job expiry": true,
    "Hiring completed": true,
    "Application updates": true,
  });
  const [saved, setSaved] = useState(false);

  const toggle = (key: string) => setNotifPrefs((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
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
            {[
              <>Default hiring stage: <span className="font-semibold text-slate-900">Shortlisted</span></>,
              <>ATS sorting: <span className="font-semibold text-slate-900">Highest score first</span></>,
              <>Visible columns: Candidate, ATS Score, Skills Match, Status</>,
            ].map((content, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
                className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-3"
              >
                {content}
              </motion.div>
            ))}
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
