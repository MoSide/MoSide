"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function MetadataArray(key, target, propKey) {
    let data;
    if (propKey) {
        data = Reflect.getMetadata(key, target, propKey);
    }
    else {
        data = Reflect.getMetadata(key, target);
    }
    if (!data) {
        data = [];
        if (propKey) {
            Reflect.defineMetadata(key, data, target, propKey);
        }
        else {
            Reflect.defineMetadata(key, data, target);
        }
    }
    return data;
}
exports.MetadataArray = MetadataArray;
