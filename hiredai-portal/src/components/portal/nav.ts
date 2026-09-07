import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Settings,
  Star,
  Users,
} from "lucide-react";
import type { RecruiterPortalPage } from "./data";

export interface SidebarItem {
  id: RecruiterPortalPage;
  label: string;
  icon: typeof LayoutDashboard;
  path: string;
}

// Primary navigation used by both the desktop Sidebar and the mobile drawer.
export const NAV_ITEMS: SidebarItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/hr/dashboard" },
  { id: "jobs", label: "Jobs", icon: Briefcase, path: "/hr/jobs" },
  { id: "post-job", label: "Post Job", icon: FileText, path: "/hr/post-job" },
  { id: "applications", label: "Candidates", icon: Users, path: "/hr/applications" },
  { id: "interviews", label: "Interviews", icon: CalendarDays, path: "/hr/interviews" },
  { id: "shortlisted", label: "Analytics", icon: Star, path: "/hr/shortlisted" },
  { id: "company", label: "Company", icon: Building2, path: "/hr/company" },
  { id: "settings", label: "Settings", icon: Settings, path: "/hr/settings" },
];

// Kept as a separate export in case any quick-link/mobile-only spot wants to reference it directly.
export const POST_JOB_ITEM: SidebarItem = NAV_ITEMS.find((item) => item.id === "post-job")!;

// Mobile drawer just reuses the same ordered list now that Post Job lives in NAV_ITEMS.
export const MOBILE_NAV_ITEMS: SidebarItem[] = NAV_ITEMS;