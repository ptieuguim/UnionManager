"use client";

import React from "react";
import { Users, MapPin, Building, ShoppingBag } from "lucide-react";
import MemberManagement from "../OrganisationGestion/Members/MemberManagement";
import BranchManagement from "../OrganisationGestion/Branches/BranchManagement";
import ProductServiceManagement from "./Product-Services/ProductServiceManagement";

// TODO: Ajouter d'autres imports et types si besoin
import {  motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export const OrganisationNavigationTabs: React.FC = () => {
    // --- États strictement typés ---
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'members' | 'branches' | 'agencies' | 'products'>('members');

  const tabs: { key: 'members' | 'branches' | 'agencies' | 'products'; icon: React.ReactNode; label: string }[] = [
    { key: 'members', icon: <Users className="inline-block mr-2" />, label: t('organisation.tabs.members') },
    { key: 'branches', icon: <MapPin className="inline-block mr-2" />, label: t('organisation.tabs.branches') },
    { key: 'agencies', icon: <Building className="inline-block mr-2" />, label: t('organisation.tabs.agencies') },
    { key: 'products', icon: <ShoppingBag className="inline-block mr-2" />, label: t('organisation.tabs.products') },
  ];

  // --- Rendu dynamique du composant selon l'onglet ---
  const renderComponent = (tabKey: 'members' | 'branches' | 'agencies' | 'products') => {
    switch (tabKey) {
      case 'members':
        return <MemberManagement />;
      case 'branches':
        return <BranchManagement />;
      case 'agencies':
        return <div>agencies</div>;
      case 'products':
        return <ProductServiceManagement />;
      default:
        return null;
    }
  };

  // --- UI complète migrée et typée ---
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
                ? 'bg-indigo-600 text-white'
                : 'bg-white/30 backdrop-blur-md text-gray-700 hover:bg-indigo-100'
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
                animate={{ opacity: 1, width: '60%', x: '-50%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Zone de contenu qui change selon l'onglet actif */}
      <div className="mt-8">
        {renderComponent(activeTab)}
      </div>
    </div>
  );
};

export default OrganisationNavigationTabs;
