import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { tasks as tasksApi, familyMembers, taskTypes } from '../services/api';
import { FamilyMember, TaskType } from '../types';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTask?: any;
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export default function TaskForm({ isOpen, onClose, onSuccess, editTask }: TaskFormProps) {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [types, setTypes] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);
  // Helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: getTodayDate(),
    priority: 'medium',
    family_member_id: '',
    category: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (editTask) {
        setForm({
          title: editTask.title || '',
          description: editTask.description || '',
          due_date: editTask.due_date || '',
          priority: editTask.priority || 'medium',
          family_member_id: editTask.family_member_id || '',
          category: editTask.category || '',
        });
      }
    }
  }, [isOpen, editTask]);

  const fetchData = async () => {
    try {
      const [familyRes, typesRes] = await Promise.all([
        familyMembers.getAll(),
        taskTypes.getAll(),
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
      if (editTask) {
        await tasksApi.update(editTask.id, form);
      } else {
        await tasksApi.create(form);
      }
      onSuccess();
      onClose();
      setForm({ title: '', description: '', due_date: getTodayDate(), priority: 'medium', family_member_id: '', category: '' });
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
            {editTask ? 'Edit Task' : 'Add Task'}
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
              placeholder="Task title"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Assign To</label>
            <select
              value={form.family_member_id}
              onChange={e => setForm({ ...form, family_member_id: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="">Unassigned</option>
              {family.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="e.g., Chores, Personal, Work"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editTask ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
