'use strict'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value))
            } catch (e) {
                reject(e)
            }
        }

        function rejected(value) {
            try {
                step(generator['throw'](value))
            } catch (e) {
                reject(e)
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value)
            }).then(fulfilled, rejected)
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
}
Object.defineProperty(exports, '__esModule', {value: true})
const __1 = require('..')
const function_injector_1 = require('../../function-injector')

function initController(process, routerList) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(routerList)) {
            return []
        }
        const methods = []
        yield Promise.all(routerList.map((controller) => __awaiter(this, void 0, void 0, function* () {
            const cMeta = __1.getControllerMetadata(controller)
            const cIns = new controller()
            // 绑定代理
            const ctx = bindCtrProxy(process, cIns)
            cMeta.methods.forEach((cMethod) => {
                const path = getCtrMethodPath(cMeta.path, cMethod.path)
                methods.push({
                    path,
                    method: cMethod.method,
                    target: new function_injector_1.CtrFunc(ctx, cMethod.key)
                })
            })
            // 执行onInit
            return runCycleLife('onInit', cIns)
        })))
        return methods;
    });
}
exports.initController = initController;
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
