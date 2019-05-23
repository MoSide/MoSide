import { FunctionInjector } from '../../function-injector/function-injector';
import { Moon } from '../../moon/moon';
import { PluginInterface } from '../../moon/plugin.interface';
export declare class MosideProcess {
    private moon;
    private errorHook;
    proxyHandler: ProxyHandler<Object>;
    constructor(moon: Moon, errorHook: Function);
    pluginProcess(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{
        status: boolean;
        index?: number;
        result?: string;
    }>;
    bindHandler(ctr: any): any;
}
