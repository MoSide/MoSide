"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const metadata_array_1 = require("../utils/metadata-array");
const symbol_1 = require("../moside/symbol");
exports.PARAM_REQUIRE = 'parameters:require';
function Require(target, prop, index) {
    if (!index) {
        Reflect.defineMetadata(exports.PARAM_REQUIRE, true, target, prop);
    }
    else {
        const specParam = metadata_array_1.MetadataArray(symbol_1.PARAMETERS, target, prop);
        if (specParam[index]) {
            specParam[index].require = true;
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
