import { TrainingLogService } from './training-log.service';
import { CreateTrainingLogDto } from './dto/training-log.dto';
export declare class TrainingLogController {
    private readonly trainingLogService;
    constructor(trainingLogService: TrainingLogService);
    findAll(req: any, routineId?: string, startDate?: string, endDate?: string): Promise<import("./entities/training-log.entity").TrainingLog[]>;
    create(dto: CreateTrainingLogDto, req: any): Promise<import("./entities/training-log.entity").TrainingLog>;
    getStats(req: any): Promise<{
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
    delete(id: number, req: any): Promise<void>;
}
