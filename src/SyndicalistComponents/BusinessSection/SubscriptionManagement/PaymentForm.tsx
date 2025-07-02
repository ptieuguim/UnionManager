import React, { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CreditCard as CardIcon, Lock } from 'lucide-react';
import { SubscriptionPlanType } from './SubscriptionManagement';

interface PaymentFormProps {
  plan: SubscriptionPlanType;
  onClose: () => void;
  onSubmit: (formData: PaymentFormData) => void;
}

export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  agreeTerms: boolean;
}

const initialFormData: PaymentFormData = {
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
  saveCard: true,
  agreeTerms: false,
};

interface PaymentFormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
  agreeTerms?: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ plan, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PaymentFormData>(initialFormData);
  const [errors, setErrors] = useState<PaymentFormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && 'checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name as keyof PaymentFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: PaymentFormErrors = {};
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Nom du titulaire requis';
    }
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Date invalide (MM/AA)';
    }
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV invalide';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vous devez accepter les conditions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, cardNumber: value }));
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
          <h2 className="text-xl font-bold text-gray-800">Paiement du plan {plan.name}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Lock className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-medium mb-2">Numéro de carte</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full pl-10 pr-4 py-3 border ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
            />
            <CardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            {errors.cardNumber && <div className="text-red-500 text-sm mt-1">{errors.cardNumber}</div>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Nom du titulaire</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              placeholder="Nom complet"
              className={`w-full px-4 py-3 border ${errors.cardName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
            />
            {errors.cardName && <div className="text-red-500 text-sm mt-1">{errors.cardName}</div>}
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">Date d'expiration</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/AA"
                maxLength={5}
                className={`w-full px-4 py-3 border ${errors.expiryDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
              />
              {errors.expiryDate && <div className="text-red-500 text-sm mt-1">{errors.expiryDate}</div>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-medium mb-2">CVV</label>
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength={4}
                className={`w-full px-4 py-3 border ${errors.cvv ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-2 transition-colors`}
              />
              {errors.cvv && <div className="text-red-500 text-sm mt-1">{errors.cvv}</div>}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-700">Enregistrer cette carte pour de futurs paiements</label>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="text-gray-700">J'accepte les conditions générales d'utilisation</label>
            {errors.agreeTerms && <div className="text-red-500 text-sm ml-4">{errors.agreeTerms}</div>}
          </div>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Payer {plan.price.toLocaleString()} FCFA
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PaymentForm;
