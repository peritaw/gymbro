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
exports.RoutineController = void 0;
const common_1 = require("@nestjs/common");
const routine_service_1 = require("./routine.service");
const routine_dto_1 = require("./dto/routine.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RoutineController = class RoutineController {
    routineService;
    constructor(routineService) {
        this.routineService = routineService;
    }
    findAll(req) {
        return this.routineService.findAll(req.user.userId);
    }
    findOne(id, req) {
        return this.routineService.findOne(id, req.user.userId);
    }
    create(dto, req) {
        return this.routineService.create(dto, req.user.userId);
    }
    update(id, dto, req) {
        return this.routineService.update(id, dto, req.user.userId);
    }
    remove(id, req) {
        return this.routineService.remove(id, req.user.userId);
    }
    activate(id, req) {
        return this.routineService.activate(id, req.user.userId);
    }
};
exports.RoutineController = RoutineController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [routine_dto_1.CreateRoutineDto, Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, routine_dto_1.UpdateRoutineDto, Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], RoutineController.prototype, "activate", null);
exports.RoutineController = RoutineController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/routines'),
    __metadata("design:paramtypes", [routine_service_1.RoutineService])
], RoutineController);
//# sourceMappingURL=routine.controller.js.map