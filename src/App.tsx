import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardTV from './pages/dashboard/DashboardTV';
import Calendar from './pages/Calendar';
import Tasks from './pages/Tasks';
import Homework from './pages/Homework';
import Meals from './pages/Meals';
import Classes from './pages/Classes';
import Family from './pages/Family';
import Leaderboard from './pages/Leaderboard';
import TeamKanban from './pages/TeamKanban';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Public route - no auth required for TV dashboard */}
      <Route path="/tv" element={<DashboardTV />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/homework" element={<Homework />} />
                <Route path="/meals" element={<Meals />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/family" element={<Family />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/team-kanban" element={<TeamKanban />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
