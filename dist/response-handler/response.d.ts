import { Ctx } from '../moside/ctx';
import { ResponseAdapter } from '../moside/framework.interface';
export declare class Response {
    private responseAdapter;
    ctx: Ctx;
    private _httpStatus;
    private _body;
    private _error;
    constructor(responseAdapter: ResponseAdapter, ctx: Ctx);
    header(name: string, value: any): this;
    removeHeader(name: string): this;
    status(status: number): Response;
    body(body: any): Response;
    error(error: any): Response;
    end(): void;
    response(): void;
}
/**
 * Created by yskun on 2017/4/18.
 */
