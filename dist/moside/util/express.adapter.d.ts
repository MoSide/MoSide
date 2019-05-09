import { Framework, RequestAdapter, ResponseAdapter } from "../framework.interface";
import * as e from "express";
import { IHttpMethod } from "../method.interface";
export declare class ExpressAdapter implements Framework {
    request(request: any): RequestAdapter;
    response([request, response, next]: [e.Request, e.Response, e.NextFunction]): ResponseAdapter;
    router(methods: IHttpMethod[]): import("express-serve-static-core").Router;
}
