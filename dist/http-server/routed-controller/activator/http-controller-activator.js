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
const http_activator_middleware_1 = require("./http-activator-middleware");
const inversify_1 = require("inversify");
const core_1 = require("../../../core");
let HttpControllerActivator = class HttpControllerActivator extends core_1.ControllerActivator {
    constructor(functionReader, paramsReader) {
        super(functionReader, paramsReader);
    }
    turnIntoMiddleware(action, params) {
        action.arguments;
        var requestHandler = (request, response, next) => {
            var paramsArray = [];
            for (var index in params) {
                paramsArray[index] = params[index](request, response);
            }
            return action(...paramsArray);
        };
        return new http_activator_middleware_1.HttpActivatorMiddleware(requestHandler);
    }
    ;
};
HttpControllerActivator = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(core_1.Types.FunctionReader)),
    __param(1, inversify_1.inject(core_1.Types.ParamsReader)),
    __metadata("design:paramtypes", [Object, Object])
], HttpControllerActivator);
exports.HttpControllerActivator = HttpControllerActivator;
//# sourceMappingURL=http-controller-activator.js.map