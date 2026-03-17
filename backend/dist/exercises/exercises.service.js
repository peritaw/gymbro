"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exercise_library_entity_1 = require("./entities/exercise-library.entity");
let ExercisesService = class ExercisesService {
    exerciseLibraryRepository;
    constructor(exerciseLibraryRepository) {
        this.exerciseLibraryRepository = exerciseLibraryRepository;
    }
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
        if (count > 0)
            return;
        const exercises = [
            { name: 'Press de Banca Plano', muscleGroup: 'Pecho', equipment: 'Barra' },
            { name: 'Press de Banca Inclinado', muscleGroup: 'Pecho', equipment: 'Barra' },
            { name: 'Aperturas con Mancuernas', muscleGroup: 'Pecho', equipment: 'Mancuernas' },
            { name: 'Cruces en Polea', muscleGroup: 'Pecho', equipment: 'Polea' },
            { name: 'Fondos en Paralelas', muscleGroup: 'Pecho', equipment: 'Peso Corporal' },
            { name: 'Dominadas', muscleGroup: 'Espalda', equipment: 'Peso Corporal' },
            { name: 'Jalón al Pecho', muscleGroup: 'Espalda', equipment: 'Máquina' },
            { name: 'Remo con Barra', muscleGroup: 'Espalda', equipment: 'Barra' },
            { name: 'Remo en Polea Baja', muscleGroup: 'Espalda', equipment: 'Polea' },
            { name: 'Remo con Mancuerna a 1 Mano', muscleGroup: 'Espalda', equipment: 'Mancuernas' },
            { name: 'Sentadilla Libre', muscleGroup: 'Piernas', equipment: 'Barra' },
            { name: 'Prensa Inclinada', muscleGroup: 'Piernas', equipment: 'Máquina' },
            { name: 'Peso Muerto Rumano', muscleGroup: 'Piernas', equipment: 'Barra' },
            { name: 'Peso Muerto Convencional', muscleGroup: 'Piernas', equipment: 'Barra' },
            { name: 'Extensiones de Cuádriceps', muscleGroup: 'Piernas', equipment: 'Máquina' },
            { name: 'Curl Femoral Tumbado', muscleGroup: 'Piernas', equipment: 'Máquina' },
            { name: 'Zancadas / Estocadas', muscleGroup: 'Piernas', equipment: 'Mancuernas' },
            { name: 'Elevación de Talones', muscleGroup: 'Piernas', equipment: 'Máquina' },
            { name: 'Press Militar', muscleGroup: 'Hombros', equipment: 'Barra' },
            { name: 'Press Arnold', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
            { name: 'Elevaciones Laterales', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
            { name: 'Pájaros (Deltoides Posterior)', muscleGroup: 'Hombros', equipment: 'Mancuernas' },
            { name: 'Face Pull', muscleGroup: 'Hombros', equipment: 'Polea' },
            { name: 'Curl con Barra', muscleGroup: 'Bíceps', equipment: 'Barra' },
            { name: 'Curl Martillo', muscleGroup: 'Bíceps', equipment: 'Mancuernas' },
            { name: 'Curl en Banco Scott', muscleGroup: 'Bíceps', equipment: 'Máquina' },
            { name: 'Curl Concentrado', muscleGroup: 'Bíceps', equipment: 'Mancuernas' },
            { name: 'Extensión en Polea Alta', muscleGroup: 'Tríceps', equipment: 'Polea' },
            { name: 'Rompecráneos', muscleGroup: 'Tríceps', equipment: 'Barra EZ' },
            { name: 'Press Francés', muscleGroup: 'Tríceps', equipment: 'Barra EZ' },
            { name: 'Patada de Tríceps', muscleGroup: 'Tríceps', equipment: 'Mancuernas' },
            { name: 'Crunch Abdominal', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
            { name: 'Elevaciones de Piernas', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
            { name: 'Plancha (Plank)', muscleGroup: 'Abdomen', equipment: 'Peso Corporal' },
            { name: 'Rueda Abdominal', muscleGroup: 'Abdomen', equipment: 'Otro' }
        ];
        const entities = this.exerciseLibraryRepository.create(exercises);
        await this.exerciseLibraryRepository.save(entities);
        console.log(`Seeded ${exercises.length} exercises into exercise_library table.`);
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exercise_library_entity_1.ExerciseLibrary)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map