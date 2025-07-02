// MIGRATION : Ce composant a été migré de ReservationManagement.jsx vers TypeScript strict. L'ancien fichier doit être supprimé après validation.
"use client";

import { FC, useState } from "react";
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

// Types TypeScript
interface EventType {
  value: string;
  label: string;
  icon: React.ReactNode;
}
interface ReminderTime {
  value: string;
  label: string;
}
interface RecurrenceOption {
  value: string;
  label: string;
}
interface ReservationEvent {
  id: string;
  title: string;
  date: Date | null;
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

interface EventModalProps {
  event?: ReservationEvent | null;
  onSave: (event: ReservationEvent) => void;
  onClose: () => void;
}

const eventTypes: EventType[] = [
  { value: "meeting", label: "Réunion", icon: <Users size={18} className="text-blue-600" /> },
  { value: "training", label: "Formation", icon: <FileText size={18} className="text-emerald-600" /> },
  { value: "inspection", label: "Inspection", icon: <Truck size={18} className="text-amber-600" /> },
  { value: "other", label: "Autre", icon: <Calendar size={18} className="text-purple-600" /> },
];

const reminderTimes: ReminderTime[] = [
  { value: "30min", label: "30 minutes avant" },
  { value: "1hour", label: "1 heure avant" },
  { value: "1day", label: "1 jour avant" },
];
const recurrenceOptions: RecurrenceOption[] = [
  { value: "daily", label: "Quotidien" },
  { value: "weekly", label: "Hebdomadaire" },
  { value: "monthly", label: "Mensuel" },
];

interface EventModalProps {
  event?: ReservationEvent | null;
  onSave: (event: ReservationEvent) => void;
  onClose: () => void;
}

const EventModal: FC<EventModalProps> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<ReservationEvent>(
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

interface ReservationManagementProps {}

interface ReservationManagementState {
  events: ReservationEvent[];
  isAddingEvent: boolean;
  editingEvent: ReservationEvent | null;
}

const ReservationManagement: React.FC<ReservationManagementProps> = () => {
  const [events, setEvents] = useState<ReservationEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<ReservationEvent | null>(null);

  const handleAddEvent = (newEvent: ReservationEvent) => {
    setEvents([...events, newEvent]);
    setIsAddingEvent(false);
  };

  const handleEditEvent = (updatedEvent: ReservationEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Gestion des Réservations</h2>
        {/* Liste des événements */}
        <div className="space-y-4">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-slate-50 rounded-lg p-4 flex justify-between items-start"
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
                  className="p-2 hover:bg-slate-200 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton d'ajout */}
        <button
          onClick={() => setIsAddingEvent(true)}
          className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle réservation
        </button>
      </div>

      {/* Modals */}
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
  );
};

export default ReservationManagement;
