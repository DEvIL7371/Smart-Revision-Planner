import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Search, 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Trash2, 
  Check, 
  Moon, 
  Sun, 
  UserPlus, 
  LogIn 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isToday, isFuture, parseISO, differenceInDays } from 'date-fns';
import { AppState, User, Subject, Task } from './types';
import { storage, authService } from './services/storage';
import { generatePlan } from './services/planner';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, onLogout }: { activeTab: string, setActiveTab: (tab: string) => void, onLogout: () => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'subjects', icon: BookOpen, label: 'Subjects' },
    { id: 'plan', icon: Calendar, label: 'Revision Plan' },
    { id: 'progress', icon: CheckCircle2, label: 'Progress' },
    { id: 'profile', icon: UserIcon, label: 'Profile' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">SmartRev</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-item w-full ${activeTab === item.id ? 'active' : 'text-slate-500'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <button 
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-danger hover:bg-danger/10 rounded-xl transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

const Topbar = ({ user, title }: { user: User | null, title: string }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-slate-800 capitalize">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all duration-200"
          />
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'Guest'}</p>
            <p className="text-xs text-slate-500">Student Mode</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

const Dashboard = ({ state, setActiveTab }: { state: AppState, setActiveTab: (tab: string) => void }) => {
  const upcomingExams = state.subjects
    .filter(s => isFuture(new Date(s.examDate)))
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 3);

  const todayTasks = state.tasks.filter(t => isToday(new Date(t.date)));
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const totalTasks = state.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Subjects</p>
            <p className="text-2xl font-bold">{state.subjects.length}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tasks Completed</p>
            <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Overall Progress</p>
            <p className="text-2xl font-bold">{progress}%</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <UserIcon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-500 font-medium truncate">Current Goal</p>
            <p className="text-lg font-bold truncate">{state.user?.studyGoal || 'Set a goal'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's Focus
            </h3>
            <button onClick={() => setActiveTab('progress')} className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {todayTasks.length > 0 ? todayTasks.map(task => (
              <div key={task.id} className="glass-card p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full ${task.completed ? 'bg-success' : 'bg-primary'}`}></div>
                  <div>
                    <p className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{task.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-success hover:bg-success/10 rounded-lg transition-all">
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )) : (
              <div className="glass-card p-8 text-center space-y-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-medium">No tasks for today. Relax!</p>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-danger" />
              Upcoming Exams
            </h3>
            <button onClick={() => setActiveTab('subjects')} className="text-sm text-primary font-medium hover:underline">Manage</button>
          </div>
          <div className="space-y-3">
            {upcomingExams.length > 0 ? upcomingExams.map(subject => {
              const daysLeft = differenceInDays(new Date(subject.examDate), new Date());
              return (
                <div key={subject.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold" style={{ backgroundColor: subject.color }}>
                      <span className="text-xs opacity-80">{format(new Date(subject.examDate), 'MMM')}</span>
                      <span>{format(new Date(subject.examDate), 'dd')}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{subject.name}</p>
                      <p className="text-xs text-slate-500">{format(new Date(subject.examDate), 'EEEE, p')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${daysLeft <= 3 ? 'text-danger' : 'text-slate-600'}`}>{daysLeft} days left</p>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      subject.priority === 'high' ? 'bg-danger/10 text-danger' : 
                      subject.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
                    }`}>
                      {subject.priority}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div className="glass-card p-8 text-center space-y-2">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <p className="text-slate-500 font-medium">No exams scheduled yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const Subjects = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', examDate: '', priority: 'medium' as const, color: '#3b82f6' });

  const handleAdd = () => {
    if (!newSubject.name || !newSubject.examDate) return;
    const subject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      ...newSubject,
      examDate: new Date(newSubject.examDate).toISOString(),
    };
    const newState = { ...state, subjects: [...state.subjects, subject] };
    setState(newState);
    storage.save(newState);
    setShowAdd(false);
    setNewSubject({ name: '', examDate: '', priority: 'medium', color: '#3b82f6' });
  };

  const handleDelete = (id: string) => {
    const newState = { 
      ...state, 
      subjects: state.subjects.filter(s => s.id !== id),
      tasks: state.tasks.filter(t => t.subjectId !== id)
    };
    setState(newState);
    storage.save(newState);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-500">Manage your exam subjects and dates.</p>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.subjects.map(subject => (
          <div key={subject.id} className="glass-card overflow-hidden group">
            <div className="h-2 w-full" style={{ backgroundColor: subject.color }}></div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-bold text-slate-800">{subject.name}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(subject.examDate), 'PPP')}
                  </p>
                </div>
                <button onClick={() => handleDelete(subject.id)} className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className={`text-xs uppercase px-3 py-1 rounded-full font-bold ${
                  subject.priority === 'high' ? 'bg-danger/10 text-danger' : 
                  subject.priority === 'medium' ? 'bg-accent/10 text-accent' : 'bg-success/10 text-success'
                }`}>
                  {subject.priority} Priority
                </span>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                      T{i}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">New Subject</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Subject Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mathematics" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newSubject.name}
                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Exam Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={newSubject.examDate}
                    onChange={e => setNewSubject({...newSubject, examDate: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Priority</label>
                    <select 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                      value={newSubject.priority}
                      onChange={e => setNewSubject({...newSubject, priority: e.target.value as any})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Color Tag</label>
                    <input 
                      type="color" 
                      className="w-full h-[50px] p-1 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer"
                      value={newSubject.color}
                      onChange={e => setNewSubject({...newSubject, color: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleAdd}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
              >
                Create Subject
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Plan = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const handleGenerate = () => {
    if (state.subjects.length === 0) return;
    const tasks = generatePlan(state.subjects, new Date());
    const newState = { ...state, tasks };
    setState(newState);
    storage.save(newState);
  };

  const tasksByDate = state.tasks.reduce((acc, task) => {
    const date = format(new Date(task.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(tasksByDate).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-500">Your personalized study schedule based on exam dates.</p>
        <button 
          onClick={handleGenerate}
          className="bg-accent text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
        >
          <TrendingUp className="w-5 h-5" />
          Regenerate Plan
        </button>
      </div>

      {sortedDates.length > 0 ? (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-4">
                <h4 className="text-lg font-bold text-slate-800">{format(new Date(date), 'EEEE, MMM do')}</h4>
                <div className="h-px flex-1 bg-slate-200"></div>
                {isToday(new Date(date)) && <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Today</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasksByDate[date].map(task => {
                  const subject = state.subjects.find(s => s.id === task.subjectId);
                  return (
                    <div key={task.id} className="glass-card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: subject?.color }}>
                      <div className={`p-2 rounded-lg ${task.type === 'practice' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                        {task.type === 'practice' ? <CheckCircle2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{task.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{subject?.name || 'Unknown Subject'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Calendar className="w-10 h-10" />
          </div>
          <div className="max-w-xs mx-auto space-y-2">
            <h4 className="text-xl font-bold">No Plan Generated</h4>
            <p className="text-slate-500">Add some subjects and click "Regenerate Plan" to create your study schedule.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Progress = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const toggleTask = (id: string) => {
    const newState = {
      ...state,
      tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    };
    setState(newState);
    storage.save(newState);
  };

  const subjectsWithProgress = state.subjects.map(subject => {
    const subjectTasks = state.tasks.filter(t => t.subjectId === subject.id);
    const completed = subjectTasks.filter(t => t.completed).length;
    const total = subjectTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { ...subject, percentage, completed, total };
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectsWithProgress.map(subject => (
          <div key={subject.id} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800">{subject.name}</h4>
              <span className="text-sm font-bold text-primary">{subject.percentage}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${subject.percentage}%` }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">{subject.completed} of {subject.total} tasks completed</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold">Task Checklist</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {state.tasks.length > 0 ? state.tasks.map(task => {
            const subject = state.subjects.find(s => s.id === task.subjectId);
            return (
              <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed ? 'bg-success border-success text-white' : 'border-slate-200 text-transparent hover:border-primary'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
                <div className="flex-1">
                  <p className={`font-bold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subject?.name}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{format(new Date(task.date), 'MMM do')}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  task.type === 'practice' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
                  {task.type}
                </span>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-slate-400 font-medium">No tasks available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const user = state.user;
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    grade: user?.grade || '',
    studyGoal: user?.studyGoal || '',
    streak: user?.streak || 0,
    avgScore: user?.avgScore || 0,
    avatar: user?.avatar || '',
  });

  const handleSave = () => {
    if (!user) return;
    const updatedUser = { ...user, ...formData };
    const newState = { ...state, user: updatedUser };
    setState(newState);
    storage.save(newState);
    alert('Profile updated successfully!');
  };

  const randomizeAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`;
    setFormData({ ...formData, avatar: newAvatar });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="glass-card p-10 text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <div className="w-full h-full rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100">
            <img src={formData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Guest'}`} alt="Avatar" />
          </div>
          <button 
            onClick={randomizeAvatar}
            className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-slate-800">{formData.name}</h3>
          <p className="text-slate-500 font-medium">{formData.email}</p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className="px-6 py-3 bg-slate-50 rounded-2xl">
            <p className="text-2xl font-bold text-primary">{formData.streak}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="px-6 py-3 bg-slate-50 rounded-2xl">
            <p className="text-2xl font-bold text-success">{formData.avgScore}%</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Avg. Score</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 space-y-6">
        <h4 className="text-xl font-bold">Personal Information</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Current Grade</label>
            <input 
              type="text" 
              placeholder="e.g. 12th Grade" 
              value={formData.grade}
              onChange={e => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Study Goal</label>
            <input 
              type="text" 
              placeholder="e.g. 4.0 GPA" 
              value={formData.studyGoal}
              onChange={e => setFormData({ ...formData, studyGoal: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Day Streak</label>
            <input 
              type="number" 
              value={formData.streak}
              onChange={e => setFormData({ ...formData, streak: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Avg. Score (%)</label>
            <input 
              type="number" 
              value={formData.avgScore}
              onChange={e => setFormData({ ...formData, avgScore: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" 
            />
          </div>
        </div>
        <button 
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const Settings = ({ state, setState, onReset }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, onReset: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card p-6 space-y-6">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          App Preferences
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {state.settings.theme === 'light' ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-primary" />}
              </div>
              <div>
                <p className="font-bold text-slate-800">Dark Mode</p>
                <p className="text-xs text-slate-500">Enable dark theme for the app</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const newTheme: 'light' | 'dark' = state.settings.theme === 'light' ? 'dark' : 'light';
                const newState = { ...state, settings: { ...state.settings, theme: newTheme } };
                setState(newState);
                storage.save(newState);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${state.settings.theme === 'dark' ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state.settings.theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Push Notifications</p>
                <p className="text-xs text-slate-500">Get reminded about your study tasks</p>
              </div>
            </div>
            <button 
              onClick={() => {
                const newState = { ...state, settings: { ...state.settings, notifications: !state.settings.notifications } };
                setState(newState);
                storage.save(newState);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${state.settings.notifications ? 'bg-primary' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state.settings.notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <h4 className="text-xl font-bold text-danger flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Danger Zone
        </h4>
        <div className="p-4 bg-danger/5 border border-danger/10 rounded-2xl space-y-4">
          <p className="text-sm text-slate-600">Resetting your data will permanently delete all your subjects, tasks, and progress. This action cannot be undone.</p>
          <button 
            onClick={onReset}
            className="w-full bg-danger text-white py-3 rounded-xl font-bold shadow-lg shadow-danger/20 hover:bg-danger/90 transition-all"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

const Auth = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const user = authService.login(formData.email);
      if (user) onLogin(user);
      else alert('User not found. Please sign up.');
    } else {
      const user = authService.signup(formData.name, formData.email);
      onLogin(user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-slate-50 to-accent/5">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex w-full max-w-4xl h-[600px]"
      >
        <div className="hidden md:flex flex-1 bg-primary p-12 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">Master Your Exams with SmartRev</h2>
            <p className="mt-4 text-white/80 text-lg">The ultimate companion for high-performance revision and scheduling.</p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-medium">Dynamic Study Plans</p>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="font-medium">Progress Tracking</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-12 flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-800">{isLogin ? 'Welcome Back' : 'Join SmartRev'}</h3>
            <p className="text-slate-500">{isLogin ? 'Enter your details to continue your journey.' : 'Create an account to start planning today.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="John Doe" 
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <div className="relative">
                <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <SettingsIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
            >
              {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-primary font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>(storage.get());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogin = (user: User) => {
    const newState = { ...state, user };
    setState(newState);
    storage.save(newState);
  };

  const handleLogout = () => {
    authService.logout();
    setState({ ...state, user: null });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      const newState = storage.reset();
      setState(newState);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Loading SmartRev...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} setActiveTab={setActiveTab} />;
      case 'subjects': return <Subjects state={state} setState={setState} />;
      case 'plan': return <Plan state={state} setState={setState} />;
      case 'progress': return <Progress state={state} setState={setState} />;
      case 'profile': return <Profile state={state} setState={setState} />;
      case 'settings': return <Settings state={state} setState={setState} onReset={handleReset} />;
      default: return <Dashboard state={state} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col">
        <Topbar user={state.user} title={activeTab} />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
