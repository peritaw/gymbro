import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Routine } from '../../routine/entities/routine.entity';
import { ExerciseLog } from './exercise-log.entity';

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

  @OneToMany(() => ExerciseLog, (exerciseLog) => exerciseLog.trainingLog, {
    cascade: true,
  })
  exerciseLogs: ExerciseLog[];

  @CreateDateColumn()
  createdAt: Date;
}
