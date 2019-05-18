import 'reflect-metadata';
import { IParameter } from './parameter.interface';
export declare class CtrFunc {
    context: any;
    prop: string;
    constructor(context: any, prop: string);
    private _parameters;
    readonly parameters: IParameter[];
    readonly func: any;
    readonly targetType: any;
    getMetadata(key: string | symbol): any;
    setMetadata(key: string | symbol, meta: any): void;
    getOriginParams(): any[];
    apply(params: any[]): any;
}
