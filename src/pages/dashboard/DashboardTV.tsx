import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, Flame, Trophy, Calendar, Utensils, Newspaper, Plus, Loader2 } from 'lucide-react';
import { tasks as tasksApi, events as eventsApi, meals as mealsApi, familyMembers, dashboard } from '../../services/api';

// Types
interface Task {
  id: number;
  title: string;
  completed: boolean;
  due_date?: string;
  due_time?: string;
  priority: 'high' | 'medium' | 'low';
  assigned_to: number;
  family_member_id: number;
}

interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  color: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time?: string;
  location?: string;
  event_type: string;
  family_member_id: number;
}

interface Meal {
  id: number;
  name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  planned_by?: string;
}

interface LeaderboardEntry {
  id: number;
  user_id: number;
  name: string;
  avatar: string;
  points: number;
  streak: number;
}

interface Weather {
  temp: number;
  feels_like: number;
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
  tasks_completed_today: number;
  tasks_completed_this_week: number;
  current_streak: number;
  total_points: number;
  points_this_week: number;
  badges: string[];
}

// Helper to get member info
const getMemberInfo = (members: FamilyMember[], id: number) => {
  const member = members.find(m => m.id === id);
  return member || { name: 'Unknown', color: '#666' };
};

// Header Component
function Header({ weather, dateStr }: { weather: Weather | null; dateStr: string }) {
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
        {weather ? (
          <>
            <span className="text-4xl">{weather.icon}</span>
            <div>
              <p className="text-2xl font-bold text-white">{weather.temp}°F</p>
              <p className="text-sm text-slate-400">{weather.condition}</p>
            </div>
          </>
        ) : (
          <p className="text-slate-400">Loading weather...</p>
        )}
      </div>
    </div>
  );
}

// Task Panel Component
function TaskPanel({ 
  tasks, 
  members, 
  onComplete,
  loading 
}: { 
  tasks: Task[]; 
  members: FamilyMember[];
  onComplete: (id: number) => void;
  loading: boolean;
}) {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  
  const filteredTasks = selectedMember 
    ? tasks.filter(t => t.family_member_id === selectedMember && !t.completed)
    : tasks.filter(t => !t.completed);

  const membersWithTasks = members.filter(m => 
    tasks.some(t => t.family_member_id === m.id && !t.completed)
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
        {members.map(member => (
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p className="text-4xl mb-2">🎉</p>
            <p>All done!</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const member = getMemberInfo(members, task.family_member_id);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-slate-700/50 rounded-xl border-l-4 cursor-pointer transition-all hover:bg-slate-700"
                style={{ borderLeftColor: member.color }}
                onClick={() => onComplete(task.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full border-2 border-slate-500 hover:border-green-400 flex items-center justify-center transition-all" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">{member.name}</span>
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
            );
          })
        )}
      </div>

      <button className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl flex items-center justify-center gap-2 transition-colors">
        <Plus className="w-4 h-4" /> Add Task
      </button>
    </div>
  );
}

