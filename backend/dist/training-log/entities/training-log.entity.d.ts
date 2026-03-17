import { Routine } from '../../routine/entities/routine.entity';
export declare class TrainingLog {
    id: number;
    routine: Routine;
    routineId: number;
    routineDayId: number;
    date: string;
    completed: boolean;
    notes: string;
    durationMinutes: number;
    userId: number;
    createdAt: Date;
}
