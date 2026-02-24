import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { events as eventsApi, familyMembers, eventTypes } from '../services/api';
import { FamilyMember, EventType } from '../types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEvent?: any;
  defaultDate?: string;
}

export default function EventForm({ isOpen, onClose, onSuccess, editEvent, defaultDate }: EventFormProps) {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [types, setTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: defaultDate || '',
    end_time: '',
    all_day: false,
    family_member_id: '',
    recurrence: '',
    event_type_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (editEvent) {
        setForm({
          title: editEvent.title || '',
          description: editEvent.description || '',
          start_time: editEvent.start_time?.slice(0, 16) || '',
          end_time: editEvent.end_time?.slice(0, 16) || '',
          all_day: editEvent.all_day || false,
          family_member_id: editEvent.family_member_id || '',
          recurrence: editEvent.recurrence || '',
          event_type_id: editEvent.event_type_id || '',
        });
      } else {
        setForm({
          title: '',
          description: '',
          start_time: defaultDate || '',
          end_time: '',
          all_day: false,
          family_member_id: '',
          recurrence: '',
          event_type_id: '',
        });
      }
    }
  }, [isOpen, editEvent, defaultDate]);

  const fetchData = async () => {
    try {
      const [familyRes, typesRes] = await Promise.all([
        familyMembers.getAll(),
        eventTypes.getAll(),
      ]);
      setFamily(familyRes.data);
      setTypes(typesRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editEvent) {
        await eventsApi.update(editEvent.id, form);
      } else {
        await eventsApi.create(form);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="bg-dark-card rounded-t-3xl sm:rounded-2xl border-t sm:border border-dark-border w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-dark-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {editEvent ? 'Edit Event' : 'Add Event'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Event title"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
              rows={2}
              placeholder="Optional description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="all_day"
              checked={form.all_day}
              onChange={e => setForm({ ...form, all_day: e.target.checked })}
              className="w-4 h-4 rounded border-dark-border bg-dark-bg text-primary-500 focus:ring-primary-500"
            />
            <label htmlFor="all_day" className="text-sm text-gray-400">All day event</label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Start</label>
              <input
                type={form.all_day ? 'date' : 'datetime-local'}
                value={form.start_time}
                onChange={e => setForm({ ...form, start_time: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>
            {!form.all_day && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">End</label>
                <input
                  type="datetime-local"
                  value={form.end_time}
                  onChange={e => setForm({ ...form, end_time: e.target.value })}
                  className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Event Type</label>
            <select
              value={form.event_type_id}
              onChange={e => setForm({ ...form, event_type_id: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">No type</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Assign To</label>
            <select
              value={form.family_member_id}
              onChange={e => setForm({ ...form, family_member_id: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">Everyone</option>
              {family.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Recurrence</label>
            <select
              value={form.recurrence}
              onChange={e => setForm({ ...form, recurrence: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">Does not repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editEvent ? 'Update Event' : 'Add Event'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
