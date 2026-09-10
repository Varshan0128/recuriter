import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import BrandLogo from "../BrandLogo";

const RECRUITER_FAQS = [
  {
    q: "What is the HiredAI Recruiter Portal?",
    a: "HiredAI Recruiter Portal helps HR teams manage the full hiring lifecycle from job creation to candidate review and interview coordination.",
  },
  {
    q: "How does candidate matching work?",
    a: "The portal compares each applicant against the role requirements and stores structured review data so recruiters can prioritize candidate quality without relying on static sample metrics.",
  },
  {
    q: "Can I manage jobs and interview workflows?",
    a: "Yes. Recruiters can create or edit jobs, add screening questions, review applications, update stages, and keep notes and activity history for each candidate.",
  },
  {
    q: "Is AI scoring connected in this build?",
    a: "No external AI service is connected here. The portal keeps evaluation states honest and shows pending or manual review until a real scoring provider is linked.",
  },
];

function LinkedInGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zM8.5 8h3.83v2.05h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8 22 10.2 22 14.05V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.17V23h-4V8z" />
    </svg>
  );
}

function InstagramGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.5 8.57L23.3 22h-6.9l-5.4-6.6L4.7 22H1.6l8.03-9.18L1 2h7.1l4.9 6.03L18.9 2zm-1.2 18.2h1.9L7.4 3.7H5.4l12.3 16.5z" />
    </svg>
  );
}

function HomeFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-t-[30px] border border-white/10 bg-[#0b0c14] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)] md:p-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-4xl">Frequently asked questions</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">
          Quick answers about hiring, AI matching, and how the portal works.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl divide-y divide-white/10">
        {RECRUITER_FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-semibold text-white">{item.q}</span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                   className="shrink-0 text-white"
                >
                  <ChevronDown size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-6 text-slate-400">{item.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function HomeFooterSection({ navigate }: { navigate: (path: string) => void }) {
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Post a Job", path: "/hr/post-job" },
        { label: "Candidate Search", path: "/hr/applications" },
        { label: "Hiring Analytics", path: "/hr/analytics" },
        { label: "Interview Scheduling", path: "/hr/interviews" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Company Profile", path: "/hr/company" },
        { label: "Settings", path: "/hr/settings" },
        { label: "Privacy", path: "#" },
        { label: "Terms", path: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", path: "#" },
        { label: "Help Center", path: "#" },
        { label: "FAQ", path: "#" },
        { label: "Community", path: "#" },
      ],
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="rounded-b-[30px] border border-t-0 border-white/10 bg-[#0b0c14] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.35)] md:p-10"
    >
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <BrandLogo size={24} />
            </div>
            <div className="text-lg font-extrabold tracking-tight text-white">
              Hired<span className="text-violet-400">AI</span>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            Your AI-powered hiring partner — from posting roles to matching, screening, and scheduling the right candidates faster.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <motion.a
              href="https://www.linkedin.com/company/start-at-root/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              <LinkedInGlyph size={16} />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/hiredai.in?igsh=MmR3ZWVkMmkzNzhi"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              <InstagramGlyph size={16} />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -3, scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10"
            >
              <XGlyph size={16} />
            </motion.a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.08, ease: "easeOut" }}
            >
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{col.title}</div>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => (link.path !== "#" ? navigate(link.path) : undefined)}
                      className="text-sm text-slate-300 transition hover:text-violet-400"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
        <span>© 2026 HiredAI. All rights reserved.</span>
        <div className="flex gap-5">
          <button type="button" className="transition hover:text-violet-400">Privacy Policy</button>
          <button type="button" className="transition hover:text-violet-400">Terms of Service</button>
          <button type="button" className="transition hover:text-violet-400">Cookie Policy</button>
        </div>
      </div>
    </motion.footer>
  );
}

export function HomeFAQFooter({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div>
      <HomeFAQSection />
      <HomeFooterSection navigate={navigate} />
    </div>
  );
}