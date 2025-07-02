"use client";

import React from "react";
import { Plus, Users, MessageCircle, Star } from "lucide-react";
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

const DashboardSection: React.FC<DashboardSectionProps> = ({ syndicats }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {syndicats.map((syndicat) => (
          <div
            key={syndicat.id}
            className="bg-white border border-gray-300 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            style={{ animation: "fadeIn 0.5s ease-in-out" }}
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Star className="h-6 w-6 text-yellow-500 mr-2" />
                {syndicat.name}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-5 w-5 mr-1 text-blue-500" />
                  <span>
                    {syndicat.members} {t("membresM")}
                  </span>
                </div>
                {syndicat.newMessages > 0 && (
                  <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {syndicat.newMessages} {t("messages")}
                  </span>
                )}
              </div>
              <button className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold">
                {t("accéder_au_syndicat")}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">{t("créez_votre_propre_syndicat")}</h2>
            <p className="text-blue-200">{t("lancez_votre_propre_syndicat_et_rassemblez_des_membres_autour_de_votre_cause")}</p>
          </div>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t("créer_un_syndicat")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
