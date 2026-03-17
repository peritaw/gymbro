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
exports.TrainingLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const training_log_entity_1 = require("./entities/training-log.entity");
let TrainingLogService = class TrainingLogService {
    logRepository;
    constructor(logRepository) {
        this.logRepository = logRepository;
    }
    async findAll(userId, routineId, startDate, endDate) {
        const where = { userId };
        if (routineId)
            where.routineId = routineId;
        if (startDate && endDate)
            where.date = (0, typeorm_2.Between)(startDate, endDate);
        return this.logRepository.find({
            where,
            order: { date: 'DESC' },
        });
    }
    async create(dto, userId) {
        const existing = await this.logRepository.findOne({
            where: {
                userId,
                routineId: dto.routineId,
                routineDayId: dto.routineDayId,
                date: dto.date,
            },
        });
        if (existing) {
            existing.completed = dto.completed;
            existing.notes = dto.notes ?? existing.notes;
            existing.durationMinutes = dto.durationMinutes ?? existing.durationMinutes;
            return this.logRepository.save(existing);
        }
        const log = this.logRepository.create({
            ...dto,
            userId,
        });
        return this.logRepository.save(log);
    }
    async getStats(userId) {
        const logs = await this.logRepository.find({
            where: { userId, completed: true },
            order: { date: 'DESC' },
        });
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const uniqueDates = [...new Set(logs.map((l) => l.date))].sort().reverse();
        for (let i = 0; i < uniqueDates.length; i++) {
            const logDate = new Date(uniqueDates[i]);
            logDate.setHours(0, 0, 0, 0);
            const expectedDate = new Date(today);
            expectedDate.setDate(expectedDate.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);
            if (logDate.getTime() === expectedDate.getTime()) {
                streak++;
            }
            else if (i === 0 && logDate.getTime() === expectedDate.getTime() - 86400000) {
                const yesterdayExpected = new Date(today);
                yesterdayExpected.setDate(yesterdayExpected.getDate() - 1);
                if (logDate.getTime() === yesterdayExpected.getTime()) {
                    streak++;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekLogs = await this.logRepository.find({
            where: {
                userId,
                date: (0, typeorm_2.Between)(weekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]),
            },
        });
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        const monthLogs = await this.logRepository.find({
            where: {
                userId,
                date: (0, typeorm_2.Between)(monthAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]),
            },
        });
        const completedThisWeek = weekLogs.filter((l) => l.completed).length;
        const completedThisMonth = monthLogs.filter((l) => l.completed).length;
        let bestStreak = 0;
        let currentStreak = 0;
        const allDates = [...new Set(logs.map((l) => l.date))].sort();
        for (let i = 0; i < allDates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            }
            else {
                const prev = new Date(allDates[i - 1]);
                const curr = new Date(allDates[i]);
                const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    currentStreak++;
                }
                else {
                    currentStreak = 1;
                }
            }
            bestStreak = Math.max(bestStreak, currentStreak);
        }
        const weeklyBreakdown = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLogs = weekLogs.filter((l) => l.date === dateStr);
            weeklyBreakdown.push({
                date: dateStr,
                dayName: d.toLocaleDateString('es', { weekday: 'short' }),
                completed: dayLogs.some((l) => l.completed),
                count: dayLogs.filter((l) => l.completed).length,
            });
        }
        return {
            currentStreak: streak,
            bestStreak,
            completedThisWeek,
            completedThisMonth,
            totalWorkouts: logs.length,
            weeklyBreakdown,
        };
    }
    async delete(id, userId) {
        const log = await this.logRepository.findOne({ where: { id, userId } });
        if (!log)
            throw new common_1.NotFoundException('Training log not found');
        await this.logRepository.remove(log);
    }
};
exports.TrainingLogService = TrainingLogService;
exports.TrainingLogService = TrainingLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(training_log_entity_1.TrainingLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrainingLogService);
//# sourceMappingURL=training-log.service.js.map