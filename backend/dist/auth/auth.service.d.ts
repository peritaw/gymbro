import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            weeklyGoal: number;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            email: string;
            name: string;
            weeklyGoal: number;
        };
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        name: string;
        weeklyGoal: number;
    }>;
    updateProfile(userId: number, updateData: {
        name?: string;
        weeklyGoal?: number;
    }): Promise<{
        id: number;
        email: string;
        name: string;
        weeklyGoal: number;
    }>;
    private generateToken;
}
