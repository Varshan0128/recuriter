import {
  Activity,
  Briefcase,
  CalendarDays,
  CircleCheckBig,
  FileText,
  ShieldCheck,
  Star,
  Target,
  Users,
  Workflow,
} from "lucide-react";

export type RecruiterPortalPage =
  | "home"
  | "dashboard"
  | "post-job"
  | "jobs"
  | "applications"
  | "company"
  | "settings"
  | "interviews"
  | "shortlisted";

export type ApplicationStatus = "Applied" | "Reviewed" | "Shortlisted" | "Interview" | "Rejected" | "Hired";

export interface JobRow {
  id: string;
  title: string;
  department: string;
  status: "Active" | "Paused" | "Closed" | "Draft";
  applications: number;
  atsAvg: number;
  location: string;
  posted: string;
}

export interface ApplicationRow {
  id: string;
  candidate: string;
  role: string;
  score: number;
  experience: string;
  skillsMatch: string;
  appliedDate: string;
  location: string;
  education: string;
  status: ApplicationStatus;
}

export interface InterviewRow {
  candidate: string;
  role: string;
  time: string;
  type: string;
  status: "Scheduled" | "Live" | "Completed";
}

export const DASHBOARD_STATS = [
  { label: "Active Jobs", value: "28", delta: "+4 this month", icon: Briefcase, tone: "from-violet-500 to-fuchsia-500", spark: "#7c3aed" },
  { label: "Applications", value: "1,284", delta: "+18% over week", icon: FileText, tone: "from-sky-500 to-blue-500", spark: "#0ea5e9" },
  { label: "Interviews", value: "46", delta: "+11 this week", icon: CalendarDays, tone: "from-orange-500 to-amber-500", spark: "#f97316" },
  { label: "Hired", value: "17", delta: "+3 in the last 7 days", icon: CircleCheckBig, tone: "from-emerald-500 to-green-500", spark: "#10b981" },
];

export const DASHBOARD_TREND_DATA = [
  { name: "May 2", applications: 118 },
  { name: "May 3", applications: 146 },
  { name: "May 4", applications: 192 },
  { name: "May 5", applications: 222 },
  { name: "May 6", applications: 296 },
  { name: "May 7", applications: 238 },
  { name: "May 8", applications: 176 },
];

export const DASHBOARD_ACTIVITY = [
  {
    icon: FileText,
    title: "82 applications screened",
    subtitle: "Senior Product Designer posted 3 days ago",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    icon: Target,
    title: "94 ATS average",
    subtitle: "Data Scientist role pulled strongest fit scores",
    tone: "bg-sky-50 text-sky-600",
  },
  {
    icon: Workflow,
    title: "6-stage pipeline active",
    subtitle: "Interview round moving into shortlist review",
    tone: "bg-emerald-50 text-emerald-600",
  },
];

export const DASHBOARD_PIPELINE = [
  { stage: "Applied", count: 1, candidate: "Maya Chen", role: "Product Designer" },
  { stage: "Reviewed", count: 1, candidate: "Rahul Verma", role: "DevOps Engineer" },
  { stage: "Shortlisted", count: 1, candidate: "Aarav Mehta", role: "Data Scientist" },
  { stage: "Interview", count: 1, candidate: "Priya Shah", role: "Backend Engineer" },
  { stage: "Offer", count: 0, candidate: "No candidates yet", role: "" },
  { stage: "Hired", count: 1, candidate: "Sneha Iyer", role: "HR Business Partner" },
];

export const DASHBOARD_APPLICATIONS = [
  { id: "A-001", initials: "AM", candidate: "Aarav Mehta", role: "Data Scientist", ats: 94, experience: "4 years", applied: "Aug 5, 2025", status: "Shortlisted" as ApplicationStatus },
  { id: "A-002", initials: "PS", candidate: "Priya Shah", role: "Backend Engineer", ats: 88, experience: "5 years", applied: "Aug 5, 2025", status: "Interview" as ApplicationStatus },
  { id: "A-003", initials: "MC", candidate: "Maya Chen", role: "Product Designer", ats: 96, experience: "6 years", applied: "Aug 4, 2025", status: "Applied" as ApplicationStatus },
  { id: "A-004", initials: "RV", candidate: "Rahul Verma", role: "DevOps Engineer", ats: 71, experience: "3 years", applied: "Aug 4, 2025", status: "Reviewed" as ApplicationStatus },
];

