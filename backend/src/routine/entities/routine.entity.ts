import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { RoutineDay } from './routine-day.entity';
import { TrainingLog } from '../../training-log/entities/training-log.entity';

@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.routines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => RoutineDay, (day) => day.routine, {
    cascade: true,
    eager: true,
  })
  days: RoutineDay[];

  @OneToMany(() => TrainingLog, (log) => log.routine)
  trainingLogs: TrainingLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
