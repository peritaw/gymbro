import { IsString, IsOptional, IsBoolean, IsNumber, IsDateString } from 'class-validator';

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
}
