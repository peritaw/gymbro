export declare class CreateExerciseDto {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
    order?: number;
}
export declare class CreateRoutineDayDto {
    dayNumber: number;
    name: string;
    muscleGroup?: string;
    exercises: CreateExerciseDto[];
}
export declare class CreateRoutineDto {
    name: string;
    description?: string;
    isActive?: boolean;
    days: CreateRoutineDayDto[];
}
export declare class UpdateRoutineDto {
    name?: string;
    description?: string;
    isActive?: boolean;
    days?: CreateRoutineDayDto[];
}
