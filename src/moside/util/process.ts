import {getControllerMethodMetadata} from "../decorators/HttpMethod";
import {IControllerMetadata, IControllerMethodMetadata} from "../controller.interface";
import {getControllerMetadata} from "../decorators/Controller";
import {Ctx} from "../ctx";
import {TypeProvider} from "../../function-injector/type-provider.interface";
import {CtrFunc} from "../../function-injector/ctr-func";
import {FunctionInjector} from "../../function-injector/function-injector";
import {Injectable} from "../../function-injector/Injectable.decorator";

function createMethodInjector(injector: FunctionInjector, {request, response}): FunctionInjector {
  const ctxProvider: TypeProvider = {
    token: Ctx,
    useValue: new Ctx(request, response)
  }
  return injector.createChild([ctxProvider])
}

class Process {

  proxyHandler: ProxyHandler<Object> = {
    get: (target: Object, p: string, receiver: any): any => {
      const m = Reflect.get(target, p, receiver)
      if (typeof m !== 'function') {
        return m
      }

      const mMeta: IControllerMethodMetadata = getControllerMethodMetadata(target, p)
      if (!mMeta) {
        return m
      }

      const cMeta: IControllerMetadata = getControllerMetadata(target)
      return async (request, response) => {
        const injector = createMethodInjector(cMeta.injector, {
          request,
          response
        })

        await injector.resolveAndApply([
          new CtrFunc(this, 'beforeProcess'),
          new CtrFunc(this, 'controllerProcess'),
          new CtrFunc(this, 'afterProcess')
        ])
      }
    }
  }

  @Injectable
  beforeProcess() {
  }

  @Injectable
  afterProcess() {
  }

  pluginProcess(stage: 'before' | 'after') {
  }

  @Injectable
  controllerProcess() {

  }

  bindHandler(ctr: any) {
    return new Proxy(ctr, this.proxyHandler)
  }

}

export const ctrProcess = new Process()
