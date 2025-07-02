"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logout, getFirstName, getLastName, getProfilFromToken } from "../../../services/AccountService";
import { Header } from "./Header";
import { NotificationsPanel } from "./NotificationPanel";
import { Sidebar } from "./SideBar";
import React from "react";

import { ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: undefined as string | undefined,
    lastName: undefined as string | undefined,
    profile: undefined as string | undefined,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get profile data from token, converting null to undefined to match expected types
      const profileValue = getProfilFromToken();
      
      setUserData({
        firstName: getFirstName() ?? undefined,
        lastName: getLastName() ?? undefined,
        profile: profileValue === null ? undefined : profileValue,
      });
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleProfileClick = () => {
    router.push("/parametres");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header
        isSidebarOpen={isSidebarOpen}
        searchTerm={searchTerm}
        userData={userData}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchChange={setSearchTerm}
        onNotificationToggle={() => setIsNotificationOpen(!isNotificationOpen)}
        onProfileClick={handleProfileClick}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </div>
        </main>

        <NotificationsPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    </div>
  );
};
