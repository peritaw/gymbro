import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WeekTargetDto {
  @IsNumber()
  week: number;

  @IsNumber()
  weight: number;

  @IsNumber()
  reps: number;

  @IsNumber()
  sets: number;
}

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(1)
  sets: number;

  @IsNumber()
  @Min(1)
  reps: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekTargetDto)
  weekTargets?: WeekTargetDto[];
}

export class CreateRoutineDayDto {
  @IsNumber()
  dayNumber: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  muscleGroup?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises: CreateExerciseDto[];
}

export class CreateRoutineDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDayDto)
  days: CreateRoutineDayDto[];
}

export class UpdateRoutineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDayDto)
  days?: CreateRoutineDayDto[];
}
