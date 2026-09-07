import { motion } from "motion/react";
import { Clock3, MoveRight } from "lucide-react";
import { GlassPanel } from "./shared";
import { INTERVIEWS, statusDot } from "./data";

export default function InterviewsPage() {
  return (
    <GlassPanel title="Interviews" subtitle="Timeline-style cards for the day ahead.">
      <div className="grid gap-4 md:grid-cols-3">
        {INTERVIEWS.map((item, i) => (
          <motion.div
            key={`${item.candidate}-${item.time}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="rounded-[26px] border border-slate-100 bg-white/80 p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_18px_44px_rgba(124,58,237,0.14)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-slate-950">{item.candidate}</div>
                <div className="text-sm text-slate-500">{item.role}</div>
              </div>
              <motion.span
                animate={item.status === "Live" ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1.4, repeat: item.status === "Live" ? Infinity : 0, ease: "easeInOut" }}
                className={`inline-flex h-3 w-3 rounded-full ${statusDot(item.status)}`}
              />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
              <Clock3 size={13} />
              {item.time}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
              <span>{item.type}</span>
              <motion.button
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Join Meeting <MoveRight size={13} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
