import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { clearPortalRole } from "../auth/portalRole";
import TopNavBar from "./TopNavBar";
import Sidebar from "./Sidebar";
import { MobileDrawer } from "./portal/shared";
import type { RecruiterPortalPage } from "./portal/data";
import HomePage from "./portal/HomePage";
import DashboardPage from "./portal/DashboardPage";
import JobsPage from "./portal/JobsPage";
import ApplicationsPage from "./portal/ApplicationsPage";
import ShortlistedPage from "./portal/ShortlistedPage";
import JobFormPage from "./portal/JobFormPage";
import CompanyPage from "./portal/CompanyPage";
import SettingsPage from "./portal/SettingsPage";
import InterviewsPage from "./portal/InterviewsPage";

export type { RecruiterPortalPage } from "./portal/data";
export { NOTIFICATIONS } from "./portal/data";

interface RecruiterPortalProps {
  page: RecruiterPortalPage;
}

function DashboardContent({ page }: { page: RecruiterPortalPage }) {
  switch (page) {
    case "home":
      return <HomePage />;
    case "dashboard":
      return <DashboardPage />;
    case "jobs":
      return <JobsPage />;
    case "applications":
      return <ApplicationsPage />;
    case "shortlisted":
      return <ShortlistedPage />;
    case "post-job":
      return <JobFormPage />;
    case "company":
      return <CompanyPage />;
    case "settings":
      return <SettingsPage />;
    case "interviews":
      return <InterviewsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function RecruiterPortal({ page }: RecruiterPortalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    clearPortalRole();
    await logout();
    navigate("/login");
  };

  const showSidebar = true;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f8f7ff_36%,#ffffff_100%)] overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_33%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.08),rgba(255,255,255,0.08))]" />

      <MobileDrawer open={mobileOpen} currentPage={page} onClose={() => setMobileOpen(false)} onNavigate={(path) => navigate(path)} onLogout={handleLogout} />

      <div className="relative min-h-screen pt-[73px]">
        <TopNavBar
          currentPage={page}
          brandPath="/"
          onNavigate={(path) => navigate(path)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
        />

        <div className={showSidebar ? "flex" : ""}>
          {showSidebar ? <Sidebar currentPage={page} brandPath="/" onNavigate={(path) => navigate(path)} onLogout={handleLogout} user={user} /> : null}

          <main className={`min-w-0 flex-1 px-4 py-5 md:px-6 lg:px-8 lg:py-7 ${showSidebar ? "lg:ml-[260px]" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <DashboardContent page={page} />
              </motion.div>
            </AnimatePresence>
          </main>
      </div>
      </div>
    </div>
  );
}
