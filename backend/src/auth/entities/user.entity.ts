import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Routine } from '../../routine/entities/routine.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: 3 })
  weeklyGoal: number;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ nullable: true, type: 'timestamp' })
  resetTokenExpiry: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Routine, (routine) => routine.user)
  routines: Routine[];
}
