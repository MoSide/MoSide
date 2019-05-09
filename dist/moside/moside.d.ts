import { MosideProcess } from './util/process';
import { Moon } from '../moon/moon';
export declare class Moside {
    private routerList;
    private adapter;
    private methods;
    process: MosideProcess;
    plugin: Moon;
    protected constructor();
    static create(routerList: any[]): Promise<Moside>;
    postErrorMessage(e: Error): void;
    getRouter(): any;
    private onInit;
}
