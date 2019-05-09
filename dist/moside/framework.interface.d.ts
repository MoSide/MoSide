import { IHttpMethod } from "./method.interface";
export interface Framework {
    request(params: any[]): RequestAdapter;
    response(params: any[]): ResponseAdapter;
    router(methods: IHttpMethod[]): any;
}
export interface ResponseAdapter {
    next(err?: any): any;
    status(code: number): any;
    setHeader(name: string, value: string | number | string[]): any;
    removeHeader(name: string): any;
    send(data?: any): any;
}
export interface RequestAdapter {
}