export const TREND_DATA = [
  { name: "Mon", applications: 42, interviews: 7, hires: 1 },
  { name: "Tue", applications: 55, interviews: 10, hires: 2 },
  { name: "Wed", applications: 63, interviews: 12, hires: 2 },
  { name: "Thu", applications: 50, interviews: 9, hires: 1 },
  { name: "Fri", applications: 74, interviews: 14, hires: 3 },
  { name: "Sat", applications: 45, interviews: 8, hires: 1 },
  { name: "Sun", applications: 38, interviews: 6, hires: 1 },
];

export const PIPELINE_DATA = [
  { name: "Applied", value: 478, color: "#8B5CF6" },
  { name: "Reviewed", value: 186, color: "#06B6D4" },
  { name: "Shortlisted", value: 102, color: "#10B981" },
  { name: "Interview", value: 34, color: "#F59E0B" },
  { name: "Offer", value: 14, color: "#EF4444" },
  { name: "Hired", value: 17, color: "#6366F1" },
];

export const HIRING_FUNNEL = [
  { label: "Applied", value: 478, icon: Users, tone: "bg-violet-50 text-violet-600", bar: "#7c3aed" },
  { label: "Reviewed", value: 186, icon: Activity, tone: "bg-sky-50 text-sky-600", bar: "#0ea5e9" },
  { label: "Shortlisted", value: 102, icon: Star, tone: "bg-purple-50 text-purple-600", bar: "#a855f7" },
  { label: "Interview", value: 34, icon: CalendarDays, tone: "bg-amber-50 text-amber-600", bar: "#f59e0b" },
  { label: "Offer", value: 14, icon: ShieldCheck, tone: "bg-orange-50 text-orange-600", bar: "#fb923c" },
  { label: "Hired", value: 17, icon: Users, tone: "bg-emerald-50 text-emerald-600", bar: "#10b981" },
];

export const NOTIFICATIONS = [
  { title: "New application received", text: "Maya Chen applied for Senior Product Designer.", time: "2 min ago", unread: true },
  { title: "Interview reminder", text: "3 interviews start in the next 45 minutes.", time: "15 min ago", unread: true },
  { title: "Job expiring soon", text: "Backend Engineer role closes tomorrow at 5:00 PM.", time: "1 hr ago", unread: false },
  { title: "Hiring completed", text: "Cloud Security Analyst role has been filled.", time: "4 hr ago", unread: false },
];

export const JOBS: JobRow[] = [
  { id: "J-1024", title: "Senior Product Designer", department: "Design", status: "Active", applications: 82, atsAvg: 84, location: "Remote", posted: "3 days ago" },
  { id: "J-1032", title: "Backend Engineer", department: "Engineering", status: "Paused", applications: 141, atsAvg: 77, location: "Bengaluru", posted: "8 days ago" },
  { id: "J-1038", title: "Data Scientist", department: "Data Science", status: "Active", applications: 66, atsAvg: 88, location: "Hybrid", posted: "2 days ago" },
  { id: "J-1041", title: "HR Business Partner", department: "People", status: "Draft", applications: 0, atsAvg: 0, location: "Mumbai", posted: "Draft" },
  { id: "J-1044", title: "DevOps Engineer", department: "Cloud", status: "Closed", applications: 97, atsAvg: 79, location: "Remote", posted: "18 days ago" },
];

export const APPLICATIONS: ApplicationRow[] = [
  { id: "A-001", candidate: "Aarav Mehta", role: "Data Scientist", score: 94, experience: "4 years", skillsMatch: "91%", appliedDate: "Aug 5", location: "Bengaluru", education: "M.Tech", status: "Shortlisted" },
  { id: "A-002", candidate: "Priya Shah", role: "Backend Engineer", score: 88, experience: "5 years", skillsMatch: "86%", appliedDate: "Aug 5", location: "Pune", education: "B.E.", status: "Interview" },
  { id: "A-003", candidate: "Maya Chen", role: "Product Designer", score: 96, experience: "6 years", skillsMatch: "93%", appliedDate: "Aug 4", location: "Remote", education: "B.Des", status: "Applied" },
  { id: "A-004", candidate: "Rahul Verma", role: "DevOps Engineer", score: 71, experience: "3 years", skillsMatch: "69%", appliedDate: "Aug 4", location: "Hyderabad", education: "B.Tech", status: "Reviewed" },
  { id: "A-005", candidate: "Sneha Iyer", role: "HR Business Partner", score: 84, experience: "8 years", skillsMatch: "83%", appliedDate: "Aug 3", location: "Chennai", education: "MBA", status: "Hired" },
];

export const INTERVIEWS: InterviewRow[] = [
  { candidate: "Maya Chen", role: "Product Designer", time: "10:00 AM", type: "Google Meet", status: "Live" },
  { candidate: "Priya Shah", role: "Backend Engineer", time: "11:30 AM", type: "Zoom", status: "Scheduled" },
  { candidate: "Aarav Mehta", role: "Data Scientist", time: "02:00 PM", type: "In person", status: "Scheduled" },
];

