import { FunctionInjector } from '../../function-injector'
import { Moon } from '../../moon/moon'
import { PluginInterface } from '../../moon'

export declare class MosideProcess {
    proxyHandler: ProxyHandler<Object>
    private moon
    private errorHook

    constructor(moon: Moon, errorHook: Function);

    private runController

    bindHandler(ctr: any): any;

    pluginProcess(stage: 'before' | 'after' | 'error', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{
        status: boolean;
        index?: number;
        result?: string;
    }>;
}
