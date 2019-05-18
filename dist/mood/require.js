"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const metadata_array_1 = require("../utils/metadata-array");
const constant_1 = require("./constant");
exports.PARAM_REQUIRE = 'parameters:require';
function Require(target, prop, index) {
    if (!index) {
        Reflect.defineMetadata(exports.PARAM_REQUIRE, true, target, prop);
    }
    else {
        const specParam = metadata_array_1.MetadataArray(constant_1.MOOD_PARAMETERS, target, prop);
        const targetParam = specParam.find(param => param.index === index);
        if (targetParam) {
            targetParam.require = true;
        }
        else {
            throw new Error(`Require Decorator must after Type Decorator`);
        }
    }
}
exports.Require = Require;
function getRequireMetadata(target, prop) {
    return Reflect.getMetadata(exports.PARAM_REQUIRE, target, prop) || false;
}
exports.getRequireMetadata = getRequireMetadata;
