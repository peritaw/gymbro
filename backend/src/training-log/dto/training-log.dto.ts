import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseLogDto {
  @IsNumber()
  exerciseId: number;

  @IsNumber()
  setNumber: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;
}

export class CreateTrainingLogDto {
  @IsNumber()
  routineId: number;

  @IsOptional()
  @IsNumber()
  routineDayId?: number;

  @IsDateString()
  date: string;

  @IsBoolean()
  completed: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseLogDto)
  exerciseLogs?: CreateExerciseLogDto[];
}
