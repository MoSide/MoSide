"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Controller_1 = require("./Controller");
const symbol_1 = require("../symbol");
const Injectable_decorator_1 = require("../../function-injector/Injectable.decorator");
function setHttpMethodMeta(target, prop, descriptor, method, path) {
    Injectable_decorator_1.Injectable(target, prop);
    const cMeta = Controller_1.getControllerMetadata(target.constructor);
    const mMeta = {
        func: descriptor.value,
        method,
        path: path || prop || '/',
        key: prop,
        plugins: []
    };
    setControllerMethodMetadata(target, prop, mMeta);
    cMeta.methods.push(mMeta);
}
function Http(target, prop, descriptor) {
    const methodSplit = /^(\w+?)::(.*?)$/;
    let [_, method, path] = prop.split(methodSplit);
    if (_) {
        method = 'get';
        path = _;
    }
    setHttpMethodMeta(target, prop, descriptor, method, path);
}
exports.Http = Http;
function HttpMethod(method, path) {
    return (target, prop, descriptor) => {
        setHttpMethodMeta(target, prop, descriptor, method, path);
    };
}
exports.HttpMethod = HttpMethod;
function getControllerMethodMetadata(target, prop) {
    return Reflect.getMetadata(symbol_1.METHOD, target, prop);
}
exports.getControllerMethodMetadata = getControllerMethodMetadata;
function setControllerMethodMetadata(target, prop, meta) {
    return Reflect.defineMetadata(symbol_1.METHOD, meta, target, prop);
}
const methods = {};
(function () {
    ['get', 'post', 'put', 'del', 'head']
        .forEach((method) => {
        methods[method] = (path) => {
            return HttpMethod(method, path);
        };
    });
})();
exports.Get = methods.get;
exports.Post = methods.post;
exports.Put = methods.put;
exports.Del = methods.del;
exports.Head = methods.head;
