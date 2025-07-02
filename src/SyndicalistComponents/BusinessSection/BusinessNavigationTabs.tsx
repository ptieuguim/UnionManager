// MIGRATION: Ce composant a été migré de BusinessNavigationTabs.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
import { FC, JSX, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, Building,
  Megaphone, CreditCard, Heart, Star, Zap
} from "lucide-react";
import PlanningManagement from "./planing/PlaningManagement";
import ReservationManagement  from "./Reservation/ReservationManagement";
import { AnnouncementManagement } from "./Announcements/AnnouncementManagement";
import { TransactionManagement } from "./Transactions/TransactionManagement";
import WishlistManagement from "./Wishlist/WishlistManagement";
import { FavoritesManagement } from "./Favorites/FavoritesManagement";
import  SubscriptionManagement  from "./SubscriptionManagement/SubscriptionManagement";

interface Tab {
  key: string;
  icon: JSX.Element;
  label: string;
}

const tabs: Tab[] = [
  { key: "planing", icon: <Calendar className="inline-block mr-2" />, label: "Planning" },
  { key: "evenement", icon: <MapPin className="inline-block mr-2" />, label: "Événements" },
  { key: "reservation", icon: <Building className="inline-block mr-2" />, label: "Réservation" },
  { key: "announcements", icon: <Megaphone className="inline-block mr-2" />, label: "Annonces" },
  { key: "transactions", icon: <CreditCard className="inline-block mr-2" />, label: "Transactions" },
  { key: "wishlist", icon: <Heart className="inline-block mr-2" />, label: "Liste de souhaits" },
  { key: "favorites", icon: <Star className="inline-block mr-2" />, label: "Favoris" },
  { key: "subscription", icon: <Zap className="inline-block mr-2" />, label: "Abonnements" },
];

export const BusinessNavigationTabs: FC = () => {
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
      case "announcements":
        return <AnnouncementManagement />;
      case "transactions":
        return <TransactionManagement />;
      case "wishlist":
        return <WishlistManagement />;
      case "favorites":
        return <FavoritesManagement />;
      case "subscription":
        return <SubscriptionManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="pt-6">
      {/* Barre de navigation */}
      <div className="flex justify-center gap-4 relative overflow-x-auto pb-2 px-4">
        <div className="flex space-x-2 md:space-x-4">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 md:px-6 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 shadow-md whitespace-nowrap ${
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
                  animate={{ opacity: 1, width: "30%", x: "-50%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Zone de contenu qui change selon l'onglet actif */}
      <div className="mt-8">
        {renderComponent(activeTab)}
      </div>
    </div>
  );
};

export default BusinessNavigationTabs;
