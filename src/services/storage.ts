import { AppState, User, Subject, Task } from '../types';

const STORAGE_KEY = 'smart_revision_planner_state';

const defaultState: AppState = {
  user: null,
  subjects: [],
  tasks: [],
  settings: {
    theme: 'light',
    notifications: true,
  },
};

export const storage = {
  get: (): AppState => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultState;
  },
  save: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    return defaultState;
  },
};

export const authService = {
  login: (email: string): User | null => {
    const state = storage.get();
    // Simple mock: if email exists in state, return user
    if (state.user && state.user.email === email) {
      return state.user;
    }
    return null;
  },
  signup: (name: string, email: string): User => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      grade: 'Not set',
      studyGoal: 'Not set',
      streak: 0,
      avgScore: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
    const state = storage.get();
    state.user = newUser;
    storage.save(state);
    return newUser;
  },
  logout: () => {
    const state = storage.get();
    state.user = null;
    storage.save(state);
  },
};
