"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e = require("express");
const logger_1 = require("../../utils/logger");
class ExpressAdapter {
    request(request) {
        return request;
    }
    response([request, response, next]) {
        return {
            next,
            status(code) {
                return response.status(code);
            },
            setHeader(name, value) {
                return response.setHeader(name, value);
            },
            removeHeader(name) {
                return response.removeHeader(name);
            },
            send(data) {
                return response.send(data);
            }
        };
    }
    router(methods) {
        const router = e.Router();
        methods.forEach(({ method, path, target }) => {
            logger_1.logger.info(`creating router`, method, path, target.context.constructor.name, target.prop);
            function targetCall(...params) {
                return target.apply(params);
            }
            switch (method) {
                case 'get':
                    router.get(path, targetCall);
                    break;
                case 'post':
                    router.post(path, targetCall);
                    break;
                case 'del':
                    router.delete(path, targetCall);
                    break;
                case 'put':
                    router.put(path, targetCall);
                    break;
                default:
                    if (router[method]) {
                        router[method](path, targetCall);
                    }
                    else {
                        console.log(`something wrong`, method, path, target);
                    }
            }
        });
        return router;
    }
}
exports.ExpressAdapter = ExpressAdapter;
