import { Routine } from '../../routine/entities/routine.entity';
export declare class User {
    id: number;
    email: string;
    password: string;
    name: string;
    weeklyGoal: number;
    resetToken: string;
    resetTokenExpiry: Date;
    createdAt: Date;
    routines: Routine[];
}
