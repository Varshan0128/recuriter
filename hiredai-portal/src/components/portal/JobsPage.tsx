import { motion } from "motion/react";
import { MoreHorizontal, PencilLine } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { GlassPanel } from "./shared";
import { JOBS, currency, statusTone } from "./data";

export default function JobsPage() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <GlassPanel title="My Jobs" subtitle="Track live roles, score distribution, and posted status at a glance.">
          <div className="overflow-hidden rounded-[26px] border border-slate-100 bg-white/80">
            <table className="w-full text-left">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Job</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applications</th>
                  <th className="px-4 py-3">ATS Avg</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {JOBS.map((job, i) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                    className="border-t border-slate-100 transition hover:bg-violet-50/30"
                  >
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-950">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.id} - {job.posted}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{job.department}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(job.status)}`}>{job.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900">{currency(job.applications)}</td>
                    <td className="px-4 py-4">
                      {job.atsAvg ? (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${job.atsAvg}%` }}
                              transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                              className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#a855f7)]"
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{job.atsAvg}%</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-700">{job.location}</td>
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
          </div>
        </GlassPanel>
      </motion.div>

      <div className="grid gap-5">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <GlassPanel title="Hiring analytics" subtitle="Compact trend view for job-level performance.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={JOBS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE9F8" />
                  <XAxis dataKey="title" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="applications" radius={[12, 12, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
                    {JOBS.map((entry, index) => (
                      <Cell key={entry.id} fill={index % 2 === 0 ? "#7c3aed" : "#06b6d4"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
        >
          <GlassPanel title="Create from template" subtitle="Quick actions for the next posting.">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Product Designer", "Backend Engineer", "Data Scientist", "DevOps Engineer"].map((role, i) => (
                <motion.button
                  key={role}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.25 + i * 0.06, ease: "easeOut" }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-[22px] border border-slate-100 bg-white/80 px-4 py-4 text-left text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
                >
                  {role}
                </motion.button>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
