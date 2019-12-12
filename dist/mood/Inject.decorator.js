"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const metadata_array_1 = require("../utils/metadata-array");
const constant_1 = require("./constant");
function getTarget(method, prop) {
    return method + '.' + prop
}

function Inject(method, prop, defaultValue = null) {
    return (target, propertyKey, pIndex) => {
        const targetPoint = getTarget(method, prop)
        const param = Reflect.getMetadata('design:paramtypes', target, propertyKey)
        metadata_array_1.MetadataArray(constant_1.MOOD_PARAMETERS, target, propertyKey).push({
            token: targetPoint,
            type: param[pIndex],
            index: pIndex,
            target: targetPoint,
            spec: true,
            defaultValue
        });
    };
}
exports.Inject = Inject;
