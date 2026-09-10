import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { clearPortalRole } from "../auth/portalRole";
import TopNavBar from "./TopNavBar";
import HomePage from "./portal/HomePage";
import { MobileDrawer } from "./portal/shared";

export default function Home() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    clearPortalRole();
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f8f7ff_36%,#ffffff_100%)] overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_33%)]" />

      <MobileDrawer
        open={mobileOpen}
        currentPage="home"
        onClose={() => setMobileOpen(false)}
        onNavigate={(path: string) => navigate(path)}
        onLogout={handleLogout}
      />

      <div className="relative min-h-screen pt-[73px]">
        <TopNavBar
          currentPage="home"
          brandPath="/"
          onNavigate={(path) => navigate(path)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
        />

        <main className="px-4 pb-5 md:px-6 lg:px-8 lg:pb-7">
          <HomePage />
        </main>
      </div>
    </div>
  );
}
