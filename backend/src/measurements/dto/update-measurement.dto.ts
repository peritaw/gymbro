import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class UpdateMeasurementDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsNumber()
  @IsOptional()
  chest?: number;

  @IsNumber()
  @IsOptional()
  waist?: number;

  @IsNumber()
  @IsOptional()
  arms?: number;

  @IsNumber()
  @IsOptional()
  legs?: number;
}
