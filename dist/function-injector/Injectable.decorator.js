"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Injectable(target, prop) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target, prop);
    const parameters = paramTypes.map((value, index) => {
        return {
            token: value,
            type: value,
            index: index
        };
    });
    Reflect.defineMetadata('fun:params', parameters, target, prop);
}
exports.Injectable = Injectable;
