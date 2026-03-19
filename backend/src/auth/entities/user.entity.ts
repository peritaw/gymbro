import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Routine } from '../../routine/entities/routine.entity';
import { UserRole } from '../enums/user-role.enum';


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

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  companyId: number;

  @Column({ nullable: true })
  trainerId: number;

  @Column({ nullable: true })
  pendingCompanyId: number;

  @Column({ type: 'text', nullable: true })
  trainerDescription: string;

  @Column({ nullable: true })
  trainerSpecialty: string;

  @OneToMany(() => Routine, (routine) => routine.user)
  routines: Routine[];

  @ManyToOne(() => User, (user) => user.trainers, { nullable: true })
  company: User;

  @OneToMany(() => User, (user) => user.company)
  trainers: User[];

  @ManyToOne(() => User, (user) => user.clients, { nullable: true })
  trainer: User;

  @OneToMany(() => User, (user) => user.trainer)
  clients: User[];
}
