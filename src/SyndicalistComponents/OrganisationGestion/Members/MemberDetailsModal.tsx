import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Member, MembershipRequest } from "./MemberTypes";
import { X, Edit, Mail, Phone, Calendar, FileText, Lock, CheckCircle, FolderOpen } from "lucide-react";

type MemberOrRequest = Member | MembershipRequest;

interface MemberDetailsModalProps {
  member: MemberOrRequest | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (member: Member) => void;
} 

const TABS = ["Infos", "Paiements", "Documents"] as const;
type Tab = typeof TABS[number];

const isMember = (item: MemberOrRequest): item is Member => {
  return (item as Member).status !== undefined;
};

const isRequest = (item: MemberOrRequest): item is MembershipRequest => {
  return (item as MembershipRequest).motivation !== undefined;
};

const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({ member, open, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState<Tab>("Infos");
  if (!member) return null;

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
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
            {/* En-tête membre */}
            <div className="flex items-center mb-6">
              <img
  src={member.profilePic || (isMember(member) && member.avatar) || "/default-avatar.png"}
  alt={member.name}
  className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover mr-6"
/>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h2>
                <div className="flex items-center space-x-2 mb-2">
                  {isMember(member) && (
  <>
    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
      <Calendar className="w-3 h-3 mr-1" />
      {member.joinDate}
    </span>
    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
      <CheckCircle className="w-3 h-3 mr-1" />
      {member.status === "active" ? "Actif" : member.status === "blocked" ? "Bloqué" : "En attente"}
    </span>
  </>
)}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Mail className="w-4 h-4 mr-1" /> {member.email}
                </div>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Phone className="w-4 h-4 mr-1" /> {member.phone}
                </div>
              </div>
            </div>
            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 mb-6">
  {onEdit && isMember(member) && (
    <button
      className="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors"
      onClick={() => onEdit(member)}
    >
      <Edit className="inline w-4 h-4 mr-1" /> Modifier
    </button>
  )}
</div>
            {/* Onglets */}
            <div className="flex space-x-3 border-b mb-6">
              {TABS.map(tab => (
                <button
                  key={tab}
                  className={`pb-2 px-4 font-semibold border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-700"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Contenu de l’onglet actif */}
            {activeTab === "Infos" && (
  <div>
    <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
    <ul className="text-gray-700 space-y-1">
      <li><span className="font-medium">Nom :</span> {member.name}</li>
      <li><span className="font-medium">Email :</span> {member.email}</li>
      <li><span className="font-medium">Téléphone :</span> {member.phone}</li>
      <li><span className="font-medium">Profession :</span> {member.profession}</li>
      {isMember(member) && <li><span className="font-medium">Rôle :</span> {member.role}</li>}
      {isMember(member) && <li><span className="font-medium">Statut :</span> {member.status === "active" ? "Actif" : member.status === "blocked" ? "Bloqué" : "En attente"}</li>}
      {isMember(member) && <li><span className="font-medium">Date d’adhésion :</span> {member.joinDate}</li>}
      {isRequest(member) && <li><span className="font-medium">Date de soumission :</span> {member.dateSubmitted}</li>}
    </ul>
    {isRequest(member) && member.motivation && (
      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <div className="font-semibold mb-1 flex items-center"><FileText className="w-4 h-4 mr-1" />Motivation</div>
        <div className="text-gray-700">{member.motivation}</div>
      </div>
    )}
  </div>
)}
            {activeTab === "Paiements" && isMember(member) && (
  <div>
    <h3 className="text-lg font-semibold mb-2">Historique des paiements</h3>
    <ul className="divide-y divide-gray-200">
      {member.paymentHistory && member.paymentHistory.length > 0 ? (
        member.paymentHistory.map((payment, idx) => (
          <li key={idx} className="py-2 flex items-center justify-between">
            <span>{payment.date}</span>
            <span className="font-mono">{payment.amount} FCFA</span>
            <span className={
              payment.status === "completed"
                ? "text-green-600"
                : payment.status === "pending"
                ? "text-yellow-600"
                : "text-red-600"
            }>
              {payment.status === "completed"
                ? "Payé"
                : payment.status === "pending"
                ? "En attente"
                : "Échoué"}
            </span>
          </li>
        ))
      ) : (
        <li className="py-2 text-gray-500">Aucun paiement enregistré.</li>
      )}
    </ul>
  </div>
)}
            {activeTab === "Documents" && (
  <div>
    <h3 className="text-lg font-semibold mb-2 flex items-center"><FolderOpen className="w-5 h-5 mr-2" />Documents</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isRequest(member) && member.idCardFront && (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
          <div className="font-medium mb-2">Carte d’identité (recto)</div>
          <img
            src={member.idCardFront}
            alt="Carte d’identité recto"
            className="w-48 h-32 object-cover rounded border"
          />
        </div>
      )}
      {isRequest(member) && member.idCardBack && (
        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center">
          <div className="font-medium mb-2">Carte d’identité (verso)</div>
          <img
            src={member.idCardBack}
            alt="Carte d’identité verso"
            className="w-48 h-32 object-cover rounded border"
          />
        </div>
      )}
      {/* Ajouter ici d’autres documents si besoin */}
    </div>
    {isRequest(member) && !(member.idCardFront || member.idCardBack) && (
      <div className="text-gray-500">Aucun document disponible.</div>
    )}
    {isMember(member) && (
      <div className="text-gray-500">Aucun document disponible.</div>
    )}
  </div>
)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberDetailsModal;
