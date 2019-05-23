import { PluginInterface } from '../../moon';
import { FunctionInjector } from '../../function-injector';
import { MethodCtx } from './method-ctx';
import { Mood } from '../../mood/mood';
import { Response } from '../../response-handler';
export declare class MoodAdapter implements PluginInterface {
    beforeController(injector: FunctionInjector, { parameters }: MethodCtx, mood: Mood, response: Response): boolean;
}
