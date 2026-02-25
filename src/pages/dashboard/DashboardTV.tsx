import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Flame, Trophy, Star, Calendar, Utensils, Newspaper, X, Plus } from 'lucide-react';

// Types
interface Task {
  id: number;
  title: string;
  completed: boolean;
  due_date?: string;
  due_time?: string;
  priority: 'high' | 'medium' | 'low';
  assigned_to: number;
  memberName: string;
  memberColor: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  location?: string;
  event_type: string;
  memberId: number;
  memberName: string;
}

interface Meal {
  id: number;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  plannedBy?: string;
}

interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string;
  points: number;
  streak: number;
}

interface Weather {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
}

interface NewsItem {
  headline: string;
  source: string;
  url?: string;
}

interface UserStats {
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  currentStreak: number;
  totalPoints: number;
  pointsThisWeek: number;
  badges: string[];
}

// Mock Data
const mockFamilyMembers = [
  { id: 1, name: 'Dad', avatar: '👨', color: '#3B82F6' },
  { id: 2, name: 'Mom', avatar: '👩', color: '#EC4899' },
  { id: 3, name: 'Emma', avatar: '👧', color: '#10B981' },
  { id: 4, name: 'Jack', avatar: '👦', color: '#F59E0B' },
];

const mockTasks: Task[] = [
  { id: 1, title: 'Finish report', completed: false, due_time: '5:00 PM', priority: 'high', assigned_to: 1, memberName: 'Dad', memberColor: '#3B82F6' },
  { id: 2, title: 'Call grandma', completed: true, priority: 'medium', assigned_to: 1, memberName: 'Dad', memberColor: '#3B82F6' },
  { id: 3, title: 'Grocery shop', completed: false, due_time: '10:00 AM', priority: 'medium', assigned_to: 2, memberName: 'Mom', memberColor: '#EC4899' },
  { id: 4, title: 'Pick up kids', completed: false, due_time: '3:30 PM', priority: 'high', assigned_to: 2, memberName: 'Mom', memberColor: '#EC4899' },
  { id: 5, title: 'Math homework', completed: false, due_time: '4:00 PM', priority: 'high', assigned_to: 3, memberName: 'Emma', memberColor: '#10B981' },
  { id: 6, title: 'Practice piano', completed: false, due_time: '6:00 PM', priority: 'low', assigned_to: 3, memberName: 'Emma', memberColor: '#10B981' },
  { id: 7, title: 'Clean room', completed: false, due_time: '12:00 PM', priority: 'medium', assigned_to: 4, memberName: 'Jack', memberColor: '#F59E0B' },
  { id: 8, title: 'Soccer practice', completed: false, due_time: '4:00 PM', priority: 'medium', assigned_to: 4, memberName: 'Jack', memberColor: '#F59E0B' },
];

const mockEvents: Event[] = [
  { id: 1, title: 'Graduation Ceremony', date: '2026-02-25', start_time: '2:00 PM', end_time: '4:00 PM', location: 'School Gymnasium', event_type: 'school', memberId: 3, memberName: 'Emma' },
  { id: 2, title: 'Soccer Practice', date: '2026-02-25', start_time: '4:00 PM', end_time: '5:30 PM', location: 'Central Park', event_type: 'sports', memberId: 4, memberName: 'Jack' },
];

const mockMeals: Meal[] = [
  { id: 1, name: 'Pancakes', meal_type: 'breakfast', date: '2026-02-25', plannedBy: 'Mom' },
  { id: 2, name: 'Pizza', meal_type: 'lunch', date: '2026-02-25' },
  { id: 3, name: 'Pasta', meal_type: 'dinner', date: '2026-02-25', plannedBy: 'Dad' },
];

const mockLeaderboard: LeaderboardEntry[] = [
  { id: 3, name: 'Emma', avatar: '👧', points: 450, streak: 7 },
  { id: 4, name: 'Jack', avatar: '👦', points: 420, streak: 3 },
  { id: 1, name: 'Dad', avatar: '👨', points: 380, streak: 5 },
  { id: 2, name: 'Mom', avatar: '👩', points: 350, streak: 4 },
];

const mockWeather: Weather = {
  temp: 72,
  feelsLike: 70,
  condition: 'Sunny',
  icon: '☀️',
  humidity: 45,
};

const mockNews: NewsItem[] = [
  { headline: 'Local school wins state award', source: 'Local News' },
  { headline: 'Weather: Sunny weekend ahead', source: 'Weather' },
  { headline: 'New recipe: Tacos Tuesday!', source: 'Family Kitchen' },
];

