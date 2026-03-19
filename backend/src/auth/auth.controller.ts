import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  updateProfile(
    @Request() req: any,
    @Body()
    updateData: {
      name?: string;
      weeklyGoal?: number;
      weight?: number;
      height?: number;
    },
  ) {
    return this.authService.updateProfile(req.user.userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('associate-trainer')
  associateTrainer(@Request() req: any, @Body('email') trainerEmail: string) {
    // Basic role check (could use a dedicated decorator)
    if (req.user.role !== 'COMPANY') {
      throw new UnauthorizedException('Solo las empresas pueden asociar entrenadores');
    }
    return this.authService.associateTrainer(req.user.userId, trainerEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('assign-client')
  assignClient(
    @Request() req: any,
    @Body('clientId') clientId: number,
    @Body('trainerId') trainerId: number,
  ) {
    if (req.user.role !== 'COMPANY') {
      throw new UnauthorizedException('Solo las empresas pueden asignar clientes');
    }
    return this.authService.assignClientToTrainer(
      req.user.userId,
      clientId,
      trainerId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-trainers')
  getMyTrainers(@Request() req: any) {
    if (req.user.role !== 'COMPANY') {
      throw new UnauthorizedException('Solo las empresas pueden ver sus entrenadores');
    }
    return this.authService.getMyTrainers(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-clients')
  getMyClients(@Request() req: any) {
    return this.authService.getMyClients(req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept-invitation')
  acceptInvitation(@Request() req: any) {
    if (req.user.role !== 'TRAINER') {
      throw new UnauthorizedException('Solo los entrenadores pueden aceptar invitaciones');
    }
    return this.authService.acceptInvitation(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reject-invitation')
  rejectInvitation(@Request() req: any) {
    if (req.user.role !== 'TRAINER') {
      throw new UnauthorizedException('Solo los entrenadores pueden rechazar invitaciones');
    }
    return this.authService.rejectInvitation(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trainers')
  getAllTrainers() {
    return this.authService.getAllTrainers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('select-trainer')
  selectTrainer(@Request() req: any, @Body('trainerId') trainerId: number) {
    if (req.user.role !== 'CLIENT') {
      throw new UnauthorizedException('Solo los alumnos pueden seleccionar entrenadores');
    }
    return this.authService.selectTrainer(req.user.userId, trainerId);
  }
}
