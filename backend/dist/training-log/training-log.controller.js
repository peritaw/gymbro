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
exports.TrainingLogController = void 0;
const common_1 = require("@nestjs/common");
const training_log_service_1 = require("./training-log.service");
const training_log_dto_1 = require("./dto/training-log.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TrainingLogController = class TrainingLogController {
    trainingLogService;
    constructor(trainingLogService) {
        this.trainingLogService = trainingLogService;
    }
    findAll(req, routineId, startDate, endDate) {
        return this.trainingLogService.findAll(req.user.userId, routineId ? parseInt(routineId) : undefined, startDate, endDate);
    }
    create(dto, req) {
        return this.trainingLogService.create(dto, req.user.userId);
    }
    getStats(req) {
        return this.trainingLogService.getStats(req.user.userId);
    }
    delete(id, req) {
        return this.trainingLogService.delete(id, req.user.userId);
    }
};
exports.TrainingLogController = TrainingLogController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('routineId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], TrainingLogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [training_log_dto_1.CreateTrainingLogDto, Object]),
    __metadata("design:returntype", void 0)
], TrainingLogController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrainingLogController.prototype, "getStats", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], TrainingLogController.prototype, "delete", null);
exports.TrainingLogController = TrainingLogController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/training-logs'),
    __metadata("design:paramtypes", [training_log_service_1.TrainingLogService])
], TrainingLogController);
//# sourceMappingURL=training-log.controller.js.map