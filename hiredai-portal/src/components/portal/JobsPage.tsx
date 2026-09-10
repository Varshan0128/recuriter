import { motion } from "motion/react";
import { MoreHorizontal, PencilLine } from "lucide-react";
import { GlassPanel } from "./shared";
import { useJobs } from "../../lib/queries";

const statusTone: Record<string, string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-50 text-slate-600",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-red-200 bg-red-50 text-red-700",
};

export default function JobsPage() {
  const { data: jobs = [], isLoading, error } = useJobs();

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
        <GlassPanel title="My Jobs" subtitle="Live roles belonging to your company.">
          {isLoading ? <p className="p-6 text-sm text-slate-500">Loading jobs...</p> : null}
          {error ? <p className="p-6 text-sm text-red-600">{error.message}</p> : null}
          {!isLoading && !error ? (
            <div className="overflow-x-auto rounded-[26px] border border-slate-100 bg-white/80">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Experience</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Work mode</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                    className="border-t border-slate-100 transition hover:bg-violet-50/30"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-950">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.id}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone[job.status]}`}>{job.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{job.experience_min ?? "-"} - {job.experience_max ?? "-"} years</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{job.employment_type}</td>
                    <td className="px-4 py-4 text-sm text-slate-700">{job.work_mode}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} className="rounded-xl border border-slate-200 p-2 hover:border-violet-200 hover:text-violet-700">
                          <PencilLine size={15} />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }} className="rounded-xl border border-slate-200 p-2 hover:border-violet-200 hover:text-violet-700">
                          <MoreHorizontal size={15} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No jobs have been posted yet.</p> : null}
            </div>
          ) : null}
        </GlassPanel>
      </motion.div>
    </div>
  );
}
