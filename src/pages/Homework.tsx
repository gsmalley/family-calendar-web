import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Clock, CheckCircle } from 'lucide-react';
import { homework, familyMembers } from '../services/api';
import { Homework, FamilyMember } from '../types';

export default function Homework() {
  const [homework_, setHomework] = useState<Homework[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const params: any = {};
      if (filter === 'pending') params.completed = false;
      if (filter === 'completed') params.completed = true;
      
      const [hwRes, familyRes] = await Promise.all([
        homework.getAll(params),
        familyMembers.getAll(),
      ]);
      setHomework(hwRes.data);
      setFamily(familyRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHomework = async (id: string, completed: boolean) => {
    try {
      await homework.update(id, { completed: !completed });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getMemberName = (id?: string) => family.find(m => m.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-400" />
          Homework
        </h2>
        <button className="p-2 bg-primary-500 rounded-lg">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-purple-500 text-white'
                : 'bg-dark-card text-gray-400 border border-dark-border'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-dark-card rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : homework_.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No homework found</p>
          </div>
        ) : (
          homework_.map((hw, index) => (
            <motion.div
              key={hw.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-dark-card rounded-xl border p-4 transition-all ${
                hw.completed ? 'border-green-500/30' : 'border-dark-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleHomework(hw.id, hw.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                      hw.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-600 hover:border-green-500'
                    }`}
                  >
                    {hw.completed && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                  <div>
                    <p className={`font-medium ${hw.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {hw.subject}
                    </p>
                    {hw.description && (
                      <p className="text-sm text-gray-500 mt-1">{hw.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {hw.due_date}
                      </span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#a855f7' }}
                      >
                        {getMemberName(hw.family_member_id)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
