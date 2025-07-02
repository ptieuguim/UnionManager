import React, { useState } from "react";
import { Member } from "./MemberTypes";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Briefcase, Calendar, DollarSign, FileText } from "lucide-react";

interface EditMemberModalProps {
  member: Member | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Member) => void;
}

const EditMemberModal: React.FC<EditMemberModalProps> = ({ member, open, onClose, onSave }) => {
  const [form, setForm] = useState<Member | null>(member);
  const [error, setError] = useState<string>("");

  React.useEffect(() => {
    setForm(member);
    setError("");
  }, [member, open]);

  if (!member || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => f ? { ...f, [name]: value } : f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    onSave(form);
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
            className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 relative"
            onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" /> Éditer le membre
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Téléphone *</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={form.profession}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Rôle</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center"><DollarSign className="w-4 h-4 mr-1" /> Statut de paiement</label>
                <select
                  name="paymentStatus"
                  value={form.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                >
                  <option value="paid">Payé</option>
                  <option value="partial">Partiel</option>
                  <option value="unpaid">Non payé</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center"><FileText className="w-4 h-4 mr-1" /> Commentaire</label>
                <textarea
                  name="comment"
                  value={form.comment || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 min-h-[60px]"
                  placeholder="Ajouter un commentaire..."
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
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

export default EditMemberModal;
