import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Plus, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { meals } from '../services/api';
import { Meal } from '../types';
import MealForm from '../components/MealForm';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export default function Meals() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekMeals, setWeekMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMealForm, setShowMealForm] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      const start = format(subDays(selectedDate, 3), 'yyyy-MM-dd');
      const end = format(addDays(selectedDate, 3), 'yyyy-MM-dd');
      const res = await meals.getAll({ start_date: start, end_date: end });
      setWeekMeals(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMealForDayAndType = (date: Date, type: string) => 
    weekMeals.find(m => m.date === format(date, 'yyyy-MM-dd') && m.meal_type === type);

  const prevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const nextDay = () => setSelectedDate(addDays(selectedDate, 1));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-6 h-6 text-orange-400" />
          Meal Plan
        </h2>
        <button className="p-2 bg-primary-500 rounded-lg">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Date Navigation */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevDay} className="p-2 hover:bg-dark-border rounded-lg">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          <button onClick={nextDay} className="p-2 hover:bg-dark-border rounded-lg">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Meal Cards */}
        <div className="space-y-3">
          {mealTypes.map((type) => {
            const meal = getMealForDayAndType(selectedDate, type);
            return (
              <motion.div
                key={type}
                whileTap={{ scale: 0.98 }}
                className="bg-dark-bg rounded-xl border border-dark-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      type === 'breakfast' ? 'bg-yellow-500/20 text-yellow-400' :
                      type === 'lunch' ? 'bg-green-500/20 text-green-400' :
                      type === 'dinner' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{type}</p>
                      <p className="text-white font-medium">{meal?.name || 'Not planned'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingMeal(meal);
                      setShowMealForm(true);
                    }}
                    className="p-2 text-gray-500 hover:text-primary-400"
                  >
                    {meal ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>
                {meal?.ingredients && (
                  <p className="text-sm text-gray-500 mt-2">{meal.ingredients}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Week Preview */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <h3 className="text-lg font-semibold text-white mb-3">This Week</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array(7).fill(null).map((_, i) => {
            const date = addDays(new Date(), i - 3);
            const hasMeals = weekMeals.some(m => m.date === format(date, 'yyyy-MM-dd'));
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${
                  format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    ? 'bg-primary-500'
                    : 'bg-dark-bg border border-dark-border'
                }`}
              >
                <span className="text-xs text-gray-400">{format(date, 'EEE')}</span>
                <span className="text-sm font-bold text-white">{format(date, 'd')}</span>
                {hasMeals && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Meal Form */}
      <MealForm
        isOpen={showMealForm}
        onClose={() => {
          setShowMealForm(false);
          setEditingMeal(undefined);
        }}
        onSuccess={() => fetchMeals()}
        editMeal={editingMeal}
        date={format(selectedDate, 'yyyy-MM-dd')}
      />
    </div>
  );
}
