export interface User {
  id: string;
  username: string;
  role: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  all_day: boolean;
  family_member_id?: string;
  recurrence?: string;
  event_type_id?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  family_member_id?: string;
  category?: string;
  task_type_id?: string;
  created_at: string;
}

export interface Homework {
  id: string;
  subject: string;
  description?: string;
  due_date: string;
  completed: boolean;
  family_member_id?: string;
  created_at: string;
}

export interface InstrumentPractice {
  id: string;
  instrument: string;
  duration_minutes?: number;
  notes?: string;
  practice_date: string;
  family_member_id?: string;
  created_at: string;
}

export interface Meal {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  ingredients?: string;
  notes?: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  schedule: string;
  instructor?: string;
  notes?: string;
  family_member_id?: string;
  created_at: string;
}

export interface ClassAttendance {
  id: string;
  class_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface EventType {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskType {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface GamificationData {
  points: number;
  streak: number;
  badges: Badge[];
  rank: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned_at: string;
}

// Team Kanban Types
export type KanbanStatus = 'backlog' | 'in_progress' | 'testing' | 'review' | 'done';
export type KanbanPriority = 'p1' | 'p2' | 'p3';
export type KanbanCategory = 'feature' | 'bug' | 'chore' | 'docs';
export type BacklogStatus = 'blocked' | 'ready' | 'need_specs';

export interface TeamKanbanTask {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: KanbanPriority;
  category: KanbanCategory;
  storyPoints: number;
  labels: string[];
  project: string;
  backlogStatus?: BacklogStatus;
  assignee: string;
  startedAt: string | null;
  completedAt: string | null;
  completedBy: string | null;
  reviewer: string | null;
  prLink: string | null;
  deployedTo: string | null;
  createdAt: string;
}

export interface KanbanTaskFilters {
  assignee?: string;
  category?: KanbanCategory;
  priority?: KanbanPriority;
  project?: string;
  status?: KanbanStatus;
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: KanbanPriority;
  category: KanbanCategory;
  storyPoints: number;
  labels: string[];
  project: string;
  backlogStatus?: BacklogStatus;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  assignee?: string;
  reviewer?: string;
  prLink?: string;
  deployedTo?: string;
  startedAt?: string | null;
  completedAt?: string | null;
  completedBy?: string | null;
}
