"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const metadata_array_1 = require("../utils/metadata-array");
const constant_1 = require("./constant");
function HttpParameter(paramType) {
    return function (target, propertyKey) {
        const type = Reflect.getMetadata('design:type', target, propertyKey);
        if (type) {
            const p = {
                property: propertyKey,
                type
            };
            metadata_array_1.MetadataArray(paramType, target).push(p);
            let types = Reflect.getMetadata(constant_1.MOOD_PARAMETERS, target);
            if (!types) {
                types = new Set();
                Reflect.defineMetadata(constant_1.MOOD_PARAMETERS, types, target);
            }
            types.add(paramType);
        }
    };
}
exports.HttpParameter = HttpParameter;
exports.Query = HttpParameter("query" /* query */);
exports.PathParameter = HttpParameter("params" /* path */);
exports.Body = HttpParameter("body" /* body */);
