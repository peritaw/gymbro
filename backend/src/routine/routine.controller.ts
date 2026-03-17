import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto, UpdateRoutineDto } from './dto/routine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('routines')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.routineService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.routineService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateRoutineDto, @Request() req: any) {
    return this.routineService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoutineDto,
    @Request() req: any,
  ) {
    return this.routineService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.routineService.remove(id, req.user.userId);
  }

  @Patch(':id/activate')
  activate(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.routineService.activate(id, req.user.userId);
  }
}
