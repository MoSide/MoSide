"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }

        step((generator = generator.apply(thisArg, _arguments || [])).next())
    });
};
Object.defineProperty(exports, '__esModule', {value: true})
const __1 = require('..')
const ctx_1 = require('../ctx')
const function_injector_1 = require('../../function-injector')
const response_handler_1 = require('../../response-handler')
const controller_1 = require('./controller')
const method_ctx_1 = require('./method-ctx')
const mood_1 = require('../../mood/mood')
const reason_1 = require('./reason')

class MosideProcess {
    constructor(moon, errorHook) {
        this.moon = moon
        this.errorHook = errorHook
        this.proxyHandler = {
            get: (target, p, receiver) => {
                const m = Reflect.get(target, p, receiver)
                if (typeof m !== 'function') {
                    return m
                }
                const mMeta = __1.getControllerMethodMetadata(target, p);
                if (!mMeta) {
                    return m;
                }
                const cMeta = __1.getControllerMetadata(target)
                return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
                    const responseHandler = new response_handler_1.Response(response, next);
                    try {
                        const methodCtx = new method_ctx_1.MethodCtx(target, p);
                        const mood = mood_1.Mood.create([
                            ['params', request.params],
                            ['query', request.query],
                            ['body', request.body]
                        ]);
                        const injector = createMethodInjector({
                            request,
                            response,
                            mood,
                            responseHandler,
                            methodCtx
                        })
                        const extraPlugins = [
                            ...cMeta.plugins,
                            ...mMeta.plugins
                        ]
                        let result
                        result = yield this.pluginProcess('before', injector, extraPlugins)
                        if (result && result.status === false) {
                            if (!responseHandler['_body']) {
                                responseHandler.status(500).body({code: -1, err: result.result})
                            }
                            // todo
                            return responseHandler.response()
                        }
                        yield this.runController(injector, new function_injector_1.CtrFunc(target, p), extraPlugins)
                        result = yield this.pluginProcess('after', injector, extraPlugins)
                        if (result && result.status === false) {
                            if (!responseHandler['_body']) {
                                responseHandler.status(500).body({code: -1, err: result.result})
                            }
                        }
                        responseHandler.response()
                    }
                    catch (e) {
                        const result = yield controller_1.runCycleLife('onError', target);
                        if (result !== false) {
                            this.errorHook(e);
                            next(e);
                            // todo resp error
                        }
                    }
                });
            }
        };
    }

    pluginProcess(stage, injector, extraPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.moon.run(stage, injector, extraPlugins)
        })
    }

    bindHandler(ctr) {
        return new Proxy(ctr, this.proxyHandler)
    }

    runController(injector, controller, extraPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield injector.resolveAndApply(controller)
            } catch (e) {
                const errInjector = injector.createChild([{
                    token: reason_1.Reason,
                    useValue: new reason_1.Reason(e)
                }])
                const {status} = yield this.pluginProcess('error', errInjector, extraPlugins)
                if (!status) {
                    throw e
                }
            }
        })
    }
}
exports.MosideProcess = MosideProcess;
function createMethodInjector({ request, response, mood, responseHandler, methodCtx }) {
    const ctxProvider = {
        token: ctx_1.Ctx,
        useValue: new ctx_1.Ctx(request, response)
    };
    const moodProvider = {
        token: mood_1.Mood,
        useValue: mood
    };
    const respHandlerProvider = {
        token: responseHandler.constructor,
        useValue: responseHandler
    };
    const respHandlerProvider2 = {
        token: response_handler_1.Response,
        useValue: responseHandler
    };
    const methodCtxProvider = {
        token: method_ctx_1.MethodCtx,
        useValue: methodCtx
    };
    return function_injector_1.FunctionInjector.create([
        ctxProvider,
        moodProvider,
        respHandlerProvider,
        respHandlerProvider2,
        methodCtxProvider
    ]);
}
