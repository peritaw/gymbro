import { RoutineService } from './routine.service';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routine.dto';
export declare class RoutineController {
    private readonly routineService;
    constructor(routineService: RoutineService);
    findAll(req: any): Promise<import("./entities/routine.entity").Routine[]>;
    findOne(id: number, req: any): Promise<import("./entities/routine.entity").Routine>;
    create(dto: CreateRoutineDto, req: any): Promise<import("./entities/routine.entity").Routine>;
    update(id: number, dto: UpdateRoutineDto, req: any): Promise<import("./entities/routine.entity").Routine>;
    remove(id: number, req: any): Promise<void>;
    activate(id: number, req: any): Promise<import("./entities/routine.entity").Routine>;
}
