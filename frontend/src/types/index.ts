export const UserRole = {
  COMPANY: 'COMPANY',
  TRAINER: 'TRAINER',
  CLIENT: 'CLIENT',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  weeklyGoal: number;
  weight?: number;
  height?: number;
  companyId?: number;
  trainerId?: number;
  pendingCompanyId?: number;
  trainerDescription?: string;
  trainerSpecialty?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface WeekTarget {
  week: number;
  weight: number;
  reps: number;
  sets: number;
}

export interface Exercise {
  id?: number;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order?: number;
  weekTargets?: WeekTarget[];
}
export interface RoutineDay {
  id?: number;
  dayNumber: number;
  name: string;
  muscleGroup?: string;
  exercises: Exercise[];
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
  weekNumber?: number;
  exerciseLogs?: ExerciseLog[];
}

export interface ExerciseLog {
  id?: number;
  exerciseId: number;
  setNumber: number;
  weight: number;
  reps: number;
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
  role: UserRole;
}
