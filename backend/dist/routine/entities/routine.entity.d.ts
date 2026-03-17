import { User } from '../../auth/entities/user.entity';
import { RoutineDay } from './routine-day.entity';
import { TrainingLog } from '../../training-log/entities/training-log.entity';
export declare class Routine {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    user: User;
    userId: number;
    days: RoutineDay[];
    trainingLogs: TrainingLog[];
    createdAt: Date;
    updatedAt: Date;
}
