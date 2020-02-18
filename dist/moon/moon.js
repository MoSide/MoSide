'use strict'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value))
            } catch (e) {
                reject(e)
            }
        }

        function rejected(value) {
            try {
                step(generator['throw'](value))
            } catch (e) {
                reject(e)
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value)
            }).then(fulfilled, rejected)
        }

        step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
}
Object.defineProperty(exports, '__esModule', {value: true})
const function_injector_1 = require('../function-injector')
const mood_1 = require('../mood/mood')

class Moon {
    constructor(plugins = []) {
        this.plugins = plugins
    }

    run(stage, injector, extraPlugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const mood = injector.get(mood_1.Mood)
            const target = {
                before: 'beforeController',
                after: 'afterController',
                error: 'onControllerError'
            }[stage]
            const processPlugin = [
                ...this.plugins.filter(plugin => plugin[target]),
                ...extraPlugins.filter(plugin => plugin[target])
            ].map(plugin => new function_injector_1.CtrFunc(plugin, target))
            const [status] = yield injector.resolveAndApply(processPlugin, mood, false)
            if (status.status === false) {
                status.result = `${processPlugin[status.index].context.constructor.name}(stage: ${stage}) has wrong process`
            }
            return status
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
