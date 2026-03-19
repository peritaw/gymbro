import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { UserRole } from './enums/user-role.enum';

@Injectable()

export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: dto.role,
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        weeklyGoal: user.weeklyGoal,
        weight: user.weight,
        height: user.height,
        companyId: user.companyId,
        trainerId: user.trainerId,
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        weeklyGoal: user.weeklyGoal,
        weight: user.weight,
        height: user.height,
        companyId: user.companyId,
        trainerId: user.trainerId,
      },
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await this.userRepository.save(user);

    // In production, send email here with nodemailer
    // For now, we'll log the token (configure SMTP in .env for real emails)
    console.log(`Reset token for ${email}: ${resetToken}`);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = '';
    user.resetTokenExpiry = null as any;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      weeklyGoal: user.weeklyGoal,
      weight: user.weight,
      height: user.height,
      companyId: user.companyId,
      trainerId: user.trainerId,
      pendingCompanyId: user.pendingCompanyId,
      trainerDescription: user.trainerDescription,
      trainerSpecialty: user.trainerSpecialty,
    };
  }

  async updateProfile(userId: number, updateData: { name?: string, weeklyGoal?: number, weight?: number, height?: number }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    if (updateData.name !== undefined) user.name = updateData.name;
    if (updateData.weeklyGoal !== undefined) user.weeklyGoal = updateData.weeklyGoal;
    if (updateData.weight !== undefined) user.weight = updateData.weight;
    if (updateData.height !== undefined) user.height = updateData.height;

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      weeklyGoal: user.weeklyGoal,
      weight: user.weight,
      height: user.height,
      companyId: user.companyId,
      trainerId: user.trainerId,
    };
  }

  async associateTrainer(companyId: number, trainerEmail: string) {
    const trainer = await this.userRepository.findOne({
      where: { email: trainerEmail, role: UserRole.TRAINER },
    });

    if (!trainer) {
      throw new BadRequestException('Entrenador no encontrado');
    }

    if (trainer.companyId) {
      throw new BadRequestException('El entrenador ya pertenece a una empresa');
    }

    trainer.pendingCompanyId = companyId;
    await this.userRepository.save(trainer);
    return { message: 'Invitación enviada al entrenador' };
  }

  async acceptInvitation(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.pendingCompanyId) {
      throw new BadRequestException('No hay invitaciones pendientes');
    }

    user.companyId = user.pendingCompanyId;
    user.pendingCompanyId = null as any;
    await this.userRepository.save(user);
    return { message: 'Invitación aceptada con éxito' };
  }

  async rejectInvitation(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.pendingCompanyId) {
      throw new BadRequestException('No hay invitaciones pendientes');
    }

    user.pendingCompanyId = null as any;
    await this.userRepository.save(user);
    return { message: 'Invitación rechazada' };
  }

  async getAllTrainers() {
    return this.userRepository.find({
      where: { role: UserRole.TRAINER },
      select: ['id', 'name', 'email', 'trainerDescription', 'trainerSpecialty'],
    });
  }

  async selectTrainer(clientId: number, trainerId: number) {
    const client = await this.userRepository.findOne({ where: { id: clientId, role: UserRole.CLIENT } });
    if (!client) throw new BadRequestException('Cliente no encontrado');

    const trainer = await this.userRepository.findOne({ where: { id: trainerId, role: UserRole.TRAINER } });
    if (!trainer) throw new BadRequestException('Entrenador no encontrado');

    client.trainerId = trainerId;
    await this.userRepository.save(client);
    return { message: 'Entrenador seleccionado con éxito' };
  }

  async assignClientToTrainer(
    companyId: number,
    clientId: number,
    trainerId: number,
  ) {
    const client = await this.userRepository.findOne({
      where: { id: clientId, role: UserRole.CLIENT, companyId },
    });

    if (!client) {
      throw new BadRequestException('Cliente no encontrado o no pertenece a la empresa');
    }

    const trainer = await this.userRepository.findOne({
      where: { id: trainerId, role: UserRole.TRAINER, companyId },
    });

    if (!trainer) {
      throw new BadRequestException('Entrenador no encontrado o no pertenece a la empresa');
    }

    client.trainerId = trainerId;
    await this.userRepository.save(client);
    return { message: 'Cliente asignado al entrenador con éxito' };
  }

  async getMyTrainers(companyId: number) {
    return this.userRepository.find({
      where: { companyId, role: UserRole.TRAINER },
    });
  }

  async getMyClients(userId: number, role: UserRole) {
    if (role === UserRole.COMPANY) {
      return this.userRepository.find({
        where: { companyId: userId, role: UserRole.CLIENT },
      });
    } else if (role === UserRole.TRAINER) {
      return this.userRepository.find({
        where: { trainerId: userId, role: UserRole.CLIENT },
      });
    }
    return [];
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
