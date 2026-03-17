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
exports.RoutineDay = void 0;
const typeorm_1 = require("typeorm");
const routine_entity_1 = require("./routine.entity");
const exercise_entity_1 = require("./exercise.entity");
let RoutineDay = class RoutineDay {
    id;
    dayNumber;
    name;
    muscleGroup;
    routine;
    routineId;
    exercises;
};
exports.RoutineDay = RoutineDay;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoutineDay.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoutineDay.prototype, "dayNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoutineDay.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RoutineDay.prototype, "muscleGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => routine_entity_1.Routine, (routine) => routine.days, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'routineId' }),
    __metadata("design:type", routine_entity_1.Routine)
], RoutineDay.prototype, "routine", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoutineDay.prototype, "routineId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => exercise_entity_1.Exercise, (exercise) => exercise.routineDay, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], RoutineDay.prototype, "exercises", void 0);
exports.RoutineDay = RoutineDay = __decorate([
    (0, typeorm_1.Entity)('routine_days')
], RoutineDay);
//# sourceMappingURL=routine-day.entity.js.map