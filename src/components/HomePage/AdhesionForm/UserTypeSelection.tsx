// UserTypeSelection.tsx - Composant pour choisir le type d'utilisateur
"use client";

import { motion } from "framer-motion";
import { User, Building2, CheckCircle } from "lucide-react";

interface UserTypeSelectionProps {
  onSelect: (typeId: string) => void;
  selectedType: string | null;
}

interface UserType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  available: boolean;
}

export const UserTypeSelection = ({ onSelect, selectedType }: UserTypeSelectionProps) => {
  const userTypes: UserType[] = [
    {
      id: 'individual',
      title: 'Personne physique',
      description: 'Je suis une personne individuelle souhaitant adhérer au syndicat',
      icon: User,
      features: ['Adhésion individuelle', 'Cotisation personnelle', 'Droits de vote individuel'],
      available: true
    },
    {
      id: 'organization',
      title: 'Organisation',
      description: 'Je représente une organisation ou entreprise',
      icon: Building2,
      features: ['Adhésion collective', 'Cotisation organisationnelle', 'Représentation multiple'],
      available: false
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Type d'adhésion
        </h2>
        <p className="text-gray-600">
          Choisissez le type d'adhésion qui vous correspond
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {userTypes.map((type) => (
          <motion.div
            key={type.id}
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
              !type.available
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                : selectedType === type.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg cursor-pointer'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md cursor-pointer'
            }`}
            whileHover={type.available ? { scale: 1.02 } : {}}
            whileTap={type.available ? { scale: 0.98 } : {}}
            onClick={() => type.available && onSelect(type.id)}
          >
            {!type.available && (
              <div className="absolute top-4 right-4 px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                Bientôt disponible
              </div>
            )}
            {selectedType === type.id && type.available && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </motion.div>
            )}
            <div className="text-center mb-6">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                type.available ? 'bg-blue-100' : 'bg-gray-200'
              }`}>
                <type.icon className={`w-8 h-8 ${
                  type.available ? 'text-blue-600' : 'text-gray-400'
                }`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {type.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {type.description}
              </p>
            </div>
            <div className="space-y-2">
              {type.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className={`w-4 h-4 mr-2 ${
                    type.available ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
