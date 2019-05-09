import { PluginInterface } from "../../moon/plugin.interface";
import { FunctionInjector } from "../../function-injector/function-injector";
import { MethodCtx } from "./method-ctx";
import { Ctx } from "../ctx";
export declare class MoodAdapter implements PluginInterface {
    beforeController(injector: FunctionInjector, { request: { param, query, body } }: Ctx, { parameters }: MethodCtx): boolean;
}
