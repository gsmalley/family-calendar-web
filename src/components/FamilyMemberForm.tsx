import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { familyMembers as familyMembersApi } from '../services/api';
import { FamilyMember } from '../types';

interface FamilyMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMember?: FamilyMember;
}

const colorOptions = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', 
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#06b6d4', '#84cc16', '#f59e0b', '#6366f1',
];

export default function FamilyMemberForm({ isOpen, onClose, onSuccess, editMember }: FamilyMemberFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    color: colorOptions[0],
  });

  useEffect(() => {
    if (isOpen) {
      if (editMember) {
        setForm({
          name: editMember.name,
          color: editMember.color,
        });
      } else {
        setForm({
          name: '',
          color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        });
      }
    }
  }, [isOpen, editMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMember) {
        await familyMembersApi.update(editMember.id, form);
      } else {
        await familyMembersApi.create(form);
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
            {editMember ? 'Edit Family Member' : 'Add Family Member'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-dark-card scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editMember ? 'Update Member' : 'Add Member'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
