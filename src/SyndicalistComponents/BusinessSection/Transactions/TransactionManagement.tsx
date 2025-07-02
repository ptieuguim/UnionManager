import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Search, Filter, ArrowUpDown, Eye, Download,
  CheckCircle, XCircle, Clock, AlertTriangle, CreditCard,
  Calendar, User, MapPin, Truck, Package, FileText,
  ChevronDown, ChevronUp, X, Printer, Mail, Phone, MessageSquare
} from 'lucide-react';

// Types
interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  since: string;
}

interface TransactionItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface TimelineEvent {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  date: string;
  description: string;
}

interface Transaction {
  id: string;
  date: string;
  customer: Customer;
  amount: number;
  subtotal: number;
  tax: number;
  status: 'completed' | 'pending' | 'cancelled' | 'processing';
  paymentMethod: string;
  items: TransactionItem[];
  timeline?: TimelineEvent[];
}

interface TransactionDetailsProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'Complétée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'processing': return 'En traitement';
      default: return 'Inconnue';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl mr-4">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Détails de la transaction</h2>
              <p className="text-gray-500">#{transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Informations générales</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-800">{formatDate(transaction.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant</span>
                <span className="font-medium text-gray-800">{transaction.amount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Méthode de paiement</span>
                <span className="font-medium text-gray-800">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Statut</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {getStatusLabel(transaction.status)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Client</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">{transaction.customer.name}</div>
                  <div className="text-sm text-gray-500">Client depuis {transaction.customer.since}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-4 h-4 text-gray-400 mt-1 mr-2" />
                <span className="text-gray-600">{transaction.customer.phone}</span>
              </div>
              <div className="flex items-start">
                <Mail className="w-4 h-4 text-gray-400 mt-1 mr-2" />
                <span className="text-gray-600">{transaction.customer.email}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2" />
                <span className="text-gray-600">{transaction.customer.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Détails de la réservation</h3>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transaction.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.description}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.quantity}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{item.unitPrice.toLocaleString()} FCFA</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{(item.quantity * item.unitPrice).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-500">Sous-total</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{transaction.subtotal.toLocaleString()} FCFA</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-right text-sm font-medium text-gray-500">TVA (19.25%)</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{transaction.tax.toLocaleString()} FCFA</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td colSpan={4} className="px-4 py-3 text-right text-sm font-bold text-gray-800">Total</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{transaction.amount.toLocaleString()} FCFA</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {transaction.timeline && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Historique</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-4">
                {transaction.timeline.map((event, index) => (
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
                         event.type === 'error' ? <XCircle className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                      </div>
                      {index < (transaction.timeline?.length ?? 0) - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium text-gray-800">{event.title}</div>
                      <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                      <div className="mt-1 text-sm text-gray-600">{event.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
          <div className="space-x-3 mb-3 sm:mb-0">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </button>
          </div>
          <div className="space-x-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contacter le client
            </button>
            {transaction.status === 'pending' && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fakeTransactions: Transaction[] = [
      {
        id: 'TRX-001',
        date: '2023-05-15T10:30:00Z',
        customer: {
          name: 'Jean Kouassi',
          email: 'jean.kouassi@example.com',
          phone: '+237 612345678',
          address: '123 Rue de la Paix, Douala',
          since: 'Jan 2022'
        },
        amount: 75000,
        subtotal: 63025,
        tax: 11975,
        status: 'completed',
        paymentMethod: 'Carte bancaire',
        items: [
          {
            name: 'Transport express',
            description: 'Livraison de colis express Douala-Yaoundé',
            quantity: 1,
            unitPrice: 45000
          },
          {
            name: 'Assurance transport',
            description: 'Assurance pour marchandises de valeur',
            quantity: 1,
            unitPrice: 15000
          },
          {
            name: 'Emballage sécurisé',
            description: 'Emballage renforcé pour protection',
            quantity: 1,
            unitPrice: 3025
          }
        ],
        timeline: [
          {
            type: 'info',
            title: 'Réservation créée',
            date: '2023-05-15T10:30:00Z',
            description: 'Le client a effectué une réservation en ligne'
          },
          {
            type: 'info',
            title: 'Paiement reçu',
            date: '2023-05-15T10:35:00Z',
            description: 'Paiement par carte bancaire confirmé'
          },
          {
            type: 'success',
            title: 'Réservation confirmée',
            date: '2023-05-15T10:40:00Z',
            description: 'La réservation a été confirmée et assignée'
          },
          {
            type: 'success',
            title: 'Service complété',
            date: '2023-05-16T14:20:00Z',
            description: 'Le service a été effectué avec succès'
          }
        ]
      },
      {
        id: 'TRX-002',
        date: '2023-05-18T14:45:00Z',
        customer: {
          name: 'Marie Mbarga',
          email: 'marie.mbarga@example.com',
          phone: '+237 687654321',
          address: '45 Avenue Kennedy, Yaoundé',
          since: 'Mar 2021'
        },
        amount: 120000,
        subtotal: 100628,
        tax: 19372,
        status: 'pending',
        paymentMethod: 'Virement bancaire',
        items: [
          {
            name: 'Location camion',
            description: "Location d'un camion 10 tonnes pour 2 jours",
            quantity: 2,
            unitPrice: 50000
          },
          {
            name: 'Chauffeur',
            description: "Services d'un chauffeur professionnel",
            quantity: 1,
            unitPrice: 628
          }
        ],
        timeline: [
          {
            type: 'info',
            title: 'Réservation créée',
            date: '2023-05-18T14:45:00Z',
            description: 'Le client a effectué une réservation par téléphone'
          },
          {
            type: 'warning',
            title: 'En attente de paiement',
            date: '2023-05-18T14:50:00Z',
            description: 'Virement bancaire en attente de confirmation'
          }
        ]
      },
      {
        id: 'TRX-003',
        date: '2023-05-20T09:15:00Z',
        customer: {
          name: 'Paul Nkeng',
          email: 'paul.nkeng@example.com',
          phone: '+237 654321987',
          address: '78 Commercial Avenue, Bamenda',
          since: 'Nov 2022'
        },
        amount: 35000,
        subtotal: 29350,
        tax: 5650,
        status: 'processing',
        paymentMethod: 'Mobile Money',
        items: [
          {
            name: 'Transport urbain',
            description: 'Service de navette aéroport',
            quantity: 1,
            unitPrice: 29350
          }
        ],
        timeline: [
          {
            type: 'info',
            title: 'Réservation créée',
            date: '2023-05-20T09:15:00Z',
            description: 'Le client a effectué une réservation en ligne'
          },
          {
            type: 'info',
            title: 'Paiement reçu',
            date: '2023-05-20T09:20:00Z',
            description: 'Paiement par Mobile Money confirmé'
          },
          {
            type: 'info',
            title: 'En cours de traitement',
            date: '2023-05-20T09:25:00Z',
            description: 'La réservation est en cours de traitement'
          }
        ]
      },
      {
        id: 'TRX-004',
        date: '2023-05-22T16:20:00Z',
        customer: {
          name: 'Sophie Ndongo',
          email: 'sophie.ndongo@example.com',
          phone: '+237 698765432',
          address: '15 Zone Portuaire, Kribi',
          since: 'Feb 2023'
        },
        amount: 250000,
        subtotal: 209644,
        tax: 40356,
        status: 'cancelled',
        paymentMethod: 'Chèque',
        items: [
          {
            name: 'Transport maritime',
            description: 'Transport de marchandises par voie maritime',
            quantity: 1,
            unitPrice: 180000
          },
          {
            name: 'Dédouanement',
            description: 'Services de dédouanement',
            quantity: 1,
            unitPrice: 29644
          }
        ],
        timeline: [
          {
            type: 'info',
            title: 'Réservation créée',
            date: '2023-05-22T16:20:00Z',
            description: 'Le client a effectué une réservation en personne'
          },
          {
            type: 'warning',
            title: 'Problème de paiement',
            date: '2023-05-23T10:15:00Z',
            description: 'Le chèque a été refusé par la banque'
          },
          {
            type: 'error',
            title: 'Réservation annulée',
            date: '2023-05-24T14:30:00Z',
            description: 'La réservation a été annulée suite au problème de paiement'
          }
        ]
      },
      {
        id: 'TRX-005',
        date: '2023-05-25T11:10:00Z',
        customer: {
          name: 'Ibrahim Ousmane',
          email: 'ibrahim.ousmane@example.com',
          phone: '+237 612345987',
          address: '56 Rue Principale, Garoua',
          since: 'Apr 2022'
        },
        amount: 85000,
        subtotal: 71277,
        tax: 13723,
        status: 'completed',
        paymentMethod: 'Espèces',
        items: [
          {
            name: 'Transport routier',
            description: 'Transport de marchandises par route',
            quantity: 1,
            unitPrice: 71277
          }
        ],
        timeline: [
          {
            type: 'info',
            title: 'Réservation créée',
            date: '2023-05-25T11:10:00Z',
            description: 'Le client a effectué une réservation en personne'
          },
          {
            type: 'info',
            title: 'Paiement reçu',
            date: '2023-05-25T11:15:00Z',
            description: 'Paiement en espèces reçu'
          },
          {
            type: 'success',
            title: 'Réservation confirmée',
            date: '2023-05-25T11:20:00Z',
            description: 'La réservation a été confirmée'
          },
          {
            type: 'success',
            title: 'Service complété',
            date: '2023-05-26T15:45:00Z',
            description: 'Le service a été effectué avec succès'
          }
        ]
      }
    ];
    setTransactions(fakeTransactions);
  }, []);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus ? transaction.status === filterStatus : true;
      let matchesDate = true;
      if (filterDateRange.start && filterDateRange.end) {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(filterDateRange.start);
        const endDate = new Date(filterDateRange.end);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = transactionDate >= startDate && transactionDate <= endDate;
      }
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === 'id') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'Complétée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'processing': return 'En traitement';
      default: return 'Inconnue';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const exportTransactions = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'transactions.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const printTransactions = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Transactions - Rapport</title></head><body>...print content...</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par ID ou client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="completed">Complétée</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          <div>
            <div className="flex space-x-2">
              <input
                type="date"
                value={filterDateRange.start}
                onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Date début"
              />
              <input
                type="date"
                value={filterDateRange.end}
                onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Date fin"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Trier par:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'id')}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="date">Date</option>
                <option value="amount">Montant</option>
                <option value="id">ID</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              >
                {sortOrder === 'asc' ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              {filteredTransactions.length} transaction(s) trouvée(s)
            </div>
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
              setFilterDateRange({ start: '', end: '' });
            }}
            className="mt-2 sm:mt-0 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center"
          >
            <X className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(transaction.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.customer.name}</div>
                        <div className="text-sm text-gray-500">{transaction.customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount.toLocaleString()} FCFA</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{transaction.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setSelectedTransaction(transaction)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredTransactions.length)}
              </span>{' '}
              sur <span className="font-medium">{filteredTransactions.length}</span> résultats
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const number = i + 1;
                return (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === number
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100 mr-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Transactions complétées</div>
              <div className="text-2xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'completed').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-yellow-100 mr-4">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">En attente</div>
              <div className="text-2xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100 mr-4">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">En traitement</div>
              <div className="text-2xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'processing').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-red-100 mr-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Annulées</div>
              <div className="text-2xl font-bold text-gray-800">
                {transactions.filter(t => t.status === 'cancelled').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de détails de transaction */}
      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetails
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionManagement;
