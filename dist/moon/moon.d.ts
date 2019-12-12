import { PluginInterface } from './plugin.interface'
import { FunctionInjector } from '../function-injector'

export declare class Moon {
    private plugins

    constructor(plugins?: PluginInterface[]);

    run(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{
        status: boolean;
        index?: number;
        result?: string;
    }>;

    add(plugin: PluginInterface): void;
    remove(plugin: PluginInterface): void;
}
