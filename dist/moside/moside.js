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
const controller_1 = require("./util/controller");
const process_1 = require("./util/process");
const moon_1 = require("../moon/moon");
const mood_adapter_1 = require("./util/mood.adapter");
const express_adapter_1 = require("./util/express.adapter");
class Moside {
    constructor() {
        this.routerList = [];
        this.plugin = new moon_1.Moon([
            new mood_adapter_1.MoodAdapter
        ]);
        this.process = new process_1.MosideProcess(this.plugin, this.postErrorMessage.bind(this));
        this.adapter = new express_adapter_1.ExpressAdapter();
    }
    static create(routerList) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = new Moside();
            ret.routerList = routerList;
            yield ret.onInit();
            return ret;
        });
    }
    postErrorMessage(e) {
    }
    getRouter() {
        return this.adapter.router(this.methods);
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.methods = yield controller_1.initController(this.process, this.routerList);
        });
    }
}
exports.Moside = Moside;
