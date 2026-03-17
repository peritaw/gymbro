import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RoutineModule } from './routine/routine.module';
import { TrainingLogModule } from './training-log/training-log.module';

import { MeasurementsModule } from './measurements/measurements.module';
import { ExercisesModule } from './exercises/exercises.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            autoLoadEntities: true,
            synchronize: true,
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gymbro',
            autoLoadEntities: true,
            synchronize: true,
          },
    ),
    AuthModule,
    RoutineModule,
    TrainingLogModule,
    MeasurementsModule,
    ExercisesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
