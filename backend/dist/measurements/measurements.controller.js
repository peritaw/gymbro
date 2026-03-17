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
exports.MeasurementsController = void 0;
const common_1 = require("@nestjs/common");
const measurements_service_1 = require("./measurements.service");
const create_measurement_dto_1 = require("./dto/create-measurement.dto");
const update_measurement_dto_1 = require("./dto/update-measurement.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let MeasurementsController = class MeasurementsController {
    measurementsService;
    constructor(measurementsService) {
        this.measurementsService = measurementsService;
    }
    create(req, createMeasurementDto) {
        return this.measurementsService.create(req.user.userId, createMeasurementDto);
    }
    findAll(req) {
        return this.measurementsService.findAll(req.user.userId);
    }
    findOne(req, id) {
        return this.measurementsService.findOne(+id, req.user.userId);
    }
    update(req, id, updateMeasurementDto) {
        return this.measurementsService.update(+id, req.user.userId, updateMeasurementDto);
    }
    remove(req, id) {
        return this.measurementsService.remove(+id, req.user.userId);
    }
};
exports.MeasurementsController = MeasurementsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_measurement_dto_1.CreateMeasurementDto]),
    __metadata("design:returntype", void 0)
], MeasurementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MeasurementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MeasurementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_measurement_dto_1.UpdateMeasurementDto]),
    __metadata("design:returntype", void 0)
], MeasurementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MeasurementsController.prototype, "remove", null);
exports.MeasurementsController = MeasurementsController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/measurements'),
    __metadata("design:paramtypes", [measurements_service_1.MeasurementsService])
], MeasurementsController);
//# sourceMappingURL=measurements.controller.js.map