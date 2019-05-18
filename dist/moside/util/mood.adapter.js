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
const ctx_1 = require("../ctx");
class MoodAdapter {
    beforeController(injector, { request: { param = {}, query = {}, body = {} } }, { parameters }) {
        const mood = mood_1.Mood.create([
            ['param', param],
            ['query', query],
            ['body', body]
        ]);
        const resolveResult = mood.resolve(parameters);
        if (resolveResult.result) {
            if (resolveResult.body) {
                injector.push(resolveResult.body);
            }
            return true;
        }
        else {
            return false;
        }
    }
}
__decorate([
    function_injector_1.Injectable,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [function_injector_1.FunctionInjector,
        ctx_1.Ctx,
        method_ctx_1.MethodCtx]),
    __metadata("design:returntype", void 0)
], MoodAdapter.prototype, "beforeController", null);
exports.MoodAdapter = MoodAdapter;
