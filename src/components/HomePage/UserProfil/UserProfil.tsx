"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

interface UserProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfile: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<UserProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Logique de soumission
      console.log("Profile updated:", formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-8 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("configuration_du_profil")}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prénom */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t("prenom")}</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          {/* Nom */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t("nom")}</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{t("email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {/* Section mot de passe */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t("changer_mot_de_passe")}</h3>
          <div className="space-y-4">
            {/* Mot de passe actuel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t("mot_de_passe_actuel")}</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Nouveau mot de passe */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t("nouveau_mot_de_passe")}</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Confirmation */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{t("confirmer_nouveau_mot_de_passe")}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t("envoi") : t("mettre_a_jour_profil")}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
