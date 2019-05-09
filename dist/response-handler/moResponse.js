"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MoResponse {
    constructor(responseAdapter, ctx) {
        this.responseAdapter = responseAdapter;
        this.ctx = ctx;
        this._httpStatus = -1;
    }
    header(name, value) {
        this.responseAdapter.setHeader(name, value);
        return this;
    }
    removeHeader(name) {
        this.responseAdapter.removeHeader(name);
        return this;
    }
    status(status) {
        this._httpStatus = status;
        return this;
    }
    body(body) {
        this._body = body;
        return this;
    }
    error(error) {
        this._error = error;
        return this;
    }
    end() {
        return;
    }
    response() {
        if (this._error) {
            return this.responseAdapter.next(this._error);
        }
        if (this._httpStatus !== -1) {
            this.responseAdapter.status(this._httpStatus);
        }
        if (this._body !== undefined) {
            this.responseAdapter.send(this._body);
        }
        else {
            this.responseAdapter.send();
        }
    }
}
exports.MoResponse = MoResponse;
/**
 * Created by yskun on 2017/4/18.
 */
