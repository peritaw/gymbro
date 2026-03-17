import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingLogController } from './training-log.controller';
import { TrainingLogService } from './training-log.service';
import { TrainingLog } from './entities/training-log.entity';
import { ExerciseLog } from './entities/exercise-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingLog, ExerciseLog])],
  controllers: [TrainingLogController],
  providers: [TrainingLogService],
  exports: [TrainingLogService],
})
export class TrainingLogModule {}
