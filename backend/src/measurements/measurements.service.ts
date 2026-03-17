import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Measurement } from './entities/measurement.entity';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementRepository: Repository<Measurement>,
  ) {}

  async create(userId: number, createMeasurementDto: CreateMeasurementDto) {
    const measurement = this.measurementRepository.create({
      ...createMeasurementDto,
      userId,
    });
    return await this.measurementRepository.save(measurement);
  }

  async findAll(userId: number) {
    return await this.measurementRepository.find({
      where: { userId },
      order: { date: 'ASC' },
    });
  }

  async findOne(id: number, userId: number) {
    const measurement = await this.measurementRepository.findOne({
      where: { id, userId },
    });
    if (!measurement) throw new NotFoundException('Measurement not found');
    return measurement;
  }

  async update(id: number, userId: number, updateMeasurementDto: UpdateMeasurementDto) {
    const measurement = await this.findOne(id, userId);
    
    // Update fields
    if (updateMeasurementDto.weight !== undefined) measurement.weight = updateMeasurementDto.weight;
    if (updateMeasurementDto.chest !== undefined) measurement.chest = updateMeasurementDto.chest;
    if (updateMeasurementDto.waist !== undefined) measurement.waist = updateMeasurementDto.waist;
    if (updateMeasurementDto.arms !== undefined) measurement.arms = updateMeasurementDto.arms;
    if (updateMeasurementDto.legs !== undefined) measurement.legs = updateMeasurementDto.legs;
    if (updateMeasurementDto.date !== undefined) measurement.date = updateMeasurementDto.date;

    return await this.measurementRepository.save(measurement);
  }

  async remove(id: number, userId: number) {
    const measurement = await this.findOne(id, userId);
    return await this.measurementRepository.remove(measurement);
  }
}
