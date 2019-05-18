"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const constant_1 = require("../mood/constant");
class CtrFunc {
    constructor(context, prop) {
        this.context = context;
        this.prop = prop;
    }
    get parameters() {
        if (!this._parameters) {
            const parameters = this.getMetadata('fun:params');
            if (!parameters) {
                throw new Error(`the func ${this.targetType.name}(${this.prop}) has not decorate by Injectable`);
            }
            const specParams = this.getMetadata(constant_1.MOOD_PARAMETERS);
            this._parameters = new Array(...parameters);
            if (specParams && Array.isArray(specParams)) {
                specParams.forEach(param => {
                    this._parameters[param.index] = param;
                });
            }
        }
        return this._parameters;
    }
    get func() {
        return Reflect.get(this.context, this.prop);
    }
    get targetType() {
        return this.context.constructor;
    }
    getMetadata(key) {
        return Reflect.getMetadata(key, this.context, this.prop);
    }
    setMetadata(key, meta) {
        return Reflect.defineMetadata(key, meta, this.context, this.prop);
    }
    getOriginParams() {
        return this.getMetadata('design:paramtypes');
    }
    apply(params) {
        return Reflect.apply(this.func, this.context, params);
    }
}
exports.CtrFunc = CtrFunc;
