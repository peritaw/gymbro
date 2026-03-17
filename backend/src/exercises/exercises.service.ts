import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseLibrary } from './entities/exercise-library.entity';

@Injectable()
export class ExercisesService implements OnModuleInit {
  constructor(
    @InjectRepository(ExerciseLibrary)
    private readonly exerciseLibraryRepository: Repository<ExerciseLibrary>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async findAll() {
    return await this.exerciseLibraryRepository.find({
      order: { name: 'ASC' }
    });
  }

  async seed() {
    const count = await this.exerciseLibraryRepository.count();
    if (count > 0) return; // Ya está sembrado

    const exercises = [
      // Pecho
      { name: 'Press de Banca Plano', muscleGroup: 'Pecho', equipment: 'Barra' },
      { name: 'Press de Banca Inclinado', muscleGroup: 'Pecho', equipment: 'Barra' },
      { name: 'Aperturas con Mancuernas', muscleGroup: 'Pecho', equipment: 'Mancuernas' },
      { name: 'Cruces en Polea', muscleGroup: 'Pecho', equipment: 'Polea' },
      { name: 'Fondos en Paralelas', muscleGroup: 'Pecho', equipment: 'Peso Corporal' },
      // Espalda
      { name: 'Dominadas', muscleGroup: 'Espalda', equipment: 'Peso Corporal' },
      { name: 'Jalón al Pecho', muscleGroup: 'Espalda', equipment: 'Máquina' },
      { name: 'Remo con Barra', muscleGroup: 'Espalda', equipment: 'Barra' },
      { name: 'Remo en Polea Baja', muscleGroup: 'Espalda', equipment: 'Polea' },
      { name: 'Remo con Mancuerna a 1 Mano', muscleGroup: 'Espalda', equipment: 'Mancuernas' },
      // Piernas
      { name: 'Sentadilla Libre', muscleGroup: 'Piernas', equipment: 'Barra' },
      { name: 'Prensa Inclinada', muscleGroup: 'Piernas', equipment: 'Máquina' },
      { name: 'Peso Muerto Rumano', muscleGroup: 'Piernas', equipment: 'Barra' },
      { name: 'Peso Muerto Convencional', muscleGroup: 'Piernas', equipment: 'Barra' },
      { name: 'Extensiones de Cuádriceps', muscleGroup: 'Piernas', equipment: 'Máquina' },
      { name: 'Curl Femoral Tumbado', muscleGroup: 'Piernas', equipment: 'Máquina' },
      { name: 'Zancadas / Estocadas', muscleGroup: 'Piernas', equipment: 'Mancuernas' },
      { name: 'Elevación de Talones', muscleGroup: 'Piernas', equipment: 'Máquina' },
      // Hombros
      { name: 'Press Militar', muscleGroup: 'Hombros', equipment: 'Barra' },
      { name: 'Press Arnold', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
      { name: 'Elevaciones Laterales', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
      { name: 'Pájaros (Deltoides Posterior)', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
      { name: 'Face Pull', muscleGroup: 'Hombros', equipment: 'Polea' },
      // Brazos - Bíceps
      { name: 'Curl con Barra', muscleGroup: 'Bíceps', equipment: 'Barra' },
      { name: 'Curl Martillo', muscleGroup: 'Bíceps', equipment: 'Mancuernas' },
      { name: 'Curl en Banco Scott', muscleGroup: 'Bíceps', equipment: 'Máquina' },
      { name: 'Curl Concentrado', muscleGroup: 'Bíceps', equipment: 'Mancuernas' },
      // Brazos - Tríceps
      { name: 'Extensión en Polea Alta', muscleGroup: 'Tríceps', equipment: 'Polea' },
      { name: 'Rompecráneos', muscleGroup: 'Tríceps', equipment: 'Barra EZ' },
      { name: 'Press Francés', muscleGroup: 'Tríceps', equipment: 'Barra EZ' },
      { name: 'Patada de Tríceps', muscleGroup: 'Tríceps', equipment: 'Mancuernas' },
      // Abdomen
      { name: 'Crunch Abdominal', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
      { name: 'Elevaciones de Piernas', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
      { name: 'Plancha (Plank)', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
      { name: 'Rueda Abdominal', muscleGroup: 'Abdomen', equipment: 'Otro' }
    ];

    const entities = this.exerciseLibraryRepository.create(exercises);
    await this.exerciseLibraryRepository.save(entities);
    console.log(`Seeded ${exercises.length} exercises into exercise_library table.`);
  }
}
