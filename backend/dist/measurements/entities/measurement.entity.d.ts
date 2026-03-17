import { User } from '../../auth/entities/user.entity';
export declare class Measurement {
    id: number;
    userId: number;
    date: string;
    weight: number;
    chest: number;
    waist: number;
    arms: number;
    legs: number;
    createdAt: Date;
    user: User;
}
