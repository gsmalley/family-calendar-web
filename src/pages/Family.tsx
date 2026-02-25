import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit2, Trash2 } from 'lucide-react';
import { familyMembers } from '../services/api';
import { FamilyMember } from '../types';

const avatarColors = [
  'from-red-500 to-pink-500',
  'from-orange-500 to-yellow-500',
  'from-green-500 to-emerald-500',
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-pink-500 to-rose-500',
];

export default function Family() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await familyMembers.getAll();
      setMembers(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Delete this family member?')) return;
    try {
      await familyMembers.delete(id);
      fetchMembers();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          Family Members
        </h2>
        <button className="p-2 bg-primary-500 rounded-lg">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-dark-card rounded-2xl animate-pulse"></div>
          ))
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No family members yet</p>
            <button className="mt-4 px-4 py-2 bg-primary-500 rounded-lg text-white">
              Add Member
            </button>
          </div>
        ) : (
          members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-dark-card rounded-2xl border border-dark-border p-4 text-center group relative"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-1.5 bg-dark-bg rounded-lg">
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => deleteMember(member.id)}
                  className="p-1.5 bg-dark-bg rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>

              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <span className="text-2xl font-bold text-white">{getInitials(member.name)}</span>
              </div>

              <h3 className="font-semibold text-white">{member.name}</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: member.color }}
                />
                <span className="text-xs text-gray-500">Color</span>
              </div>

              <div className="mt-4 pt-4 border-t border-dark-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-white">5</p>
                  <p className="text-xs text-gray-500">Tasks</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">3</p>
                  <p className="text-xs text-gray-500">Events</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">85%</p>
                  <p className="text-xs text-gray-500">Done</p>
                </div>
              </div>
            </motion.div>
          ))
        )}

        <motion.div
          whileTap={{ scale: 0.95 }}
          className="h-40 bg-dark-border/30 rounded-2xl border-2 border-dashed border-dark-border flex flex-col items-center justify-center cursor-pointer hover:border-primary-500/50 transition-colors"
        >
          <Plus className="w-8 h-8 text-gray-500 mb-2" />
          <p className="text-gray-500">Add Member</p>
        </motion.div>
      </div>

      <div className="bg-dark-card rounded-xl border border-dark-border p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Color Legend</h3>
        <div className="flex flex-wrap gap-2">
          {members.map(m => (
            <div key={m.id} className="flex items-center gap-2 bg-dark-bg px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
              <span className="text-xs text-gray-300">{m.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}