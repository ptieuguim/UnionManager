import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Check, X, ChevronDown, ChevronUp, Download, Calendar,
  Clock, AlertTriangle, CheckCircle, FileText, User, Mail, Phone,
  Shield, Zap, Award, Star, Gift, Lock, CreditCard as CardIcon,
  DollarSign, ArrowRight, Bell, Settings, HelpCircle, RefreshCw,
  Printer, ExternalLink, Edit, Trash2, Plus, Info, MapPin
} from 'lucide-react';
import PaymentForm, { PaymentFormData } from './PaymentForm';
import CancelSubscriptionModal from './CancelSubscriptionModal';

// Types
export interface SubscriptionPlanType {
  id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  features: string[];
  limitations?: string[];
  highlight?: boolean;
  popular?: boolean;
  icon?: React.ReactNode;
}

export interface SubscriptionType {
  id: string;
  plan: SubscriptionPlanType;
  status: 'active' | 'pending' | 'cancelled' | string;
  startDate: string;
  nextBillingDate: string;
  endDate?: string;
  billingCycle?: string;
  paymentMethod?: string;
  cardInfo?: { brand: string; last4: string };
  discount?: number;
  autoRenew?: boolean;
  invoices?: { number: string; date: string; amount: number }[];
  history?: { type: string; title: string; date: string; description: string }[];
  billingInfo?: { name?: string; email?: string; phone?: string; address?: string };
}