const mockBadges = [
  { icon: '🌅', name: 'Early Bird', earned: true },
  { icon: '🏆', name: 'Task Master', earned: true },
  { icon: '🔥', name: '7-Day Streak', earned: true },
  { icon: '📚', name: 'Homework Hero', earned: false },
  { icon: '🍳', name: 'Meal Planner', earned: false },
];

// Components
function Header({ weather, dateStr }: { weather: Weather; dateStr: string }) {
  const [greeting, setGreeting] = useState('Good Morning');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🏠</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{greeting} 👋</h1>
          <p className="text-slate-400">The Smith Family</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl text-white font-semibold">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl">
        <span className="text-4xl">{weather.icon}</span>
        <div>
          <p className="text-2xl font-bold text-white">{weather.temp}°F</p>
          <p className="text-sm text-slate-400">{weather.condition}</p>
        </div>
      </div>
    </div>
  );
}

function TaskPanel({ tasks, onComplete }: { tasks: Task[]; onComplete: (id: number) => void }) {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  
  const filteredTasks = selectedMember 
    ? tasks.filter(t => t.assigned_to === selectedMember)
    : tasks;

  const membersWithTasks = mockFamilyMembers.filter(m => 
    tasks.some(t => t.assigned_to === m.id && !t.completed)
  );

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <CheckCircle className="w-6 h-6 text-green-400" />
        Tasks
      </h2>
      
      {/* Member Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setSelectedMember(null)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
            selectedMember === null 
              ? 'bg-primary-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          All
        </button>
        {mockFamilyMembers.map(member => (
          <button
            key={member.id}
            onClick={() => setSelectedMember(member.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
              selectedMember === member.id 
                ? 'text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
            style={{ backgroundColor: selectedMember === member.id ? member.color : undefined }}
          >
            {member.avatar} {member.name}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 bg-slate-700/50 rounded-xl border-l-4 cursor-pointer transition-all hover:bg-slate-700 ${
              task.completed ? 'opacity-50' : ''
            }`}
            style={{ borderLeftColor: task.memberColor }}
            onClick={() => !task.completed && onComplete(task.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-slate-500 hover:border-green-400'
              }`}>
                {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-400">{task.memberName}</span>
                  {task.due_time && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.due_time}
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                task.priority === 'high' ? 'bg-red-500' :
                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} />
            </div>
          </motion.div>
        ))}
        
        {filteredTasks.filter(t => !t.completed).length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <p className="text-4xl mb-2">🎉</p>
            <p>All done!</p>
          </div>
        )}
      </div>

      <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-4 h-4" /> Add Task
      </button>
    </div>
  );
}

function EventsSection({ events }: { events: Event[] }) {
  const eventIcons: Record<string, string> = {
    school: '🎓',
    sports: '🏃',
    family: '👨‍👩‍👧‍👦',
    work: '💼',
    default: '📅',
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-purple-400" />
        Today's Events
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-purple-500/50 cursor-pointer transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{eventIcons[event.event_type] || eventIcons.default}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{event.title}</h3>
                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {event.start_time}{event.end_time && ` - ${event.end_time}`}
                </p>
                {event.location && (
                  <p className="text-sm text-slate-400">{event.location}</p>
                )}
                <p className="text-xs text-purple-400 mt-1">For: {event.memberName}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {events.length === 0 && (
          <p className="col-span-2 text-center py-4 text-slate-500">No events today</p>
        )}
      </div>
    </div>
  );
}

function MealsSection({ meals }: { meals: Meal[] }) {
  const mealIcons = { breakfast: '🥞', lunch: '🍕', dinner: '🍝' };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Utensils className="w-6 h-6 text-orange-400" />
        Today's Meals
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
          const meal = meals.find(m => m.meal_type === type);
          return (
            <div key={type} className="p-4 bg-slate-700/50 rounded-xl text-center">
              <span className="text-3xl block mb-2">{mealIcons[type]}</span>
              <p className="text-xs text-slate-400 capitalize">{type}</p>
              <p className="font-medium text-white truncate">{meal?.name || '—'}</p>
              {meal?.plannedBy && (
                <p className="text-xs text-slate-500">by {meal.plannedBy}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewsSection({ news }: { news: NewsItem[] }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Newspaper className="w-6 h-6 text-blue-400" />
        Family News
      </h2>
      <div className="space-y-2">
        {news.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-colors"
          >
            <p className="text-white text-sm">{item.headline}</p>
            <p className="text-xs text-slate-500 mt-1">{item.source}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GamificationPanel({ 
  leaderboard, 
  badges, 
  selectedMember 
}: { 
  leaderboard: LeaderboardEntry[];
  badges: { icon: string; name: string; earned: boolean }[];
  selectedMember: number | null;
}) {
  const currentStats = mockFamilyMembers.find(m => m.id === (selectedMember || 3)) || mockFamilyMembers[2];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Family Ranking
      </h2>

      {/* Leaderboard */}
      <div className="space-y-2 mb-4">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              entry.id === selectedMember || (selectedMember === null && index === 0)
                ? 'bg-yellow-500/20 border border-yellow-500/30'
                : 'bg-slate-700/30'
            }`}
          >
            <span className="text-lg font-bold text-slate-400 w-6">
              {index === 0 ? '👑' : index + 1}
            </span>
            <span className="text-2xl">{entry.avatar}</span>
            <div className="flex-1">
              <p className="font-medium text-white">{entry.name}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-500" /> {entry.streak} day streak
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-yellow-400">{entry.points}</p>
              <p className="text-xs text-slate-500">pts</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats for selected member */}
      <div className="mb-4 p-4 bg-slate-700/30 rounded-xl">
        <h3 className="text-sm font-semibold text-slate-400 mb-2">👤 {currentStats.name}'s Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-slate-800/50 rounded-lg">
            <p className="text-xl font-bold text-green-400">5</p>
            <p className="text-xs text-slate-500">tasks today</p>
          </div>
          <div className="p-2 bg-slate-800/50 rounded-lg">
            <p className="text-xl font-bold text-orange-400">80%</p>
            <p className="text-xs text-slate-500">completed</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-2">Badges Earned</h3>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-center p-2 rounded-xl ${
                badge.earned 
                  ? 'bg-yellow-500/20 border border-yellow-500/30' 
                  : 'bg-slate-700/30 opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.earned ? badge.icon : '❓'}</span>
              <span className="text-xs text-slate-400 mt-1">{badge.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Total Points */}
      <div className="mt-auto p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30 text-center">
        <p className="text-sm text-slate-400">Total Family Points</p>
        <p className="text-3xl font-bold text-yellow-400">1,600</p>
        <p className="text-xs text-green-400">+150 this week</p>
      </div>
    </div>
  );
}

function Footer({ 
  members, 
  selectedMember, 
  onSelect 
}: { 
  members: typeof mockFamilyMembers;
  selectedMember: number | null;
  onSelect: (id: number | null) => void;
}) {
  return (
    <div className="bg-slate-900/80 px-6 py-3 flex items-center justify-center gap-4">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full font-medium transition-all ${
          selectedMember === null 
            ? 'bg-primary-500 text-white' 
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        All 👤
      </button>
      {members.map(member => (
        <button
          key={member.id}
          onClick={() => onSelect(member.id)}
          className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
            selectedMember === member.id 
              ? 'text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
          style={{ backgroundColor: selectedMember === member.id ? member.color : undefined }}
        >
          {member.avatar} {member.name}
        </button>
      ))}
    </div>
  );
}

// Main Dashboard Component
export default function DashboardTV() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<number[]>([]);

  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleCompleteTask = (taskId: number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    ));
    // Trigger confetti
    setConfetti(prev => [...prev, Date.now()]);
    setTimeout(() => {
      setConfetti(prev => prev.slice(1));
    }, 2000);
  };

  const filteredTasks = selectedMember
    ? tasks.filter(t => t.assigned_to === selectedMember)
    : tasks;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Confetti Overlay */}
      <AnimatePresence>
        {confetti.length > 0 && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: '50%', 
                  y: '50%', 
                  scale: 0,
                  rotate: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`, 
                  scale: 1,
                  rotate: Math.random() * 720,
                  opacity: 0
                }}
                transition={{ duration: 1 + Math.random() }}
                className="absolute w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: ['#FFD700', '#EF4444', '#10B981', '#3B82F6', '#EC4899'][i % 5]
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <Header weather={mockWeather} dateStr={dateStr} />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Tasks */}
        <div className="w-80 flex-shrink-0">
          <TaskPanel tasks={filteredTasks} onComplete={handleCompleteTask} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <EventsSection events={mockEvents} />
          <MealsSection meals={mockMeals} />
          <NewsSection news={mockNews} />
        </div>

        {/* Right Panel - Gamification */}
        <div className="w-80 flex-shrink-0">
          <GamificationPanel 
            leaderboard={mockLeaderboard} 
            badges={mockBadges}
            selectedMember={selectedMember}
          />
        </div>
      </div>

      <Footer 
        members={mockFamilyMembers} 
        selectedMember={selectedMember}
        onSelect={setSelectedMember}
      />
    </div>
  );
}
