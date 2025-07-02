'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Users, Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, Activity, ArrowUp, ArrowDown, MessageSquare, FileText, 
  Award, Truck, MapPin, CreditCard, Star 
} from "lucide-react";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Filler 
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { getFirstName, getLastName } from "../services/AccountService";

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement,
  Title,
  Filler
);

// Types pour TypeScript
interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  trend?: 'up' | 'down';
  color: string;
  percentage?: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface Task {
  id: number;
  title: string;
  date: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

// Composant pour les cartes de statistiques
const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  trend, 
  color, 
  percentage 
}) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${color}`}
  >
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
        <Icon className={`h-6 w-6 ${color.replace('border-', 'text-')}`} />
      </div>
      {trend && (
        <div className={`flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">{percentage}%</span>
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </motion.div>
);

// Composant pour les activités récentes
const RecentActivity: React.FC = () => {
  const activities: Activity[] = [
    { 
      id: 1, 
      title: "Nouvelle adhésion", 
      description: "Jean Dupont a rejoint le syndicat", 
      time: "Il y a 2 heures",
      icon: <Users className="h-5 w-5 text-blue-500" />
    },
    { 
      id: 2, 
      title: "Cotisation reçue", 
      description: "Marie Martin a payé sa cotisation mensuelle", 
      time: "Il y a 5 heures",
      icon: <CreditCard className="h-5 w-5 text-green-500" />
    },
    { 
      id: 3, 
      title: "Nouvel événement", 
      description: "Assemblée générale programmée pour le 15 juin", 
      time: "Il y a 1 jour",
      icon: <Calendar className="h-5 w-5 text-purple-500" />
    },
    { 
      id: 4, 
      title: "Vote terminé", 
      description: "La proposition sur les horaires a été acceptée", 
      time: "Il y a 2 jours",
      icon: <CheckCircle className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activités récentes</h3>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              {activity.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{activity.title}</h4>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant pour les tâches à venir
const UpcomingTasks: React.FC = () => {
  const tasks: Task[] = [
    { 
      id: 1, 
      title: "Réunion du bureau", 
      date: "Demain, 10:00", 
      status: "pending",
      priority: "high"
    },
    { 
      id: 2, 
      title: "Préparation des documents financiers", 
      date: "15 Juin, 14:00", 
      status: "pending",
      priority: "medium"
    },
    { 
      id: 3, 
      title: "Rencontre avec les autorités", 
      date: "20 Juin, 09:00", 
      status: "pending",
      priority: "high"
    }
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tâches à venir</h3>
      <div className="space-y-3">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center">
              {task.priority === "high" ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
              ) : (
                <Clock className="h-5 w-5 text-blue-500 mr-3" />
              )}
              <div>
                <h4 className="font-medium text-gray-800">{task.title}</h4>
                <p className="text-xs text-gray-500">{task.date}</p>
              </div>
            </div>
            <div>
              {task.status === "completed" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className={`px-2 py-1 rounded-full text-xs ${
                  task.priority === "high" 
                    ? "bg-red-100 text-red-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {task.priority === "high" ? "Urgent" : "Normal"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant pour les statistiques des membres
const MemberStats: React.FC = () => {
  const data = {
    labels: ['Actifs', 'Inactifs', 'Nouveaux', 'En attente'],
    datasets: [
      {
        label: 'Membres',
        data: [120, 19, 15, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Répartition des membres',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <Pie data={data} options={options} />
    </motion.div>
  );
};

// Composant pour les revenus mensuels
const MonthlyRevenue: React.FC = () => {
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus (FCFA)',
        data: [650000, 590000, 800000, 810000, 560000, 550000, 700000, 650000, 900000, 970000, 1100000, 1200000],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Dépenses (FCFA)',
        data: [450000, 390000, 600000, 550000, 400000, 450000, 500000, 450000, 600000, 650000, 700000, 800000],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Revenus et dépenses mensuels',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toLocaleString() + ' FCFA';
          }
        }
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
};

// Composant pour l'évolution des adhésions
const MembershipTrend: React.FC = () => {
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Nouvelles adhésions',
        data: [5, 8, 12, 15, 10, 7, 14, 18, 20, 25, 22, 30],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des adhésions',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'adhésions'
        }
      }
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <Line data={data} options={options} />
    </motion.div>
  );
};

// Composant pour les services populaires
const PopularServices: React.FC = () => {
  const data = {
    labels: ['Formation', 'Assistance juridique', 'Médiation', 'Conseil', 'Événements'],
    datasets: [
      {
        label: 'Utilisation des services',
        data: [65, 45, 30, 25, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Services les plus utilisés',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <Bar data={data} options={options} />
    </motion.div>
  );
};

// Composant principal SyndicatDashboard
export const SyndicatDashboard: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  useEffect(() => {
    setFirstName(getFirstName() || "");
    setLastName(getLastName() || "");
  }, []);

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">
          Bienvenue, {firstName} {lastName}!
        </h1>
        <p className="text-gray-600">Votre portail syndical personnalisé</p>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={Users} 
          title="Membres actifs" 
          value="156" 
          trend="up" 
          percentage="12" 
          color="border-blue-500" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Cotisations" 
          value="1.2M FCFA" 
          trend="up" 
          percentage="8" 
          color="border-green-500" 
        />
        <StatCard 
          icon={Calendar} 
          title="Événements" 
          value="12" 
          trend="up" 
          percentage="5" 
          color="border-purple-500" 
        />
        <StatCard 
          icon={CheckCircle} 
          title="Votes actifs" 
          value="3" 
          trend="down" 
          percentage="2" 
          color="border-orange-500" 
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyRevenue />
        <MembershipTrend />
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MemberStats />
        <PopularServices />
      </div>

      {/* Activités récentes et tâches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingTasks />
      </div>

      {/* Indicateurs de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Award className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Satisfaction des membres</h3>
              <p className="text-sm text-gray-600">Évaluation globale</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progression</span>
              <span className="text-sm font-medium text-blue-600">92%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 mr-1" />
              <span>4.6/5 (basé sur 78 évaluations)</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Truck className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Couverture géographique</h3>
              <p className="text-sm text-gray-600">Présence territoriale</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Régions couvertes</span>
              <span className="text-sm font-medium text-green-600">7/10</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-green-500 mr-1" />
              <span>12 antennes locales actives</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <FileText className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Conformité légale</h3>
              <p className="text-sm text-gray-600">Statut réglementaire</p>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Documents à jour</span>
              <span className="text-sm font-medium text-purple-600">100%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-purple-500 mr-1" />
              <span>Tous les documents sont conformes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SyndicatDashboard;