export const PIPELINE_COLUMNS: { title: ApplicationStatus | "Offer"; items: ApplicationRow[] }[] = [
  { title: "Applied", items: APPLICATIONS.filter((app) => app.status === "Applied") },
  { title: "Reviewed", items: APPLICATIONS.filter((app) => app.status === "Reviewed") },
  { title: "Shortlisted", items: APPLICATIONS.filter((app) => app.status === "Shortlisted") },
  { title: "Interview", items: APPLICATIONS.filter((app) => app.status === "Interview") },
  { title: "Offer", items: [] },
  { title: "Hired", items: APPLICATIONS.filter((app) => app.status === "Hired") },
];

export const RECRUITER_FAQS = [
  {
    q: "What is the HiredAI Recruiter Portal?",
    a: "HiredAI Recruiter Portal helps HR teams manage the complete hiring process in one place — from posting jobs and receiving applications to AI-powered candidate matching, shortlisting, interviews, and hiring.",
  },
  {
    q: "How does AI candidate matching work?",
    a: "HiredAI analyzes the job requirements against each candidate's resume, skills, experience, and qualifications to identify how well they match the role. Recruiters can use the match score to prioritize relevant candidates faster.",
  },
  {
    q: "How is the ATS score calculated?",
    a: "The ATS score evaluates how closely a candidate's resume matches the job requirements, including relevant skills, keywords, experience, education, and role-specific requirements. It is designed to support recruiter decision-making, not replace it.",
  },
  {
    q: "Can I create and manage job postings?",
    a: "Yes. Recruiters can create, edit, publish, pause, and manage job postings from the Jobs section. Each job also provides an overview of applications and candidate matching performance.",
  },
  {
    q: "How do I manage candidates after they apply?",
    a: "Applications are organized in the Candidates section, where recruiters can review resumes, view ATS scores, check skill matches, add notes, shortlist candidates, and move them through the hiring pipeline.",
  },
  {
    q: "Can I track the hiring process?",
    a: "Yes. HiredAI provides a hiring pipeline that tracks candidates through stages such as Applied → Reviewed → Shortlisted → Interview → Offer → Hired, making it easier to monitor recruitment progress.",
  },
];

export const DASHBOARD_INTERVIEWS = [
  { initials: "PS", candidate: "Priya Shah", role: "Backend Engineer", day: "Today", time: "11:30 AM", type: "Google Meet" },
  { initials: "AM", candidate: "Aarav Mehta", role: "Data Scientist", day: "Tomorrow", time: "02:00 PM", type: "Zoom" },
  { initials: "MC", candidate: "Maya Chen", role: "Product Designer", day: "Aug 10", time: "10:00 AM", type: "Google Meet" },
];

export const DASHBOARD_STAT_SPARKS: Record<string, number[]> = {
  "Active Jobs": [10, 14, 12, 18, 16, 22, 20, 28],
  "Applications": [420, 560, 610, 700, 820, 980, 1120, 1284],
  "Interviews": [12, 18, 15, 22, 28, 25, 40, 46],
  "Hired": [3, 5, 6, 8, 10, 12, 15, 17],
};

export const ANALYTICS_RANGE = { label: "09/05 - 10/02", days: "Last 28 days" };

export const ANALYTICS_STATS = [
  { label: "Views", value: "394", delta: "+0.1%", up: true },
  { label: "Applied", value: "193", delta: "+0.1%", up: true },
  { label: "Phone Interviewed", value: "137", delta: "-6%", up: false },
  { label: "Interviewed", value: "60", delta: "+0.1%", up: true },
  { label: "Offered", value: "19", delta: "+0.1%", up: true },
];

export const ANALYTICS_FUNNEL = [
  { label: "Views", value: 394, fill: "#2dd4bf" },
  { label: "Applied", value: 204, fill: "#22c55e" },
  { label: "Phone Screened", value: 137, fill: "#38bdf8" },
  { label: "Interview", value: 60, fill: "#818cf8" },
  { label: "Offered", value: 19, fill: "#a78bfa" },
  { label: "Hired", value: 4, fill: "#7c3aed" },
];

