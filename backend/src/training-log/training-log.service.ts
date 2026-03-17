import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TrainingLog } from './entities/training-log.entity';
import { CreateTrainingLogDto } from './dto/training-log.dto';

@Injectable()
export class TrainingLogService {
  constructor(
    @InjectRepository(TrainingLog)
    private readonly logRepository: Repository<TrainingLog>,
  ) {}

  async findAll(
    userId: number,
    routineId?: number,
    startDate?: string,
    endDate?: string,
  ): Promise<TrainingLog[]> {
    const where: any = { userId };
    if (routineId) where.routineId = routineId;
    if (startDate && endDate) where.date = Between(startDate, endDate);

    return this.logRepository.find({
      where,
      order: { date: 'DESC' },
    });
  }

  async create(dto: CreateTrainingLogDto, userId: number): Promise<TrainingLog> {
    const { exerciseLogs, ...rest } = dto;
    
    // Check if log already exists for this date + routine day
    const existing = await this.logRepository.findOne({
      where: {
        userId,
        routineId: dto.routineId,
        routineDayId: dto.routineDayId,
        date: dto.date,
      },
      relations: ['exerciseLogs'],
    });

    if (existing) {
      // Update existing log
      existing.completed = dto.completed;
      existing.notes = dto.notes ?? existing.notes;
      existing.durationMinutes = dto.durationMinutes ?? existing.durationMinutes;
      if (dto.weekNumber !== undefined) existing.weekNumber = dto.weekNumber;
      
      if (exerciseLogs) {
        existing.exerciseLogs = exerciseLogs.map(el => ({ ...el, trainingLogId: existing.id })) as any;
      }
      
      return this.logRepository.save(existing);
    }

    const log = this.logRepository.create({
      ...rest,
      userId,
      exerciseLogs: exerciseLogs || [],
    });

    return this.logRepository.save(log);
  }

  async getExerciseHistory(userId: number, exerciseId: number) {
    return this.logRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.exerciseLogs', 'exerciseLog')
      .where('log.userId = :userId', { userId })
      .andWhere('exerciseLog.exerciseId = :exerciseId', { exerciseId })
      .orderBy('log.date', 'DESC')
      .getMany();
  }

  async getStats(userId: number) {
    // Current streak
    const logs = await this.logRepository.find({
      where: { userId, completed: true },
      order: { date: 'DESC' },
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDates = [...new Set(logs.map((l) => l.date))].sort().reverse();

    for (let i = 0; i < uniqueDates.length; i++) {
      const logDate = new Date(uniqueDates[i]);
      logDate.setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else if (i === 0 && logDate.getTime() === expectedDate.getTime() - 86400000) {
        // If no log today, check from yesterday
        const yesterdayExpected = new Date(today);
        yesterdayExpected.setDate(yesterdayExpected.getDate() - 1);
        if (logDate.getTime() === yesterdayExpected.getTime()) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Weekly stats (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogs = await this.logRepository.find({
      where: {
        userId,
        date: Between(weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]),
      },
    });

    // Monthly stats (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthLogs = await this.logRepository.find({
      where: {
        userId,
        date: Between(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]),
      },
    });

    const completedThisWeek = weekLogs.filter((l) => l.completed).length;
    const completedThisMonth = monthLogs.filter((l) => l.completed).length;

    // Best streak
    let bestStreak = 0;
    let currentStreak = 0;
    const allDates = [...new Set(logs.map((l) => l.date))].sort();
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        currentStreak = 1;
      } else {
        const prev = new Date(allDates[i - 1]);
        const curr = new Date(allDates[i]);
        const diff =
          (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, currentStreak);
    }

    // Last 7 days breakdown
    const weeklyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = weekLogs.filter((l) => l.date === dateStr);
      weeklyBreakdown.push({
        date: dateStr,
        dayName: d.toLocaleDateString('es', { weekday: 'short' }),
        completed: dayLogs.some((l) => l.completed),
        count: dayLogs.filter((l) => l.completed).length,
      });
    }

    return {
      currentStreak: streak,
      bestStreak,
      completedThisWeek,
      completedThisMonth,
      totalWorkouts: logs.length,
      weeklyBreakdown,
    };
  }

  async delete(id: number, userId: number): Promise<void> {
    const log = await this.logRepository.findOne({ where: { id, userId } });
    if (!log) throw new NotFoundException('Training log not found');
    await this.logRepository.remove(log);
  }
}
