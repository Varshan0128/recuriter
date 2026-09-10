import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronDown, LogOut, Menu, Settings } from "lucide-react";
import BrandLogo from "./BrandLogo";
import UserAvatar from "./UserAvatar";
import type { RecruiterPortalPage } from "./RecruiterPortal";
import { NOTIFICATIONS } from "./RecruiterPortal";
import type { AuthUser } from "../auth/AuthContext";

interface NavLink {
  id: RecruiterPortalPage;
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { id: "dashboard", label: "Dashboard", path: "/hr/dashboard" },
  { id: "jobs", label: "Jobs", path: "/hr/jobs" },
  { id: "post-job", label: "Post Job", path: "/hr/post-job" },
  { id: "applications", label: "Candidates", path: "/hr/applications" },
  { id: "interviews", label: "Interviews", path: "/hr/interviews" },
  { id: "shortlisted", label: "Analytics", path: "/hr/shortlisted" },
  { id: "company", label: "Company", path: "/hr/company" },
];

interface TopNavBarProps {
  currentPage: RecruiterPortalPage;
  brandPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
  user?: AuthUser | null;
}

export default function TopNavBar({ currentPage, brandPath, onNavigate, onLogout, onOpenMobileMenu, user }: TopNavBarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-6 px-4 py-4 md:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Brand */}
        <motion.button
          type="button"
          onClick={() => onNavigate(brandPath)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex shrink-0 items-center gap-3 rounded-2xl px-1 py-1 transition"
        >
          <motion.div
            whileHover={{ rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(124,58,237,0.16)] ring-1 ring-violet-100"
          >
            <BrandLogo size={28} />
          </motion.div>
          <div className="text-left">
            <div className="text-lg font-extrabold leading-none tracking-tight text-slate-950">
              Hired<span className="text-violet-600">AI</span>
            </div>
            <div className="mt-1 text-xs font-medium text-slate-500">Recruiter Portal</div>
          </div>
        </motion.button>

        {/* Desktop nav links */}
        <nav className="hidden flex-1 items-center gap-7 pl-4 lg:flex">
  {NAV_LINKS.map((link) => {
    const active = currentPage === link.id;
    return (
      <button
        key={link.id}
        type="button"
        onClick={() => onNavigate(link.path)}
        className={`relative flex items-center gap-1 pb-4 pt-1 text-sm font-semibold transition ${
          active ? "text-violet-700" : "text-slate-700 hover:text-violet-600"
        }`}
      >
        {link.label}
        {active ? (
          <motion.span
            layoutId="nav-underline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              layout: { type: "spring", stiffness: 400, damping: 32 },
              opacity: { duration: 0.2 },
            }}
            className="absolute -bottom-4 left-0 right-0 h-[3px] rounded-full bg-violet-600"
          />
        ) : null}
      </button>
    );
  })}
</nav>

        {/* Right side: bell + profile */}
        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          {/* Notification bell */}
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => {
                setNotifOpen((o) => !o);
                setProfileOpen(false);
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-600"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600 ring-2 ring-white" />
            </motion.button>

            <AnimatePresence>
              {notifOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onMouseDown={() => setNotifOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
                  >
                    <div className="border-b border-slate-100 px-4 py-3 text-sm font-bold text-slate-950">
                      Notifications
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {NOTIFICATIONS.map((n, i) => (
                        <motion.div
                          key={n.title}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
                          className={`flex items-start gap-3 border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50 ${n.unread ? "bg-violet-50/40" : ""}`}
                        >
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.unread ? "bg-violet-600" : "bg-slate-300"}`} />
                          <div>
                            <div className="text-sm font-semibold text-slate-950">{n.title}</div>
                            <div className="mt-0.5 text-xs leading-5 text-slate-500">{n.text}</div>
                            <div className="mt-1 text-[11px] font-medium text-slate-400">{n.time}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile dropdown */}
          <div className="relative">
            <motion.button
              type="button"
              onClick={() => {
                setProfileOpen((o) => !o);
                setNotifOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-2xl px-2 py-1 text-left transition hover:bg-slate-50"
            >
              <UserAvatar firstName={user?.firstName} lastName={user?.lastName} name={user?.fullName} size={38} />
              <div className="hidden sm:block">
                <div className="text-sm font-bold leading-tight text-slate-950">{user?.firstName ?? "Varshan"}</div>
                <div className="text-xs text-slate-500">{user?.role ?? "Recruiter"}</div>
              </div>
              <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="hidden sm:block">
                <ChevronDown size={15} className="text-slate-400" />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {profileOpen ? (
                <>
                  <div className="fixed inset-0 z-40" onMouseDown={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
                  >
                    <div className="border-b border-slate-100 px-4 py-3">
                      <div className="text-sm font-bold text-slate-950">{user?.firstName ?? "Varshan"}</div>
                      <div className="truncate text-xs text-slate-500">{user?.email ?? "Recruiter"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onNavigate("/hr/settings");
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        onLogout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}