export const ANALYTICS_TREND = [
  { date: "28 Aug", pageViews: 165, applications: 90, previous: 140 },
  { date: "30 Aug", pageViews: 185, applications: 110, previous: 150 },
  { date: "1 Sep", pageViews: 150, applications: 95, previous: 130 },
  { date: "3 Sep", pageViews: 200, applications: 120, previous: 160 },
  { date: "5 Sep", pageViews: 210, applications: 140, previous: 170 },
  { date: "27 Sep", pageViews: 175, applications: 115, previous: 155 },
  { date: "29 Sep", pageViews: 220, applications: 150, previous: 180 },
  { date: "01 Oct", pageViews: 165, applications: 95, previous: 145 },
  { date: "03 Oct", pageViews: 185, applications: 105, previous: 150 },
  { date: "11 Oct", pageViews: 140, applications: 80, previous: 135 },
];

export const ANALYTICS_CHANNEL_KEYS = [
  { key: "corporate", label: "Corporate site", color: "#22c55e" },
  { key: "referral", label: "Referral", color: "#f97316" },
  { key: "social", label: "Social Media", color: "#a855f7" },
  { key: "agency", label: "Agency", color: "#6366f1" },
  { key: "jobBoard", label: "Job Board", color: "#0ea5e9" },
  { key: "others", label: "Others", color: "#94a3b8" },
  { key: "default", label: "Default", color: "#0f172a" },
];

export const ANALYTICS_CHANNEL_BAR = [
  { date: "21 Aug", corporate: 6, referral: 3, social: 2, agency: 4, jobBoard: 3, others: 1, default: 1 },
  { date: "23 Aug", corporate: 8, referral: 4, social: 3, agency: 5, jobBoard: 3, others: 1, default: 1 },
  { date: "25 Aug", corporate: 7, referral: 3, social: 4, agency: 4, jobBoard: 2, others: 1, default: 1 },
  { date: "26 Aug", corporate: 10, referral: 5, social: 5, agency: 6, jobBoard: 4, others: 2, default: 1 },
  { date: "27 Aug", corporate: 12, referral: 6, social: 6, agency: 7, jobBoard: 4, others: 2, default: 1 },
  { date: "28 Aug", corporate: 9, referral: 4, social: 4, agency: 5, jobBoard: 3, others: 1, default: 1 },
  { date: "29 Aug", corporate: 14, referral: 7, social: 6, agency: 8, jobBoard: 5, others: 2, default: 2 },
  { date: "30 Aug", corporate: 11, referral: 5, social: 5, agency: 6, jobBoard: 4, others: 2, default: 1 },
  { date: "31 Aug", corporate: 8, referral: 4, social: 3, agency: 4, jobBoard: 3, others: 1, default: 1 },
  { date: "01 Sep", corporate: 7, referral: 3, social: 3, agency: 3, jobBoard: 2, others: 1, default: 1 },
  { date: "02 Sep", corporate: 9, referral: 4, social: 4, agency: 5, jobBoard: 3, others: 1, default: 1 },
  { date: "03 Sep", corporate: 6, referral: 3, social: 2, agency: 3, jobBoard: 2, others: 1, default: 1 },
];

export const ANALYTICS_CHANNEL_DONUT = [
  { name: "Corporate site", value: 38, color: "#22c55e" },
  { name: "Referral", value: 14, color: "#f97316" },
  { name: "Social Media", value: 12, color: "#a855f7" },
  { name: "Agency", value: 16, color: "#6366f1" },
  { name: "Job Board", value: 12, color: "#0ea5e9" },
  { name: "Others", value: 5, color: "#94a3b8" },
  { name: "Default", value: 3, color: "#0f172a" },
];

export function currency(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function statusTone(status: string) {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Paused":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Closed":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-violet-50 text-violet-700 border-violet-200";
  }
}

export function applicationTone(status: ApplicationStatus) {
  switch (status) {
    case "Applied":
      return "bg-slate-100 text-slate-700";
    case "Reviewed":
      return "bg-cyan-50 text-cyan-700";
    case "Shortlisted":
      return "bg-violet-50 text-violet-700";
    case "Interview":
      return "bg-amber-50 text-amber-700";
    case "Rejected":
      return "bg-red-50 text-red-700";
    case "Hired":
      return "bg-emerald-50 text-emerald-700";
  }
}

export function statusDot(status: InterviewRow["status"]) {
  switch (status) {
    case "Live":
      return "bg-emerald-500";
    case "Scheduled":
      return "bg-violet-500";
    case "Completed":
      return "bg-slate-400";
  }
}

export function pageTitle(page: RecruiterPortalPage) {
  switch (page) {
    case "home":
      return "Home";
    case "dashboard":
      return "Hiring dashboard";
    case "post-job":
      return "Post Job";
    case "jobs":
      return "My Jobs";
    case "applications":
      return "Applications";
    case "company":
      return "Company Profile";
    case "settings":
      return "Settings";
    case "interviews":
      return "Interviews";
    case "shortlisted":
      return "Shortlisted";
  }
}