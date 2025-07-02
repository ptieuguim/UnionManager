"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Edit3, Trash2, CheckCircle, MapPin, Plus } from "lucide-react";
import { Notification } from "@/components/Notification";
import axios from 'axios';
import { AxiosResponse } from 'axios';
import InteractiveMap from './InteractiveMap';

// URL de l'API (constante)
// URL de l'API pour les requêtes Axios
const API_URL = "/api/organization-service/organizations";

// Types et interfaces pour le formulaire
interface Location {
  lat: number;
  lng: number;
}

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationMessage {
  type: NotificationType;
  message: string;
  isVisible: boolean;
}

interface Antenne {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location?: Location;
  // Ces propriétés ne peuvent plus être undefined si on veut afficher des coordonnées dans le tableau
  latitude: number;
  longitude: number;
  city?: string;
  postal_code?: string;
  country?: string;
}

interface FormData {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  website_url?: string;
  web_site_url?: string; // Également présent pour compatibilité rétroactive
  description?: string;
  leader_name?: string;
  foundation_date?: string;
  member_count?: number;
  type?: string;
  business_domains?: string[] | string;
  sector?: string;
  syndicatType?: string;
  creationDate?: string;
  lastAssemblyDate?: string;
  memberCount?: string;
  responsiblePerson?: string;
  additionalNotes?: string;
  legalReference?: string;
  accreditationNumber?: string;
  accreditationDate?: string;
  accreditationAuthority?: string;
  accreditationDocument?: unknown;
  antennes?: Antenne[];
  // Added missing properties
  registration_date?: string;
  registration_number?: string;
  year_founded?: string;
  long_name?: string;
  short_name?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  logo_url?: string | File | null;
  cover_image_url?: string;
  ceo_name?: string;
  social_network?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Interface pour les props de Step3Antennes - utilisée directement par le composant Step3Antennes ci-dessous
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Step3AntennesProps {
  goBackToStep2: () => void;
  handleSubmit: () => void;
  antennes: Antenne[];
  setAntennes: React.Dispatch<React.SetStateAction<Antenne[]>>;
  isLoading: boolean;
  apiResponse: ApiResponse | null;
  showNotification: (notification: NotificationMessage | { isVisible?: boolean; message: string; type?: NotificationType }) => void;
}

// Interface pour le FileUploader
// FileUploader props pour les champs d'upload
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  currentFile?: File | null;
  bgColor?: string;
  borderColor?: string;
  preview?: boolean;
}

// L'InteractiveMap est désormais importé depuis un composant externe './InteractiveMap.tsx'

