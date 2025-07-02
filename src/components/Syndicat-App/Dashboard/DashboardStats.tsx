"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, Calendar, MessageSquare, CreditCard, Vote, BarChart2, PieChart, Activity,
  ArrowUp, ArrowDown, DollarSign, Clock, CheckCircle, AlertTriangle
} from "lucide-react";

interface StatCardProps {
  icon: FC<any>;
  title: string;
  value: string;
  trend: "up" | "down" | null;
  color: string;
  percentage: string;
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, title, value, trend, color, percentage }) => (
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

interface ChartData {
  label?: string;
  value: number;
  color: string;
}

interface ChartProps {
  title: string;
  type: "bar" | "pie" | "line";
  data: ChartData[];
  height?: number;
}

const Chart: FC<ChartProps> = ({ title, type, data, height = 300 }) => {
  // Simulation de graphiques avec des barres ou des cercles colorés
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {type === 'bar' ? (
          <BarChart2 className="h-5 w-5 text-blue-500" />
        ) : type === 'pie' ? (
          <PieChart className="h-5 w-5 text-purple-500" />
        ) : (
          <Activity className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {type === 'bar' && (
          <div className="flex items-end justify-between h-full">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-full">
                <div
                  className={`w-12 ${item.color} rounded-t-lg`}
                  style={{ height: `${item.value}%` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        {type === 'pie' && (
          <div className="flex justify-center items-center h-full">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {data.map((item, index) => {
                  const startAngle = index > 0
                    ? data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / 100 * 360
                    : 0;
                  const endAngle = startAngle + (item.value / 100 * 360);
                  const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
                  return (
                    <path
                      key={index}
                      d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      fill={item.color}
                      stroke="#fff"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-800">100%</span>
            </div>
          </div>
           </div>
        )}
        {type === 'line' && (
          <div className="h-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={data.map((point, i) => `${i * (100 / (data.length - 1))},${100 - point.value}`).join(' ')}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((point, i) => (
                <circle
                  key={i}
                  cx={i * (100 / (data.length - 1))}
                  cy={100 - point.value}
                  r="2"
                  fill="#4F46E5"
                />
              ))}
            </svg>
          </div>
        )}
      </div>
      {type === 'pie' && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-xs text-gray-600">{item.label} ({item.value}%)</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  date: string;
  status?: string;
}

const RecentActivity: FC = () => {
  const activities: ActivityItem[] = [
    { id: 1, type: "cotisation", description: "Cotisation mensuelle reçue", date: "2025-06-27" },
    { id: 2, type: "vote", description: "Nouveau vote lancé : Réforme statuts", date: "2025-06-26" },
    { id: 3, type: "evenement", description: "Événement planifié : Assemblée Générale", date: "2025-06-25" },
    { id: 4, type: "message", description: "Nouveau message dans le chat", date: "2025-06-24" },
  ];
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Activités récentes</h3>
      <ul className="divide-y divide-gray-100">
        {activities.map(activity => (
          <li key={activity.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              {activity.type === "cotisation" && <CreditCard className="h-5 w-5 text-green-500 mr-3" />}
              {activity.type === "vote" && <Vote className="h-5 w-5 text-blue-500 mr-3" />}
              {activity.type === "evenement" && <Calendar className="h-5 w-5 text-purple-500 mr-3" />}
              {activity.type === "message" && <MessageSquare className="h-5 w-5 text-gray-500 mr-3" />}
              <div>
                <h4 className="font-medium text-gray-800">{activity.description}</h4>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
            <div>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

interface TaskItem {
  id: number;
  title: string;
  date: string;
  status: string;
  priority: "high" | "normal";
}

const UpcomingTasks: FC = () => {
  const tasks: TaskItem[] = [
    { id: 1, title: "Préparer AG annuelle", date: "2025-07-01", status: "pending", priority: "high" },
    { id: 2, title: "Envoyer rapport financier", date: "2025-07-05", status: "pending", priority: "normal" },
    { id: 3, title: "Relancer membres inactifs", date: "2025-07-10", status: "completed", priority: "normal" },
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

export const DashboardStats: FC = () => {
  // Données pour les graphiques
  const barChartData: ChartData[] = [
    { label: 'Jan', value: 65, color: 'bg-blue-500' },
    { label: 'Fév', value: 40, color: 'bg-blue-500' },
    { label: 'Mar', value: 75, color: 'bg-blue-500' },
    { label: 'Avr', value: 55, color: 'bg-blue-500' },
    { label: 'Mai', value: 60, color: 'bg-blue-500' },
    { label: 'Juin', value: 80, color: 'bg-blue-500' }
  ];

  const pieChartData: ChartData[] = [
    { label: 'Cotisations', value: 45, color: 'blue' },
    { label: 'Dons', value: 25, color: 'green' },
    { label: 'Services', value: 20, color: 'purple' },
    { label: 'Autres', value: 10, color: 'yellow' }
  ];

   const lineChartData = [
    { value: 20 }, { value: 40 }, { value: 30 }, 
    { value: 70 }, { value: 50 }, { value: 80 }
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble des statistiques et activités du syndicat</p>
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
          icon={CreditCard}
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
          icon={Vote}
          title="Votes actifs"
          value="3"
          trend="down"
          percentage="2"
          color="border-orange-500"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart
          title="Évolution des adhésions"
          type="bar"
          data={barChartData}
        />
        <Chart
          title="Répartition des revenus"
          type="pie"
          data={pieChartData}
        />
      </div>

      {/* Activités récentes et tâches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <UpcomingTasks />
      </div>
    </div>
  );
};

export default DashboardStats;
