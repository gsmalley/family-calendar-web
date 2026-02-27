import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import { classes, familyMembers } from '../services/api';
import { Class, FamilyMember } from '../types';

export default function Classes() {
  const [classList, setClassList] = useState<Class[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const classData = {
      name: formData.get('name'),
      subject: formData.get('subject'),
      schedule: formData.get('schedule'),
      instructor: formData.get('instructor'),
      notes: formData.get('notes'),
      family_member_id: formData.get('family_member_id'),
    };

    try {
      if (editingClass) {
        await classes.update(editingClass.id, classData);
      } else {
        await classes.create(classData);
      }
      setShowClassForm(false);
      setEditingClass(null);
      fetchData();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this class?')) {
      try {
        await classes.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

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
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingClass(cls); setShowClassForm(true); }}
                    className="p-2 text-gray-500 hover:text-primary-400"
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cls.id)}
                    className="p-2 text-gray-500 hover:text-red-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
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

      {/* Class Form Modal */}
      {showClassForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-card rounded-xl border border-dark-border p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingClass ? 'Edit Class' : 'Add Class'}
              </h3>
              <button 
                onClick={() => { setShowClassForm(false); setEditingClass(null); }}
                className="p-2 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Class Name</label>
                <input
                  name="name"
                  defaultValue={editingClass?.name}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Math 101"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject</label>
                <input
                  name="subject"
                  defaultValue={editingClass?.subject}
                  required
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Schedule</label>
                <input
                  name="schedule"
                  defaultValue={editingClass?.schedule}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Mon/Wed/Fri 10am"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Instructor</label>
                <input
                  name="instructor"
                  defaultValue={editingClass?.instructor}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                  placeholder="e.g., Mom"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign To</label>
                <select
                  name="family_member_id"
                  defaultValue={editingClass?.family_member_id || ''}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All</option>
                  {family.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  name="notes"
                  defaultValue={editingClass?.notes}
                  rows={3}
                  className="w-full bg-dark-border border border-dark-border rounded-lg px-3 py-2 text-white"
                  placeholder="Additional notes..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg"
              >
                {editingClass ? 'Update Class' : 'Add Class'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
