import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Member, PaymentHistoryEntry } from "./MemberTypes";
import { X, CreditCard } from "lucide-react";

interface PaymentModalProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onSave: (payment: PaymentHistoryEntry) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ member, open, onClose, onSave }) => {
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (!member) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Montant invalide");
      return;
    }
    const payment: PaymentHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      amount: parsedAmount,
      status: "completed"
    };
    onSave(payment);
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center mb-6">
              <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-800">Enregistrer un paiement</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Montant (FCFA)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-200 focus:outline-none focus:ring-2 transition-colors"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Sauvegarder
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
