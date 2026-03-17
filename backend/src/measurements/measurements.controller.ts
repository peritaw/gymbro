import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { UpdateMeasurementDto } from './dto/update-measurement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  create(@Request() req: any, @Body() createMeasurementDto: CreateMeasurementDto) {
    return this.measurementsService.create(req.user.userId, createMeasurementDto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.measurementsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.measurementsService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateMeasurementDto: UpdateMeasurementDto) {
    return this.measurementsService.update(+id, req.user.userId, updateMeasurementDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.measurementsService.remove(+id, req.user.userId);
  }
}
