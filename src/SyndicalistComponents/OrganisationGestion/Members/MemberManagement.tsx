// src/components/members/MemberManagement.tsx

"use client"; // INDISPENSABLE : Ce composant est interactif et utilise des hooks.

import React, { useState, useMemo, useEffect, JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image"; // OPTIMISATION : Utilisation du composant Image de Next.js
import {
  Eye, Edit, Trash2, UserPlus, UserX, Search,Calendar, Mail, Phone, Lock, CheckCircle, AlertTriangle, Clock, ChevronDown, X, CreditCard, Settings, DollarSign, Upload, FileText
} from "lucide-react";

// Assurez-vous que ces imports pointent vers les bons fichiers
import MemberDetailsModal from "./MemberDetailsModal";
import PaymentModal from "./PaymentModal";
import EditMemberModal from "./EditMemberModal";
import { Member, MembershipRequest, PaymentHistoryEntry } from "./MemberTypes";



//  Données pour les DEMANDES D'ADHÉSION
const dummyRequestsData: MembershipRequest[] = [
    {
        id: 1, name: "Jean Dupont", email: "jean.dupont@example.com",
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        motivation: "Je souhaite rejoindre le syndicat pour défendre mes droits et contribuer à l'amélioration des conditions de travail.",
        idCardFront: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
        idCardBack: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
        phone: "+237 698 123 456", 
        profession: "Chauffeur de taxi",
        dateSubmitted: "2023-05-15",
    },
    {
        id: 2, name: "Sophie Martin", 
        email: "sophie.martin@example.com",
        profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        motivation: "Passionnée par l'action syndicale, je souhaite mettre mes compétences au service de notre communauté.",
        idCardFront: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
        idCardBack: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
        phone: "+237 699 234 567", 
        profession: "Juriste", 
        dateSubmitted: "2023-05-18",
    },
    {
    id: 3,
    name: "Lucas Petit",
    email: "lucas.petit@example.com",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    motivation: "Je veux contribuer à l'amélioration des conditions de travail et participer activement aux négociations collectives pour notre secteur.",
    idCardFront: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    idCardBack: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    phone: "+237 697 345 678",
    profession: "Conducteur de bus",
    dateSubmitted: "2023-05-20",
},
{
    id: 4,
    name: "Emma Leroy",
    email: "emma.leroy@example.com",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    motivation: "Engagée pour la justice sociale et l'équité au travail, je souhaite rejoindre votre syndicat pour faire entendre la voix des travailleurs.",
    idCardFront: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    idCardBack: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    phone: "+237 696 456 789",
    profession: "Assistante administrative",
    dateSubmitted: "2023-05-22",
},
{
    id: 5,
    name: "Thomas Roux",
    email: "thomas.roux@example.com",
    profilePic: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    motivation: "Je souhaite participer activement à la vie syndicale et apporter mon expertise technique pour améliorer nos conditions de travail.",
    idCardFront: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    idCardBack: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop",
    phone: "+237 695 567 890",
    profession: "Mécanicien",
    dateSubmitted: "2023-05-25",
}
];

//  Données pour les MEMBRES EXISTANTS (avec le bon type `Member[]`)
const dummyMembersData: Member[] = [
    {
        id: 1, name: "Marie Martin", 
        email: "marie.martin@example.com",
        phone: "+237 698 765 432",
        profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
        status: "active", 
        joinDate: "2023-01-15",
        role: "Membre", 
        profession: "Chauffeur de taxi",
        paymentStatus: "paid",
        lastPayment: "2023-05-10",
        paymentHistory: [{ date: "2023-05-10", amount: 15000, status: "completed" }],
        totalPaid: 45000, 
        dueAmount: 0,
        nextPaymentDate: "2023-06-10"
    },
    {
        id: 2, name: "Pierre Durand", 
        email: "pierre.durand@example.com", 
        phone: "+237 699 876 543",
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        status: "blocked", 
        joinDate: "2023-02-20", 
        role: "Membre", 
        profession: "Conducteur de bus",
        paymentStatus: "unpaid", 
        lastPayment: "2023-03-15",
        paymentHistory: [{ date: "2023-03-15", amount: 15000, status: "completed" }],
        totalPaid: 30000, 
        dueAmount: 30000, 
        nextPaymentDate: "2023-04-15"
    },
    
];


// --- SECTION DES FONCTIONS UTILITAIRES (Helpers) ---

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0 }).format(amount);
}

function getPaymentStatusBadge(status: Member["paymentStatus"]): JSX.Element {
  switch (status) {
    case 'paid': return <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Payé</span>;
    case 'partial': return <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Partiel</span>;
    case 'unpaid': return <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Non payé</span>;
    default: return <></>;
  }
}

