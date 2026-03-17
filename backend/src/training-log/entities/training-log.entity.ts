import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Routine } from '../../routine/entities/routine.entity';

@Entity('training_logs')
export class TrainingLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Routine, (routine) => routine.trainingLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: number;

  @Column({ nullable: true })
  routineDayId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: true })
  completed: boolean;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  durationMinutes: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
