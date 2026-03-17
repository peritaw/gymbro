import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { RoutineDay } from './entities/routine-day.entity';
import { Exercise } from './entities/exercise.entity';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routine.dto';
export declare class RoutineService {
    private readonly routineRepository;
    private readonly dayRepository;
    private readonly exerciseRepository;
    constructor(routineRepository: Repository<Routine>, dayRepository: Repository<RoutineDay>, exerciseRepository: Repository<Exercise>);
    findAll(userId: number): Promise<Routine[]>;
    findOne(id: number, userId: number): Promise<Routine>;
    create(dto: CreateRoutineDto, userId: number): Promise<Routine>;
    update(id: number, dto: UpdateRoutineDto, userId: number): Promise<Routine>;
    remove(id: number, userId: number): Promise<void>;
    activate(id: number, userId: number): Promise<Routine>;
}
