import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DollarSign, PieChart, FileText, Download, Upload,
    Plus, Search, Filter, ChevronDown, Eye, EyeOff,
    Users, CreditCard, Mail, Calendar, CheckCircle, XCircle
} from 'lucide-react'

const FinanceManagement = () => {
    const [activeTab, setActiveTab] = useState('overview')
    const [showBalance, setShowBalance] = useState(false)
    const [filterMonth, setFilterMonth] = useState('')
    const [filterMember, setFilterMember] = useState('')
    const [showPaymentForm, setShowPaymentForm] = useState(false)

    const tabs = [
        { id: 'overview', label: 'Aperçu', icon: PieChart },
        { id: 'cotisations', label: t("cotisations"), icon: Users },
        { id: 'expenses', label: {t("depenses")}, icon: DollarSign },
        { id: 'reports', label: {t("rapports")}, icon: FileText },
    ]

    const financialData = {
        balance: 150000,
        cotisations: 45000,
        expenses: 30000,
    }

    const members = [
        { id: 1, name: 'Jean Dupont', status: 'paid', amount: 100 },
        { id: 2, name: 'Marie Curie', status: 'unpaid', amount: 0 },
        { id: 3, name: 'Pierre Martin', status: 'paid', amount: 100 },
        { id: 4, name: 'Sophie Lefebvre', status: 'partial', amount: 50 },
        { id: 5, name: 'Luc Besson', status: 'unpaid', amount: 0 },
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">{t("solde_actuel")}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl font-bold">
                                    {showBalance
                                        ? `${financialData.balance.toLocaleString()} €`
                                        : '••••••• €'
                                    }
                                </span>
                                <button
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    {showBalance ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">Cotisations vs Dépenses</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-green-600">{t("cotisations")}</p>
                                    <p className="text-2xl font-semibold">{financialData.cotisations.toLocaleString()} €</p>
                                </div>
                                <div>
                                    <p className="text-red-600">{t("depenses")}</p>
                                    <p className="text-2xl font-semibold">{financialData.expenses.toLocaleString()} €</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            case 'cotisations':
                return (
                    <div>
                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex space-x-4">
                                <div className="relative">
                                    <select
                                        value={filterMonth}
                                        onChange={(e) => setFilterMonth(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tous les mois</option>
                                        <option value="01">Janvier</option>
                                        <option value="02">Février</option>
                                        {/* Add other months */}
                                    </select>
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterMember}
                                        onChange={(e) => setFilterMember(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Tous les membres</option>
                                        {members.map(member => (
                                            <option key={member.id} value={member.id}>{member.name}</option>
                                        ))}
                                    </select>
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPaymentForm(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Enregistrer un paiement
                            </motion.button>
                        </div>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant payé</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {members.map(member => (
                                    <tr key={member.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    member.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        member.status === 'unpaid' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {member.status === 'paid' ? 'Payé' :
                                                        member.status === 'unpaid' ? 'Non payé' : 'Partiel'}
                                                </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{member.amount} €</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-4">{t("details")}</button>
                                            {member.status !== 'paid' && (
                                                <button className="text-green-600 hover:text-green-900 mr-4">Enregistrer un paiement</button>
                                            )}
                                            {member.status === 'unpaid' && (
                                                <button className="text-red-600 hover:text-red-900">Envoyer un rappel</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            case 'expenses':
                return <div>Contenu des dépenses</div>
            case 'reports':
                return <div>Contenu des rapports</div>
            default:
                return <div>Sélectionnez un onglet</div>
        }
    }

    const PaymentForm = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Enregistrer un paiement</h3>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="member">
                            Membre
                        </label>
                        <select
                            id="member"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {members.map(member => (
                                <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="amount">
                            Montant
                        </label>
                        <input
                            type="number"
                            id="amount"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="paymentMethod">
                            Méthode de paiement
                        </label>
                        <select
                            id="paymentMethod"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="cash">Espèces</option>
                            <option value="transfer">Virement</option>
                            <option value="mobileMoney">Mobile Money</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setShowPaymentForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {t("annuler")}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestion des Finances</h1>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex space-x-4">
                            {tabs.map(tab => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <tab.icon className="mr-2 h-5 w-5" />
                                    {tab.label}
                                </motion.button>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center"
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                {t("importer")}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                            >
                                <Download className="mr-2 h-5 w-5" />
                                {t("exporter")}
                            </motion.button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderTabContent()}

                        </motion.div>
                    </AnimatePresence>
                </div>

                {activeTab === 'cotisations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold mb-2">Générer un rapport de cotisations</h3>
                            <p className="text-gray-600 mb-4">Créez un rapport détaillé des cotisations par membre ou par période</p>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center">
                                <FileText className="mr-2 h-5 w-5" />
                                Générer un rapport
                            </button>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
                        >
                            <h3 className="text-lg font-semibold mb-2">Envoyer des rappels</h3>
                            <p className="text-gray-600 mb-4">Envoyez des rappels automatiques pour les cotisations en retard</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center">
                                <Mail className="mr-2 h-5 w-5" />
                                Envoyer des rappels
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
            {showPaymentForm && <PaymentForm />}
        </div>
    )
}

export default FinanceManagement