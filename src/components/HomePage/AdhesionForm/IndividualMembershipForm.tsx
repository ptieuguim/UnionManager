// IndividualMembershipForm.tsx - Formulaire d'adhésion pour personne physique
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Camera, CreditCard, Send, ArrowRight } from "lucide-react";
import { FileUploader } from "./file-uploader"; // Utilise automatiquement la version .tsx

interface IndividualFormProps {
  onSubmit: (data: any) => void;
  formData: Record<string, any>;
  setFormData: (data: Record<string, any>) => void;
}

export const IndividualForm = ({ onSubmit, formData, setFormData }: IndividualFormProps) => {
  const [photoIdentite, setPhotoIdentite] = useState<File | null>(null);
  const [pieceIdentiteFace, setPieceIdentiteFace] = useState<File | null>(null);
  const [pieceIdentiteDos, setPieceIdentiteDos] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = () => {
    // Validation basique
    const requiredFields = ['nom', 'prenom', 'numeroCNI', 'dateNaissance', 'telephone', 'email', 'adresse', 'profession', 'motivation'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      alert(`Veuillez remplir tous les champs obligatoires: ${missingFields.join(', ')}`);
      return;
    }
    if (!photoIdentite || !pieceIdentiteFace || !pieceIdentiteDos) {
      alert('Veuillez télécharger tous les documents requis');
      return;
    }
    onSubmit({
      ...formData,
      photoIdentite,
      pieceIdentiteFace,
      pieceIdentiteDos
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Formulaire d'adhésion
        </h2>
        <p className="text-gray-600">
          Remplissez vos informations personnelles pour finaliser votre adhésion
        </p>
      </div>
      <div className="space-y-6">
        {/* Informations personnelles */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Informations personnelles
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.nom || ''}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre nom de famille"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.prenom || ''}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro CNI *
              </label>
              <input
                type="text"
                required
                value={formData.numeroCNI || ''}
                onChange={(e) => handleInputChange('numeroCNI', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Numéro de votre CNI"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de naissance *
              </label>
              <input
                type="date"
                required
                value={formData.dateNaissance || ''}
                onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Date de naissance"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                required
                value={formData.telephone || ''}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre numéro de téléphone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre adresse email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <input
                type="text"
                required
                value={formData.adresse || ''}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre adresse complète"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <input
                type="text"
                required
                value={formData.profession || ''}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre profession actuelle"
              />
            </div>
            <div className="mt-4 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivation pour rejoindre le syndicat *
              </label>
              <textarea
                required
                rows={4}
                value={formData.motivation || ''}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Expliquez-nous pourquoi vous souhaitez rejoindre notre syndicat..."
              />
            </div>
          </div>
        </div>
        {/* Documents requis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-500" />
            Documents requis
          </h3>
          <div className="space-y-6">
            <FileUploader
              label="Photo d'identité"
              icon={<Camera className="text-green-500" />}
              accept="image/*"
              onFileSelect={setPhotoIdentite}
              bgColor="bg-green-50"
              borderColor="border-green-200"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <FileUploader
                label="Pièce d'identité (Face)"
                icon={<CreditCard className="text-orange-500" />}
                accept="image/*"
                onFileSelect={setPieceIdentiteFace}
                bgColor="bg-orange-50"
                borderColor="border-orange-200"
              />
              <FileUploader
                label="Pièce d'identité (Dos)"
                icon={<CreditCard className="text-purple-500" />}
                accept="image/*"
                onFileSelect={setPieceIdentiteDos}
                bgColor="bg-purple-50"
                borderColor="border-purple-200"
              />
            </div>
          </div>
        </div>
        <motion.button
          onClick={handleFormSubmit}
          className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send className="w-5 h-5 mr-2" />
          Envoyer ma demande d'adhésion
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};
