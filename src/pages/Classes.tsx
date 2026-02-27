import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Calendar, Clock, CheckCircle } from 'lucide-react';
import { classes, familyMembers } from '../services/api';
import { Class, FamilyMember } from '../types';

export default function Classes() {
  const [classList, setClassList] = useState<Class[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClassForm, setShowClassForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [classesRes, familyRes] = await Promise.all([
        classes.getAll(),
        familyMembers.getAll(),
      ]);
      setClassList(classesRes.data);
      setFamily(familyRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (id?: string) => family.find(m => m.id === id)?.name || 'All';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-pink-400" />
          Classes
        </h2>
        <button 
          onClick={() => setShowClassForm(true)}
          className="p-2 bg-primary-500 rounded-lg"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-dark-card rounded-xl border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-white">{classList.length}</p>
          <p className="text-xs text-gray-400">Total Classes</p>
        </div>
        <div className="bg-dark-card rounded-xl border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{classList.length}</p>
          <p className="text-xs text-gray-400">This Week</p>
        </div>
        <div className="bg-dark-card rounded-xl border border-dark-border p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">85%</p>
          <p className="text-xs text-gray-400">Attendance</p>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-dark-card rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : classList.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No classes yet</p>
            <p className="text-sm text-gray-600">Add your homeschool classes</p>
          </div>
        ) : (
          classList.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-card rounded-xl border border-dark-border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{cls.name}</h3>
                    <p className="text-sm text-gray-400">{cls.subject}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {cls.schedule}
                      </span>
                      {cls.instructor && (
                        <span className="text-xs text-gray-500">
                          👤 {cls.instructor}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
              {cls.notes && (
                <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-dark-border">
                  {cls.notes}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
