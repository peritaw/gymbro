import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TrainingLogService } from './training-log.service';
import { CreateTrainingLogDto } from './dto/training-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/training-logs')
export class TrainingLogController {
  constructor(private readonly trainingLogService: TrainingLogService) {}

  @Get()
  findAll(
    @Request() req: any,
    @Query('routineId') routineId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.trainingLogService.findAll(
      req.user.userId,
      routineId ? parseInt(routineId) : undefined,
      startDate,
      endDate,
    );
  }

  @Post()
  create(@Body() dto: CreateTrainingLogDto, @Request() req: any) {
    return this.trainingLogService.create(dto, req.user.userId);
  }

  @Get('stats')
  getStats(@Request() req: any) {
    return this.trainingLogService.getStats(req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.trainingLogService.delete(id, req.user.userId);
  }
}
