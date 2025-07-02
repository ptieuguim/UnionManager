"use client";
import { motion } from "framer-motion";
import { Bell, Building, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import React from "react";

interface HeaderProps {
  isSidebarOpen: boolean;
  searchTerm: string;
  userData?: { profile?: string };
  onSidebarToggle: () => void;
  onSearchChange: (value: string) => void;
  onNotificationToggle: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  searchTerm,
  userData,
  onSidebarToggle,
  onSearchChange,
  onNotificationToggle,
  onProfileClick,
}) => {
  const { t } = useTranslation();
  return (
    <motion.header
      className="bg-white shadow-lg z-20"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onSidebarToggle}
              className="text-gray-600 hover:text-blue-600 focus:outline-none"
              type="button"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-6 w-6" />
              ) : (
                <ChevronRight className="h-6 w-6" />
              )}
            </motion.button>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SyndicManager
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder={t("rechercherPlaceholder1")}
                className="w-64 pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative bg-white p-2 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              onClick={onNotificationToggle}
              type="button"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                4
              </span>
            </motion.button>

            {/* Modification : ajout de onClick pour afficher la section "Paramètres" */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onProfileClick}
              className="w-10 h-10 rounded-full overflow-hidden cursor-pointer shadow-lg border-2 border-white"
            >
              <img
                src={userData?.profile}
                alt={t("photo_de_profil")}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
