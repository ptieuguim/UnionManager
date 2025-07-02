"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building, Search, Bell, Settings, Home, Users, Compass,
    ChevronRight, ChevronLeft, LogOut, X, AlertCircle, Calendar,
    CheckCircle, FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { logout, getFirstName, getLastName, getProfilFromToken } from "../../services/AccountService";
import { AcceuilSection } from "./AcceuilSection";
import { MesSyndicats } from "./MesSyndicatSection";
import Explorer from "./ExploreSection";
import { ProfilUser } from "./ProfilUser/ProfilUser";

// Types for navItems and notifications
interface NavItem {
    id: string;
    icon: React.ElementType;
    label: string;
    gradient: string;
    description: string;
}

interface Notification {
    title: string;
    description: string;
    time: string;
    icon: React.ElementType;
    gradient: string;
}

const navItems: NavItem[] = [
    {
        id: "dashboard",
        icon: Home,
        label: "Accueil",
        gradient: "from-blue-500 to-indigo-600",
        description: "Actualité",
    },
    {
        id: "syndicats",
        icon: Users,
        label: "Mes Syndicats",
        gradient: "from-blue-500 to-indigo-600",
        description: "Gérer vos organisations",
    },
    {
        id: "explorer",
        icon: Compass,
        label: "Explorer",
        gradient: "from-blue-500 to-indigo-600",
        description: "Découvrir de nouveaux syndicats",
    },
    {
        id: "parametres",
        icon: Settings,
        label: "Paramètres",
        gradient: "from-blue-500 to-indigo-600",
        description: "Configuration du compte",
    },
];

const notifications: Notification[] = [
    {
        title: "Nouvelle réunion planifiée",
        description: "Assemblée générale prévue pour demain à 14h",
        time: "Il y a 5 minutes",
        icon: Calendar,
        gradient: "from-blue-500 to-indigo-600",
    },
    {
        title: "Cotisation reçue",
        description: "Paiement confirmé de Jean Dupont",
        time: "Il y a 30 minutes",
        icon: CheckCircle,
        gradient: "from-green-500 to-emerald-600",
    },
    {
        title: "Nouveau document partagé",
        description: "Rapport mensuel disponible",
        time: "Il y a 1 heure",
        icon: FileText,
        gradient: "from-purple-500 to-pink-600",
    },
    {
        title: "Alerte importante",
        description: "Mise à jour des statuts requise",
        time: "Il y a 2 heures",
        icon: AlertCircle,
        gradient: "from-orange-500 to-red-600",
    },
];

interface NotificationItemProps extends Notification {}
const NotificationItem = ({ title, description, time, icon: Icon, gradient }: NotificationItemProps) => (
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

const SettingsPlaceholder = () => (
    <div className="text-center py-12">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto"
        >
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Paramètres en développement</h3>
            <p className="text-gray-600">Cette section sera bientôt disponible avec de nouvelles fonctionnalités.</p>
        </motion.div>
    </div>
);

interface HeaderProps {
    isSidebarOpen: boolean;
    searchTerm: string;
    userData: { firstName: string; lastName: string; profile: string };
    onSidebarToggle: () => void;
    onSearchChange: (value: string) => void;
    onNotificationToggle: () => void;
    onProfileClick: () => void;
}
const Header = ({ isSidebarOpen, searchTerm, userData, onSidebarToggle, onSearchChange, onNotificationToggle, onProfileClick }: HeaderProps) => (
    <motion.header
        className="bg-white shadow-lg z-20"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
    >
        {/* ...header content... */}
    </motion.header>
);

interface SidebarProps {
    isOpen: boolean;
    activeSection: string;
    onSectionChange: (section: string) => void;
    onLogout: () => void;
}
const Sidebar = ({ isOpen, activeSection, onSectionChange, onLogout }: SidebarProps) => (
    <nav className={`bg-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        {/* ...sidebar content... */}
    </nav>
);

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}
const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>
                <div className="space-y-4 p-6 overflow-y-auto flex-1">
                    {notifications.map((notification, index) => (
                        <NotificationItem key={index} {...notification} />
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Voir toutes les notifications
                </motion.button>
            </motion.div>
        )}
    </AnimatePresence>
);

import { useTranslation } from 'react-i18next';

export const HomePage = () => {
    const { i18n } = useTranslation();
    const [activeSection, setActiveSection] = useState<string>("dashboard");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const router = useRouter();

    const userData = useMemo(() => ({
        firstName: getFirstName() ?? "",
        lastName: getLastName() ?? "",
        profile: getProfilFromToken() ?? "", // Utilisation de ?? pour éviter null
    }), []);

    useEffect(() => {
        const savedSection = localStorage.getItem("activeSection");
        if (savedSection) setActiveSection(savedSection);
    }, []);

    useEffect(() => {
        localStorage.setItem("activeSection", activeSection);
    }, [activeSection]);

    const renderContent = useCallback(() => {
        const sections: { [key: string]: JSX.Element } = {
            dashboard: <AcceuilSection />,
            syndicats: <MesSyndicats />,
            explorer: <Explorer />,
            parametres: <ProfilUser />,
        };
        return sections[activeSection] || null;
    }, [activeSection]);

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Sélecteur de langue */}
            <div className="absolute top-4 right-4 z-50">
                <select
                    className="px-2 py-1 rounded border border-gray-300"
                    value={i18n.language}
                    onChange={e => i18n.changeLanguage(e.target.value)}
                    aria-label="Changer la langue"
                >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                </select>
            </div>
            <Header
                isSidebarOpen={isSidebarOpen}
                searchTerm={searchTerm}
                userData={userData}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onSearchChange={setSearchTerm}
                onNotificationToggle={() => setIsNotificationOpen(!isNotificationOpen)}
                onProfileClick={() => setActiveSection("parametres")}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    isOpen={isSidebarOpen}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    onLogout={() => {
                        logout();
                        router.push('/login');
                    }}
                />

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

                <NotificationsPanel
                    isOpen={isNotificationOpen}
                    onClose={() => setIsNotificationOpen(false)}
                />
            </div>
        </div>
    );
};

export default HomePage;
