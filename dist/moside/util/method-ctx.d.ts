import { CtrFunc } from "../../function-injector/ctr-func";
export declare class MethodCtx extends CtrFunc {
    constructor(context: Object, prop: string);
    readonly func: never;
    apply(params: any[]): never;
    setMetadata(key: string | symbol, meta: any): never;
}
