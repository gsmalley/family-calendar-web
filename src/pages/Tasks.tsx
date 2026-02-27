import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Filter, ChevronDown, X, Pencil, Trash2 } from 'lucide-react';
import { tasks, familyMembers } from '../services/api';
import { Task, FamilyMember } from '../types';
import TaskForm from '../components/TaskForm';

const priorities = {
  low: { label: 'Low', color: 'bg-blue-500' },
  medium: { label: 'Medium', color: 'bg-yellow-500' },
  high: { label: 'High', color: 'bg-red-500' },
};

export default function Tasks() {
  const [tasks_, setTasks] = useState<Task[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchFamily();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const params: any = {};
      if (filter === 'pending') params.completed = false;
      if (filter === 'completed') params.completed = true;
      const res = await tasks.getAll(params);
      setTasks(res.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamily = async () => {
    try {
      const res = await familyMembers.getAll();
      setFamily(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleTask = async (id: string) => {
    try {
      await tasks.toggle(id);
      fetchTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await tasks.delete(id);
      fetchTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredTasks = tasks_;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-green-400" />
          Tasks
        </h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 bg-primary-500 rounded-lg"
        >
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
                ? 'bg-primary-500 text-white'
                : 'bg-dark-card text-gray-400 border border-dark-border'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-dark-card rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-dark-card rounded-xl border p-4 transition-all ${
                task.completed ? 'border-green-500/30 opacity-60' : 'border-dark-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-0.5 ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-600 hover:border-green-500'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${priorities[task.priority].color} text-white`}>
                      {priorities[task.priority].label}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-500">Due {task.due_date}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-gray-400 hover:text-primary-400 hover:bg-dark-border rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-border rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Task Form */}
      <TaskForm
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => fetchTasks()}
      />

      {/* Edit Task Form */}
      <TaskForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditTask(null);
        }}
        onSuccess={() => {
          fetchTasks();
          setEditTask(null);
        }}
        editTask={editTask}
      />
    </div>
  );
}
