export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  grade?: string;
  studyGoal?: string;
  streak?: number;
  avgScore?: number;
}

export interface Subject {
  id: string;
  name: string;
  examDate: string; // ISO string
  priority: 'low' | 'medium' | 'high';
  color: string;
}

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  date: string; // ISO string
  completed: boolean;
  type: 'revision' | 'practice' | 'mock';
}

export interface RevisionPlan {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

export interface AppState {
  user: User | null;
  subjects: Subject[];
  tasks: Task[];
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}