// SubscriptionPlan component
const SubscriptionPlan: React.FC<{
  plan: SubscriptionPlanType;
  currentPlan?: SubscriptionPlanType;
  onSelect: (plan: SubscriptionPlanType) => void;
  onUpgrade: (plan: SubscriptionPlanType) => void;
}> = ({ plan, currentPlan, onSelect, onUpgrade }) => {
  const isActive = currentPlan && currentPlan.id === plan.id;
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${isActive ? 'border-blue-500' : 'border-transparent'}`}
    >
      {plan.popular && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 font-medium">
          Le plus populaire
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
            <p className="text-gray-600">{plan.description}</p>
          </div>
          {plan.icon}
        </div>
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-800">{plan.price.toLocaleString()}</span>
            <span className="text-gray-600 ml-1">FCFA/mois</span>
          </div>
          {plan.discount && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Économisez {plan.discount}% avec un abonnement annuel
            </div>
          )}
        </div>
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
          {plan.limitations && plan.limitations.map((limitation, index) => (
            <div key={`limit-${index}`} className="flex items-start">
              <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{limitation}</span>
            </div>
          ))}
        </div>
        {isActive ? (
          <div className="flex flex-col space-y-3">
            <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-center font-medium">
              Votre plan actuel
            </div>
            <button
              onClick={() => onSelect(plan)}
              className="py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Gérer l'abonnement
            </button>
          </div>
        ) : (
          <button
            onClick={() => onUpgrade(plan)}
            className={`w-full py-3 rounded-lg font-medium ${plan.highlight ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-all duration-200`}
          >
            {currentPlan ? 'Changer de plan' : 'Choisir ce plan'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

// SubscriptionDetails component
const SubscriptionDetails: React.FC<{
  subscription: SubscriptionType;
  onClose: () => void;
  onCancel: (subscription: SubscriptionType) => void;
  onRenew: (subscription: SubscriptionType) => void;
  onUpgrade: (plan: SubscriptionPlanType) => void;
}> = ({ subscription, onClose, onCancel, onRenew, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'billing' | 'history'>('details');
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* ...details UI, tabs, etc... */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('details')}
          >
            Détails
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'billing' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('billing')}
          >
            Facturation
          </button>
          <button
            className={`py-2 px-4 rounded-lg font-medium ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setActiveTab('history')}
          >
            Historique
          </button>
        </div>
        {/* Tab contents */}
{activeTab === 'details' && (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations générales</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Statut</span>
            <span className={`font-medium ${
              subscription.status === 'active' ? 'text-green-600' :
              subscription.status === 'pending' ? 'text-yellow-600' :
              subscription.status === 'cancelled' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {subscription.status === 'active' ? 'Actif' :
                subscription.status === 'pending' ? 'En attente' :
                subscription.status === 'cancelled' ? 'Annulé' :
                subscription.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date de début</span>
            <span className="font-medium text-gray-800">{formatDate(subscription.startDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Prochaine facturation</span>
            <span className="font-medium text-gray-800">{formatDate(subscription.nextBillingDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Période de facturation</span>
            <span className="font-medium text-gray-800">{subscription.billingCycle}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Informations de paiement</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Méthode de paiement</span>
            <span className="font-medium text-gray-800">{subscription.paymentMethod}</span>
          </div>
          {subscription.cardInfo && (
            <div className="flex justify-between">
              <span className="text-gray-600">Carte</span>
              <span className="font-medium text-gray-800">•••• •••• •••• {subscription.cardInfo.last4}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Montant mensuel</span>
            <span className="font-medium text-gray-800">{subscription.plan.price.toLocaleString()} FCFA</span>
          </div>
          {subscription.discount && (
            <div className="flex justify-between">
              <span className="text-gray-600">Réduction</span>
              <span className="font-medium text-green-600">-{subscription.discount}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Fonctionnalités incluses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subscription.plan.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600">{feature}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onUpgrade(subscription.plan)}
        className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center justify-center"
      >
        <Zap className="w-5 h-5 mr-2" />
        Mettre à niveau
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onRenew(subscription)}
        className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Renouveler
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onCancel(subscription)}
        className="flex-1 py-3 px-6 border-2 border-red-500 text-red-500 rounded-xl font-semibold hover:bg-red-50 flex items-center justify-center"
      >
        <X className="w-5 h-5 mr-2" />
        Annuler
      </motion.button>
    </div>
  </div>
)}
{activeTab === 'billing' && (
  <div className="space-y-6">
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Méthode de paiement</h3>
      <div className="flex items-center p-3 border border-gray-200 rounded-lg bg-white">
        <div className="p-2 bg-blue-100 rounded-lg mr-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-grow">
          <div className="font-medium text-gray-800">
            {subscription.cardInfo ? `Carte ${subscription.cardInfo.brand}` : 'Carte bancaire'}
          </div>
          <div className="text-sm text-gray-500">
            {subscription.cardInfo ? `•••• •••• •••• ${subscription.cardInfo.last4}` : '•••• •••• •••• 1234'}
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-800 p-2">
          <Edit className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          + Ajouter une nouvelle méthode de paiement
        </button>
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Adresse de facturation</h3>
      <div className="space-y-2">
        <div className="flex items-start">
          <User className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
          <div className="text-gray-700">{subscription.billingInfo?.name || 'Jean Dupont'}</div>
        </div>
        <div className="flex items-start">
          <Mail className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
          <div className="text-gray-700">{subscription.billingInfo?.email || 'jean.dupont@example.com'}</div>
        </div>
        <div className="flex items-start">
          <Phone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
          <div className="text-gray-700">{subscription.billingInfo?.phone || '+237 612345678'}</div>
        </div>
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
          <div className="text-gray-700">{subscription.billingInfo?.address || '123 Rue de la Paix, Douala, Cameroun'}</div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Modifier l'adresse
        </button>
      </div>
    </div>
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Factures récentes</h3>
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Voir toutes les factures
        </button>
      </div>
      <div className="space-y-3">
        {subscription.invoices && subscription.invoices.length > 0 ? (
          subscription.invoices.map((invoice, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-800">Facture #{invoice.number}</div>
                  <div className="text-sm text-gray-500">{formatDate(invoice.date)}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 font-medium text-gray-800">{invoice.amount.toLocaleString()} FCFA</div>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucune facture disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
{activeTab === 'history' && (
  <div className="space-y-6">
    <div className="bg-gray-50 p-4 rounded-xl">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Historique de l'abonnement</h3>
      <div className="space-y-6">
        {subscription.history && subscription.history.length > 0 ? (
          subscription.history.map((event, index) => (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  event.type === 'success' ? 'bg-green-100 text-green-600' :
                  event.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  event.type === 'error' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {event.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                    event.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                    event.type === 'error' ? <X className="w-5 h-5" /> :
                    <Clock className="w-5 h-5" />}
                </div>
                {index < subscription.history!.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                )}
              </div>
              <div className="pb-6">
                <div className="text-sm font-medium text-gray-800">{event.title}</div>
                <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                <div className="mt-1 text-sm text-gray-600">{event.description}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun historique disponible pour le moment</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
        <div className="flex justify-end mt-6 space-x-2">
          <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg" onClick={onClose}>Fermer</button>
          <button className="bg-yellow-500 text-white py-2 px-4 rounded-lg" onClick={() => onRenew(subscription)}>Renouveler</button>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg" onClick={() => onUpgrade(subscription.plan)}>Changer de plan</button>
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg" onClick={() => onCancel(subscription)}>Annuler</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main SubscriptionManagement component
const SubscriptionManagement: React.FC = () => {
  // Example state (replace with real data/fetch)
  const [plans, setPlans] = useState<SubscriptionPlanType[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanType | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'warning' | 'error' | 'info'>('success');

  useEffect(() => {
    // Replace with real fetch logic
    setPlans([
      {
        id: 'basic',
        name: 'Basique',
        description: 'Pour les petits syndicats',
        price: 15000,
        features: [
          "Jusqu'à 50 membres",
          'Gestion des cotisations',
          'Communication de base',
          'Support par email',
        ],
        limitations: [
          
          'Pas d\'analyse avancée',
          'Pas de personnalisation',
        ],
        icon: <Shield className="w-10 h-10 text-blue-500" />, highlight: false,
      },
      {
        id: 'standard',
        name: 'Standard',
        description: 'Pour les syndicats en croissance',
        price: 35000,
        discount: 10,
        features: [
          "Jusqu'à 200 membres",
          'Gestion des cotisations avancée',
          'Communication multi-canal',
          'Événements et réunions',
          'Support prioritaire',
          'Analyses de base',
        ],
        icon: <Award className="w-10 h-10 text-purple-500" />, highlight: true, popular: true,
      },
      {
        id: 'premium',
        name: 'Premium',
        description: 'Pour les grands syndicats',
        price: 75000,
        discount: 15,
        features: [
          'Membres illimités',
          'Gestion financière complète',
          'Communication avancée',
          'Événements et réunions illimités',
          'Support dédié 24/7',
          'Analyses avancées',
          'Personnalisation complète',
        ],
        icon: <Zap className="w-10 h-10 text-yellow-500" />, highlight: false,
      },
    ]);
    // Simulate current subscription
    setCurrentSubscription({
      id: 'sub-1',
      plan: {
        id: 'standard',
        name: 'Standard',
        description: 'Pour les syndicats en croissance',
        price: 35000,
        discount: 10,
        features: [
          "Jusqu'à 200 membres",
          'Gestion des cotisations avancée',
          'Communication multi-canal',
          'Événements et réunions',
          'Support prioritaire',
          'Analyses de base',
        ],
        icon: <Award className="w-10 h-10 text-purple-500" />, highlight: true, popular: true,
      },
      status: 'active',
      startDate: '2024-01-01',
      nextBillingDate: '2025-01-01',
      endDate: '',
      billingCycle: 'annuel',
      paymentMethod: 'Carte bancaire',
      cardInfo: { brand: 'Visa', last4: '1234' },
      discount: 10,
      autoRenew: true,
      invoices: [],
      history: [],
      billingInfo: { name: 'Jean Dupont', email: 'jean@example.com', phone: '690000000', address: 'Yaoundé' },
    });
  }, []);

  // Handlers
  const handleSelectPlan = (plan: SubscriptionPlanType) => {
    setSelectedPlan(plan);
  };
  const handleUpgradePlan = (plan: SubscriptionPlanType) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };
  const handlePaymentSubmit = (paymentData: PaymentFormData) => {
    setShowPaymentForm(false);
    setShowSuccessNotification(true);
    setNotificationMessage('Paiement effectué avec succès !');
    setNotificationType('success');
    // ...add logic to update subscription
  };
  const handleCancelSubscription = (subscription: SubscriptionType) => {
    setShowCancelModal(true);
  };
  const confirmCancelSubscription = (reason: string) => {
    setShowCancelModal(false);
    setShowSuccessNotification(true);
    setNotificationMessage('Abonnement annulé avec succès !');
    setNotificationType('success');
    // ...add logic to cancel subscription
  };
  const handleRenewSubscription = (subscription: SubscriptionType) => {
    setShowSuccessNotification(true);
    setNotificationMessage('Abonnement renouvelé avec succès !');
    setNotificationType('success');
    // ...add logic to renew subscription
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Gestion des abonnements</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {plans.map((plan) => (
          <SubscriptionPlan
            key={plan.id}
            plan={plan}
            currentPlan={currentSubscription?.plan}
            onSelect={handleSelectPlan}
            onUpgrade={handleUpgradePlan}
          />
        ))}
      </div>
      {/* Modals */}
      <AnimatePresence>
        {selectedPlan && !showPaymentForm && (
          <SubscriptionDetails
            subscription={currentSubscription!}
            onClose={() => setSelectedPlan(null)}
            onCancel={handleCancelSubscription}
            onRenew={handleRenewSubscription}
            onUpgrade={handleUpgradePlan}
          />
        )}
        {showPaymentForm && selectedPlan && (
          <PaymentForm
            plan={selectedPlan}
            onClose={() => setShowPaymentForm(false)}
            onSubmit={handlePaymentSubmit}
          />
        )}
        {showCancelModal && currentSubscription && (
          <CancelSubscriptionModal
            subscription={currentSubscription}
            onClose={() => setShowCancelModal(false)}
            onConfirm={confirmCancelSubscription}
          />
        )}
      </AnimatePresence>
      {/* Notification de succès */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-lg max-w-md ${
              notificationType === 'success' ? 'bg-green-600 text-white' :
              notificationType === 'warning' ? 'bg-yellow-600 text-white' :
              notificationType === 'error' ? 'bg-red-600 text-white' :
              'bg-blue-600 text-white'
            }`}
          >
            <div className="flex items-start">
              {notificationType === 'success' ? <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" /> :
               notificationType === 'warning' ? <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" /> :
               notificationType === 'error' ? <X className="w-6 h-6 mr-3 flex-shrink-0" /> :
               <Info className="w-6 h-6 mr-3 flex-shrink-0" />}
              <div>
                <p className="font-medium">{notificationMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionManagement;
