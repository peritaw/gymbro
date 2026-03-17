import { ExercisesService } from './exercises.service';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    findAll(): Promise<import("./entities/exercise-library.entity").ExerciseLibrary[]>;
}
