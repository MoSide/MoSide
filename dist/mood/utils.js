"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function typeConvector(content, type) {
    switch (type) {
        case Boolean:
            return toBoolean(content);
        case Number:
            return toNumber(content);
        case String:
            return toString(content);
        case Date:
            return toDate(content);
        default:
            return content;
    }
}
exports.typeConvector = typeConvector;
function arrayTypeConvector(array, type) {
    if (Array.isArray(type)) {
        const result = new Array(...array);
        type.forEach((t, index) => {
            if (result[index] !== undefined || result[index] !== null) {
                result[index] = typeConvector(result[index], t);
            }
        });
        return result;
    }
    else {
        return array.map(value => typeConvector(value, type));
    }
}
exports.arrayTypeConvector = arrayTypeConvector;
function toBoolean(content) {
    if (typeof content === 'boolean') {
        return content;
    }
    else if (typeof content === 'string') {
        if (content === 'true') {
            return true;
        }
        else if (content === 'false') {
            return false;
        }
    }
    return Boolean(content);
}
function toNumber(content) {
    if (typeof content === 'number') {
        return content;
    }
    return Number(content);
}
function toDate(content) {
    if (content instanceof Date) {
        return content;
    }
    return new Date(content);
}
function toString(content) {
    if (typeof content === 'string') {
        return content;
    }
    String(content);
}
