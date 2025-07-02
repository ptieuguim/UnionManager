"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Bell, LogOut } from "lucide-react";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white focus:outline-none focus:text-gray-200 lg:hidden"
            >
              <ChevronRight
                className={`h-6 w-6 transition-transform duration-200 ${isSidebarOpen ? "transform rotate-180" : ""}`}
              />
            </button>
            <h1 className="ml-2 text-2xl font-bold leading-7 sm:text-3xl sm:truncate">
              Syndicat des Taxi
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("rechercher")}
                className="w-full pl-10 pr-4 py-2 border border-blue-400 rounded-md leading-5 bg-blue-500 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-blue-200" />
              </div>
            </div>
            <button
              className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              <Bell className="h-6 w-6" />
            </button>
            <button
              className="bg-blue-500 p-2 rounded-full text-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              onClick={() => router.push("/home")}
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
