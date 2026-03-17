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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingLog = void 0;
const typeorm_1 = require("typeorm");
const routine_entity_1 = require("../../routine/entities/routine.entity");
let TrainingLog = class TrainingLog {
    id;
    routine;
    routineId;
    routineDayId;
    date;
    completed;
    notes;
    durationMinutes;
    userId;
    createdAt;
};
exports.TrainingLog = TrainingLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TrainingLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => routine_entity_1.Routine, (routine) => routine.trainingLogs, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'routineId' }),
    __metadata("design:type", routine_entity_1.Routine)
], TrainingLog.prototype, "routine", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TrainingLog.prototype, "routineId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TrainingLog.prototype, "routineDayId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], TrainingLog.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TrainingLog.prototype, "completed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TrainingLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], TrainingLog.prototype, "durationMinutes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TrainingLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TrainingLog.prototype, "createdAt", void 0);
exports.TrainingLog = TrainingLog = __decorate([
    (0, typeorm_1.Entity)('training_logs')
], TrainingLog);
//# sourceMappingURL=training-log.entity.js.map