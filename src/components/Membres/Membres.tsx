"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, UserPlus, UserMinus, UserX, Search, Filter,
    Check, X, AlertTriangle, MoreHorizontal, Eye, Edit,
    Mail, Phone, MapPin, Calendar, Building, Shield,
    ChevronRight, Star, Award, TrendingUp, UserCheck
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface StatCardProps {
  icon: React.ElementType;
  value: number | string;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${color}`}
  >
    <div className="flex items-center">
      <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div className="ml-4">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </div>
    </div>
  </motion.div>
);

interface TabButtonProps {
  active: boolean;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ active, icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center px-6 py-3 rounded-xl transition-all duration-300 ${
      active
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
        : "bg-white text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon className={`w-5 h-5 mr-2 ${active ? "text-white" : "text-blue-500"}`} />
    <span className="font-medium">{label}</span>
    {active && (
      <motion.div
        className="ml-2 bg-white rounded-full w-2 h-2"
        layoutId="activeTab"
      />
    )}
  </motion.button>
);

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: string;
  role: string;
  contributions: string;
  avatar?: string;
}

interface MembershipRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  requestDate: string;
  motivation: string;
}

export const MemberManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'members' | 'requests'>('members');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const { t } = useTranslation();

  const members: Member[] = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', phone: '0123456789', address: '123 Rue de Paris', joinDate: '2021-05-15', status: 'active', role: 'Membre Senior', contributions: '12/12' },
    { id: 2, name: 'Marie Curie', email: 'marie@example.com', phone: '0987654321', address: '456 Avenue des Sciences', joinDate: '2020-11-23', status: 'active', role: 'Membre du Bureau', contributions: '12/12' },
    { id: 3, name: 'Pierre Martin', email: 'pierre@example.com', phone: '0654321987', address: '789 Boulevard du Progrès', joinDate: '2022-02-01', status: 'suspended', role: 'Membre', contributions: '8/12' },
  ];

  const membershipRequests: MembershipRequest[] = [
    { id: 1, name: 'Sophie Lefebvre', email: 'sophie@example.com', phone: '0612345678', requestDate: '2023-06-01', motivation: 'Je souhaite rejoindre le syndicat pour contribuer activement à la défense des droits des travailleurs.' },
    { id: 2, name: 'Lucas Dubois', email: 'lucas@example.com', phone: '0698765432', requestDate: '2023-06-02', motivation: 'Fort de mon expérience dans le domaine, je pense pouvoir apporter une perspective utile au syndicat.' },
  ];

  const handleAction = (action: string, member: Member) => {
    setSelectedAction(action);
    setSelectedMember(member);
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    console.log(`Confirmed ${selectedAction} for member:`, selectedMember);
    setShowConfirmModal(false);
  };

  const renderMembers = () => {
    const filteredMembers = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || member.status === filterStatus)
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            value={members.length}
            label={t("membres_actifs")}
            color="border-blue-500"
          />
          <StatCard
            icon={UserCheck}
            value="95%"
            label={t("taux_de_participation")}
            color="border-green-500"
          />
          <StatCard
            icon={Award}
            value="12"
            label="Membres du bureau"
            color="border-purple-500"
          />
          <StatCard
            icon={TrendingUp}
            value="+15%"
            label="Croissance mensuelle"
            color="border-orange-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Membre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredMembers.map(member => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                              {member.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                              Depuis {member.joinDate}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center mb-1">
                          <Mail className="w-4 h-4 mr-2 text-blue-500" />
                          {member.email}
                        </div>
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          {member.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-purple-500" />
                          <span className="text-sm text-gray-900">{member.role}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {t("cotisations")} : {member.contributions}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'active' ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                          >
                            <Eye className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors duration-200"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors duration-200"
                            onClick={() => handleAction('suspend', member)}
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
                            onClick={() => handleAction('remove', member)}
                          >
                            <UserX className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMembershipRequests = () => (
    <div className="space-y-6">
      <AnimatePresence>
        {membershipRequests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                    {request.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{request.name}</h3>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        {request.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        Demande soumise le {request.requestDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Check className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              {/*<div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Motivation :</h4>
                <p className="text-gray-600">{request.motivation}</p>
              </div>*/}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      {/* ...UI d'origine, tabs, stats, etc. ... */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'members' ? renderMembers() : renderMembershipRequests()}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-800">{t("confirmer_action")}</h2>
                  <p className="text-gray-600">{t("action_non_annulable")}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-8">
                {t("etes_vous_sur_de")}
                <span className="font-semibold">{selectedMember?.name}</span> ?
              </p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setShowConfirmModal(false)}
                >
                  {t("annuler")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={confirmAction}
                >
                  {t("confirmer")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberManagement;
