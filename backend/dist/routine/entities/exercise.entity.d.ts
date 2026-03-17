import { RoutineDay } from './routine-day.entity';
export declare class Exercise {
    id: number;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    notes: string;
    order: number;
    routineDay: RoutineDay;
    routineDayId: number;
}
