import { useState, useEffect, useCallback } from 'react';
import { teamKanban } from '../services/api';
import type { 
  TeamKanbanTask, 
  KanbanStatus, 
  KanbanTaskFilters,
  KanbanPriority,
  KanbanCategory 
} from '../types';

// Agent configuration
const AGENTS = [
  { name: 'rudy', emoji: '🦋', color: 'bg-purple-500' },
  { name: 'penelope', emoji: '🎨', color: 'bg-pink-500' },
  { name: 'pow', emoji: '🛠️', color: 'bg-orange-500' },
  { name: 'autumn', emoji: '🌸', color: 'bg-green-500' },
  { name: 'sherlock', emoji: '🕵️', color: 'bg-blue-500' },
  { name: 'garrison', emoji: '🚀', color: 'bg-cyan-500' },
] as const;

const COLUMNS: { id: KanbanStatus; label: string; emoji: string }[] = [
  { id: 'backlog', label: 'Backlog', emoji: '📋' },
  { id: 'in_progress', label: 'In Progress', emoji: '🏗️' },
  { id: 'testing', label: 'Testing', emoji: '🧪' },
  { id: 'review', label: 'Review', emoji: '🔍' },
  { id: 'done', label: 'Done', emoji: '✅' },
];

const PRIORITY_COLORS: Record<KanbanPriority, string> = {
  p1: 'border-red-500',
  p2: 'border-yellow-500', 
  p3: 'border-green-500',
};

const PRIORITY_LABELS: Record<KanbanPriority, string> = {
  p1: '🔴 p1',
  p2: '🟡 p2',
  p3: '🟢 p3',
};

const CATEGORY_LABELS: Record<KanbanCategory, string> = {
  feature: 'feature',
  bug: 'bug',
  chore: 'chore',
  docs: 'docs',
};

const PROJECT_COLORS: Record<string, { bg: string; text: string }> = {
  'Family Calendar V2': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Team Tools': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Website Updates': { bg: 'bg-green-100', text: 'text-green-700' },
};

function getProjectColor(project: string) {
  return PROJECT_COLORS[project] || { bg: 'bg-gray-100', text: 'text-gray-700' };
}

function getAgentInfo(name: string) {
  return AGENTS.find(a => a.name.toLowerCase() === name.toLowerCase()) || AGENTS[2]; // default to pow
}

export default function TeamKanban() {
  const [tasks, setTasks] = useState<TeamKanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<KanbanTaskFilters>({});
  const [view, setView] = useState<'team' | 'mine'>('team');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamKanban.getTasks(filters);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to load tasks. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleMoveTask = async (taskId: string, newStatus: KanbanStatus) => {
    try {
      await teamKanban.moveTask(taskId, newStatus);
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error('Failed to move task:', err);
      setError('Failed to move task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await teamKanban.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task');
    }
  };

  const filteredTasks = view === 'mine' 
    ? tasks.filter(t => t.assignee === 'pow') // For now, hardcoded to pow
    : tasks;

  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = filteredTasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<KanbanStatus, TeamKanbanTask[]>);

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Kanban</h1>
          <p className="text-gray-500 text-sm">Development task board</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* View Toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            <button
              onClick={() => setView('team')}
              className={`px-4 py-2 text-sm font-medium ${
                view === 'team' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Team View
            </button>
            <button
              onClick={() => setView('mine')}
              className={`px-4 py-2 text-sm font-medium ${
                view === 'mine' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Tasks
            </button>
          </div>

          {/* Filter Dropdowns */}
          <select
            value={filters.assignee || ''}
            onChange={(e) => setFilters(f => ({ ...f, assignee: e.target.value || undefined }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Assignees</option>
            {AGENTS.map(agent => (
              <option key={agent.name} value={agent.name}>
                {agent.emoji} {agent.name}
              </option>
            ))}
          </select>

          <select
            value={filters.category || ''}
            onChange={(e) => setFilters(f => ({ ...f, category: (e.target.value as KanbanCategory) || undefined }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Categories</option>
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
            <option value="chore">Chore</option>
            <option value="docs">Docs</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters(f => ({ ...f, priority: (e.target.value as KanbanPriority) || undefined }))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Priorities</option>
            <option value="p1">P1 - Critical</option>
            <option value="p2">P2 - High</option>
            <option value="p3">P3 - Normal</option>
          </select>

          <button
            onClick={fetchTasks}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <div 
            key={column.id} 
            className="flex-shrink-0 w-72 bg-gray-50 rounded-lg p-3"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{column.emoji}</span>
                <h2 className="font-semibold text-gray-800">{column.label}</h2>
              </div>
              <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                {tasksByStatus[column.id]?.length || 0}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3 min-h-[200px]">
              {tasksByStatus[column.id]?.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onMove={handleMoveTask}
                  onDelete={handleDeleteTask}
                />
              ))}
              {tasksByStatus[column.id]?.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: TeamKanbanTask;
  onMove: (taskId: string, status: KanbanStatus) => void;
  onDelete: (taskId: string) => void;
}

function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const agent = getAgentInfo(task.assignee);
  const projectColors = getProjectColor(task.project);

  return (
    <div 
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${PRIORITY_COLORS[task.priority]} p-3 hover:shadow-md transition-shadow ${isDragging ? 'opacity-50 rotate-3' : ''}`}
    >
      {/* Title */}
      <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>

      {/* Project & Backlog Status */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className={`text-xs px-2 py-0.5 rounded ${projectColors.bg} ${projectColors.text}`}>
          {task.project}
        </span>
        {task.status === 'backlog' && task.backlogStatus && (
          <span className={`text-xs px-2 py-0.5 rounded ${
            task.backlogStatus === 'blocked' ? 'bg-red-100 text-red-700' :
            task.backlogStatus === 'ready' ? 'bg-green-100 text-green-700' :
            'bg-orange-100 text-orange-700'
          }`}>
            {task.backlogStatus === 'blocked' ? '🔴 blocked' :
             task.backlogStatus === 'ready' ? '🟢 ready' :
             '🟠 need specs'}
          </span>
        )}
      </div>

      {/* Priority & Category */}
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-xs">{PRIORITY_LABELS[task.priority]}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          task.category === 'feature' ? 'bg-blue-100 text-blue-700' :
          task.category === 'bug' ? 'bg-red-100 text-red-700' :
          task.category === 'chore' ? 'bg-gray-100 text-gray-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {CATEGORY_LABELS[task.category]}
        </span>
      </div>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map(label => (
            <span key={label} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Assignee & Story Points */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full ${agent.color} flex items-center justify-center text-white text-xs`}>
            {agent.emoji}
          </span>
          <span className="text-xs text-gray-500">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.storyPoints > 0 && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {task.storyPoints} pts
            </span>
          )}
          {/* Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-lg z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(task.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
