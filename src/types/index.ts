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
