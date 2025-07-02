// MIGRATION : Ce composant a été migré de PlaningManagement.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
"use client";

import { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Edit,
  Trash2,
  Users,
  Truck,
  FileText,
  MapPin,
  X,
  Repeat,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface EventType {
  value: string;
  label: string;
  icon: JSX.Element;
}

interface PlanningEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: string;
  location: string;
  description: string;
  reminderType: string;
  reminderTime: string;
  emailReminder: boolean;
  recurrence: boolean;
  recurrenceFrequency: string;
}

const eventTypes: EventType[] = [
  { value: "meeting", label: "Réunion", icon: <Users size={18} className="text-blue-600" /> },
  { value: "training", label: "Formation", icon: <FileText size={18} className="text-emerald-600" /> },
  { value: "inspection", label: "Inspection", icon: <Truck size={18} className="text-amber-600" /> },
  { value: "other", label: "Autre", icon: <Calendar size={18} className="text-purple-600" /> },
];

const reminderTimes = [
  { value: "30min", label: "30 minutes avant" },
  { value: "1hour", label: "1 heure avant" },
  { value: "1day", label: "1 jour avant" },
];

const recurrenceOptions = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
];

interface EventModalProps {
  event?: PlanningEvent | null;
  onSave: (event: PlanningEvent) => void;
  onClose: () => void;
}

const EventModal: FC<EventModalProps> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<PlanningEvent>(
    event || {
      id: "",
      title: "",
      date: null as unknown as Date,
      time: "",
      type: "",
      location: "",
      description: "",
      reminderType: "both",
      reminderTime: "1hour",
      emailReminder: false,
      recurrence: false,
      recurrenceFrequency: "",
    }
  );

  const handleSubmit = () => {
    if (formData.title && formData.date && formData.time) {
      onSave({ ...formData, id: event?.id || Date.now().toString() });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            {event ? "Modifier l'événement" : "Nouvel Événement"}
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Titre</label>
            <input
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Réunion client"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                value={formData.date ? formData.date.toISOString().split("T")[0] : ""}
                onChange={e => setFormData({ ...formData, date: new Date(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Heure</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Sélectionnez un type</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Lieu</label>
            <input
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              placeholder="Adresse ou lieu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              rows={3}
              placeholder="Détails de l'événement"
            />
          </div>

          {/* Section Rappel par Email */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emailReminder}
                onChange={e => setFormData({ ...formData, emailReminder: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                id="emailReminder"
              />
              <label htmlFor="emailReminder" className="text-sm text-slate-600 flex items-center gap-1">
                <Mail size={16} className="text-blue-600" />
                Recevoir des rappels par email
              </label>
            </div>
            {formData.emailReminder && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Temps de rappel</label>
                <select
                  value={formData.reminderTime}
                  onChange={e => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {reminderTimes.map(rt => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section Récurrence */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.recurrence}
                onChange={e => setFormData({ ...formData, recurrence: e.target.checked, recurrenceFrequency: "" })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                id="recurrence"
              />
              <label htmlFor="recurrence" className="text-sm text-slate-600 flex items-center gap-1">
                <Repeat size={16} className="text-blue-600" />
                Répéter cet événement
              </label>
            </div>
            {formData.recurrence && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Fréquence</label>
                <select
                  value={formData.recurrenceFrequency}
                  onChange={e => setFormData({ ...formData, recurrenceFrequency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Sélectionnez une fréquence</option>
                  {recurrenceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title || !formData.date || !formData.time}
              className={`px-4 py-2 rounded-lg transition-colors ${
                formData.title && formData.date && formData.time
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {event ? "Enregistrer" : "Créer l'événement"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PlanningManagement: FC = () => {
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<PlanningEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [viewMode, setViewMode] = useState<"today" | "upcoming">("today");
  const [filterType, setFilterType] = useState<string>("");

  useEffect(() => {
    const fakeEvents: PlanningEvent[] = [
      {
        id: "1",
        title: "Réunion syndicale",
        date: new Date(),
        time: "10:00",
        type: "meeting",
        location: "Siège du syndicat, Douala",
        description: "Discussion sur les nouvelles réglementations",
        reminderType: "both",
        reminderTime: "1hour",
        emailReminder: true,
        recurrence: false,
        recurrenceFrequency: "",
      },
      {
        id: "2",
        title: "Formation sécurité",
        date: new Date(Date.now() + 86400000),
        time: "09:00",
        type: "training",
        location: "Centre de formation, Yaoundé",
        description: "Formation pour chauffeurs",
        reminderType: "email",
        reminderTime: "1day",
        emailReminder: false,
        recurrence: true,
        recurrenceFrequency: "weekly",
      },
    ];
    setEvents(fakeEvents);
  }, []);

  const handleAddEvent = (newEvent: PlanningEvent) => {
    setEvents([...events, newEvent]);
    setIsAddingEvent(false);
  };

  const handleEditEvent = (updatedEvent: PlanningEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Fonction d'export des événements en CSV
  const exportEvents = () => {
    const csvHeader = "ID,Titre,Date,Heure,Type,Lieu,Description,EmailReminder,Récurrence,RécurrenceFréquence\n";
    const csvRows = events.map(event => {
      const dateStr = event.date ? new Date(event.date).toLocaleDateString() : "";
      return [
        event.id,
        `"${event.title}"`,
        dateStr,
        event.time,
        event.type,
        `"${event.location}"`,
        `"${event.description}"`,
        event.emailReminder,
        event.recurrence,
        event.recurrenceFrequency,
      ].join(",");
    });
    const csvContent = csvHeader + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "events.csv");
    link.click();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filtrer et trier les événements selon le mode et le type sélectionné
  const filteredEvents = events
    .filter(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      const dateMatch = viewMode === "today"
        ? eventDate.getTime() === today.getTime()
        : eventDate.getTime() >= today.getTime();
      const typeMatch = filterType ? event.type === filterType : true;
      return dateMatch && typeMatch;
    })
    .filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
      <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center drop-shadow-sm">
        Gestion du Planning
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Calendrier */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="[--rdp-cell-size:40px] text-sm"
            />
          </div>
        </div>

        {/* Liste des événements */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-slate-700">
                {viewMode === "today" ? "Planning d'aujourd'hui" : "Planning à venir"}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("today")}
                  className={`px-3 py-1 rounded-lg ${viewMode === "today" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setViewMode("upcoming")}
                  className={`px-3 py-1 rounded-lg ${viewMode === "upcoming" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  À venir
                </button>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="mb-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <input
                type="text"
                placeholder="Rechercher des événements..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:max-w-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg"
              >
                <option value="">Tous les types</option>
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <button
                onClick={exportEvents}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Exporter CSV
              </button>
            </div>

            {/* Liste des événements filtrés */}
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center text-slate-500 py-12">
                  Aucun événement trouvé.
                </div>
              ) : (
                filteredEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-blue-50 rounded-lg p-4 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-medium text-slate-800">{event.title}</h3>
                      <div className="mt-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {event.date ? new Date(event.date).toLocaleDateString() : ""}
                          <Clock size={14} className="ml-2" />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Bouton d'ajout */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddingEvent(true)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50"
            >
              <Plus size={24} />
            </motion.button>

            {/* Modals pour ajout et édition */}
            <AnimatePresence>
              {isAddingEvent && (
                <EventModal
                  onSave={handleAddEvent}
                  onClose={() => setIsAddingEvent(false)}
                />
              )}
              {editingEvent && (
                <EventModal
                  event={editingEvent}
                  onSave={handleEditEvent}
                  onClose={() => setEditingEvent(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningManagement;
