import { motion } from "motion/react";
import {
  ArrowRight,
  CircleCheckBig,
  Clock3,
  FileText,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassPanel } from "./shared";
import { APPLICATIONS, INTERVIEWS, JOBS, PIPELINE_DATA, currency, statusDot, statusTone } from "./data";
import { HomeFAQFooter } from "./HomeFAQFooter";

export function DashboardHero({ onPostJob, onViewApplications }: { onPostJob: () => void; onViewApplications: () => void }) {
  return (
    <section className="relative flex items-center overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(180deg,#f5f3ff_0%,#faf9ff_55%,#ffffff_100%)] px-6 py-14 shadow-[0_24px_64px_rgba(124,58,237,0.10)] md:px-10 md:py-16 lg:min-h-[calc(100vh-73px)]">
      <motion.div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-200/40 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="pointer-events-none absolute left-10 top-10 h-16 w-16 rounded-full border border-violet-200"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute right-10 top-16 h-14 w-14 rounded-2xl bg-violet-100/70"
        animate={{ y: [0, 10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-700 shadow-sm"
        >
          <Sparkles size={14} />
          AI-Powered Recruitment Platform
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 md:text-6xl lg:text-7xl"
        >
          Hire Smarter.
          <br />
          <span className="bg-[linear-gradient(135deg,#7c3aed,#a855f7)] bg-clip-text text-transparent">
            Build Stronger Teams.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-5 max-w-xl text-base leading-7 text-slate-500 md:text-lg"
        >
          HiredAI helps recruiters find the right talent faster with AI-driven screening,
          intelligent matching, and automated workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onPostJob}
            className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition hover:opacity-90"
          >
            <Plus size={16} />
            Post New Job
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onViewApplications}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50"
          >
            <FileText size={16} />
            View Applications
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { label: "Active Jobs", value: "28" },
            { label: "Applications", value: "1,284" },
            { label: "Interviews", value: "46" },
            { label: "Hired", value: "17" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/80 bg-white/70 px-3 py-4 shadow-[0_10px_28px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            >
              <div className="text-2xl font-extrabold text-slate-950">{stat.value}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -12, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
        className="pointer-events-none absolute left-6 bottom-10 hidden -rotate-6 md:block lg:left-14"
      >
        <div className="relative h-40 w-32 rounded-3xl bg-white shadow-[0_24px_60px_rgba(124,58,237,0.18)] ring-1 ring-violet-100">
          <div className="absolute inset-x-0 top-5 flex flex-col items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-violet-100 text-violet-600">
              <FileText size={18} />
            </div>
            <div className="h-2 w-16 rounded-full bg-violet-100" />
            <div className="h-2 w-12 rounded-full bg-violet-100" />
            <div className="h-2 w-14 rounded-full bg-violet-100" />
          </div>
          <div className="absolute -bottom-3 -right-3 grid h-9 w-9 place-items-center rounded-full bg-violet-600 text-white shadow-lg">
            <CircleCheckBig size={16} />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 12, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          x: { duration: 0.6, delay: 0.4 },
          y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
        className="pointer-events-none absolute right-6 bottom-12 hidden items-end md:flex lg:right-14"
      >
        <div className="grid h-14 w-14 place-items-center rounded-full bg-violet-200/70 text-violet-500 shadow-md">
          <Users size={24} />
        </div>
        <div className="-ml-3 grid h-20 w-20 place-items-center rounded-full bg-violet-300/60 text-violet-600 shadow-lg">
          <Users size={30} />
        </div>
        <div className="-ml-3 grid h-16 w-16 place-items-center rounded-full bg-white text-violet-500 shadow-lg ring-1 ring-violet-100">
          <Search size={24} />
        </div>
      </motion.div>
    </section>
  );
}

function HomeActiveJobsSection({ navigate }: { navigate: (path: string) => void }) {
  const activeJobs = JOBS.filter((job) => job.status === "Active").slice(0, 3);

  return (
    <GlassPanel
      title="Your active hiring"
      subtitle="Keep track of your open roles and see how candidates are progressing through each position."
      action={
        <button
          type="button"
          onClick={() => navigate("/hr/jobs")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          View All Jobs <ArrowRight size={14} />
        </button>
      }
    >
      {activeJobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {activeJobs.map((job, i) => (
            <motion.button
              key={job.id}
              type="button"
              onClick={() => navigate("/hr/jobs")}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-[24px] border border-slate-100 bg-white/90 p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-violet-200 hover:shadow-[0_16px_40px_rgba(124,58,237,0.14)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-950">{job.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{job.location} · Full-time</div>
                </div>
                <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm">
                <div>
                  <div className="font-bold text-slate-950">{job.applications}</div>
                  <div className="text-xs text-slate-500">Applicants</div>
                </div>
                <div className="h-8 w-px bg-slate-100" />
                <div>
                  <div className="font-bold text-slate-950">{Math.round(job.applications * 0.3)}</div>
                  <div className="text-xs text-slate-500">Shortlisted</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(job.atsAvg, 100)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#a855f7)]"
                  />
                </div>
                <div className="mt-2 text-[11px] font-medium text-slate-400">{job.posted}</div>
              </div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
          <div className="text-sm font-semibold text-slate-700">No active jobs yet</div>
          <p className="mt-1 text-sm text-slate-500">Create your first job post and start finding the right candidates.</p>
          <button
            type="button"
            onClick={() => navigate("/hr/post-job")}
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7c3aed_0%,#6d28d9_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)]"
          >
            <Plus size={15} /> Post a New Job
          </button>
        </div>
      )}
    </GlassPanel>
  );
}

function HomeTopCandidatesSection({ navigate }: { navigate: (path: string) => void }) {
  const topCandidates = [...APPLICATIONS].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <GlassPanel
      title="Top matching candidates"
      subtitle="AI-powered matching helps you quickly identify candidates whose skills and experience best fit your open roles."
      action={
        <button
          type="button"
          onClick={() => navigate("/hr/applications")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          View All Candidates <ArrowRight size={14} />
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {topCandidates.map((c, i) => (
          <motion.button
            key={c.id}
            type="button"
            onClick={() => navigate("/hr/applications")}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="flex flex-col rounded-[24px] border border-slate-100 bg-white/90 p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-violet-200 hover:shadow-[0_16px_40px_rgba(124,58,237,0.14)]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.10))] text-sm font-bold text-violet-700">
                {c.candidate.split(" ").map((p) => p[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-slate-950">{c.candidate}</div>
                <div className="text-xs text-slate-500">{c.role}</div>
              </div>
            </div>

            <div className={`mt-4 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${c.score >= 90 ? "bg-emerald-50 text-emerald-700" : "bg-violet-50 text-violet-700"}`}>
              {c.score}% Match
            </div>

            <div className="mt-3 text-xs text-slate-500">{c.skillsMatch} skills match</div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{c.experience}</span>
              <span>{c.location}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </GlassPanel>
  );
}

function HomePipelineSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <GlassPanel
      title="Your hiring pipeline"
      subtitle="Get a quick overview of candidates moving through each stage of your recruitment process."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {PIPELINE_DATA.map((stage, i) => (
          <motion.button
            key={stage.name}
            type="button"
            onClick={() => navigate("/hr/applications")}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative flex flex-col items-center rounded-[22px] border border-slate-100 bg-white/90 px-3 py-5 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-violet-200"
          >
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl text-white"
              style={{ background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)` }}
            >
              <Users size={16} />
            </div>
            <div className="mt-3 text-xl font-extrabold text-slate-950">{currency(stage.value)}</div>
            <div className="mt-1 text-xs font-semibold text-slate-500">{stage.name}</div>
            {i < PIPELINE_DATA.length - 1 ? (
              <span className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-slate-200 xl:block" />
            ) : null}
          </motion.button>
        ))}
      </div>
    </GlassPanel>
  );
}

function HomeInterviewsSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <GlassPanel
      title="Upcoming interviews"
      subtitle="Stay on top of scheduled conversations and make sure no candidate interaction is missed."
      action={
        <button
          type="button"
          onClick={() => navigate("/hr/interviews")}
          className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
        >
          View Calendar <ArrowRight size={14} />
        </button>
      }
    >
      {INTERVIEWS.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {INTERVIEWS.map((item, i) => (
            <motion.button
              key={`${item.candidate}-${item.time}`}
              type="button"
              onClick={() => navigate("/hr/interviews")}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="flex flex-col rounded-[24px] border border-slate-100 bg-white/90 p-5 text-left shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:border-violet-200 hover:shadow-[0_16px_40px_rgba(124,58,237,0.14)]"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                  <Clock3 size={12} /> {item.time}
                </div>
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusDot(item.status)}`} />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(124,58,237,0.12),rgba(168,85,247,0.10))] text-xs font-bold text-violet-700">
                  {item.candidate.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <div className="font-bold text-slate-950">{item.candidate}</div>
                  <div className="text-xs text-slate-500">{item.role}</div>
                </div>
              </div>
              <div className="mt-4 text-xs font-medium text-slate-400">{item.type}</div>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-10 text-center">
          <div className="text-sm font-semibold text-slate-700">No upcoming interviews</div>
          <p className="mt-1 text-sm text-slate-500">Scheduled candidate interviews will appear here.</p>
        </div>
      )}
    </GlassPanel>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <DashboardHero
        onPostJob={() => navigate("/hr/post-job")}
        onViewApplications={() => navigate("/hr/applications")}
      />
      <HomeActiveJobsSection navigate={navigate} />
      <HomeTopCandidatesSection navigate={navigate} />
      <HomePipelineSection navigate={navigate} />
      <HomeInterviewsSection navigate={navigate} />
      <HomeFAQFooter navigate={navigate} />
    </div>
  );
}
