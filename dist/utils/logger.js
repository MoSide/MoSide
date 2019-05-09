"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
log4js_1.configure({
    appenders: {
        console: {
            type: 'console'
        },
    },
    categories: {
        default: {
            appenders: ['console'],
            level: 'trace'
        }
    },
    pm2: true
});
exports.logger = log4js_1.getLogger('MoSide');
exports.logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
