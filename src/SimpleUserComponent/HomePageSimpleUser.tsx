import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Search, Bell, Home, Compass, ChevronRight, LogOut, X, ChevronLeft } from "lucide-react";
import  Explorer from "../components/HomePage/ExploreSection";
import { getFirstName, getLastName } from "../services/AccountService";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

interface Notification {
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  gradient: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  gradient: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    icon: Home,
    label: "Accueil",
    gradient: "from-blue-500 to-indigo-600",
    description: "Tableau de bord principal",
  },
  {
    id: "explorer",
    icon: Compass,
    label: "Explorer",
    gradient: "from-blue-500 to-indigo-600",
    description: "Découvrir des syndicats",
  }
];

const notifications: Notification[] = [
  {
    title: "Bienvenue sur SyndicManager",
    description: "Découvrez les syndicats disponibles",
    time: "Il y a 5 minutes",
    icon: Building,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Conseil de recherche",
    description: "Utilisez les filtres pour trouver le syndicat idéal",
    time: "Il y a 30 minutes",
    icon: Search,
    gradient: "from-green-500 to-emerald-600",
  }
];

const NotificationItem: React.FC<Notification> = ({ title, description, time, icon: Icon, gradient }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group"
  >
    <div className={`h-1 bg-gradient-to-r ${gradient}`} />
    <div className="p-4">
      <div className="flex items-center mb-2">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="ml-auto text-xs text-gray-500">{time}</span>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </motion.div>
);

export const SimpleUserHomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [lastName, setLastName] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection && navItems.some(item => item.id === savedSection)) {
      setActiveSection(savedSection);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  useEffect(() => {
    setFirstName(getFirstName());
    setLastName(getLastName());
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl inline-block mb-4">
                  <Building className="h-12 w-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {t("bienvenue_sur_syndic_manager")}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Découvrez et rejoignez des syndicats qui correspondent à vos intérêts professionnels.
                  Explorez les différentes organisations et trouvez celle qui vous convient le mieux.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl"
                >
                  <Compass className="h-8 w-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Explorer les Syndicats
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Parcourez la liste des syndicats disponibles et trouvez celui qui correspond à vos besoins.
                  </p>
                  <button
                    onClick={() => setActiveSection("explorer")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Commencer l'exploration
                  </button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl"
                >
                  <Search className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Recherche Avancée
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Utilisez nos filtres de recherche pour trouver rapidement le syndicat qui vous correspond.
                  </p>
                  <button
                    onClick={() => setActiveSection("explorer")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                  >
                    Rechercher un syndicat
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
      case "explorer":
        return <Explorer />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
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
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
              >
                {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
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
                  placeholder="Rechercher un syndicat..."
                  className="w-64 pl-10 pr-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative bg-white p-2 rounded-xl text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                  </span>
                </motion.button>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center cursor-pointer shadow-lg"
              >
                {firstName && lastName && (
                  <span className="font-semibold text-lg">
                    {firstName.charAt(0)}
                    {lastName.charAt(0)}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.nav
          initial={{ width: isSidebarOpen ? 256 : 64 }}
          animate={{ width: isSidebarOpen ? 256 : 64 }}
          transition={{ duration: 0.3 }}
          className={`bg-white shadow-xl flex flex-col z-20 ${isSidebarOpen ? "" : "absolute inset-y-0 left-0"}`}
        >
          <div className="flex-grow overflow-y-auto p-6">
            <nav className="space-y-4">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full p-3 rounded-xl transition-all duration-300 group ${
                    activeSection === item.id
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } ${isSidebarOpen ? "flex items-center" : "flex justify-center"}`}
                >
                  <item.icon className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : ""}`} />
                  {isSidebarOpen && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={`text-xs ${activeSection === item.id ? "text-white/80" : "text-gray-500"}`}>
                        {item.description}
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
          <div className="p-6 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center ${isSidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium ml-2">Déconnexion</span>}
            </motion.button>
          </div>
        </motion.nav>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
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
        {/* Notifications Panel */}
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
                    <p className="text-sm text-gray-500">Vous avez 2 nouvelles notifications</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsNotificationOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <NotificationItem key={index} {...notification} />
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

export default SimpleUserHomePage;
