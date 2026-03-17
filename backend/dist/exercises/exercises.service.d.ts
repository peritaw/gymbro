import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExerciseLibrary } from './entities/exercise-library.entity';
export declare class ExercisesService implements OnModuleInit {
    private readonly exerciseLibraryRepository;
    constructor(exerciseLibraryRepository: Repository<ExerciseLibrary>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<ExerciseLibrary[]>;
    seed(): Promise<void>;
}
