"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
function Model(target) {
    Reflect.defineMetadata(constant_1.MODEL, true, target);
}
exports.Model = Model;
function getModelMeta(target) {
    return Reflect.getMetadata(constant_1.MODEL, target) || false;
}
exports.getModelMeta = getModelMeta;
