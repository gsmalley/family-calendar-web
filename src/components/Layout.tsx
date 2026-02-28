import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Calendar, CheckSquare, BookOpen, Utensils, 
  GraduationCap, Users, Trophy, Menu, X, LogOut, Sparkles, Kanban
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/homework', icon: BookOpen, label: 'Homework' },
  { path: '/meals', icon: Utensils, label: 'Meals' },
  { path: '/classes', icon: GraduationCap, label: 'Classes' },
  { path: '/family', icon: Users, label: 'Family' },
  { path: '/team-kanban', icon: Kanban, label: 'Team Board' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-card/80 backdrop-blur-lg border-b border-dark-border">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Family Hub</h1>
              <p className="text-xs text-gray-400">Welcome, {user?.username}</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-dark-border/50 text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-dark-card border-b border-dark-border"
          >
            <nav className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-gray-400 hover:bg-dark-border/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Desktop/Tablet) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/90 backdrop-blur-lg border-t border-dark-border hidden md:flex">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
                isActive
                  ? 'text-primary-400'
                  : 'text-gray-500 hover:text-white'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-dark-card/90 backdrop-blur-lg border-t border-dark-border md:hidden">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'text-primary-400'
                    : 'text-gray-500'
                }`
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
