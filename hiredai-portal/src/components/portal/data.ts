export type RecruiterPortalPage =
  | "home"
  | "dashboard"
  | "post-job"
  | "jobs"
  | "applications"
  | "analytics"
  | "company"
  | "settings"
  | "team"
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

export const NOTIFICATIONS: Array<{ title: string; text: string; time: string; unread: boolean }> = [];

export function pageTitle(page: RecruiterPortalPage) {
  switch (page) {
    case "dashboard":
      return "Hiring dashboard";
    case "post-job":
      return "Post Job";
    case "jobs":
      return "My Jobs";
    case "applications":
      return "Applications";
    case "analytics":
      return "Analytics";
    case "company":
      return "Company Profile";
    case "settings":
      return "Settings";
    case "interviews":
      return "Interviews";
    case "shortlisted":
      return "Shortlisted";
    case "team":
      return "Team";
    case "home":
      return "Home";
    default:
      return "HiredAI";
  }
}