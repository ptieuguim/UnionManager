import React, { useState, ChangeEvent, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload } from 'lucide-react';

interface SyndicatFormData {
  nom: string;
  secteurActivite: string;
  objet: string;
  siegeSocial: string;
  conditionsAdhesion: string;
  statuts: File | null;
  reglementInterieur: File | null;
  logo: File | null;
}

export const CreateSyndicat: FC = () => {
  const [formData, setFormData] = useState<SyndicatFormData>({
    nom: '',
    secteurActivite: '',
    objet: '',
    siegeSocial: '',
    conditionsAdhesion: '',
    statuts: null,
    reglementInterieur: null,
    logo: null,
  });

  const handleInputChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputChangeTextarea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    setFormData({ ...formData, [name]: files?.[0] ?? null });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const [step, setStep] = useState<number>(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">Nom du syndicat</label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleInputChangeInput}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="secteurActivite" className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
              <input
                id="secteurActivite"
                name="secteurActivite"
                type="text"
                value={formData.secteurActivite}
                onChange={handleInputChangeInput}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="objet" className="block text-sm font-medium text-gray-700">Objet du syndicat</label>
              <textarea
                id="objet"
                name="objet"
                value={formData.objet}
                onChange={handleInputChangeTextarea}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="siegeSocial" className="block text-sm font-medium text-gray-700">Siège social</label>
              <input
                id="siegeSocial"
                name="siegeSocial"
                type="text"
                value={formData.siegeSocial}
                onChange={handleInputChangeInput}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="conditionsAdhesion" className="block text-sm font-medium text-gray-700">Conditions d'adhésion</label>
              <textarea
                id="conditionsAdhesion"
                name="conditionsAdhesion"
                value={formData.conditionsAdhesion}
                onChange={handleInputChangeTextarea}
                required
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label htmlFor="statuts" className="block text-sm font-medium text-gray-700">Statuts</label>
              <input
                id="statuts"
                name="statuts"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reglementInterieur" className="block text-sm font-medium text-gray-700">Règlement intérieur</label>
              <input
                id="reglementInterieur"
                name="reglementInterieur"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6">
          <h2 className="text-2xl font-bold text-center text-white">Nouveau Syndicat</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {i}
                  </div>
                  <div className={`text-sm mt-1 ${step >= i ? 'text-blue-600' : 'text-gray-600'}`}>
                    {i === 1 ? 'Informations' : i === 2 ? 'Détails' : 'Documents'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-blue-600"
                initial={{ width: '0%' }}
                animate={{ width: `${((step - 1) / 2) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 bg-white text-blue-600 rounded-md border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
          >
            <ChevronLeft className="inline-block mr-2 h-4 w-4" /> Précédent
          </button>
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              Suivant <ChevronRight className="inline-block ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              Créer le syndicat <Upload className="inline-block ml-2 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
