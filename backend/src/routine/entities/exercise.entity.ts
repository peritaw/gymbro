import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoutineDay } from './routine-day.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 3 })
  sets: number;

  @Column({ default: 10 })
  reps: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => RoutineDay, (day) => day.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routineDayId' })
  routineDay: RoutineDay;

  @Column()
  routineDayId: number;

  @Column({ type: 'json', nullable: true })
  weekTargets: { week: number; weight: number; reps: number; sets: number }[];
}
