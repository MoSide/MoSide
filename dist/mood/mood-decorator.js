"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
function ArrayType(type) {
    return function (target, propertyKey) {
        if (type) {
            Reflect.defineMetadata(constant_1.ARRAY_TYPE, type, target, propertyKey);
        }
    };
}
exports.ArrayType = ArrayType;
function getArrayTypeMeta(target, key) {
    return Reflect.getMetadata(constant_1.ARRAY_TYPE, target, key);
}
exports.getArrayTypeMeta = getArrayTypeMeta;