// Events Section Component
function EventsSection({ events, members, loading }: { events: Event[]; members: FamilyMember[]; loading: boolean }) {
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
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-center py-4 text-slate-500">No events today</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event, index) => {
            const member = getMemberInfo(members, event.family_member_id);
            return (
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
                    <p className="text-xs text-purple-400 mt-1">For: {member.name}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Meals Section Component
function MealsSection({ meals, loading }: { meals: Meal[]; loading: boolean }) {
  const mealIcons = { breakfast: '🥞', lunch: '🍕', dinner: '🍝' };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Utensils className="w-6 h-6 text-orange-400" />
        Today's Meals
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {(['breakfast', 'lunch', 'dinner'] as const).map(type => {
            const meal = meals.find(m => m.meal_type === type);
            return (
              <div key={type} className="p-4 bg-slate-700/50 rounded-xl text-center">
                <span className="text-3xl block mb-2">{mealIcons[type]}</span>
                <p className="text-xs text-slate-400 capitalize">{type}</p>
                <p className="font-medium text-white truncate">{meal?.name || '—'}</p>
                {meal?.planned_by && (
                  <p className="text-xs text-slate-500">by {meal.planned_by}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// News Section Component
function NewsSection({ news, loading }: { news: NewsItem[]; loading: boolean }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 mt-4">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Newspaper className="w-6 h-6 text-blue-400" />
        Family News
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
        </div>
      ) : news.length === 0 ? (
        <p className="text-center py-4 text-slate-500">No news available</p>
      ) : (
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
      )}
    </div>
  );
}

// Gamification Panel Component
function GamificationPanel({ 
  leaderboard, 
  userStats,
  badges, 
  selectedMember,
  members,
  loading
}: { 
  leaderboard: LeaderboardEntry[];
  userStats: UserStats | null;
  badges: { icon: string; name: string; earned: boolean }[];
  selectedMember: number | null;
  members: FamilyMember[];
  loading: boolean;
}) {
  const currentMember = selectedMember 
    ? members.find(m => m.id === selectedMember)
    : members[0];
    
  const currentStats = userStats;

  // Map badges from API
  const badgeIcons: Record<string, string> = {
    'early_bird': '🌅',
    'task_master': '🏆',
    'streak_7': '🔥',
    'homework_hero': '📚',
    'meal_planner': '🍳',
  };

  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 h-full overflow-hidden flex flex-col">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Family Ranking
      </h2>

      {/* Leaderboard */}
      <div className="space-y-2 mb-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const member = members.find(m => m.id === entry.user_id);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  entry.user_id === selectedMember || (selectedMember === null && index === 0)
                    ? 'bg-yellow-500/20 border border-yellow-500/30'
                    : 'bg-slate-700/30'
                }`}
              >
                <span className="text-lg font-bold text-slate-400 w-6">
                  {index === 0 ? '👑' : index + 1}
                </span>
                <span className="text-2xl">{member?.avatar || '👤'}</span>
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
            );
          })
        )}
      </div>

      {/* Stats for selected member */}
      {currentStats && (
        <div className="mb-4 p-4 bg-slate-700/30 rounded-xl">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">👤 {currentMember?.name || 'User'}'s Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xl font-bold text-green-400">{currentStats.tasks_completed_today}</p>
              <p className="text-xs text-slate-500">tasks today</p>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <p className="text-xl font-bold text-orange-400">{currentStats.current_streak}</p>
              <p className="text-xs text-slate-500">day streak</p>
            </div>
          </div>
        </div>
      )}

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
        <p className="text-3xl font-bold text-yellow-400">
          {leaderboard.reduce((sum, e) => sum + e.points, 0)}
        </p>
        {currentStats && (
          <p className="text-xs text-green-400">+{currentStats.points_this_week} this week</p>
        )}
      </div>
    </div>
  );
}

// Footer Component
function Footer({ 
  members, 
  selectedMember, 
  onSelect 
}: { 
  members: FamilyMember[];
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const dateStr = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const today = new Date().toISOString().split('T')[0];

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          membersRes,
          tasksRes,
          eventsRes,
          mealsRes,
          leaderboardRes,
          weatherRes,
          newsRes
        ] = await Promise.all([
          familyMembers.getAll(),
          tasksApi.getAll({ completed: false }),
          eventsApi.getAll({ start: today, end: today }),
          mealsApi.getByDate(today),
          dashboard.getLeaderboard(),
          dashboard.getWeather(),
          dashboard.getNews(),
        ]);

        setMembers(membersRes.data);
        setTasks(tasksRes.data);
        setEvents(eventsRes.data);
        setMeals(mealsRes.data);
        setLeaderboard(leaderboardRes.data);
        setWeather(weatherRes.data);
        setNews(newsRes.data);

        // Fetch user stats for selected member or first member
        if (leaderboardRes.data.length > 0) {
          const firstUserId = leaderboardRes.data[0].user_id;
          try {
            const statsRes = await dashboard.getUserStats(String(firstUserId));
            setUserStats(statsRes.data);
          } catch (e) {
            console.log('Could not fetch user stats:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [today]);

  // Fetch user stats when selectedMember changes
  useEffect(() => {
    if (selectedMember) {
      dashboard.getUserStats(String(selectedMember))
        .then(res => setUserStats(res.data))
        .catch(console.error);
    } else if (leaderboard.length > 0) {
      dashboard.getUserStats(String(leaderboard[0].user_id))
        .then(res => setUserStats(res.data))
        .catch(console.error);
    }
  }, [selectedMember, leaderboard]);

  const handleCompleteTask = async (taskId: number) => {
    try {
      await tasksApi.toggle(String(taskId));
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ));
      // Trigger confetti
      setConfetti(prev => [...prev, Date.now()]);
      setTimeout(() => {
        setConfetti(prev => prev.slice(1));
      }, 2000);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // Build badges from API (mock for now - would come from user stats)
  const badges = [
    { icon: '🌅', name: 'Early Bird', earned: true },
    { icon: '🏆', name: 'Task Master', earned: true },
    { icon: '🔥', name: '7-Day Streak', earned: userStats?.current_streak ? userStats.current_streak >= 7 : false },
    { icon: '📚', name: 'Homework Hero', earned: false },
    { icon: '🍳', name: 'Meal Planner', earned: false },
  ];

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

      <Header weather={weather} dateStr={dateStr} />

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Panel - Tasks */}
        <div className="w-80 flex-shrink-0">
          <TaskPanel 
            tasks={tasks} 
            members={members} 
            onComplete={handleCompleteTask}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <EventsSection events={events} members={members} loading={loading} />
          <MealsSection meals={meals} loading={loading} />
          <NewsSection news={news} loading={loading} />
        </div>

        {/* Right Panel - Gamification */}
        <div className="w-80 flex-shrink-0">
          <GamificationPanel 
            leaderboard={leaderboard}
            userStats={userStats}
            badges={badges}
            selectedMember={selectedMember}
            members={members}
            loading={loading}
          />
        </div>
      </div>

      <Footer 
        members={members} 
        selectedMember={selectedMember}
        onSelect={setSelectedMember}
      />
    </div>
  );
}
