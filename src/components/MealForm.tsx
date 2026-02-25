import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { meals as mealsApi } from '../services/api';
import { Meal } from '../types';

interface MealFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMeal?: Meal;
  date: string;
}

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

export default function MealForm({ isOpen, onClose, onSuccess, editMeal, date }: MealFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    date: date,
    meal_type: 'dinner',
    name: '',
    ingredients: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editMeal) {
        setForm({
          date: editMeal.date,
          meal_type: editMeal.meal_type,
          name: editMeal.name,
          ingredients: editMeal.ingredients || '',
          notes: editMeal.notes || '',
        });
      } else {
        setForm({
          date,
          meal_type: 'dinner',
          name: '',
          ingredients: '',
          notes: '',
        });
      }
    }
  }, [isOpen, editMeal, date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMeal) {
        await mealsApi.update(editMeal.id, form);
      } else {
        await mealsApi.create(form);
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
            {editMeal ? 'Edit Meal' : 'Plan Meal'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-dark-border rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Meal Type</label>
              <select
                value={form.meal_type}
                onChange={e => setForm({ ...form, meal_type: e.target.value as any })}
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                {mealTypes.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Meal Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="e.g., Spaghetti Bolognese"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Ingredients</label>
            <textarea
              value={form.ingredients}
              onChange={e => setForm({ ...form, ingredients: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
              rows={3}
              placeholder="List main ingredients..."
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
              rows={2}
              placeholder="Any special notes..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : editMeal ? 'Update Meal' : 'Add Meal'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
