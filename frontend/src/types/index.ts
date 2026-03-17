export interface User {
  id: number;
  email: string;
  name: string;
  weeklyGoal: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RoutineDay {
  id?: number;
  dayNumber: number;
  name: string;
  muscleGroup?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order?: number;
}

export interface Routine {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  days: RoutineDay[];
  createdAt: string;
}

export interface TrainingLog {
  id: number;
  routineId: number;
  routineDayId?: number;
  date: string;
  completed: boolean;
  notes?: string;
  durationMinutes?: number;
}

export interface Stats {
  currentStreak: number;
  bestStreak: number;
  completedThisWeek: number;
  completedThisMonth: number;
  totalWorkouts: number;
  weeklyBreakdown: {
    date: string;
    dayName: string;
    completed: boolean;
    count: number;
  }[];
}
export interface Measurement {
  id: number;
  userId: number;
  date: string;
  weight?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
