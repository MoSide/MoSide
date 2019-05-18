"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const function_injector_1 = require("../../function-injector");
class MethodCtx {
    constructor(context, prop) {
        this.ctx = new function_injector_1.CtrFunc(context, prop);
    }
    get parameters() {
        return this.ctx.parameters;
    }
    getMetadata(key) {
        return this.ctx.getMetadata(key);
    }
    getOriginParams() {
        return this.ctx.getOriginParams();
    }
}
exports.MethodCtx = MethodCtx;
