import { PluginInterface } from '../../moon';
import { FunctionInjector } from '../../function-injector';
import { MethodCtx } from './method-ctx';
import { Ctx } from '../ctx';
import { Response } from '../../response-handler';
export declare class MoodAdapter implements PluginInterface {
    beforeController(injector: FunctionInjector, { request: { params, query, body } }: Ctx, { parameters }: MethodCtx, response: Response): boolean;
}
