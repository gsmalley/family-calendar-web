import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, Flame, Trophy, Star, ChevronRight,
  Calendar, BookOpen, Utensils, GraduationCap, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { tasks, homework, meals } from '../services/api';
import { Task, Homework, Meal } from '../types';

const stats = [
  { label: 'Tasks Done', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  { label: 'Streak', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { label: 'Points', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { label: 'Rank', icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/20' },
];

const quickLinks = [
  { path: '/calendar', icon: Calendar, label: 'Calendar', color: 'from-blue-500 to-blue-600' },
  { path: '/tasks', icon: CheckCircle, label: 'Tasks', color: 'from-green-500 to-green-600' },
  { path: '/homework', icon: BookOpen, label: 'Homework', color: 'from-purple-500 to-purple-600' },
  { path: '/meals', icon: Utensils, label: 'Meals', color: 'from-orange-500 to-orange-600' },
  { path: '/classes', icon: GraduationCap, label: 'Classes', color: 'from-pink-500 to-pink-600' },
];

const badges = [
  { name: 'Early Bird', icon: '🌅', earned: true },
  { name: 'Task Master', icon: '🏆', earned: true },
  { name: 'Streak 7', icon: '🔥', earned: false },
  { name: 'Homework Hero', icon: '📚', earned: false },
];

export default function Dashboard() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [dueHomework, setDueHomework] = useState<Homework[]>([]);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock gamification data
  const userStats = {
    tasksDone: 42,
    streak: 7,
    points: 1250,
    rank: 'Gold',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, homeworkRes, mealsRes] = await Promise.all([
          tasks.getAll({ completed: false }),
          homework.getAll({ completed: false }),
          meals.getByDate(new Date().toISOString().split('T')[0]),
        ]);
        setUpcomingTasks(tasksRes.data.slice(0, 5));
        setDueHomework(homeworkRes.data.slice(0, 3));
        setTodayMeals(mealsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-white">Good Morning! 👋</h2>
        <p className="text-gray-400">Here's your family's day at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-dark-card rounded-2xl border border-dark-border p-4 text-center"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-white">
              {stat.label === 'Tasks Done' && userStats.tasksDone}
              {stat.label === 'Streak' && userStats.streak}
              {stat.label === 'Points' && userStats.points}
              {stat.label === 'Rank' && userStats.rank}
            </p>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {quickLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={link.path}
                className="flex flex-col items-center gap-2 p-4 bg-dark-card rounded-2xl border border-dark-border hover:border-primary-500/50 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-300">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Upcoming Tasks
            </h3>
            <Link to="/tasks" className="text-primary-400 text-sm flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-dark-border/50 rounded-xl"></div>
                ))}
              </div>
            ) : upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending tasks! 🎉</p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{task.title}</p>
                    {task.due_date && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {task.due_date}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Due Homework */}
        <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Due Homework
            </h3>
            <Link to="/homework" className="text-primary-400 text-sm flex items-center gap-1 hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-dark-border/50 rounded-xl"></div>
                ))}
              </div>
            ) : dueHomework.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No homework due! 🎉</p>
            ) : (
              dueHomework.map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-xl border border-dark-border"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{hw.subject}</p>
                    <p className="text-xs text-gray-500">Due {hw.due_date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-400" />
            Today's Meals
          </h3>
          <Link to="/meals" className="text-primary-400 text-sm flex items-center gap-1 hover:underline">
            Plan meals <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            <div className="col-span-3 animate-pulse flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-20 bg-dark-border/50 rounded-xl"></div>
              ))}
            </div>
          ) : todayMeals.length === 0 ? (
            <p className="col-span-3 text-gray-500 text-center py-4">No meals planned today</p>
          ) : (
            ['breakfast', 'lunch', 'dinner'].map((type) => {
              const meal = todayMeals.find(m => m.meal_type === type);
              return (
                <div key={type} className="p-3 bg-dark-bg rounded-xl border border-dark-border text-center">
                  <p className="text-xs text-gray-500 capitalize">{type}</p>
                  <p className="text-white font-medium truncate">{meal?.name || '—'}</p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Badges
          </h3>
          <Link to="/leaderboard" className="text-primary-400 text-sm flex items-center gap-1 hover:underline">
            Leaderboard <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className={`flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl border ${
                badge.earned 
                  ? 'bg-yellow-500/10 border-yellow-500/30' 
                  : 'bg-dark-border/30 border-dark-border opacity-50'
              }`}
            >
              <span className="text-3xl">{badge.icon}</span>
              <span className="text-xs text-gray-400">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
