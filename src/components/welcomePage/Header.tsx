"use client";
import React, { useState } from "react";
import { Building, LogIn, UserPlus, Home, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const Header: React.FC = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
  };

  const changeLanguage = (lng: string) => {
    console.log(`changement de langue:  ${lng}`);
    i18n.changeLanguage(lng);
    setOpenDropdown(false);
  };

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo et titre */}
        <div className="flex items-center space-x-2 text-blue-600">
          <Building className="h-8 w-8" />
          <span className="text-3xl font-bold">SyndicManager</span>
        </div>

        {/* Navigation */}
        <div className="flex space-x-4 items-center">
          {/* Menu déroulant pour les langues */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 px-3 py-2 rounded-full border text-gray-700 hover:bg-blue-100 transition duration-300"
            >
              <Globe className="h-5 w-5" />
              <span>Langue</span>
            </button>
            {/* Menu déroulant */}
            {openDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-40 z-50">
                <button
                  onClick={() => changeLanguage("fr")}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 w-full text-left"
                >
                  {t("français")}
                </button>
                <button
                  onClick={() => changeLanguage("en")}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 w-full text-left"
                >
                  {t("english")}
                </button>
                <button
                  onClick={() => changeLanguage("de")}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100 w-full text-left"
                >
                  {t("deutsch")}
                </button>
              </div>
            )}
          </div>

          {/* Boutons Se connecter / S'inscrire */}
          <motion.button
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full border border-blue-300 flex items-center hover:bg-blue-200 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
          >
            <LogIn className="mr-2 h-4 w-4" /> {t("seConnecter")}
          </motion.button>
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/register")}
          >
            <UserPlus className="mr-2 h-4 w-4" /> {t("sinscrire")}
          </motion.button>
        </div>
      </div>
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex items-center text-gray-600 text-sm">
          <Home className="w-4 h-4 mr-2 text-gray-500" />
          <span>{t("accueil")}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
