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
exports.MeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const measurement_entity_1 = require("./entities/measurement.entity");
let MeasurementsService = class MeasurementsService {
    measurementRepository;
    constructor(measurementRepository) {
        this.measurementRepository = measurementRepository;
    }
    async create(userId, createMeasurementDto) {
        const measurement = this.measurementRepository.create({
            ...createMeasurementDto,
            userId,
        });
        return await this.measurementRepository.save(measurement);
    }
    async findAll(userId) {
        return await this.measurementRepository.find({
            where: { userId },
            order: { date: 'ASC' },
        });
    }
    async findOne(id, userId) {
        const measurement = await this.measurementRepository.findOne({
            where: { id, userId },
        });
        if (!measurement)
            throw new common_1.NotFoundException('Measurement not found');
        return measurement;
    }
    async update(id, userId, updateMeasurementDto) {
        const measurement = await this.findOne(id, userId);
        if (updateMeasurementDto.weight !== undefined)
            measurement.weight = updateMeasurementDto.weight;
        if (updateMeasurementDto.chest !== undefined)
            measurement.chest = updateMeasurementDto.chest;
        if (updateMeasurementDto.waist !== undefined)
            measurement.waist = updateMeasurementDto.waist;
        if (updateMeasurementDto.arms !== undefined)
            measurement.arms = updateMeasurementDto.arms;
        if (updateMeasurementDto.legs !== undefined)
            measurement.legs = updateMeasurementDto.legs;
        if (updateMeasurementDto.date !== undefined)
            measurement.date = updateMeasurementDto.date;
        return await this.measurementRepository.save(measurement);
    }
    async remove(id, userId) {
        const measurement = await this.findOne(id, userId);
        return await this.measurementRepository.remove(measurement);
    }
};
exports.MeasurementsService = MeasurementsService;
exports.MeasurementsService = MeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(measurement_entity_1.Measurement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MeasurementsService);
//# sourceMappingURL=measurements.service.js.map