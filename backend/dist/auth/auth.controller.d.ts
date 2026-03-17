import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        name: string;
        weeklyGoal: number;
    }>;
    updateProfile(req: any, updateData: {
        name?: string;
        weeklyGoal?: number;
    }): Promise<{
        id: number;
        email: string;
        name: string;
        weeklyGoal: number;
    }>;
}
