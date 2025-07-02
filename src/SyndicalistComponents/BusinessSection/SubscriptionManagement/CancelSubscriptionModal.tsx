import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SubscriptionType } from './SubscriptionManagement';

interface CancelSubscriptionModalProps {
  subscription: SubscriptionType;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({ subscription, onClose, onConfirm }) => {
  const [reason, setReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(reason === 'other' ? otherReason : reason);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Annuler l'abonnement</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Pourquoi souhaitez-vous annuler ?</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={reason}
              onChange={e => setReason(e.target.value)}
              required
            >
              <option value="" disabled>Choisissez une raison</option>
              <option value="trop_cher">Trop cher</option>
              <option value="pas_util">Je n'utilise pas assez le service</option>
              <option value="problemes">Problèmes techniques</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          {reason === 'autre' && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Précisez</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={otherReason}
                onChange={e => setOtherReason(e.target.value)}
                required
              />
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-6">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Confirmer l'annulation
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CancelSubscriptionModal;
