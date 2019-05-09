"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ctr_func_1 = require("../../function-injector/ctr-func");
class MethodCtx extends ctr_func_1.CtrFunc {
    // todo 调整设计模式
    constructor(context, prop) {
        super(context, prop);
    }
    get func() {
        throw Error(`Method Ctx does not support this method`);
    }
    apply(params) {
        throw Error(`Method Ctx does not support this method`);
    }
    setMetadata(key, meta) {
        throw Error(`Method Ctx does not support this method`);
    }
}
exports.MethodCtx = MethodCtx;
