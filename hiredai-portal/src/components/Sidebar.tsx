import { motion } from "motion/react";
import { ChevronDown, LogOut, Sparkles } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { NAV_ITEMS } from "./portal/nav";
import type { RecruiterPortalPage } from "./portal/data";
import type { AuthUser } from "../auth/AuthContext";

const EXPANDABLE: RecruiterPortalPage[] = ["jobs", "applications", "interviews", "shortlisted", "company"];

interface SidebarProps {
  currentPage: RecruiterPortalPage;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  user?: AuthUser | null;
}

export default function Sidebar({ currentPage, onNavigate, onLogout, user }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-[73px] z-30 hidden h-[calc(100vh-73px)] w-[260px] shrink-0 flex-col border-r border-slate-200/80 bg-white/90 backdrop-blur-2xl lg:flex">
      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pt-5 pb-4">
        {NAV_ITEMS.filter((item) => item.id !== "settings").map((item) => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          const expandable = EXPANDABLE.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold transition ${
                active ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-2xl bg-violet-50"
                />
              ) : null}
              <span className="relative z-10 flex items-center gap-3">
                <Icon size={17} className={active ? "text-violet-600" : "text-slate-400"} />
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Unlock AI Insights */}

      {/* Profile + Logout */}
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() => onNavigate("/hr/settings")}
          className="flex w-full items-center justify-between gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-slate-50"
        >
          <span className="flex items-center gap-3">
            <UserAvatar firstName={user?.firstName} lastName={user?.lastName} name={user?.fullName} size={38} />
            <span>
              <span className="block text-sm font-bold leading-tight text-slate-950">{user?.firstName ?? "Varshan"}</span>
              <span className="block text-xs text-slate-500">{user?.role ?? "Recruiter"}</span>
            </span>
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}