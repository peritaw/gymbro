import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
export declare class MeasurementsController {
    private readonly measurementsService;
    constructor(measurementsService: MeasurementsService);
    create(req: any, createMeasurementDto: CreateMeasurementDto): Promise<import("./entities/measurement.entity").Measurement>;
    findAll(req: any): Promise<import("./entities/measurement.entity").Measurement[]>;
    findOne(req: any, id: string): Promise<import("./entities/measurement.entity").Measurement>;
    update(req: any, id: string, updateMeasurementDto: UpdateMeasurementDto): Promise<import("./entities/measurement.entity").Measurement>;
    remove(req: any, id: string): Promise<import("./entities/measurement.entity").Measurement>;
}
