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
exports.RoutineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const routine_entity_1 = require("./entities/routine.entity");
const routine_day_entity_1 = require("./entities/routine-day.entity");
const exercise_entity_1 = require("./entities/exercise.entity");
let RoutineService = class RoutineService {
    routineRepository;
    dayRepository;
    exerciseRepository;
    constructor(routineRepository, dayRepository, exerciseRepository) {
        this.routineRepository = routineRepository;
        this.dayRepository = dayRepository;
        this.exerciseRepository = exerciseRepository;
    }
    async findAll(userId) {
        return this.routineRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const routine = await this.routineRepository.findOne({
            where: { id, userId },
        });
        if (!routine) {
            throw new common_1.NotFoundException('Routine not found');
        }
        return routine;
    }
    async create(dto, userId) {
        if (dto.isActive) {
            await this.routineRepository.update({ userId }, { isActive: false });
        }
        const routine = this.routineRepository.create({
            name: dto.name,
            description: dto.description,
            isActive: dto.isActive ?? false,
            userId,
            days: dto.days.map((dayDto) => ({
                dayNumber: dayDto.dayNumber,
                name: dayDto.name,
                muscleGroup: dayDto.muscleGroup,
                exercises: dayDto.exercises.map((exDto, idx) => ({
                    name: exDto.name,
                    sets: exDto.sets,
                    reps: exDto.reps,
                    weight: exDto.weight,
                    notes: exDto.notes,
                    order: exDto.order ?? idx,
                })),
            })),
        });
        return this.routineRepository.save(routine);
    }
    async update(id, dto, userId) {
        const routine = await this.findOne(id, userId);
        if (dto.isActive) {
            await this.routineRepository.update({ userId }, { isActive: false });
        }
        if (dto.days) {
            await this.dayRepository.delete({ routineId: id });
            routine.days = dto.days.map((dayDto) => this.dayRepository.create({
                dayNumber: dayDto.dayNumber,
                name: dayDto.name,
                muscleGroup: dayDto.muscleGroup,
                routineId: id,
                exercises: dayDto.exercises.map((exDto, idx) => this.exerciseRepository.create({
                    name: exDto.name,
                    sets: exDto.sets,
                    reps: exDto.reps,
                    weight: exDto.weight,
                    notes: exDto.notes,
                    order: exDto.order ?? idx,
                })),
            }));
        }
        if (dto.name !== undefined)
            routine.name = dto.name;
        if (dto.description !== undefined)
            routine.description = dto.description;
        if (dto.isActive !== undefined)
            routine.isActive = dto.isActive;
        return this.routineRepository.save(routine);
    }
    async remove(id, userId) {
        const routine = await this.findOne(id, userId);
        try {
            await this.routineRepository.delete(routine.id);
        }
        catch (error) {
            console.error('Error in routineRepository.delete:', error);
            throw error;
        }
    }
    async activate(id, userId) {
        await this.routineRepository.update({ userId }, { isActive: false });
        const routine = await this.findOne(id, userId);
        routine.isActive = true;
        return this.routineRepository.save(routine);
    }
};
exports.RoutineService = RoutineService;
exports.RoutineService = RoutineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(routine_entity_1.Routine)),
    __param(1, (0, typeorm_1.InjectRepository)(routine_day_entity_1.RoutineDay)),
    __param(2, (0, typeorm_1.InjectRepository)(exercise_entity_1.Exercise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RoutineService);
//# sourceMappingURL=routine.service.js.map