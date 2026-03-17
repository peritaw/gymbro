import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('exercise_library')
export class ExerciseLibrary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  muscleGroup: string;

  @Column({ nullable: true })
  equipment: string;
}
