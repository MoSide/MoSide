"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ctr_func_1 = require("../function-injector/ctr-func");
class Moon {
    constructor(plugins = []) {
        this.plugins = plugins;
    }
    run(stage, injector, extraPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const processPlugin = [
                ...this.plugins.filter(plugin => plugin[stage + 'Controller']),
                ...extraPlugins.filter(plugin => plugin[stage + 'Controller'])
            ].map(plugin => new ctr_func_1.CtrFunc(plugin, stage + 'Controller'));
            const [status] = yield injector.resolveAndApply(processPlugin, false);
            return status.status;
        });
    }
    add(plugin) {
        this.plugins.push(plugin);
    }
    remove(plugin) {
        const result = this.plugins.indexOf(plugin);
        if (result > -1) {
            this.plugins.splice(result, 1);
        }
    }
}
exports.Moon = Moon;
