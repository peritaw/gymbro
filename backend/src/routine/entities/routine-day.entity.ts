import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Routine } from './routine.entity';
import { Exercise } from './exercise.entity';

@Entity('routine_days')
export class RoutineDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayNumber: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  muscleGroup: string;

  @ManyToOne(() => Routine, (routine) => routine.days, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routineId' })
  routine: Routine;

  @Column()
  routineId: number;

  @OneToMany(() => Exercise, (exercise) => exercise.routineDay, {
    cascade: true,
    eager: true,
  })
  exercises: Exercise[];
}
