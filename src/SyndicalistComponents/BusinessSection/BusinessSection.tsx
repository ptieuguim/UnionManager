// MIGRATION: Ce composant a été migré de BusinessSection.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
import { FC, JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, BookOpen } from "lucide-react";
import { PlanningManagement } from "./planing/PlaningManagement.jsx";
import  ReservationManagement  from "./Reservation/ReservationManagement";

interface Tab {
  key: string;
  icon: JSX.Element;
  label: string;
}

const tabs: Tab[] = [
  { key: "planing", icon: <Calendar className="inline-block mr-2" />, label: "Planning" },
  { key: "evenement", icon: <MapPin className="inline-block mr-2" />, label: "Événements" },
  { key: "reservation", icon: <BookOpen className="inline-block mr-2" />, label: "Réservation" },
];

const BusinessNavigationTabs: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("planing");

  // Fonction qui renvoie le composant à afficher selon l'onglet actif
  const renderComponent = (tabKey: string): JSX.Element | null => {
    switch (tabKey) {
      case "planing":
        return <PlanningManagement />;
      case "evenement":
        return <div>evenementt</div>;
      case "reservation":
        return <ReservationManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-6">
      {/* Barre de navigation */}
      <div className="flex justify-center gap-6 relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-md ${
              activeTab === tab.key
                ? "bg-indigo-600 text-white"
                : "bg-white/30 backdrop-blur-md text-gray-700 hover:bg-indigo-100"
            }`}
            onClick={() => setActiveTab(tab.key)}
            aria-selected={activeTab === tab.key}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="underline"
                className="absolute bottom-0 left-1/2 w-5 h-1 bg-indigo-600 rounded-full"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "60%", x: "-50%" }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Zone de contenu qui change selon l'onglet actif */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="mt-8"
        >
          {renderComponent(activeTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export { BusinessNavigationTabs };

export const BusinessSection: FC = () => {
  return (
    <div className="container mx-auto px-4">
      <BusinessNavigationTabs />
    </div>
  );
};

export default BusinessSection;
