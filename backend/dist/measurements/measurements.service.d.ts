import { Repository } from 'typeorm';
import { Measurement } from './entities/measurement.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
export declare class MeasurementsService {
    private readonly measurementRepository;
    constructor(measurementRepository: Repository<Measurement>);
    create(userId: number, createMeasurementDto: CreateMeasurementDto): Promise<Measurement>;
    findAll(userId: number): Promise<Measurement[]>;
    findOne(id: number, userId: number): Promise<Measurement>;
    update(id: number, userId: number, updateMeasurementDto: UpdateMeasurementDto): Promise<Measurement>;
    remove(id: number, userId: number): Promise<Measurement>;
}
