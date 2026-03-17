import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { ExerciseLibrary } from './entities/exercise-library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseLibrary])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
})
export class ExercisesModule {}
