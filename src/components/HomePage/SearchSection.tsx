"use client";

import React from "react";
import { Plus, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface Syndicat {
  id: number;
  name: string;
  members: number;
  newMessages: number;
}

export interface DashboardSectionProps {
  syndicats: Syndicat[];
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ syndicats = [] }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {syndicats.map((syndicat) => (
          <div key={syndicat.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">{syndicat.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{syndicat.members} {t('membres')}</span>
                </div>
                {syndicat.newMessages > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {syndicat.newMessages} {t('messages')}
                  </span>
                )}
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                {t('accéderSyndicat')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t('créerSyndicatTitre')}</h2>
            <p className="text-blue-100">{t('créerSyndicatDescription')}</p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t('créerSyndicatBouton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
