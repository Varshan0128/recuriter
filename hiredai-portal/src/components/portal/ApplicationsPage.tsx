import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { GlassPanel } from "./shared";
import { APPLICATIONS, applicationTone } from "./data";

export default function ApplicationsPage() {
  const [selectedId, setSelectedId] = useState(APPLICATIONS[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => APPLICATIONS.filter((app) => `${app.candidate} ${app.role} ${app.location}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? APPLICATIONS[0];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel
          title="Applications"
          subtitle="Professional review table with avatar, ATS score, experience, and workflow status."
          action={
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
              <Search size={15} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search candidate"
                className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          }
        >
          <div className="overflow-hidden rounded-[26px] border border-slate-100 bg-white/80">
            <table className="w-full text-left">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Candidate</th>
                  <th className="px-4 py-3">ATS Score</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Applied</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((app, i) => (
                    <motion.tr
                      key={app.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                      onClick={() => setSelectedId(app.id)}
                      className={`cursor-pointer border-t border-slate-100 transition hover:bg-violet-50/40 ${selected?.id === app.id ? "bg-violet-50/70" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-950">{app.candidate}</div>
                        <div className="text-xs text-slate-500">{app.role} - {app.location}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">{app.score}%</span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{app.experience}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{app.skillsMatch}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{app.appliedDate}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${applicationTone(app.status)}`}>{app.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}>
          <GlassPanel title="Candidate detail" subtitle="A focused review panel with ATS context and notes.">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="rounded-[26px] bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] p-5 text-white shadow-[0_24px_64px_rgba(124,58,237,0.18)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">ATS Score</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mt-2 text-4xl font-extrabold"
                  >
                    {selected.score}
                  </motion.div>
                  <div className="mt-1 text-sm text-violet-100">Strong fit for {selected.role}</div>
                </div>
                <div className="rounded-[26px] border border-slate-100 bg-white/80 p-5">
                  <div className="text-lg font-bold text-slate-950">{selected.candidate}</div>
                  <div className="text-sm text-slate-500">{selected.role}</div>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div><span className="font-semibold text-slate-800">Experience:</span> {selected.experience}</div>
                    <div><span className="font-semibold text-slate-800">Education:</span> {selected.education}</div>
                    <div><span className="font-semibold text-slate-800">Skills match:</span> {selected.skillsMatch}</div>
                    <div><span className="font-semibold text-slate-800">Location:</span> {selected.location}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Resume", "Download", "Notes", "Shortlist"].map((label) => (
                    <motion.button
                      key={label}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
