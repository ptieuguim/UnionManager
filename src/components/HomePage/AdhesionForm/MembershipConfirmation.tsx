// MembershipConfirmation.tsx - Composant de confirmation avec ID généré
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Download } from "lucide-react";

interface ConfirmationProps {
  membershipId: string;
  antenne: { nom: string };
  onComplete: () => void;
}

export const Confirmation = ({ membershipId, antenne, onComplete }: ConfirmationProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(membershipId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="w-12 h-12 text-green-600" />
      </motion.div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Demande envoyée avec succès !
        </h2>
        <p className="text-gray-600 text-lg">
          Votre demande d'adhésion à l'antenne <strong>{antenne.nom}</strong> a été transmise.
        </p>
      </div>
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Votre numéro de référence
        </h3>
        <div className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 border border-blue-200">
          <code className="text-xl font-mono font-bold text-blue-600">
            {membershipId}
          </code>
          <motion.button
            onClick={copyToClipboard}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
        {copied && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 text-sm mt-2"
          >
            ✓ Numéro copié dans le presse-papiers
          </motion.p>
        )}
      </div>
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-left">
        <h4 className="font-semibold text-gray-900 mb-3">Prochaines étapes :</h4>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
            <span>Votre demande sera examinée par le responsable de l'antenne dans les 48h</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
            <span>Vous recevrez un email de confirmation à l'adresse fournie</span>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
            <span>En cas d'acceptation, vos identifiants de connexion vous seront communiqués</span>
          </li>
        </ul>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-gray-500">
          Conservez précieusement votre numéro de référence pour suivre l'état de votre demande
        </p>
        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={() => window.print()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Download className="w-4 h-4 mr-2" />
            Imprimer
          </motion.button>
          <motion.button
            onClick={onComplete}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Retour à l'accueil
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
