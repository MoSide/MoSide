import { ControllerOptions, IControllerMetadata } from "../controller.interface";
/**
 * 控制器装饰器
 * @param options 控制器选项
 * @constructor
 */
export declare function Controller({ path, plugins }?: ControllerOptions): (target: any) => void;
/**
 * 获取控制器的Metadata,若不存在则新建meta
 * @param target 目标控制器
 */
export declare function getControllerMetadata(target: any): IControllerMetadata;
