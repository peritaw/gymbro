import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { RoutineDay } from './entities/routine-day.entity';
import { Exercise } from './entities/exercise.entity';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routine.dto';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
    @InjectRepository(RoutineDay)
    private readonly dayRepository: Repository<RoutineDay>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async findAll(userId: number): Promise<Routine[]> {
    return this.routineRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
    });
    if (!routine) {
      throw new NotFoundException('Routine not found');
    }
    return routine;
  }

  async create(dto: CreateRoutineDto, userId: number): Promise<Routine> {
    // If this routine is set as active, deactivate others
    if (dto.isActive) {
      await this.routineRepository.update({ userId }, { isActive: false });
    }

    const routine = this.routineRepository.create({
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive ?? false,
      userId,
      days: dto.days.map((dayDto) => ({
        dayNumber: dayDto.dayNumber,
        name: dayDto.name,
        muscleGroup: dayDto.muscleGroup,
        exercises: dayDto.exercises.map((exDto, idx) => ({
          name: exDto.name,
          sets: exDto.sets,
          reps: exDto.reps,
          weight: exDto.weight,
          notes: exDto.notes,
          order: exDto.order ?? idx,
        })),
      })),
    });

    return this.routineRepository.save(routine);
  }

  async update(
    id: number,
    dto: UpdateRoutineDto,
    userId: number,
  ): Promise<Routine> {
    const routine = await this.findOne(id, userId);

    if (dto.isActive) {
      await this.routineRepository.update({ userId }, { isActive: false });
    }

    if (dto.days) {
      // Delete existing days (cascade deletes exercises)
      await this.dayRepository.delete({ routineId: id });

      routine.days = dto.days.map((dayDto) =>
        this.dayRepository.create({
          dayNumber: dayDto.dayNumber,
          name: dayDto.name,
          muscleGroup: dayDto.muscleGroup,
          routineId: id,
          exercises: dayDto.exercises.map((exDto, idx) =>
            this.exerciseRepository.create({
              name: exDto.name,
              sets: exDto.sets,
              reps: exDto.reps,
              weight: exDto.weight,
              notes: exDto.notes,
              order: exDto.order ?? idx,
            }),
          ),
        }),
      );
    }

    if (dto.name !== undefined) routine.name = dto.name;
    if (dto.description !== undefined) routine.description = dto.description;
    if (dto.isActive !== undefined) routine.isActive = dto.isActive;

    return this.routineRepository.save(routine);
  }

  async remove(id: number, userId: number): Promise<void> {
    const routine = await this.findOne(id, userId); // validates ownership
    try {
      await this.routineRepository.delete(routine.id);
    } catch (error) {
      console.error('Error in routineRepository.delete:', error);
      throw error;
    }
  }

  async activate(id: number, userId: number): Promise<Routine> {
    await this.routineRepository.update({ userId }, { isActive: false });
    const routine = await this.findOne(id, userId);
    routine.isActive = true;
    return this.routineRepository.save(routine);
  }
}
