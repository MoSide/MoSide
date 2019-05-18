import { PluginInterface } from './plugin.interface';
import { FunctionInjector } from '../function-injector/function-injector';
export declare class Moon {
    private plugins;
    constructor(plugins?: PluginInterface[]);
    run(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<boolean>;
    add(plugin: PluginInterface): void;
    remove(plugin: PluginInterface): void;
}
