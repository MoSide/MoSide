import { TypeProvider } from './type-provider.interface';
import { CtrFunc } from './ctr-func';
import { Mood } from '../mood/mood';
export declare class FunctionInjector {
    THROW_ERROR: boolean;
    private params;
    private parent;
    protected constructor();
    static create(providers: TypeProvider[], throwError?: boolean, noInjector?: boolean): FunctionInjector;
    createChild(providers?: TypeProvider[], noInjector?: boolean): FunctionInjector;
    push(providers: TypeProvider[]): void;
    get(type: any | any[]): any;
    resolveAndApply(target: CtrFunc | CtrFunc[], mood?: Mood, stopSignal?: any): Promise<any | any[]>;
    _resolveAndApply(func: CtrFunc): Promise<any>;
    resolve(cFunc: CtrFunc): any[];
    private getParam;
}