// ======================================================================
// COMPOSANT ÉTAPE 1 : INFORMATIONS GÉNÉRALES
// ======================================================================
const Step1: React.FC<{
  formData: FormData;
  onDataChange: (field: string, value: unknown) => void; 
  onNext: () => void;
}> = ({ formData, onDataChange, onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations générales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Nom du Syndicat */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du Syndicat <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={formData.name || ''}
            onChange={(e) => onDataChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Nom du syndicat"
          />
        </div>

        {/* Type de Syndicat */}
        <div>
          <label htmlFor="syndicatType" className="block text-sm font-medium text-gray-700 mb-1">
            Type de Syndicat <span className="text-red-500">*</span>
          </label>
          <select
            id="syndicatType"
            value={formData.type || ''}
            onChange={(e) => onDataChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="ANONYMOUS">Anonyme</option>
            <option value="ACCREDITED">Accrédité</option>
          </select>
        </div>

        {/* Date de Création */}
        <div>
          <label htmlFor="creationDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de Création <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="creationDate"
            value={formData.creationDate || ""}
            onChange={(e) => onDataChange("creationDate", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Secteur d'activité */}
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
            Secteur d&apos;activité <span className="text-red-500">*</span>
          </label>
          <select
            id="sector"
            value={formData.sector || ""}
            onChange={(e) => onDataChange("sector", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Sélectionner un secteur</option>
            <option value="EDUCATION">Éducation</option>
            <option value="HEALTH">Santé</option>
            <option value="TRANSPORT">Transport</option>
            <option value="INDUSTRY">Industrie</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="COMMERCE">Commerce</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => onDataChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="email@exemple.com"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => onDataChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Exemple: +237 612345678"
          />
        </div>

        {/* Adresse */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            value={formData.address || ''}
            onChange={(e) => onDataChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Adresse complète"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(optionnel)</span>
          </label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onDataChange && onDataChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Décrivez votre syndicat en quelques mots..."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          Suivant
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ======================================================================
// COMPOSANT ÉTAPE 2A : SYNDICAT ANONYME
// ======================================================================
const Step2Anonymous: React.FC<{
  formData: FormData;
  onDataChange?: (field: keyof FormData, value: string | number | boolean | string[] | File | null) => void;
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>;
  goBackToStep1: () => void;
  goToStep3: () => void;
}> = ({ formData, onDataChange, goBackToStep1, goToStep3 }) => {
  // On utilise directement setFormData ou onDataChange dans les composants enfants
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations du Syndicat Anonyme</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Nombre de membres */}
        <div>
          <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de membres <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="memberCount"
            min="1"
            value={formData.member_count || ''}
            onChange={(e) => onDataChange && onDataChange('member_count', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Nombre de membres"
          />
        </div>

        {/* Personne responsable */}
        <div>
          <label htmlFor="responsiblePerson" className="block text-sm font-medium text-gray-700 mb-1">
            Personne responsable <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="responsiblePerson"
            value={formData.leader_name || ''}
            onChange={(e) => onDataChange && onDataChange('leader_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Nom complet du responsable"
          />
        </div>

        {/* Date de la dernière assemblée */}
        <div>
          <label htmlFor="lastAssemblyDate" className="block text-sm font-medium text-gray-700 mb-1">
            Date de dernière assemblée générale
          </label>
          <input
            type="date"
            id="lastAssemblyDate"
            value={formData.foundation_date || ''}
            onChange={(e) => onDataChange && onDataChange('foundation_date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Statuts du syndicat */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statuts du syndicat <span className="text-gray-400">(optionnel)</span>
          </label>
          <div className="mt-1">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.pdf,.doc,.docx';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    onDataChange && onDataChange('accreditationDocument', file);
                  }
                };
                input.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  onDataChange && onDataChange('accreditationDocument', file);
                }
              }}
            >
              {formData.accreditationDocument ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                  <p className="mt-1 text-sm text-green-600 font-medium">
                    {formData.accreditationDocument instanceof File 
                      ? formData.accreditationDocument.name 
                      : "Fichier chargé"}
                  </p>
                  <button 
                    className="mt-2 text-xs text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDataChange && onDataChange('accreditationDocument', null);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">Cliquez pour télécharger ou glissez-déposez</p>
                  <p className="text-xs text-gray-500">PDF, DOCX (max. 10MB)</p>
                  <button 
                    className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Parcourir
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Notes supplémentaires */}
        <div className="md:col-span-2">
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes supplémentaires <span className="text-gray-400">(optionnel)</span>
          </label>
          <textarea
            id="additionalNotes"
            value={formData.description || ''}
            onChange={(e) => onDataChange && onDataChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Informations complémentaires..."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={goBackToStep1}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <button
          onClick={goToStep3}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          Suivant
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ======================================================================
// COMPOSANT ÉTAPE 2B : SYNDICAT ACCRÉDITÉ
// ======================================================================
const Step2Accredited: React.FC<{
  formData: FormData;
  onDataChange: (field: keyof FormData, value: string | number | boolean | string[] | File | null) => void;
  onNext?: () => void;
  onBack?: () => void;
  goBackToStep1: () => void;
}> = ({ formData, onDataChange, onNext, goBackToStep1 }) => {
  // On utilise directement goBackToStep1 dans le bouton de retour
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Informations du Syndicat Accrédité</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Numéro d'accréditation */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Base légale</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Loi ou réglementation applicable"
            value={formData.description || ""}
            onChange={(e) => onDataChange && onDataChange('description', e.target.value)}
          />
        </div>

        {/* Date d'accréditation */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Date d&apos;accréditation</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData?.accreditationDate || ""}
            onChange={(e) => onDataChange && onDataChange("accreditationDate", e.target.value)}
          />
        </div>

        {/* Autorité d'accréditation */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Autorité d&apos;accréditation</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nom de l&apos;autorité délivrant l&apos;accréditation"
            value={formData?.accreditationAuthority || ""}
            onChange={(e) => onDataChange && onDataChange("accreditationAuthority", e.target.value)}
          />
        </div>

        {/* Nombre de membres */}
        <div>
          <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de membres <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="memberCount"
            min="1"
            value={formData.member_count || ''}
            onChange={(e) => onDataChange && onDataChange('member_count', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Nombre de membres"
          />
        </div>

        {/* Référence légale */}
        <div className="md:col-span-2">
          <label htmlFor="legalReference" className="block text-sm font-medium text-gray-700 mb-1">
            Référence légale <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="legalReference"
            value={formData.description || ''}
            onChange={(e) => onDataChange && onDataChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Loi ou décret applicable"
            aria-label="Référence légale"
          />
        </div>

        {/* Document d'accréditation */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document d&apos;accréditation <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-10 w-10 mx-auto text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">Cliquez pour télécharger ou glissez-déposez</p>
              <p className="text-xs text-gray-500">PDF (max. 10MB)</p>
              <button 
                type="button"
                onClick={() => console.log('File upload button clicked')} 
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Parcourir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={goBackToStep1}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          Suivant
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ======================================================================
// COMPOSANT ÉTAPE 3 : GESTION DES ANTENNES
// ======================================================================
const Step3Antennes: React.FC<{
  goBackToStep2: () => void;
  handleSubmit: () => void;
  antennes: Antenne[];
  setAntennes: React.Dispatch<React.SetStateAction<Antenne[]>>;
  isLoading: boolean;
  apiResponse: ApiResponse | null;
  showNotification: (notification: NotificationMessage | { isVisible?: boolean; message: string; type?: NotificationType }) => void;
}> = ({ goBackToStep2, handleSubmit, antennes, setAntennes, isLoading, apiResponse, showNotification }) => {
  // État initial pour les antennes
  const [currentAntenne, setCurrentAntenne] = useState<Antenne>({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    location: {
      lat: 0,
      lng: 0
    },
    // Initialiser les propriétés obligatoires
    latitude: 0,
    longitude: 0
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // Mettre à jour l'antenne avec la nouvelle localisation
    setCurrentAntenne(prev => ({
      ...prev,
      location: location,
      // Toujours définir ces valeurs lors de la sélection d'un emplacement
      latitude: location.lat,
      longitude: location.lng
    }));
  };

  const handleInputChange = (field: keyof Antenne, value: string | number) => {
    setCurrentAntenne(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAntenne = () => {
    // Afficher un message de debug pour voir les valeurs
    console.log("Données de l'antenne à ajouter:", currentAntenne);
    console.log("Position sélectionnée:", selectedLocation);

    if (!currentAntenne.name || !currentAntenne.address || !currentAntenne.city || !currentAntenne.phone) {
      showNotification({
        message: "Veuillez compléter tous les champs obligatoires",
        type: "warning"
      });
      return;
    }

    // Vérification améliorée de la position: on vérifie si selectedLocation existe
    // plutôt que de se fier uniquement à la propriété location de currentAntenne
    if (!selectedLocation) {
      showNotification({
        message: "Veuillez sélectionner un emplacement sur la carte",
        type: "warning"
      });
      return;
    }

    if (isEditing && editIndex !== null) {
      // Mise à jour d'une antenne existante
      const updatedAntennes = [...antennes];
      updatedAntennes[editIndex] = { ...currentAntenne };
      setAntennes(updatedAntennes);
      showNotification({
        message: "Antenne mise à jour avec succès",
        type: "success"
      });
    } else {
      // Ajout d'une nouvelle antenne
      setAntennes([...antennes, { ...currentAntenne, id: `antenne-${Date.now()}` }]);
      showNotification({
        message: "Antenne ajoutée avec succès",
        type: "success"
      });
    }

    // Réinitialisation du formulaire
    setCurrentAntenne({
      name: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      latitude: 0,
      longitude: 0
    });
    setSelectedLocation(null);
    setIsEditing(false);
    setEditIndex(null);
  };

  const handleEditAntenne = (index: number) => {
    const antenneToEdit = antennes[index];
    setCurrentAntenne({ ...antenneToEdit });
    // Vérifier si les propriétés existent avant de les utiliser
    setSelectedLocation(
      antenneToEdit.latitude !== undefined && antenneToEdit.longitude !== undefined 
      ? { lat: antenneToEdit.latitude, lng: antenneToEdit.longitude }
      : null
    );
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteAntenne = (index: number) => {
    const updatedAntennes = antennes.filter((_, i) => i !== index);
    setAntennes(updatedAntennes);
    showNotification({
      message: "Antenne supprimée",
      type: "info"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestion des Antennes Locales</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-xl font-medium text-gray-700 mb-4">{isEditing ? "Modifier l'antenne" : "Ajouter une antenne"}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="antenneName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;antenne <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="antenneName"
              value={currentAntenne.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Siège social, Antenne Nord, etc."
            />
          </div>
          
          <div>
            <label htmlFor="antennePhone" className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="antennePhone"
              value={currentAntenne.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Exemple: +237 612345678"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="antenneAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="antenneAddress"
              value={currentAntenne.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Adresse complète"
            />
          </div>
          
          <div>
            <label htmlFor="antenneCity" className="block text-sm font-medium text-gray-700 mb-1">
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="antenneCity"
              value={currentAntenne.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Ville"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localisation sur la carte <span className="text-red-500">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-4">Cliquez sur la carte ou déplacez le marqueur pour définir l&apos;emplacement exact</p>
          
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <InteractiveMap 
              onLocationSelect={handleLocationSelect} 
              selectedLocation={selectedLocation}
              height="400px"
            />
          </div>
          
          {selectedLocation && (
            <div className="mt-2 text-sm text-gray-500">
              Coordonnées: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAddAntenne}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
            type="button"
          >
            {isEditing ? <><Edit3 size={16} /> Mettre à jour</> : <><Plus size={16} /> Ajouter</>}
          </button>
        </div>
      </div>
      
      {/* Liste des antennes */}
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Liste des antennes ({antennes.length})</h3>
        
        {antennes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin size={48} className="mx-auto mb-2 opacity-30" />
            <p>Aucune antenne ajoutée pour l&apos;instant</p>
            <p className="text-sm text-green-600">Vous avez ajouté {antennes.length} antennes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordonnées</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {antennes.map((antenne, index) => (
                  <tr key={antenne.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{antenne.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{antenne.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{antenne.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{antenne.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {antenne.latitude.toFixed(4)}, {antenne.longitude.toFixed(4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEditAntenne(index)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Voulez-vous vraiment supprimer cette antenne ?')) {
                            handleDeleteAntenne(index);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={goBackToStep2}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          type="button"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Création en cours...
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Créer le syndicat
            </>
          )}
        </button>
      </div>
      
      {apiResponse && apiResponse.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800">{apiResponse.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant principal
const CreateSyndicatForm: React.FC = () => {
  // État local pour les étapes
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [syndicatType, setSyndicatType] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    business_domains: [],
    long_name: "",
    short_name: "",
    email: "",
    type: "",
    phone: "",
    registration_number: "",
    registration_date: "",
    year_founded: "",
    web_site_url: "",
    address: "",
    description: "",
    city: "",
    country: "",
    postal_code: "",
    logo_url: null,
    cover_image_url: "",
    ceo_name: "",
    social_network: ""
  });
  const [antennes, setAntennes] = useState<Antenne[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [notification, setNotification] = useState<NotificationMessage>({ isVisible: false, message: "", type: "info" });

  // Fonction pour afficher les notifications
  const showNotification = (notification: NotificationMessage | { isVisible?: boolean; message: string; type?: NotificationType }) => {
    const notificationWithType: NotificationMessage = {
      isVisible: notification.isVisible ?? true,
      message: notification.message,
      type: notification.type ?? "info"
    };
    setNotification(notificationWithType);
  };
  const closeNotification = () => setNotification(prev => ({ ...prev, isVisible: false }));

  // Fonctions de navigation entre les étapes
  const goBackToStep1 = () => { setCurrentStep(1); setSyndicatType(""); };
  const goToStep3 = () => setCurrentStep(3);
  const goBackToStep2 = () => setCurrentStep(2);

  const handleSubmit = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      const apiPayload = { ...formData, registration_date: formData.registration_date ? new Date(formData.registration_date).toISOString() : undefined, year_founded: formData.year_founded ? new Date(formData.year_founded).toISOString() : undefined, website_url: formData.web_site_url, antennes: antennes };
      delete apiPayload.web_site_url;
      console.log("Payload envoyé à l'API:", apiPayload);
      const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
      const responseData = await response.json();
      if (!response.ok) {
        // Correction : toujours fournir un message utilisateur
        const msg = responseData?.message || `Erreur HTTP: ${response.status}`;
        throw new Error(msg);
      }
      setApiResponse(responseData);
      showNotification({ message: "Syndicat créé avec succès! ", type: "success" });
    } catch (err: any) {
      console.error("Erreur lors de la création du syndicat:", err);
      // Correction : message toujours présent
      const apiMessage = err?.response?.data?.message || err?.message || "Une erreur est survenue lors de la création du syndicat.";
      showNotification({ message: apiMessage, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Props d'animation réutilisés pour transitions cohérentes
  const animationProps = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeInOut" as const }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <Notification {...notification} onClose={closeNotification} autoClose={notification.type === "success"} duration={5000} />
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="step1" {...animationProps}>
            <Step1 
              formData={formData}
              onDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))} 
              onNext={() => {
                if (formData.type === "ANONYMOUS") {
                  setSyndicatType("anonymous");
                  setCurrentStep(2);
                } else if (formData.type === "ACCREDITED") {
                  setSyndicatType("accredited");
                  setCurrentStep(2);
                } else {
                  showNotification({ message: "Veuillez sélectionner un type de syndicat pour continuer.", type: "warning" });
                }
              }}
            />
          </motion.div>
        )}
        {currentStep === 2 && syndicatType === "anonymous" && (
          <motion.div key="step2-anon" {...animationProps}>
            <Step2Anonymous 
              formData={formData} 
              onDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))} 
              goBackToStep1={goBackToStep1} 
              goToStep3={goToStep3}
            />
          </motion.div>
        )}
        {currentStep === 2 && syndicatType === "accredited" && (
          <motion.div key="step2-accred" {...animationProps}>
            <Step2Accredited 
              formData={formData} 
              onDataChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))} 
              onNext={goToStep3} 
              goBackToStep1={goBackToStep1} 
            />
          </motion.div>
        )}
        {currentStep === 3 && (
          <motion.div key="step3-antennes" {...animationProps}>
            <Step3Antennes 
              goBackToStep2={goBackToStep2} 
              handleSubmit={handleSubmit} 
              antennes={antennes} 
              setAntennes={setAntennes} 
              isLoading={isLoading} 
              apiResponse={apiResponse} 
              showNotification={showNotification} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateSyndicatForm;
