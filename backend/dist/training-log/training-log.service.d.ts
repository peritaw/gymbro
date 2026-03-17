import { Repository } from 'typeorm';
import { TrainingLog } from './entities/training-log.entity';
import { CreateTrainingLogDto } from './dto/training-log.dto';
export declare class TrainingLogService {
    private readonly logRepository;
    constructor(logRepository: Repository<TrainingLog>);
    findAll(userId: number, routineId?: number, startDate?: string, endDate?: string): Promise<TrainingLog[]>;
    create(dto: CreateTrainingLogDto, userId: number): Promise<TrainingLog>;
    getStats(userId: number): Promise<{
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
    }>;
    delete(id: number, userId: number): Promise<void>;
}
