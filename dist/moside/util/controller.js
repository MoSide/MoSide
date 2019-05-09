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
const Controller_1 = require("../decorators/Controller");
const ctr_func_1 = require("../../function-injector/ctr-func");
function initController(process, routerList) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(routerList)) {
            return [];
        }
        const methods = [];
        // todo 这里可能需要做异步处理
        yield asyncForeach(routerList, (controller) => __awaiter(this, void 0, void 0, function* () {
            const cMeta = Controller_1.getControllerMetadata(controller);
            const cIns = new controller();
            // 绑定代理
            const ctx = bindCtrProxy(process, cIns);
            // 执行onInit
            yield runCycleLife('onInit', cIns);
            yield asyncForeach(cMeta.methods, cMethod => {
                const path = getCtrMethodPath(cMeta.path, cMethod.path);
                methods.push({
                    path,
                    method: cMethod.method,
                    target: new ctr_func_1.CtrFunc(ctx, cMethod.key)
                });
            });
        }));
        return methods;
    });
}
exports.initController = initController;
function asyncForeach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const index in array) {
            yield callback(array[index], index, array);
        }
    });
}
function runCycleLife(hook, context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context && typeof context[hook] === 'function') {
            return yield context[hook].call(context);
        }
    });
}
exports.runCycleLife = runCycleLife;
function getCtrMethodPath(cPath = '', mPath = '') {
    if (mPath === '/') {
        return cPath;
    }
    else {
        return (cPath === '/' ? '' : cPath) + mPath;
    }
}
function bindCtrProxy(ctrProcess, ctr) {
    return ctrProcess.bindHandler(ctr);
}
