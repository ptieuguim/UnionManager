"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, MessageSquare, Vote, CreditCard, Handshake,
  Home, Bell, ChevronRight, LogOut, BadgeCheck,
  Menu, X, AlertCircle, CheckCircle, Users,
  MessageCircle, Info, Building, Shield
} from "lucide-react";
import { Evenements } from "../Evenement/Evenements";
import { VotesList } from "../Vote/VoteSpace"; // .tsx version
import { ChatBox } from "../Chat/ChatBox";
import { Finances } from "../Cotisations/Finances";
import { Partnerships } from "../Partenaire/Partenaires";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { MemberManagement } from "../../Membres/Membres";
import { Publications } from "../s'exprimer/Publication";
import { useTranslation } from "react-i18next";

// Mémorisons les composants pour éviter les re-rendus inutiles
const MemoizedPublications = memo(() => <Publications />);
MemoizedPublications.displayName = 'MemoizedPublications';

const MemoizedMemberManagement = memo(() => <MemberManagement />);
MemoizedMemberManagement.displayName = 'MemoizedMemberManagement';

const MemoizedEvenements = memo(() => <Evenements />);
MemoizedEvenements.displayName = 'MemoizedEvenements';

const MemoizedChatBox = memo(() => <ChatBox />);
MemoizedChatBox.displayName = 'MemoizedChatBox';

const MemoizedVotesList = memo(() => <VotesList />);
MemoizedVotesList.displayName = 'MemoizedVotesList';

const MemoizedFinances = memo(() => <Finances />);
MemoizedFinances.displayName = 'MemoizedFinances';

const MemoizedPartnerships = memo(() => <Partnerships />);
MemoizedPartnerships.displayName = 'MemoizedPartnerships';

interface NotificationBadgeProps {
  count: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
  >
    {count}
  </motion.div>
);

interface NotificationCardComponentProps {
  icon: React.ElementType;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
}

const NotificationCardComponent: React.FC<NotificationCardComponentProps> = ({ icon: Icon, title, message, time, type }) => {
  const bgColors: Record<string, string> = {
    info: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    error: "bg-red-50 border-red-200",
  };
  
  const iconColors: Record<string, string> = {
    info: "text-blue-500",
    success: "text-green-500",
    warning: "text-yellow-500",
    error: "text-red-500",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`p-4 rounded-xl border ${bgColors[type]} transition-all duration-300 hover:shadow-md`}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${bgColors[type]} ${iconColors[type]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3 flex-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
          <span className="text-xs text-gray-500 mt-2 block">{time}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const SyndicatApp: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("événements");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const router = useRouter();
  const bannerImage = undefined;
  const organisationName = undefined;

  const navItems = [
    { id: "membres", icon: Users, label: t("membres"), badge: 12 },
    { id: "événements", icon: Calendar, label: t("evenements"), badge: 3 },
    { id: "exprimer", icon: MessageCircle, label: t("s_exprimer") },
    { id: "chat", icon: MessageSquare, label: t("chat"), badge: 5 },
    { id: "votes", icon: Vote, label: t("votes"), badge: 2 },
    { id: "contributions", icon: CreditCard, label: t("cotisations") },
    { id: "partnerships", icon: Handshake, label: t("partenariats") },
    { id: "about", icon: Info, label: t("a_propos") },
  ];

  const notifications: NotificationCardComponentProps[] = [
    {
      icon: Calendar,
      title: "Nouvelle réunion",
      message: "Réunion mensuelle prévue pour demain à 10h",
      time: "Il y a 5 minutes",
      type: "info",
    },
    {
      icon: CheckCircle,
      title: "Cotisation reçue",
      message: "Votre cotisation du mois a été validée",
      time: "Il y a 30 minutes",
      type: "success",
    },
    {
      icon: AlertCircle,
      title: "Rappel important",
      message: "N'oubliez pas de voter pour les nouvelles propositions",
      time: "Il y a 1 heure",
      type: "warning" as const,
    },
  ];

  // Utilisons useCallback pour éviter de recréer cette fonction à chaque rendu
  const renderContent = useCallback(() => {
    switch (activeSection) {
      case "membres":
        return <MemoizedMemberManagement />;
      case "événements":
        return <MemoizedEvenements />;
      case "exprimer":
        return <MemoizedPublications />;
      case "chat":
        return <MemoizedChatBox />;
      case "votes":
        return <MemoizedVotesList />;
      case "contributions":
        return <MemoizedFinances />;
      case "partnerships":
        return <MemoizedPartnerships />;
      case "about":
        return (
          <div className="max-w-4xl mx-auto py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{t("a_propos_de_syndic_manager")}</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("votre_plateforme_de_gestion_syndicale_moderne_et_efficace")}
              </p>
            </motion.div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <Building className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">{t("bienvenue_sur_syndic_manager")}</h2>
              <p className="text-gray-600 mt-2">Sélectionnez une section pour commencer</p>
            </motion.div>
          </div>
        );
    }
  }, [activeSection, t]);

  // Rendu final du composant
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <motion.header
        className="bg-white text-blue-600 shadow-lg z-20"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* Bouton de bascule pour mobile */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="text-blue-600 focus:outline-none focus:text-blue-800 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </motion.button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center"
              >
                <Building className="h-8 w-8 text-blue-500" />
                <h1 className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SyndicManager
                </h1>
              </motion.div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative bg-white p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <Bell className="h-6 w-6" />
                  <NotificationBadge count={3} />
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white p-1 rounded-full text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                onClick={() => router.push("/profil")}
              >
                {bannerImage ? (
                  <NextImage
                    src={bannerImage}
                    alt={organisationName || "Profile"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <BadgeCheck className="h-6 w-6" />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-red-500 to-pink-500 p-2 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={() => {}}
              >
                <LogOut className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar repliable */}
        <motion.div
          animate={{ width: isSidebarCollapsed ? 80 : 256 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl flex flex-col z-20"
        >
          <div className="p-2 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-blue-500"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
          <div className="flex-grow overflow-y-auto py-6">
            <nav className="px-2 space-y-3">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: isSidebarCollapsed ? 0 : 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`group flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      activeSection === item.id
                        ? "text-white"
                        : "text-blue-500 group-hover:text-blue-600"
                    }`}
                  />
                  {/* Affichage conditionnel : libellé et badge uniquement en mode étendu */}
                  {!isSidebarCollapsed && (
                    <div className="ml-3 flex-1 flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activeSection === item.id
                              ? "bg-white text-blue-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/user/home")}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4" />
              {!isSidebarCollapsed && (
                <>
                  <span className="ml-2">{t("accueil")}</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {bannerImage && (
            <div className="relative mb-6">
              <div
                className="w-full h-48 bg-cover bg-center rounded-xl"
                style={{ backgroundImage: `url(${bannerImage})` }}
              >
                <div className="w-full h-full bg-black opacity-30 rounded-xl"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-white text-3xl font-bold">{organisationName}</h1>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        
        {/* Panneau de notifications */}
        <AnimatePresence>
          {isNotificationOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-30"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{t("notifications")}</h3>
                    <p className="text-sm text-gray-500">Vous avez 3 nouvelles notifications</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <NotificationCardComponent key={index} {...notification} />
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t("voir_toutes_les_notifications")}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
