import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrainingLog } from './training-log.entity';

@Entity('exercise_logs')
export class ExerciseLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TrainingLog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trainingLogId' })
  trainingLog: TrainingLog;

  @Column()
  trainingLogId: number;

  @Column()
  exerciseId: number;

  @Column()
  setNumber: number;

  @Column({ type: 'float' })
  weight: number;

  @Column()
  reps: number;
}
