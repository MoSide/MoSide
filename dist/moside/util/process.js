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
const HttpMethod_1 = require("../decorators/HttpMethod");
const Controller_1 = require("../decorators/Controller");
const ctx_1 = require("../ctx");
const function_injector_1 = require("../../function-injector/function-injector");
const ctr_func_1 = require("../../function-injector/ctr-func");
const response_1 = require("../../response-handler/response");
const controller_1 = require("./controller");
const method_ctx_1 = require("./method-ctx");
const mood_1 = require("../../mood/mood");
class MosideProcess {
    constructor(moon, errorHook) {
        this.moon = moon;
        this.errorHook = errorHook;
        this.proxyHandler = {
            get: (target, p, receiver) => {
                const m = Reflect.get(target, p, receiver);
                if (typeof m !== 'function') {
                    return m;
                }
                const mMeta = HttpMethod_1.getControllerMethodMetadata(target, p);
                if (!mMeta) {
                    return m;
                }
                const cMeta = Controller_1.getControllerMetadata(target);
                return (request, response, next) => __awaiter(this, void 0, void 0, function* () {
                    const responseHandler = new response_1.Response(response, next);
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
                        });
                        let result;
                        result = yield this.pluginProcess('before', injector, [
                            ...cMeta.plugins,
                            ...mMeta.plugins
                        ]);
                        if (result && result.status === false) {
                            if (!responseHandler['_body']) {
                                responseHandler.status(500).body({ code: -1, err: result.result });
                            }
                            // todo
                            return responseHandler.response();
                        }
                        yield injector.resolveAndApply(new ctr_func_1.CtrFunc(target, p));
                        result = yield this.pluginProcess('after', injector, [
                            ...cMeta.plugins,
                            ...mMeta.plugins
                        ]);
                        if (result && result.status === false) {
                            if (!responseHandler['_body']) {
                                responseHandler.status(500).body({ code: -1, err: result.result });
                            }
                        }
                        responseHandler.response();
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
            return yield this.moon.run(stage, injector, extraPlugins);
        });
    }
    bindHandler(ctr) {
        return new Proxy(ctr, this.proxyHandler);
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
        token: response_1.Response,
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
