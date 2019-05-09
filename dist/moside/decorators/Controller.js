"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const symbol_1 = require("../symbol");
/**
 * 控制器装饰器
 * @param options 控制器选项
 * @constructor
 */
function Controller({ path, plugins } = {}) {
    return (target) => {
        const cMeta = getControllerMetadata(target);
        cMeta.path = path || '/';
        if (plugins && Array.isArray(plugins)) {
            cMeta.plugins.push(...plugins);
        }
    };
}
exports.Controller = Controller;
/**
 * 获取控制器的Metadata,若不存在则新建meta
 * @param target 目标控制器
 */
function getControllerMetadata(target) {
    let cMeta = Reflect.getMetadata(symbol_1.CONTROLLER, target);
    if (!cMeta) {
        cMeta = {
            path: '',
            methods: [],
            plugins: []
        };
        Reflect.defineMetadata(symbol_1.CONTROLLER, cMeta, target);
    }
    return cMeta;
}
exports.getControllerMetadata = getControllerMetadata;
