import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogOut, Menu } from "lucide-react";
import BrandLogo from "../BrandLogo";
import { MOBILE_NAV_ITEMS } from "./nav";
import type { RecruiterPortalPage } from "./data";

export function GlassPanel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_24px_64px_rgba(124,58,237,0.10)] backdrop-blur-2xl md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
  index = 0,
}: {
  label: string;
  value: string;
  delta: string;
  icon: any;
  tone: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_48px_rgba(124,58,237,0.10)] backdrop-blur-2xl transition-shadow hover:shadow-[0_24px_60px_rgba(124,58,237,0.18)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{value}</div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {delta}
          </div>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.08 + 0.15, type: "spring", stiffness: 220 }}
          className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-[0_12px_30px_rgba(124,58,237,0.25)]`}
        >
          <Icon size={20} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-violet-600" : "bg-slate-200"}`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

export function MobileDrawer({
  open,
  currentPage,
  onClose,
  onNavigate,
  onLogout,
}: {
  open: boolean;
  currentPage: RecruiterPortalPage;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative flex h-full w-[86vw] max-w-[300px] flex-col border-r border-violet-100 bg-white/95 shadow-[24px_0_60px_rgba(15,23,42,0.16)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-violet-100 px-5 py-5">
              <div className="flex items-center gap-3">
                <BrandLogo size={36} />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-500">Recruiter Portal</div>
                  <div className="font-bold tracking-tight text-slate-950">HiredAI HR</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700"
              >
                <Menu size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <nav className="space-y-1">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const active = currentPage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.path);
                        onClose();
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                        active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-violet-100 p-4">
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
