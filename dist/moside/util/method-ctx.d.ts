import { IParameter } from '../../function-injector/parameter.interface';
export declare class MethodCtx {
    private ctx;
    constructor(context: Object, prop: string);
    readonly parameters: IParameter[];
    getMetadata(key: string | symbol): any;
    getOriginParams(): any[];
}
