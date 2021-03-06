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
const function_injector_1 = require("../../function-injector");
const method_ctx_1 = require("./method-ctx");
const mood_1 = require("../../mood/mood");
const response_handler_1 = require("../../response-handler");
class MoodAdapter {
    beforeController(injector, { parameters }, mood, response) {
        const resolveResult = mood.resolve(parameters);
        if (resolveResult.result) {
            if (resolveResult.body) {
                injector.push(resolveResult.body);
            }
            return true;
        }
        else {
            response.body({
                status: 10001,
                message: 'Can not resolve all params'
            });
            return false;
        }
    }
}
__decorate([
    function_injector_1.Injectable,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [function_injector_1.FunctionInjector,
        method_ctx_1.MethodCtx,
        mood_1.Mood,
        response_handler_1.Response]),
    __metadata("design:returntype", void 0)
], MoodAdapter.prototype, "beforeController", null);
exports.MoodAdapter = MoodAdapter;
