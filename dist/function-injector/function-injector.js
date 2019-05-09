"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../utils/logger");
class FunctionInjector {
    constructor() {
        this.THROW_ERROR = true;
        this.params = new Map();
    }
    static create(providers, throwError = true) {
        const fun = new FunctionInjector();
        fun.THROW_ERROR = throwError;
        fun.push([{ token: FunctionInjector, useValue: fun }, ...providers]);
        return fun;
    }
    createChild(providers) {
        const injector = FunctionInjector.create(providers || [], this.THROW_ERROR);
        injector.parent = this;
        return injector;
    }
    push(providers) {
        providers.forEach(({ token, useValue }) => {
            // todo 此处应抛出错误？
            if (token === null || token === undefined) {
                return logger_1.logger.debug(`a provider hasn't prop 'type' or 'useValue`);
            }
            if (useValue === undefined) {
                return logger_1.logger.debug(`a provider hasn't prop 'type' or 'useValue`);
            }
            this.params.set(token, useValue);
        });
    }
    get(type) {
        if (Array.isArray(type)) {
            return type.map(t => {
                return this.getParam(t) || null;
            });
        }
        else {
            return this.getParam(type);
        }
    }
    resolveAndApply(target, stopSignal) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(target)) {
                const result = [];
                let index = 0;
                for (const cFunc of target) {
                    const status = yield this._resolveAndApply(cFunc);
                    if (stopSignal !== undefined && status === stopSignal) {
                        return [{
                                status: false,
                                index
                            }];
                    }
                    result.push(status);
                    index++;
                }
                result.unshift({
                    status: true
                });
                return result;
            }
            else {
                return yield this._resolveAndApply(target);
            }
        });
    }
    _resolveAndApply(func) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield func.apply(this.resolve(func));
        });
    }
    resolve(cFunc) {
        const cFunParams = cFunc.parameters;
        return cFunParams.map(parameter => {
            const param = this.getParam(parameter.token);
            if (param === void 0) {
                throw new Error(`${cFunc.targetType.name}(${cFunc.prop}) -> ${parameter.type.name || parameter.type}(${parameter.index}) has no provider`);
            }
            return param || null;
        });
    }
    getParam(type) {
        if (this.params.has(type)) {
            return this.params.get(type);
        }
        else {
            if (this.parent) {
                return this.parent.getParam(type);
            }
            else {
                return void 0;
            }
        }
    }
}
exports.FunctionInjector = FunctionInjector;
