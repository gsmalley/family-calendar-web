import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { homework as homeworkApi, familyMembers } from '../services/api';
import { Homework, FamilyMember } from '../types';

interface HomeworkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editHomework?: Homework;
}

export default function HomeworkForm({ isOpen, onClose, onSuccess, editHomework }: HomeworkFormProps) {
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    subject: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    family_member_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchFamily();
      if (editHomework) {
        setForm({
          subject: editHomework.subject,
          description: editHomework.description || '',
          due_date: editHomework.due_date,
          family_member_id: editHomework.family_member_id || '',
        });
      } else {
        setForm({
          subject: '',
          description: '',
          due_date: new Date().toISOString().split('T')[0],
          family_member_id: '',
        });
      }
    }
  }, [isOpen, editHomework]);

  const fetchFamily = async () => {
    try {
      const res = await familyMembers.getAll();
      setFamily(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editHomework) {
        await homeworkApi.update(editHomework.id, form);
      } else {
        await homeworkApi.create(form);
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
            {editHomework ? 'Edit Homework' : 'Add Homework'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <input
              type="text"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="e.g., Math"
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
              placeholder="Homework details..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              required
            />
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editHomework ? 'Update Homework' : 'Add Homework'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
