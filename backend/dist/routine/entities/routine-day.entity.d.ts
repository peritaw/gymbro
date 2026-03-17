import { Routine } from './routine.entity';
import { Exercise } from './exercise.entity';
export declare class RoutineDay {
    id: number;
    dayNumber: number;
    name: string;
    muscleGroup: string;
    routine: Routine;
    routineId: number;
    exercises: Exercise[];
}
