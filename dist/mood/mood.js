"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const require_1 = require("./require");
const mood_decorator_1 = require("./mood-decorator");
const constant_1 = require("./constant");
const Model_decorator_1 = require("./Model.decorator");
const FALSE = Symbol('false');
class Mood {
    constructor() {
    }
    static create(source) {
        const mood = new Mood();
        mood.source = new Map(source);
        return mood;
    }
    resolve(parameters) {
        const body = [];
        for (let param of parameters) {
            if (param.spec === true) {
                const ret = this.handleParameter(param);
                if (ret === FALSE) {
                    return { result: false };
                }
                body.push({ token: param.target, useValue: ret });
            }
            else {
                if (Model_decorator_1.getModelMeta(param.type)) {
                    const ret = this.handleModel(param);
                    if (ret === false) {
                        return { result: false };
                    }
                    body.push({ token: ret.constructor, useValue: ret });
                }
            }
        }
        return { result: true, body: body };
    }
    handleModel(Model) {
        const model = new Model();
        const metaKeys = Reflect.getMetadata(constant_1.PARAMETERS, model);
        //获取需要的属性
        for (const key of metaKeys) {
            let parameters = Reflect.getMetadata(key, model);
            const source = this.source.get(key);
            if (!source) {
                continue;
            }
            const result = parameters.findIndex(({ property, type }) => {
                if (source[property] === undefined) {
                    return require_1.getRequireMetadata(model, property);
                }
                if (type === Array && source[property].length) {
                    const arrType = mood_decorator_1.getArrayTypeMeta(model, property);
                    if (arrType) {
                        model[property] = utils_1.arrayTypeConvector(source[property], arrType);
                    }
                    else {
                        model[property] = source[property];
                    }
                }
                else {
                    model[property] = utils_1.typeConvector(source[property], type);
                }
                return false;
            });
            if (result > -1) {
                return FALSE;
            }
        }
        return model;
    }
    handleParameter({ target, require, type }) {
        if (!target) {
            target = '';
        }
        let pos = target.split('.');
        const source = pos.shift();
        let value;
        if (this.source.has(source)) {
            value = this.source.get(source);
            pos.find(p => {
                if (value === undefined) {
                    return true;
                }
                value = value[p];
            });
        }
        if (require && value === undefined) {
            return FALSE;
        }
        if (value !== undefined) {
            if (type === Array) {
                //todo 增加数组的处理
            }
            else {
                value = utils_1.typeConvector(value, type);
            }
        }
        return value !== undefined ? value : null;
    }
}
exports.Mood = Mood;
