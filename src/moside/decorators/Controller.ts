import {ControllerOptions, IControllerMetadata} from "../controller.interface";
import {CONTROLLER} from "../symbol";
import {FunctionInjector} from "../../function-injector/function-injector";

/**
 * 控制器装饰器
 * @param options 控制器选项
 * @constructor
 */
export function Controller(options: ControllerOptions = {}) {
  return (target: any) => {
    const cMeta = getControllerMetadata(target)
    cMeta.path = options.path || '/'
  }
}

/**
 * 获取控制器的Metadata,若不存在则新建meta
 * @param target 目标控制器
 */
export function getControllerMetadata(target: any): IControllerMetadata {
  let cMeta: IControllerMetadata = Reflect.getMetadata(CONTROLLER, target)
  if (!cMeta) {
    cMeta = {
      path: '',
      methods: [],
      providers: [],
      injector: FunctionInjector.create([])
    }
    Reflect.defineMetadata(CONTROLLER, cMeta, target)
  }
  return cMeta
}