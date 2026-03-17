import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutineController } from './routine.controller';
import { RoutineService } from './routine.service';
import { Routine } from './entities/routine.entity';
import { RoutineDay } from './entities/routine-day.entity';
import { Exercise } from './entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Routine, RoutineDay, Exercise])],
  controllers: [RoutineController],
  providers: [RoutineService],
  exports: [RoutineService],
})
export class RoutineModule {}
