import { TypeProvider } from './type-provider.interface';
import { CtrFunc } from './ctr-func';
export declare class FunctionInjector {
    THROW_ERROR: boolean;
    private params;
    private parent;
    protected constructor();
    static create(providers: TypeProvider[], throwError?: boolean): FunctionInjector;
    createChild(providers?: TypeProvider[]): FunctionInjector;
    push(providers: TypeProvider[]): void;
    get(type: any | any[]): any;
    resolveAndApply(target: CtrFunc | CtrFunc[], stopSignal?: any): Promise<any | any[]>;
    _resolveAndApply(func: CtrFunc): Promise<any>;
    resolve(cFunc: CtrFunc): any[];
    private getParam;
}