function getMemberStatusBadge(status: Member["status"]): JSX.Element {
  switch (status) {
    case 'active': return <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Actif</span>;
    case 'blocked': return <span className="px-3 py-1 inline-flex items-center rounded-full text-xs font-medium bg-red-100 text-red-800"><Lock className="w-3 h-3 mr-1" />Bloqué</span>;
    default: return <></>;
  }
}

// --- SOUS-COMPOSANT StatCard ---
const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; bgColor: string; textColor: string; borderColor: string; }> = ({ icon: Icon, title, value, bgColor, textColor, borderColor }) => (
  <motion.div whileHover={{ scale: 1.03 }} className={`${bgColor} ${borderColor} rounded-xl shadow-md p-6 border-l-4`}>
    <div className="flex items-center mb-2">
      <div className={`p-3 rounded-full ${bgColor} ${textColor}`}><Icon className="h-6 w-6" /></div>
    </div>
    <h3 className="text-gray-700 font-medium">{title}</h3>
    <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
  </motion.div>
);


// --- COMPOSANT PRINCIPAL ---
const MemberManagement: React.FC = () => {
  const { t } = useTranslation();

  // --- États (Hooks) ---
  const [members, setMembers] = useState<Member[]>(dummyMembersData);
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>(dummyRequestsData);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [paymentMember, setPaymentMember] = useState<Member | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [showAllRequests, setShowAllRequests] = useState(false);

  // --- Fonctions de Logique Métier (Handlers) ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const membershipRequestToMember = (request: MembershipRequest): Member => ({
    id: Date.now(), name: request.name, email: request.email, phone: request.phone,
    profilePic: request.profilePic, status: "active", joinDate: new Date().toISOString().split('T')[0],
    role: "Membre", profession: request.profession, paymentStatus: "unpaid", lastPayment: null,
    paymentHistory: [], totalPaid: 0, dueAmount: 15000,
    nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const handleAcceptRequest = (id: number) => {
    const request = membershipRequests.find(req => req.id === id);
    if (request) {
      const newMember = membershipRequestToMember(request);
      setMembers(prev => [newMember, ...prev]);
      setMembershipRequests(prev => prev.filter(req => req.id !== id));
      showToast(`La demande de ${newMember.name} a été acceptée.`);
    }
  };

  const handleRejectRequest = (id: number) => {
    setMembershipRequests(prev => prev.filter(req => req.id !== id));
    showToast("La demande a été refusée.");
  };

  const handleToggleBlock = (member: Member) => {
    setMembers(prev => prev.map(m => m.id === member.id ? { ...m, status: m.status === "blocked" ? "active" : "blocked" } : m));
    showToast(member.status === "blocked" ? `Le membre "${member.name}" a été débloqué.` : `Le membre "${member.name}" a été bloqué.`);
  };

  const handleDeleteMember = (member: Member) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le membre "${member.name}" ? Cette action est irréversible.`)) {
      setMembers(prev => prev.filter(m => m.id !== member.id));
      showToast(`Le membre "${member.name}" a été supprimé.`);
    }
  };

  const handleRecordPayment = (member: Member, payment: PaymentHistoryEntry) => {
    setMembers(prev => prev.map(m =>
      m.id === member.id ? {
        ...m,
        paymentHistory: [payment, ...m.paymentHistory],
        totalPaid: m.totalPaid + payment.amount,
        dueAmount: Math.max(0, m.dueAmount - payment.amount),
        paymentStatus: Math.max(0, m.dueAmount - payment.amount) === 0 ? "paid" : "partial",
        lastPayment: payment.date
      } : m
    ));
  };
  
  // --- Données Dérivées (avec useMemo pour la performance) ---
  const filteredMembers = useMemo(() => members.filter(member => {
    const lowerSearch = searchTerm.toLowerCase();
    return (member.name.toLowerCase().includes(lowerSearch) || member.email.toLowerCase().includes(lowerSearch) || member.phone.includes(lowerSearch)) &&
           (statusFilter === "all" || member.status === statusFilter) &&
           (paymentFilter === "all" || member.paymentStatus === paymentFilter);
  }), [members, searchTerm, statusFilter, paymentFilter]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const paginatedMembers = useMemo(() => showAllMembers ? filteredMembers : filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize), [filteredMembers, showAllMembers, currentPage]);
  
  const requestsPerPage = 3;
  const displayedRequests = useMemo(() => showAllRequests ? membershipRequests : membershipRequests.slice(0, requestsPerPage), [membershipRequests, showAllRequests]);

  // --- Rendu JSX ---
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold flex items-center text-gray-800"><UserX className="w-8 h-8 mr-3 text-blue-600" />Gestion des membres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
            icon={UserX}
            title="Membres actifs"
            value={members.filter(m => m.status === 'active').length}
            bgColor="bg-blue-50" textColor="text-blue-600" borderColor="border-blue-500"
        />
        <StatCard
            icon={CheckCircle}
            title="Cotisations à jour"
            value={members.filter(m => m.paymentStatus === 'paid').length}
            bgColor="bg-green-50" textColor="text-green-600" borderColor="border-green-500"
        />
        <StatCard
            icon={Clock}
            title="Paiements partiels"
            value={members.filter(m => m.paymentStatus === 'partial').length}
            bgColor="bg-yellow-50" textColor="text-yellow-600" borderColor="border-yellow-500"
        />
        <StatCard
            icon={AlertTriangle}
            title="Paiements en retard"
            value={members.filter(m => m.paymentStatus === 'unpaid').length}
            bgColor="bg-red-50" textColor="text-red-600" borderColor="border-red-500"
        />
      </div>

         <div className="p-4 bg-white rounded-xl shadow-sm border space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div className="relative w-full md:w-auto">
            <input type="text" placeholder="Rechercher un membre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition" />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500">
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="blocked">Bloqué</option>
            </select>
            <select value={paymentFilter} onChange={e => setPaymentFilter(e.target.value)} className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500">
                <option value="all">Tous les paiements</option>
                <option value="paid">Payé</option>
                <option value="partial">Partiel</option>
                <option value="unpaid">Non payé</option>
            </select>
            <button onClick={() => setShowAllMembers(!showAllMembers)} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                {showAllMembers ? "Afficher par page" : "Tout afficher"}
            </button>
        </div>
      </div>

      {/* Tableau des membres */}
      <div className="overflow-x-auto rounded-xl shadow border">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-50"><tr className="text-left text-sm font-semibold text-gray-600">
            <th className="p-4">Membre</th><th className="p-4">Statut</th><th className="p-4">Paiement</th><th className="p-4">Actions</th>
          </tr></thead>
          <tbody>
            {paginatedMembers.length > 0 ? paginatedMembers.map(member => (
              <tr key={member.id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
                    <Image src={member.profilePic} alt={member.name} width={44} height={44} className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.email}</div>
                  </div>
                </td>
                <td className="p-4">{getMemberStatusBadge(member.status)}</td>
                <td className="p-4">{getPaymentStatusBadge(member.paymentStatus)}</td>
                <td className="p-4 flex items-center space-x-1">
                  <button onClick={() => { setSelectedMember(member); setShowMemberDetails(true); }} className="p-2 rounded-full hover:bg-blue-100 text-blue-600" title="Détails"><Eye size={18} /></button>
                  <button onClick={() => { setPaymentMember(member); setShowPaymentModal(true); }} className="p-2 rounded-full hover:bg-green-100 text-green-600" title="Enregistrer un paiement"><CreditCard size={18} /></button>
                  <button onClick={() => { setEditMember(member); setShowEditModal(true); }} className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600" title="Modifier"><Edit size={18} /></button>
                </td>
              </tr>
            )) : <tr><td colSpan={4} className="text-center p-8 text-gray-500">Aucun membre trouvé.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ... Pagination ... */}
          {/* Pagination */}
      {!showAllMembers && (
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span className="font-semibold">Page {currentPage} / {totalPages}</span>
          <button
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
      
      {/* Section des demandes d'adhésion */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-700">Demandes en attente ({membershipRequests.length})</h2>
        {displayedRequests.length > 0 ? displayedRequests.map(req => (
          <motion.div key={req.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white shadow rounded-xl p-5 border flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border">
                <Image src={req.profilePic} alt={req.name} width={48} height={48} className="object-cover" />
              </div>
              <div>
                <div className="font-semibold text-lg">{req.name}</div>
                <div className="text-sm text-gray-500">{new Date(req.dateSubmitted).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button onClick={() => handleAcceptRequest(req.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">Accepter</button>
              <button onClick={() => handleRejectRequest(req.id)} className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Refuser</button>
            </div>
          </motion.div>
        )) : <div className="text-center p-8 bg-white rounded-xl border text-gray-500">Aucune nouvelle demande d'adhésion.</div>}
      </div>

      {/* Modaux */}
      <AnimatePresence>
        {showMemberDetails && selectedMember && <MemberDetailsModal member={selectedMember} open={showMemberDetails} onClose={() => setShowMemberDetails(false)} onEdit={m => { setEditMember(m); setShowEditModal(true); }} />}
        {showPaymentModal && paymentMember && <PaymentModal member={paymentMember} open={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSave={payment => { if (paymentMember) handleRecordPayment(paymentMember, payment); }} />}
        {showEditModal && editMember && <EditMemberModal member={editMember} open={showEditModal} onClose={() => setShowEditModal(false)} onSave={updated => { setMembers(prev => prev.map(m => m.id === updated.id ? updated : m)); setShowEditModal(false); showToast(`Le membre "${updated.name}" a été modifié.`); }} />}
      </AnimatePresence>
    </div>
  );
};

export default MemberManagement;